import { NextResponse } from 'next/server'

import {
  createClient as createAdminClient,
} from '@supabase/supabase-js'

import {
  createClient as createServerClient,
} from '@/lib/supabase/server'

type LoginBody = {
  username?: string
  password?: string
}

/* =========================================================
   RESPONSE HELPERS
========================================================= */

function invalidLogin() {
  return NextResponse.json(
    {
      error:
        'Invalid username or password.',
    },
    {
      status: 401,
      headers: {
        'Cache-Control':
          'no-store',
      },
    }
  )
}

function serverError() {
  return NextResponse.json(
    {
      error:
        'Sign in is temporarily unavailable.',
    },
    {
      status: 500,
      headers: {
        'Cache-Control':
          'no-store',
      },
    }
  )
}

/* =========================================================
   LOGIN ROUTE
========================================================= */

export async function POST(
  request: Request
) {
  try {
    /* =====================================================
       READ LOGIN INPUT
    ====================================================== */

    const body =
      (await request.json()) as LoginBody

    const username =
      body.username
        ?.trim()
        .toLowerCase()
        .replace(/^@/, '') ?? ''

    const password =
      body.password ?? ''

    if (
      !/^[a-z0-9._]{3,20}$/.test(
        username
      ) ||
      password.length === 0
    ) {
      console.log(
        '[ProVN login] Invalid input format'
      )

      return invalidLogin()
    }

    /* =====================================================
       ENVIRONMENT
    ====================================================== */

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL

    const secretKey =
      process.env
        .SUPABASE_SECRET_KEY ??
      process.env
        .SUPABASE_SERVICE_ROLE_KEY

    if (
      !supabaseUrl ||
      !secretKey
    ) {
      console.error(
        '[ProVN login] Missing Supabase server credentials'
      )

      return serverError()
    }

    /* =====================================================
       SERVER-ONLY ADMIN CLIENT
    ====================================================== */

    const admin =
      createAdminClient(
        supabaseUrl,
        secretKey,
        {
          auth: {
            autoRefreshToken:
              false,

            persistSession:
              false,

            detectSessionInUrl:
              false,
          },
        }
      )

    let userId:
      string | null =
      null

    let email:
      string | null =
      null

    /* =====================================================
       STEP 1:
       NORMAL PROFILE LOOKUP
    ====================================================== */

    const {
      data: profile,
      error: profileError,
    } =
      await admin
        .from('profiles')
        .select('id, username')
        .eq(
          'username',
          username
        )
        .maybeSingle()

    if (profileError) {
      console.error(
        '[ProVN login] Profile lookup error:',
        profileError
      )
    }

    if (profile?.id) {
      userId =
        profile.id

      console.log(
        '[ProVN login] Profile found:',
        username
      )

      const {
        data:
          profileAuthUser,
        error:
          profileAuthError,
      } =
        await admin
          .auth
          .admin
          .getUserById(
            profile.id
          )

      if (
        profileAuthError
      ) {
        console.error(
          '[ProVN login] Auth lookup from profile failed:',
          profileAuthError
        )
      } else {
        email =
          profileAuthUser
            .user
            ?.email ??
          null
      }
    }

    /* =====================================================
       STEP 2:
       FALLBACK TO AUTH METADATA

       This handles accounts that exist in auth.users
       but whose profiles row was missing / stale.
    ====================================================== */

    if (!email) {
      console.log(
        '[ProVN login] Profile resolution failed. Searching Auth metadata...'
      )

      const perPage =
        200

      /*
        Early-stage ProVN will normally resolve on page 1,
        but this safely supports multiple pages.
      */

      for (
        let page = 1;
        page <= 20;
        page += 1
      ) {
        const {
          data:
            usersResult,
          error:
            usersError,
        } =
          await admin
            .auth
            .admin
            .listUsers({
              page,
              perPage,
            })

        if (usersError) {
          console.error(
            '[ProVN login] Could not list auth users:',
            usersError
          )

          break
        }

        const matchedUser =
          usersResult.users.find(
            user => {
              const metadataUsername =
                String(
                  user
                    .user_metadata
                    ?.username ??
                    ''
                )
                  .trim()
                  .toLowerCase()
                  .replace(
                    /^@/,
                    ''
                  )

              return (
                metadataUsername ===
                username
              )
            }
          )

        if (matchedUser) {
          userId =
            matchedUser.id

          email =
            matchedUser.email ??
            null

          console.log(
            '[ProVN login] Username found in Auth metadata:',
            username
          )

          /*
            SELF-HEAL PROFILE

            If Auth has the account but profiles did
            not contain it correctly, restore it.
          */

          const displayName =
            typeof matchedUser
              .user_metadata
              ?.full_name ===
            'string'
              ? matchedUser
                  .user_metadata
                  .full_name
                  .trim()
              : null

          const {
            error:
              repairError,
          } =
            await admin
              .from(
                'profiles'
              )
              .upsert(
                {
                  id:
                    matchedUser.id,

                  username,

                  display_name:
                    displayName ||
                    null,
                },
                {
                  onConflict:
                    'id',
                }
              )

          if (
            repairError
          ) {
            console.error(
              '[ProVN login] Profile self-repair failed:',
              repairError
            )
          } else {
            console.log(
              '[ProVN login] Profile synchronized successfully'
            )
          }

          break
        }

        /*
          No additional page.
        */

        if (
          usersResult
            .users
            .length <
          perPage
        ) {
          break
        }
      }
    }

    /* =====================================================
       USERNAME DOES NOT EXIST
    ====================================================== */

    if (
      !userId ||
      !email
    ) {
      console.log(
        '[ProVN login] Username was not found:',
        username
      )

      return invalidLogin()
    }

    /* =====================================================
       STEP 3:
       CHECK EMAIL VERIFICATION STATUS
    ====================================================== */

    const {
      data:
        finalAuthUser,
      error:
        finalUserError,
    } =
      await admin
        .auth
        .admin
        .getUserById(
          userId
        )

    if (
      finalUserError ||
      !finalAuthUser.user
    ) {
      console.error(
        '[ProVN login] Final user lookup failed:',
        finalUserError
      )

      return invalidLogin()
    }

    if (
      !finalAuthUser
        .user
        .email_confirmed_at
    ) {
      console.log(
        '[ProVN login] Email is not verified:',
        username
      )

      return NextResponse.json(
        {
          error:
            'Complete email verification before signing in.',
        },
        {
          status: 403,
          headers: {
            'Cache-Control':
              'no-store',
          },
        }
      )
    }

    /* =====================================================
       STEP 4:
       PASSWORD AUTHENTICATION

       This client is tied to the current request/response
       cookie system, so the user's Supabase session is
       persisted for the homepage.
    ====================================================== */

    const supabase =
      await createServerClient()

    const {
      data:
        signInData,
      error:
        signInError,
    } =
      await supabase
        .auth
        .signInWithPassword({
          email,
          password,
        })

    /* =====================================================
       PASSWORD FAILED
    ====================================================== */

    if (
      signInError ||
      !signInData.user ||
      !signInData.session
    ) {
      if (signInError) {
        console.error(
          '[ProVN login] Password authentication failed:',
          {
            message:
              signInError.message,

            status:
              signInError.status,

            code:
              signInError.code,
          }
        )
      }

      if (
        signInError?.code ===
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
              'Cache-Control':
                'no-store',
            },
          }
        )
      }

      if (
        signInError?.status ===
        429
      ) {
        return NextResponse.json(
          {
            error:
              'Too many sign-in attempts. Wait a moment and try again.',
          },
          {
            status: 429,
            headers: {
              'Cache-Control':
                'no-store',
            },
          }
        )
      }

      return invalidLogin()
    }

    /* =====================================================
       SUCCESS
    ====================================================== */

    console.log(
      '[ProVN login] Authentication successful:',
      username
    )

    return NextResponse.json(
      {
        ok: true,

        user: {
          id:
            signInData
              .user
              .id,

          username,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store',
        },
      }
    )
  } catch (error) {
    console.error(
      '[ProVN login] Unexpected login route failure:',
      error
    )

    return serverError()
  }
}