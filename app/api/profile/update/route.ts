import { NextResponse } from 'next/server'

/* =========================================================
   TYPES
========================================================= */

type ProfileRow = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string | null
}

type SupabaseUser = {
  id: string
  email?: string
}

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_AVATAR_SIZE =
  5 * 1024 * 1024

const ALLOWED_IMAGE_TYPES =
  new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ])

/* =========================================================
   JSON RESPONSE
========================================================= */

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

/* =========================================================
   ENVIRONMENT
========================================================= */

function getSupabaseConfig() {
  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL
      ?.replace(/\/$/, '')

  const publicKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY

  const secretKey =
    process.env
      .SUPABASE_SECRET_KEY ||
    process.env
      .SUPABASE_SERVICE_ROLE_KEY

  if (
    !url ||
    !publicKey ||
    !secretKey
  ) {
    throw new Error(
      'Supabase environment variables are incomplete.'
    )
  }

  return {
    url,
    publicKey,
    secretKey,
  }
}

/* =========================================================
   ADMIN HEADERS

   IMPORTANT:
   sb_secret_... is NOT a JWT.

   New Supabase secret keys should be sent using:
   apikey: sb_secret_...

   Legacy service_role JWT can also use:
   Authorization: Bearer <service_role>
========================================================= */

function getAdminHeaders(
  secretKey: string
) {
  const headers:
    Record<string, string> =
    {
      apikey:
        secretKey,
    }

  const isNewSecretKey =
    secretKey.startsWith(
      'sb_secret_'
    )

  if (
    !isNewSecretKey
  ) {
    headers.Authorization =
      `Bearer ${secretKey}`
  }

  return headers
}

/* =========================================================
   CLEAN STRING
========================================================= */

function cleanString(
  value:
    FormDataEntryValue | null
) {
  return typeof value ===
    'string'
    ? value.trim()
    : ''
}

/* =========================================================
   IMAGE EXTENSION
========================================================= */

function extensionFromMime(
  mime: string
) {
  if (
    mime ===
    'image/jpeg'
  ) {
    return 'jpg'
  }

  if (
    mime ===
    'image/png'
  ) {
    return 'png'
  }

  if (
    mime ===
    'image/webp'
  ) {
    return 'webp'
  }

  return null
}

/* =========================================================
   SAFE STORAGE PATH
========================================================= */

function encodeStoragePath(
  path: string
) {
  return path
    .split('/')
    .map(
      part =>
        encodeURIComponent(
          part
        )
    )
    .join('/')
}

/* =========================================================
   OLD AVATAR STORAGE PATH
========================================================= */

function getStoredAvatarPath(
  avatarUrl:
    string | null
) {
  if (
    !avatarUrl
  ) {
    return null
  }

  const marker =
    '/storage/v1/object/public/avatars/'

  const index =
    avatarUrl.indexOf(
      marker
    )

  if (
    index === -1
  ) {
    return null
  }

  const value =
    avatarUrl
      .slice(
        index +
          marker.length
      )
      .split('?')[0]

  try {
    return decodeURIComponent(
      value
    )
  } catch {
    return value
  }
}

/* =========================================================
   SUPABASE ERROR READER
========================================================= */

async function readApiError(
  response: Response
) {
  try {
    const data =
      await response.json()

    if (
      typeof data?.message ===
      'string'
    ) {
      return data.message
    }

    if (
      typeof data?.error ===
      'string'
    ) {
      return data.error
    }

    if (
      typeof data?.msg ===
      'string'
    ) {
      return data.msg
    }

    return `Request failed (${response.status}).`
  } catch {
    try {
      const text =
        await response.text()

      return (
        text ||
        `Request failed (${response.status}).`
      )
    } catch {
      return `Request failed (${response.status}).`
    }
  }
}

/* =========================================================
   DELETE STORAGE OBJECT
========================================================= */

async function deleteStorageObject(
  url: string,
  secretKey: string,
  path: string
) {
  try {
    const encodedPath =
      encodeStoragePath(
        path
      )

    await fetch(
      `${url}/storage/v1/object/avatars/${encodedPath}`,
      {
        method:
          'DELETE',

        headers: {
          ...getAdminHeaders(
            secretKey
          ),
        },

        cache:
          'no-store',
      }
    )
  } catch {
    /*
      Cleanup failure should never
      break a successfully saved profile.
    */
  }
}

