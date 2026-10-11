import { NextResponse } from 'next/server'

import {
  createClient as createAdminClient,
} from '@supabase/supabase-js'

import {
  createClient as createServerClient,
} from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type LoginBody = {
  username?: string
  password?: string
}

function invalidLogin() {
  return NextResponse.json(
    {
      error: 'Invalid username or password.',
    },
    {
      status: 401,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody

    const username =
      body.username
        ?.trim()
        .toLowerCase()
        .replace(/^@/, '') ?? ''

    const password = body.password ?? ''

    if (
      !/^[a-z0-9._]{3,20}$/.test(username) ||
      !password
    ) {
      return invalidLogin()
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL

    const secretKey =
      process.env.SUPABASE_SECRET_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !secretKey) {
      console.error(
        'Missing server Supabase credentials.'
      )

      return NextResponse.json(
        {
          error:
            'Sign in is temporarily unavailable.',
        },
        {
          status: 500,
        }
      )
    }

    /*
      SERVER-ONLY admin client.

      Used only to resolve:
      username -> auth user -> private email.

      Secret key is NEVER returned to browser.
    */

    const admin = createAdminClient(
      supabaseUrl,
      secretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    )

    const {
      data: profile,
      error: profileError,
    } = await admin
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (profileError || !profile) {
      return invalidLogin()
    }

    /*
      Get the private auth email from
      Supabase Auth using the SERVER secret.
    */

    const {
      data: userResult,
      error: userLookupError,
    } = await admin.auth.admin.getUserById(
      profile.id
    )

    const email = userResult.user?.email

    if (userLookupError || !email) {
      return invalidLogin()
    }

    /*
      Use normal Supabase Auth to validate
      the user's actual password.

      Existing SSR server client sets the
      auth cookies automatically.
    */

    const supabase =
      await createServerClient()

    const {
      data,
      error: loginError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (
      loginError ||
      !data.user ||
      !data.session
    ) {
      if (
        loginError?.code ===
        'email_not_confirmed'
      ) {
        return NextResponse.json(
          {
            error:
              'Complete email verification before signing in.',
          },
          {
            status: 403,
            headers: {
              'Cache-Control': 'no-store',
            },
          }
        )
      }

      if (loginError?.status === 429) {
        return NextResponse.json(
          {
            error:
              'Too many sign-in attempts. Wait a moment and try again.',
          },
          {
            status: 429,
            headers: {
              'Cache-Control': 'no-store',
            },
          }
        )
      }

      return invalidLogin()
    }

    return NextResponse.json(
      {
        ok: true,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error(
      'ProVN username login failed:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Sign in is temporarily unavailable.',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  }
}