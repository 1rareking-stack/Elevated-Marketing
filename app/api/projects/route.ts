import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

const projectUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120),
  product: z.string().min(1).max(2000),
  audience: z.string().min(1).max(2000),
  objective: z.string().min(1).max(300),
  tone: z.string().min(1).max(300),
  channels: z.array(z.string().min(1).max(50)).min(1).max(8),
})

async function authenticatedClient() {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ? { supabase, user } : null
}

export async function GET() {
  const auth = await authenticatedClient()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await auth.supabase
    .from('projects')
    .select('*, creative_packages(*)')
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Unable to load projects' }, { status: 500 })
  return NextResponse.json({ projects: data })
}

export async function PATCH(request: Request) {
  const auth = await authenticatedClient()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = projectUpdateSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid project', issues: parsed.error.issues }, { status: 400 })
  }

  const { id, ...updates } = parsed.data
  const { data, error } = await auth.supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .eq('user_id', auth.user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Unable to save project' }, { status: 500 })
  return NextResponse.json({ project: data })
}
