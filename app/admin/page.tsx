import type { Metadata } from 'next'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { requireAdmin } from '@/lib/supabase/user'

export const metadata: Metadata = { title: 'Owner admin' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="admin-page">
        <span className="kicker">OWNER ADMIN</span>
        <h1>Admin requires Supabase.</h1>
        <p>This route never offers a demo bypass. Configure Supabase and grant your profile <code>is_admin = true</code> through a trusted database operation.</p>
        <Link className="button button-primary" href="/studio">Return to studio</Link>
      </main>
    )
  }

  const { supabase } = await requireAdmin()
  const [{ count: users }, { count: projects }, { count: generations }, { count: events }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('generation_requests').select('*', { count: 'exact', head: true }),
    supabase.from('usage_events').select('*', { count: 'exact', head: true }),
  ])

  return (
    <main className="admin-page">
      <span className="kicker">OWNER ADMIN</span>
      <h1>Platform health</h1>
      <p>Aggregated operational counts. Access is verified server-side against the protected profile role.</p>
      <div className="admin-stats">
        <article><span>Users</span><strong>{users ?? 0}</strong></article>
        <article><span>Projects</span><strong>{projects ?? 0}</strong></article>
        <article><span>Generations</span><strong>{generations ?? 0}</strong></article>
        <article><span>Usage events</span><strong>{events ?? 0}</strong></article>
      </div>
      <Link href="/studio">← Back to studio</Link>
    </main>
  )
}
