import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from './server'

export async function requireUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/sign-in')
  return { supabase, user }
}

export async function requireAdmin() {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (error || !data?.is_admin) redirect('/studio')
  return { supabase, user }
}
