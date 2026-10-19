import { NextResponse } from 'next/server'
import { creativePackageSchema } from '@/lib/creative/schema'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request, context: { params: Promise<{ projectId: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Persistence is not configured' }, { status: 503 })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = creativePackageSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid production package', issues: parsed.error.issues }, { status: 400 })

  const { projectId } = await context.params
  const creativePackage = parsed.data
  const { data, error } = await supabase
    .from('creative_packages')
    .update({
      concept: creativePackage.concept,
      storyboard: creativePackage.storyboard,
      production_package: creativePackage.production,
      package_data: creativePackage,
      total_duration_seconds: creativePackage.totalDurationSeconds,
    })
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: 'Unable to save production package' }, { status: 500 })
  return NextResponse.json({ packageId: data.id })
}
