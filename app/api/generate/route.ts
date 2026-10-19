import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { buildDeterministicPackage } from '@/lib/creative/engine'
import { generateWithConfiguredProvider } from '@/lib/creative/provider'
import { campaignBriefSchema } from '@/lib/creative/schema'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const startedAt = Date.now()
  const parsed = campaignBriefSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid campaign brief', issues: parsed.error.issues }, { status: 400 })
  }
  const brief = parsed.data

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      package: buildDeterministicPackage(brief),
      provider: 'deterministic',
      persisted: false,
    })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: quota, error: quotaError } = await supabase.rpc('consume_generation_quota')
  const allowance = quota?.[0]
  if (quotaError) return NextResponse.json({ error: 'Unable to verify generation allowance' }, { status: 500 })
  if (!allowance?.allowed) {
    return NextResponse.json({
      error: 'Monthly generation limit reached',
      usage: { used: allowance?.used ?? 0, limit: allowance?.monthly_limit ?? 0 },
    }, { status: 429 })
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: brief.name,
      product: brief.product,
      audience: brief.audience,
      objective: brief.objective,
      tone: brief.tone,
      channels: brief.channels,
      status: 'generating',
      brief,
    })
    .select()
    .single()

  if (projectError) return NextResponse.json({ error: 'Unable to create project' }, { status: 500 })

  const inputHash = createHash('sha256').update(JSON.stringify(brief)).digest('hex')
  const { data: generation } = await supabase
    .from('generation_requests')
    .insert({
      user_id: user.id,
      project_id: project.id,
      status: 'processing',
      prompt_version: 'creative-20s-v1',
      input_hash: inputHash,
    })
    .select()
    .single()

  let result: { package: ReturnType<typeof buildDeterministicPackage>; provider: string }
  let fallbackReason: string | null = null
  try {
    result = await generateWithConfiguredProvider(brief) ?? {
      package: buildDeterministicPackage(brief),
      provider: 'deterministic',
    }
  } catch (error) {
    fallbackReason = error instanceof Error ? error.message : 'Provider validation failed'
    result = { package: buildDeterministicPackage(brief), provider: 'deterministic-fallback' }
  }

  const { error: packageError } = await supabase.from('creative_packages').insert({
    user_id: user.id,
    project_id: project.id,
    concept: result.package.concept,
    storyboard: result.package.storyboard,
    production_package: result.package.production,
    package_data: result.package,
    total_duration_seconds: result.package.totalDurationSeconds,
    schema_version: result.package.schemaVersion,
  })

  if (packageError) {
    await supabase.from('projects').update({ status: 'draft' }).eq('id', project.id)
    return NextResponse.json({ error: 'Generated package failed to persist' }, { status: 500 })
  }

  const durationMs = Date.now() - startedAt
  await Promise.all([
    supabase.from('projects').update({ status: 'ready' }).eq('id', project.id),
    generation
      ? supabase.rpc('complete_generation_request', {
          request_id: generation.id,
          provider_name: result.provider,
          elapsed_ms: durationMs,
          fallback_code: fallbackReason ? 'provider_fallback' : null,
        })
      : Promise.resolve(),
    supabase.from('usage_events').insert({
      user_id: user.id,
      event_name: 'package_completed',
      properties: { project_id: project.id, provider: result.provider, duration_ms: durationMs },
    }),
  ])

  return NextResponse.json({
    project,
    package: result.package,
    provider: result.provider,
    persisted: true,
    usage: { used: allowance.used, limit: allowance.monthly_limit },
  })
}
