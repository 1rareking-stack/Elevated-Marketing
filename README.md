# Elevated Ad Studio

Elevated turns a campaign brief into a validated 20-second creative strategy, storyboard, and production package. The original polished interface is now backed by Next.js App Router server boundaries and an optional Supabase production mode.

## Production scope

- Responsive public website and protected studio
- Supabase email/password signup, signin, session refresh, callback, and signout
- User-owned projects and production packages protected by row-level security
- Private brand-asset storage with owner-folder policies
- Server-verified owner admin route; clients cannot grant themselves admin access
- Five-step brief, audience, message, production, and review wizard
- Structured creative schema with five sequential scenes totaling exactly 20 seconds
- OpenAI-compatible server provider interface with timeout and strict schema validation
- Deterministic production-quality fallback when provider credentials are missing or provider output is invalid
- Monthly generation quotas and append-only usage events
- Editable concept, approval, storyboard, production specifications, and JSON package export
- Accessible loading, error, validation, mobile navigation, and responsive editor states
- Local demo mode when Supabase is not configured

## Stack

- Next.js 16 App Router and React 19
- TypeScript 5.9 and Zod
- Supabase Auth, Postgres, Storage, SSR sessions, migrations, and RLS
- Tailwind CSS 4 tooling with the preserved custom design system
- Vitest and ESLint

The application moved from Vite because authenticated server rendering, protected route handlers, secret-bearing AI calls, and cookie-based Supabase session refresh require trusted server boundaries. The earlier Vite source remains in `src/` as a preserved checkpoint but is excluded from the production build.

## Local demo

Requires Node.js 22+ and npm 10+.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without environment variables, `/studio` clearly runs in local demo mode and generation uses the same deterministic, schema-validated engine.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Apply the checked-in migration using the Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The migration creates profiles, projects, versioned creative packages, generation requests, usage telemetry, quota functions, indexes, private asset storage, and all RLS policies.

4. In Supabase Auth URL configuration, add:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`
   - Add equivalent production URLs before release.
5. Create an account through `/sign-in`.

### Grant owner admin access

Admin cannot be granted from the browser or user API. After creating the intended owner account, run this once in the trusted Supabase SQL editor:

```sql
update public.profiles
set is_admin = true
where id = (
  select id from auth.users where email = 'owner@example.com'
);
```

The `/admin` page performs a fresh server-side user and role check. Without Supabase, it remains locked and does not offer a demo bypass.

## Optional AI provider

Generation works without AI credentials. To use an OpenAI-compatible provider, add server-only variables:

```bash
AI_API_KEY=...
AI_MODEL=...
AI_API_URL=https://api.openai.com/v1/chat/completions
```

`AI_API_KEY` is only read inside the server route. Client requests are authenticated, quota-checked transactionally, schema-validated, and persisted under the authenticated user. Provider failures or nonconforming storyboards automatically use the deterministic exact-20-second fallback.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
# all of the above
npm run check
```

The engine tests cover deterministic output, schema shape, exact 20-second duration, sequential scenes, and invalid brief rejection.

## Security notes

- Server authorization uses `supabase.auth.getUser()`, not unverified cookie claims.
- RLS restricts every user-owned table and storage path.
- The anon key is intentionally public; never expose the service-role key.
- Admin status and usage limits cannot be changed through normal client grants.
- Quota consumption and generation completion use narrow `security definer` database functions with fixed search paths.
- AI provider URLs and secrets are server-controlled environment variables, never request input.

## Remaining limitations

- No live Supabase project was available in this environment, so migrations and live email delivery could not be exercised here.
- Performance insights remain illustrative; no ad-network ingestion exists.
- Export returns the complete structured JSON production package, not encoded video or image assets.
- Brand asset policies and schema are ready, but the current UI does not yet upload files.
- Search, messages, project filters, and media preview controls remain presentational.
- Dependency auditing reports no production vulnerabilities. Development-only lint tooling currently reports an upstream `braces` advisory with no patched release available.

## Next production steps

1. Exercise signup, RLS isolation, storage, and migration rollback in a Supabase staging project.
2. Add Playwright coverage for authenticated wizard, refresh, and cross-user isolation.
3. Add provider-specific observability, retry policy, and budget alerts.
4. Build the render queue for captioned MP4 and platform-specific image exports.
5. Connect real ad-platform metrics and replace illustrative insights.