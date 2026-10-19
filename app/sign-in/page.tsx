import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from './auth-form'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const metadata: Metadata = { title: 'Sign in' }

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams
  const nextPath = params.next?.startsWith('/') ? params.next : '/studio'
  return (
    <main className="auth-page">
      <Link className="auth-logo" href="/"><span className="logo-mark"><span /></span><strong>Elevated</strong></Link>
      <AuthForm configured={isSupabaseConfigured()} nextPath={nextPath} />
    </main>
  )
}
