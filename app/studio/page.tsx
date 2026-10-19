import type { Metadata } from 'next'
import { StudioPage } from '@/components/elevated-app'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { requireUser } from '@/lib/supabase/user'

export const metadata: Metadata = { title: 'Studio' }
export const dynamic = 'force-dynamic'

export default async function Studio() {
  const configured = isSupabaseConfigured()
  if (configured) await requireUser()
  return <StudioPage demoMode={!configured} />
}
