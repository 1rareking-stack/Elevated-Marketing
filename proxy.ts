import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.next()

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user && (request.nextUrl.pathname.startsWith('/studio') || request.nextUrl.pathname.startsWith('/admin'))) {
    const signIn = request.nextUrl.clone()
    signIn.pathname = '/sign-in'
    signIn.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(signIn)
  }

  return response
}

export const config = {
  matcher: ['/studio/:path*', '/admin/:path*'],
}
