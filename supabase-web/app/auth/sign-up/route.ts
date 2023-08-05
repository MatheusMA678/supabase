import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = createRouteHandlerClient({ cookies })

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `https://3000-matheusma678-rnsupabase-3092ilm18w6.ws-us102.gitpod.io/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.redirect(
      `https://3000-matheusma678-rnsupabase-3092ilm18w6.ws-us102.gitpod.io/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    )
  }

  return NextResponse.redirect(
    `https://3000-matheusma678-rnsupabase-3092ilm18w6.ws-us102.gitpod.io/login?message=Check email to continue sign in process`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  )
}
