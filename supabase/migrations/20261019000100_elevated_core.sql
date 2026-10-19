begin;

create extension if not exists pgcrypto;

create type public.project_status as enum ('draft', 'generating', 'ready', 'archived');
create type public.generation_status as enum ('queued', 'processing', 'completed', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  monthly_generation_limit integer not null default 25 check (monthly_generation_limit between 0 and 100000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  product text not null check (char_length(product) between 1 and 2000),
  audience text not null check (char_length(audience) between 1 and 2000),
  objective text not null check (char_length(objective) between 1 and 300),
  tone text not null check (char_length(tone) between 1 and 300),
  channels text[] not null default '{}',
  status public.project_status not null default 'draft',
  brief jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.creative_packages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  version integer not null default 1 check (version > 0),
  concept jsonb not null,
  storyboard jsonb not null,
  production_package jsonb not null,
  package_data jsonb not null,
  total_duration_seconds numeric(5,2) not null check (total_duration_seconds = 20.00),
  schema_version text not null default '1.0',
  created_at timestamptz not null default now(),
  unique(project_id, version)
);

create table public.generation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  status public.generation_status not null default 'queued',
  provider text not null default 'deterministic',
  prompt_version text not null,
  input_hash text not null,
  error_code text,
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.usage_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null check (char_length(event_name) between 1 and 80),
  quantity integer not null default 1 check (quantity > 0),
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index projects_user_updated_idx on public.projects(user_id, updated_at desc);
create index creative_packages_project_idx on public.creative_packages(project_id, version desc);
create index generation_requests_user_created_idx on public.generation_requests(user_id, created_at desc);
create index usage_events_user_time_idx on public.usage_events(user_id, occurred_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.consume_generation_quota()
returns table(allowed boolean, used integer, monthly_limit integer)
language plpgsql security definer set search_path = '' as $$
declare
  current_used integer;
  current_limit integer;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  select p.monthly_generation_limit into current_limit
  from public.profiles p where p.id = auth.uid() for update;

  select coalesce(sum(e.quantity), 0)::integer into current_used
  from public.usage_events e
  where e.user_id = auth.uid()
    and e.event_name = 'generation'
    and e.occurred_at >= date_trunc('month', now());

  if current_limit is null or current_used >= current_limit then
    return query select false, current_used, coalesce(current_limit, 0);
    return;
  end if;

  insert into public.usage_events (user_id, event_name, quantity)
  values (auth.uid(), 'generation', 1);
  return query select true, current_used + 1, current_limit;
end;
$$;

revoke all on function public.consume_generation_quota() from public;
grant execute on function public.consume_generation_quota() to authenticated;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.creative_packages enable row level security;
alter table public.generation_requests enable row level security;
alter table public.usage_events enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select
using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles for update
using (id = auth.uid()) with check (id = auth.uid());

revoke update on public.profiles from authenticated;
grant update(display_name) on public.profiles to authenticated;

create policy "projects_select_own_or_admin" on public.projects for select
using (user_id = auth.uid() or public.is_admin());
create policy "projects_insert_own" on public.projects for insert
with check (user_id = auth.uid());
create policy "projects_update_own" on public.projects for update
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "projects_delete_own" on public.projects for delete
using (user_id = auth.uid());

create policy "packages_select_own_or_admin" on public.creative_packages for select
using (user_id = auth.uid() or public.is_admin());
create policy "packages_insert_own" on public.creative_packages for insert
with check (
  user_id = auth.uid()
  and exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
);
create policy "packages_update_own" on public.creative_packages for update
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "packages_delete_own" on public.creative_packages for delete
using (user_id = auth.uid());

create policy "generation_requests_select_own_or_admin" on public.generation_requests for select
using (user_id = auth.uid() or public.is_admin());
create policy "generation_requests_insert_own" on public.generation_requests for insert
with check (user_id = auth.uid());
create policy "generation_requests_update_admin" on public.generation_requests for update
using (public.is_admin()) with check (public.is_admin());

create policy "usage_events_select_own_or_admin" on public.usage_events for select
using (user_id = auth.uid() or public.is_admin());
create policy "usage_events_insert_own" on public.usage_events for insert
with check (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

create policy "brand_assets_select_own" on storage.objects for select to authenticated
using (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "brand_assets_insert_own" on storage.objects for insert to authenticated
with check (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "brand_assets_update_own" on storage.objects for update to authenticated
using (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "brand_assets_delete_own" on storage.objects for delete to authenticated
using (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);

commit;
