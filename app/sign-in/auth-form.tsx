'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, LoaderCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AuthForm({ configured, nextPath }: { configured: boolean; nextPath: string }) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    const supabase = createClient()
    const result = mode === 'sign-in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` },
        })

    setLoading(false)
    if (result.error) {
      setMessage(result.error.message)
      return
    }
    if (mode === 'sign-up' && !result.data.session) {
      setMessage('Check your email to confirm your account.')
      return
    }
    window.location.assign(nextPath)
  }

  if (!configured) {
    return (
      <div className="auth-card">
        <div className="auth-icon"><Sparkles /></div>
        <h1>Supabase setup required</h1>
        <p>Add the public Supabase URL and anon key to enable real account sessions. You can still review the complete studio in demo mode.</p>
        <Link className="button button-primary" href="/studio">Open secure-boundary demo <ArrowRight size={16} /></Link>
        <small>Demo projects remain local to this browser.</small>
      </div>
    )
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-icon"><Sparkles /></div>
      <span className="kicker">ELEVATED STUDIO</span>
      <h1>{mode === 'sign-in' ? 'Welcome back.' : 'Create your workspace.'}</h1>
      <p>{mode === 'sign-in' ? 'Sign in to continue to your creative workspace.' : 'Start with a secure account. Your work stays yours.'}</p>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} minLength={8} required /></label>
      {message && <div className="auth-message" role="status">{message}</div>}
      <button className="button button-primary" disabled={loading}>{loading ? <><LoaderCircle className="spinner-icon" /> Working…</> : <>{mode === 'sign-in' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></>}</button>
      <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setMessage('') }}>
        {mode === 'sign-in' ? 'New to Elevated? Create an account' : 'Already have an account? Sign in'}
      </button>
    </form>
  )
}
