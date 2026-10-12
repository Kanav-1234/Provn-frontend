import {
  NextResponse,
} from 'next/server'

import {
  createClient,
} from '@/lib/supabase/server'

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(
    body,
    {
      status,
      headers: {
        'Cache-Control':
          'no-store',
      },
    }
  )
}

export async function POST(
  request: Request
) {
  try {
    /* =====================================================
       AUTH
    ====================================================== */

    const supabase =
      await createClient()

    const {
      data: userResult,
      error: userError,
    } =
      await supabase.auth.getUser()

    const user =
      userResult.user

    if (
      userError ||
      !user
    ) {
      return jsonResponse(
        {
          ok: false,
          error:
            'You must be signed in to edit this profile.',
        },
        401
      )
    }

    /* =====================================================
       BODY
    ====================================================== */

    const body =
      await request
        .json()
        .catch(() => null)

    if (
      !body ||
      typeof body !== 'object'
    ) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Invalid request.',
        },
        400
      )
    }

    const input =
      body as {
        displayName?: unknown
        bio?: unknown
        avatarUrl?: unknown
      }

    const displayName =
      typeof input.displayName ===
      'string'
        ? input.displayName.trim()
        : ''

    const bio =
      typeof input.bio ===
      'string'
        ? input.bio.trim()
        : ''

    /* =====================================================
       VALIDATION
    ====================================================== */

    if (
      displayName &&
      displayName.length < 2
    ) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Display name must be at least 2 characters.',
        },
        400
      )
    }

    if (
      displayName.length > 50
    ) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Display name cannot exceed 50 characters.',
        },
        400
      )
    }

    if (
      bio.length > 240
    ) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Bio cannot exceed 240 characters.',
        },
        400
      )
    }

    /* =====================================================
       UPDATE PAYLOAD
    ====================================================== */

    const updatePayload: {
      display_name: string | null
      bio: string | null
      avatar_url?: string | null
    } = {
      display_name:
        displayName || null,

      bio:
        bio || null,
    }

    /* =====================================================
       OPTIONAL AVATAR URL

       undefined = do not change avatar
       null      = remove avatar
       string    = save new avatar
    ====================================================== */

    if (
      input.avatarUrl ===
      null
    ) {
      updatePayload.avatar_url =
        null
    }

    if (
      typeof input.avatarUrl ===
      'string'
    ) {
      const avatarUrl =
        input.avatarUrl.trim()

      if (
        avatarUrl.length > 1000
      ) {
        return jsonResponse(
          {
            ok: false,
            error:
              'Avatar URL is invalid.',
          },
          400
        )
      }

      try {
        const parsedAvatar =
          new URL(
            avatarUrl
          )

        const supabaseUrl =
          process.env
            .NEXT_PUBLIC_SUPABASE_URL

        if (!supabaseUrl) {
          throw new Error(
            'Missing Supabase URL.'
          )
        }

        const expectedHost =
          new URL(
            supabaseUrl
          ).host

        const expectedPath =
          `/storage/v1/object/public/avatars/${user.id}/`

        const validAvatar =
          parsedAvatar.host ===
            expectedHost &&
          parsedAvatar.pathname.startsWith(
            expectedPath
          )

        if (!validAvatar) {
          return jsonResponse(
            {
              ok: false,
              error:
                'Avatar URL is not valid for this account.',
            },
            400
          )
        }

        updatePayload.avatar_url =
          avatarUrl
      } catch {
        return jsonResponse(
          {
            ok: false,
            error:
              'Avatar URL is invalid.',
          },
          400
        )
      }
    }

    /* =====================================================
       UPDATE PROFILE
    ====================================================== */

    const {
      data: profile,
      error: updateError,
    } =
      await supabase
        .from('profiles')
        .update(
          updatePayload
        )
        .eq(
          'id',
          user.id
        )
        .select(
          `
            id,
            username,
            display_name,
            avatar_url,
            bio
          `
        )
        .single()

    if (
      updateError ||
      !profile
    ) {
      console.error(
        'Profile update failed:',
        updateError
      )

      return jsonResponse(
        {
          ok: false,
          error:
            'Could not save profile changes.',
        },
        500
      )
    }

    return jsonResponse({
      ok: true,
      profile,
    })
  } catch (
    error
  ) {
    console.error(
      'Profile update route failed:',
      error
    )

    return jsonResponse(
      {
        ok: false,
        error:
          'Could not save profile changes.',
      },
      500
    )
  }
}