/* =========================================================
   POST
========================================================= */

export async function POST(
  request: Request
) {
  let newlyUploadedPath:
    string | null =
    null

  try {
    const {
      url,
      publicKey,
      secretKey,
    } =
      getSupabaseConfig()

    /* =====================================================
       1. GET USER ACCESS TOKEN
    ===================================================== */

    const authorization =
      request.headers.get(
        'authorization'
      ) || ''

    const accessToken =
      authorization.startsWith(
        'Bearer '
      )
        ? authorization
            .slice(7)
            .trim()
        : ''

    if (
      !accessToken
    ) {
      return jsonResponse(
        {
          ok: false,

          error:
            'Your ProVN session is missing. Please sign in again.',
        },
        401
      )
    }

    /* =====================================================
       2. VALIDATE USER TOKEN DIRECTLY WITH SUPABASE AUTH
    ===================================================== */

    const authResponse =
      await fetch(
        `${url}/auth/v1/user`,
        {
          method:
            'GET',

          headers: {
            apikey:
              publicKey,

            Authorization:
              `Bearer ${accessToken}`,
          },

          cache:
            'no-store',
        }
      )

    if (
      !authResponse.ok
    ) {
      return jsonResponse(
        {
          ok: false,

          error:
            'Your login session has expired. Please sign in again.',
        },
        401
      )
    }

    const authenticatedUser =
      (
        await authResponse.json()
      ) as SupabaseUser

    if (
      !authenticatedUser?.id
    ) {
      return jsonResponse(
        {
          ok: false,

          error:
            'Could not verify your ProVN account.',
        },
        401
      )
    }

    const userId =
      authenticatedUser.id

    /* =====================================================
       3. REQUIRE MULTIPART FORM DATA
    ===================================================== */

    const contentType =
      request.headers.get(
        'content-type'
      ) || ''

    if (
      !contentType.includes(
        'multipart/form-data'
      )
    ) {
      return jsonResponse(
        {
          ok: false,

          error:
            'Invalid profile update request.',
        },
        400
      )
    }

    const formData =
      await request.formData()

    const displayName =
      cleanString(
        formData.get(
          'displayName'
        )
      )

    const bio =
      cleanString(
        formData.get(
          'bio'
        )
      )

    /* =====================================================
       4. VALIDATE TEXT
    ===================================================== */

    if (
      displayName.length >
      50
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
      bio.length >
      240
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
       5. OPTIONAL PROFILE PHOTO
    ===================================================== */

    const avatarEntry =
      formData.get(
        'avatar'
      )

    const avatar =
      avatarEntry instanceof File &&
      avatarEntry.size > 0
        ? avatarEntry
        : null

    if (
      avatar
    ) {
      if (
        avatar.size >
        MAX_AVATAR_SIZE
      ) {
        return jsonResponse(
          {
            ok: false,

            error:
              'Profile picture must be 5 MB or smaller.',
          },
          400
        )
      }

      if (
        !ALLOWED_IMAGE_TYPES.has(
          avatar.type
        )
      ) {
        return jsonResponse(
          {
            ok: false,

            error:
              'Use JPG, PNG or WEBP for your profile picture.',
          },
          400
        )
      }
    }

    /* =====================================================
       6. READ CURRENT PROFILE

       Uses privileged API key directly.

       New sb_secret key is deliberately NOT sent
       as Authorization Bearer.
    ===================================================== */

    const profileSelect =
      'id,username,display_name,avatar_url,bio,created_at'

    const profileReadUrl =
      `${url}/rest/v1/profiles` +
      `?id=eq.${encodeURIComponent(userId)}` +
      `&select=${encodeURIComponent(profileSelect)}`

    const profileResponse =
      await fetch(
        profileReadUrl,
        {
          method:
            'GET',

          headers: {
            ...getAdminHeaders(
              secretKey
            ),

            Accept:
              'application/json',
          },

          cache:
            'no-store',
        }
      )

    if (
      !profileResponse.ok
    ) {
      const reason =
        await readApiError(
          profileResponse
        )

      console.error(
        'Profile REST read failed:',
        reason
      )

      return jsonResponse(
        {
          ok: false,

          error:
            `Could not read your ProVN profile: ${reason}`,
        },
        500
      )
    }

    const profileRows =
      (
        await profileResponse.json()
      ) as ProfileRow[]

    const currentProfile =
      profileRows[0]

    if (
      !currentProfile
    ) {
      return jsonResponse(
        {
          ok: false,

          error:
            'Your authenticated account is not linked to a ProVN profile.',
        },
        404
      )
    }

    let finalAvatarUrl =
      currentProfile
        .avatar_url

    /* =====================================================
       7. UPLOAD NEW PROFILE PHOTO
    ===================================================== */

    if (
      avatar
    ) {
      const extension =
        extensionFromMime(
          avatar.type
        )

      if (
        !extension
      ) {
        return jsonResponse(
          {
            ok: false,

            error:
              'Unsupported profile picture format.',
          },
          400
        )
      }

      newlyUploadedPath =
        `${userId}/profile-${Date.now()}.${extension}`

      const encodedPath =
        encodeStoragePath(
          newlyUploadedPath
        )

      const uploadResponse =
        await fetch(
          `${url}/storage/v1/object/avatars/${encodedPath}`,
          {
            method:
              'POST',

            headers: {
              ...getAdminHeaders(
                secretKey
              ),

              'Content-Type':
                avatar.type,

              'cache-control':
                '3600',

              'x-upsert':
                'false',
            },

            body:
              await avatar.arrayBuffer(),

            cache:
              'no-store',
          }
        )

      if (
        !uploadResponse.ok
      ) {
        const reason =
          await readApiError(
            uploadResponse
          )

        console.error(
          'Avatar upload failed:',
          reason
        )

        return jsonResponse(
          {
            ok: false,

            error:
              `Could not upload profile picture: ${reason}`,
          },
          500
        )
      }

      finalAvatarUrl =
        `${url}/storage/v1/object/public/avatars/${encodedPath}`
    }

    /* =====================================================
       8. UPDATE PROFILE
    ===================================================== */

    const updateUrl =
      `${url}/rest/v1/profiles` +
      `?id=eq.${encodeURIComponent(userId)}` +
      `&select=${encodeURIComponent(profileSelect)}`

    const updateResponse =
      await fetch(
        updateUrl,
        {
          method:
            'PATCH',

          headers: {
            ...getAdminHeaders(
              secretKey
            ),

            'Content-Type':
              'application/json',

            Accept:
              'application/json',

            Prefer:
              'return=representation',
          },

          body:
            JSON.stringify({
              display_name:
                displayName ||
                null,

              bio:
                bio ||
                null,

              avatar_url:
                finalAvatarUrl,
            }),

          cache:
            'no-store',
        }
      )

    if (
      !updateResponse.ok
    ) {
      const reason =
        await readApiError(
          updateResponse
        )

      console.error(
        'Profile update failed:',
        reason
      )

      if (
        newlyUploadedPath
      ) {
        await deleteStorageObject(
          url,
          secretKey,
          newlyUploadedPath
        )
      }

      return jsonResponse(
        {
          ok: false,

          error:
            `Could not save your ProVN profile: ${reason}`,
        },
        500
      )
    }

    const updatedRows =
      (
        await updateResponse.json()
      ) as ProfileRow[]

    const updatedProfile =
      updatedRows[0]

    if (
      !updatedProfile
    ) {
      if (
        newlyUploadedPath
      ) {
        await deleteStorageObject(
          url,
          secretKey,
          newlyUploadedPath
        )
      }

      return jsonResponse(
        {
          ok: false,

          error:
            'Profile save completed without returning a profile record.',
        },
        500
      )
    }

    /* =====================================================
       9. REMOVE OLD AVATAR AFTER DATABASE SAVE SUCCEEDS
    ===================================================== */

    if (
      newlyUploadedPath &&
      currentProfile.avatar_url
    ) {
      const oldPath =
        getStoredAvatarPath(
          currentProfile
            .avatar_url
        )

      if (
        oldPath &&
        oldPath !==
          newlyUploadedPath &&
        oldPath.startsWith(
          `${userId}/`
        )
      ) {
        await deleteStorageObject(
          url,
          secretKey,
          oldPath
        )
      }
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return jsonResponse({
      ok: true,

      message:
        'Profile saved successfully.',

      profile:
        updatedProfile,
    })
  } catch (
    error
  ) {
    console.error(
      'ProVN profile update route failed:',
      error
    )

    return jsonResponse(
      {
        ok: false,

        error:
          'Something went wrong while saving your ProVN profile.',
      },
      500
    )
  }
}