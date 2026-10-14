'use client'

import Link from 'next/link'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type {
  ChangeEvent,
  FormEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react'

import {
  createClient,
} from '@/lib/supabase/client'

/* =========================================================
   TYPES
========================================================= */

type Profile = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string | null
}

type LoadState =
  | 'loading'
  | 'ready'
  | 'error'

/* =========================================================
   CURSOR
========================================================= */

const provnCursorSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 25 29">
  <defs>
    <linearGradient id="cursorBody" x1="3" y1="2" x2="18" y2="26" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="32%" stop-color="#f3f1f1"/>
      <stop offset="66%" stop-color="#d6d3d4"/>
      <stop offset="100%" stop-color="#aaa6a8"/>
    </linearGradient>

    <linearGradient id="cursorEdge" x1="2" y1="2" x2="18" y2="26" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f7f7f7"/>
      <stop offset="48%" stop-color="#757276"/>
      <stop offset="78%" stop-color="#a62a3a"/>
      <stop offset="100%" stop-color="#60111d"/>
    </linearGradient>
  </defs>

  <path
    d="M2.7 2.2V22.3L7.45 18.1L11.85 26.55L15.55 24.65L11.45 16.55H19.55L2.7 2.2Z"
    fill="url(#cursorBody)"
    stroke="url(#cursorEdge)"
    stroke-width="1.35"
    stroke-linejoin="round"
  />

  <path
    d="M4.25 5.3V18.25L7.05 15.75"
    fill="none"
    stroke="#ffffff"
    stroke-opacity=".72"
    stroke-width=".8"
    stroke-linecap="round"
  />

  <path
    d="M11.55 17.2L15 24.05"
    fill="none"
    stroke="#cf3045"
    stroke-width=".9"
    stroke-linecap="round"
  />
</svg>
`

const PROVN_CURSOR =
  `url("data:image/svg+xml,${encodeURIComponent(
    provnCursorSvg
  )}") 1 1, auto`

/* =========================================================
   TILT
========================================================= */

function tiltCard(
  event: ReactMouseEvent<HTMLElement>,
  strength = 3.5,
  lift = 6
) {
  const element =
    event.currentTarget

  const rect =
    element.getBoundingClientRect()

  const x =
    (
      event.clientX -
      rect.left
    ) /
    rect.width

  const y =
    (
      event.clientY -
      rect.top
    ) /
    rect.height

  const rotateY =
    (
      x -
      0.5
    ) *
    strength *
    2

  const rotateX =
    -(
      y -
      0.5
    ) *
    strength *
    2

  element.style.transition =
    'transform 80ms linear, border-color 200ms ease, box-shadow 200ms ease'

  element.style.transform =
    `perspective(1300px) translateY(-${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  element.style.setProperty(
    '--mx',
    `${x * 100}%`
  )

  element.style.setProperty(
    '--my',
    `${y * 100}%`
  )
}

function resetTilt(
  event: ReactMouseEvent<HTMLElement>
) {
  const element =
    event.currentTarget

  element.style.transition =
    'transform 520ms cubic-bezier(.16,1,.3,1), border-color 280ms ease, box-shadow 350ms ease'

  element.style.transform =
    'perspective(1300px) translateY(0) rotateX(0deg) rotateY(0deg)'
}

function TiltPanel({
  children,
  className = '',
  strength = 3.5,
  lift = 6,
}: {
  children: ReactNode
  className?: string
  strength?: number
  lift?: number
}) {
  return (
    <section
      onMouseMove={
        event =>
          tiltCard(
            event,
            strength,
            lift
          )
      }
      onMouseLeave={
        resetTilt
      }
      className={`provn-tilt ${className}`}
    >
      <div className="provn-light" />

      <div className="relative z-[2]">
        {children}
      </div>
    </section>
  )
}

/* =========================================================
   LOGO
========================================================= */

function ProVNMark() {
  return (
    <svg
      viewBox="0 0 58 58"
      className="h-[45px] w-[45px]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="profile-edit-logo"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#ff8795"
          />

          <stop
            offset="22%"
            stopColor="#dd4255"
          />

          <stop
            offset="50%"
            stopColor="#8b1727"
          />

          <stop
            offset="78%"
            stopColor="#c8263c"
          />

          <stop
            offset="100%"
            stopColor="#31060c"
          />
        </linearGradient>
      </defs>

      <path
        d="M4 8.5h35l13 9-8 3H16L8 15Z"
        fill="url(#profile-edit-logo)"
      />

      <path
        d="M11 21h27c9 0 15 5 15 12s-6 12-15 12H26v-8h11c4 0 6-2 6-4s-2-4-6-4H24v15L12 55Z"
        fill="url(#profile-edit-logo)"
      />

      <path
        d="M12 29 24 40v9l-12-11Z"
        fill="#080405"
      />
    </svg>
  )
}

function ProVNLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center"
    >
      <span className="drop-shadow-[0_0_13px_rgba(218,39,61,.26)] transition-transform duration-300 group-hover:scale-[1.04]">
        <ProVNMark />
      </span>

      <span className="-ml-[4px] translate-y-[4px] text-[22px] font-black tracking-[-0.055em]">
        <span className="text-[#f2eeee]">
          ro
        </span>

        <span className="text-[#e21d38]">
          VN
        </span>
      </span>
    </Link>
  )
}

/* =========================================================
   ICONS
========================================================= */

function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 10H5" />
      <path d="m9 6-4 4 4 4" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 10 3.5 3.5L16 5.5" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect
        x="4.5"
        y="8.5"
        width="11"
        height="8"
        rx="2"
      />

      <path d="M7 8.5V6.7a3 3 0 0 1 6 0v1.8" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
      />

      <circle
        cx="9"
        cy="9"
        r="2"
      />

      <path d="m5 18 5-5 3 3 2-2 4 4" />
    </svg>
  )
}

function GameIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 8.5h7a5 5 0 0 1 4.7 3.3l1.1 3.2c.8 2.3-1.9 4.2-3.8 2.7L15.4 16H8.6l-2.1 1.7C4.6 19.2 1.9 17.3 2.7 15l1.1-3.2a5 5 0 0 1 4.7-3.3Z" />

      <path d="M7 12v3M5.5 13.5h3" />

      <path d="M16.5 12.5h.01M18 14h.01" />
    </svg>
  )
}

/* =========================================================
   FOUNDATION ITEM
========================================================= */

function FoundationItem({
  icon,
  title,
  description,
  state,
}: {
  icon: ReactNode
  title: string
  description: string
  state: string
}) {
  return (
    <div className="group flex min-h-[73px] items-center rounded-[16px] border border-white/[0.05] bg-black/20 px-4 transition-all duration-300 hover:-translate-y-[2px] hover:border-[#5c202b]/70 hover:bg-[#0b0608]">

      <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[11px] border border-[#64232f]/75 bg-[#11070a] text-[#c63d51] transition group-hover:scale-[1.05]">
        {icon}
      </span>

      <div className="ml-4">

        <p className="text-[10px] text-zinc-300">
          {title}
        </p>

        <p className="mt-[4px] text-[7px] text-zinc-700">
          {description}
        </p>
      </div>

      <span className="ml-auto pl-4 text-[7px] font-semibold uppercase tracking-[0.14em] text-[#c63d51]">
        {state}
      </span>
    </div>
  )
}

/* =========================================================
   PAGE
========================================================= */

export default function EditProfilePage() {
  const supabase =
    useMemo(
      () =>
        createClient(),
      []
    )

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    )

  const objectUrlRef =
    useRef<string | null>(
      null
    )

  const [
    loadState,
    setLoadState,
  ] =
    useState<LoadState>(
      'loading'
    )

  const [
    profile,
    setProfile,
  ] =
    useState<Profile | null>(
      null
    )

  const [
    displayName,
    setDisplayName,
  ] =
    useState('')

  const [
    originalDisplayName,
    setOriginalDisplayName,
  ] =
    useState('')

  const [
    bio,
    setBio,
  ] =
    useState('')

  const [
    originalBio,
    setOriginalBio,
  ] =
    useState('')

  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState<string | null>(
      null
    )

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] =
    useState<File | null>(
      null
    )

  const [
    emailVerified,
    setEmailVerified,
  ] =
    useState(false)

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    saveMessage,
    setSaveMessage,
  ] =
    useState<string | null>(
      null
    )

  const [
    saveError,
    setSaveError,
  ] =
    useState<string | null>(
      null
    )

  /* =======================================================
     LOAD
  ======================================================== */

  useEffect(() => {
    let active =
      true

    async function load() {
      try {
        const {
          data:
            userResult,

          error:
            userError,
        } =
          await supabase
            .auth
            .getUser()

        if (
          !active
        ) {
          return
        }

        if (
          userError ||
          !userResult.user
        ) {
          window.location.replace(
            '/login'
          )

          return
        }

        const user =
          userResult.user

        const {
          data:
            profileResult,

          error:
            profileError,
        } =
          await supabase
            .from(
              'profiles'
            )
            .select(
              'id, username, display_name, avatar_url, bio, created_at'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          !active
        ) {
          return
        }

        if (
          profileError ||
          !profileResult
        ) {
          setLoadState(
            'error'
          )

          return
        }

        const signupName =
          typeof user
            .user_metadata
            ?.full_name ===
          'string'
            ? user
                .user_metadata
                .full_name
                .trim()
            : ''

        const initialName =
          profileResult
            .display_name
            ?.trim() ||
          signupName ||
          ''

        const initialBio =
          profileResult.bio ||
          ''

        setProfile(
          profileResult
        )

        setDisplayName(
          initialName
        )

        setOriginalDisplayName(
          initialName
        )

        setBio(
          initialBio
        )

        setOriginalBio(
          initialBio
        )

        setPreviewUrl(
          profileResult
            .avatar_url
        )

        setEmailVerified(
          Boolean(
            user
              .email_confirmed_at
          )
        )

        setLoadState(
          'ready'
        )
      } catch {
        if (
          active
        ) {
          setLoadState(
            'error'
          )
        }
      }
    }

    void load()

    return () => {
      active =
        false

      if (
        objectUrlRef.current
      ) {
        URL.revokeObjectURL(
          objectUrlRef.current
        )
      }
    }
  }, [
    supabase,
  ])

  /* =======================================================
     DERIVED
  ======================================================== */

  const profileHref =
    profile
      ? `/profiles/${encodeURIComponent(
          profile.username
        )}`
      : '/'

  const displayPreview =
    displayName.trim() ||
    profile?.username ||
    'Player'

  const initials =
    displayPreview
      .split(/\s+/)
      .filter(Boolean)
      .slice(
        0,
        2
      )
      .map(
        part =>
          part[0]
            ?.toUpperCase()
      )
      .join('') ||
    'P'

  const dirty =
    displayName.trim() !==
      originalDisplayName.trim() ||
    bio.trim() !==
      originalBio.trim() ||
    selectedPhoto !==
      null

  const profileComplete =
    [
      Boolean(
        displayName.trim()
      ),

      Boolean(
        bio.trim()
      ),

      Boolean(
        previewUrl
      ),
    ].filter(
      Boolean
    ).length

  /* =======================================================
     CHOOSE PHOTO
  ======================================================== */

  function choosePhoto() {
    if (
      saving
    ) {
      return
    }

    fileInputRef
      .current
      ?.click()
  }

  function handlePhotoChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event
        .target
        .files?.[0]

    event.target.value =
      ''

    if (
      !file
    ) {
      return
    }

    setSaveError(
      null
    )

    setSaveMessage(
      null
    )

    const allowed =
      [
        'image/jpeg',
        'image/png',
        'image/webp',
      ]

    if (
      !allowed.includes(
        file.type
      )
    ) {
      setSaveError(
        'Choose a JPG, PNG or WEBP image.'
      )

      return
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setSaveError(
        'Profile image must be 5 MB or smaller.'
      )

      return
    }

    if (
      objectUrlRef.current
    ) {
      URL.revokeObjectURL(
        objectUrlRef.current
      )
    }

    const objectUrl =
      URL.createObjectURL(
        file
      )

    objectUrlRef.current =
      objectUrl

    setSelectedPhoto(
      file
    )

    setPreviewUrl(
      objectUrl
    )
  }

  /* =======================================================
     CANCEL
  ======================================================== */

  function cancelChanges() {
    if (
      saving
    ) {
      return
    }

    if (
      objectUrlRef.current
    ) {
      URL.revokeObjectURL(
        objectUrlRef.current
      )

      objectUrlRef.current =
        null
    }

    setDisplayName(
      originalDisplayName
    )

    setBio(
      originalBio
    )

    setSelectedPhoto(
      null
    )

    setPreviewUrl(
      profile
        ?.avatar_url ??
        null
    )

    setSaveError(
      null
    )

    setSaveMessage(
      null
    )
  }

  /* =======================================================
     SAVE ALL PROFILE CHANGES
  ======================================================== */

  async function saveProfile(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (
      saving ||
      !dirty ||
      !profile
    ) {
      return
    }

    const cleanDisplayName =
      displayName.trim()

    const cleanBio =
      bio.trim()

    if (
      cleanDisplayName.length >
      50
    ) {
      setSaveError(
        'Display name cannot exceed 50 characters.'
      )

      return
    }

    if (
      cleanBio.length >
      240
    ) {
      setSaveError(
        'Bio cannot exceed 240 characters.'
      )

      return
    }

    setSaving(
      true
    )

    setSaveError(
      null
    )

    setSaveMessage(
      null
    )

    try {
      /* =========================================
         CURRENT SUPABASE SESSION
      ========================================= */

      const {
        data:
          sessionResult,

        error:
          sessionError,
      } =
        await supabase
          .auth
          .getSession()

      if (
        sessionError
      ) {
        throw new Error(
          sessionError.message
        )
      }

      let session =
        sessionResult.session

      /* =========================================
         REFRESH IF NECESSARY
      ========================================= */

      if (
        !session
          ?.access_token
      ) {
        const {
          data:
            refreshResult,

          error:
            refreshError,
        } =
          await supabase
            .auth
            .refreshSession()

        if (
          refreshError ||
          !refreshResult
            .session
            ?.access_token
        ) {
          throw new Error(
            'Your login session expired. Please sign in again.'
          )
        }

        session =
          refreshResult.session
      }

      const accessToken =
        session.access_token

      /* =========================================
         PROFILE FORM DATA
      ========================================= */

      const formData =
        new FormData()

      formData.append(
        'displayName',
        cleanDisplayName
      )

      formData.append(
        'bio',
        cleanBio
      )

      if (
        selectedPhoto
      ) {
        formData.append(
          'avatar',
          selectedPhoto
        )
      }

      /* =========================================
         SAVE
      ========================================= */

      const saveResponse =
        await fetch(
          '/api/profile/update',
          {
            method:
              'POST',

            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },

            body:
              formData,

            credentials:
              'same-origin',

            cache:
              'no-store',
          }
        )

      const result =
        await saveResponse
          .json()
          .catch(
            () => ({})
          )

      if (
        !saveResponse.ok ||
        !result.ok
      ) {
        throw new Error(
          typeof result.error ===
            'string'
            ? result.error
            : 'Could not save profile changes.'
        )
      }

      const saved =
        result.profile as
          Profile | undefined

      if (
        !saved
      ) {
        throw new Error(
          'Profile was saved but no updated profile was returned.'
        )
      }

      /* =========================================
         CLEAN TEMPORARY PREVIEW URL
      ========================================= */

      if (
        objectUrlRef.current
      ) {
        URL.revokeObjectURL(
          objectUrlRef.current
        )

        objectUrlRef.current =
          null
      }

      /* =========================================
         SAVED DATABASE STATE
      ========================================= */

      setProfile(
        saved
      )

      const finalName =
        saved
          .display_name ||
        ''

      const finalBio =
        saved.bio ||
        ''

      setDisplayName(
        finalName
      )

      setOriginalDisplayName(
        finalName
      )

      setBio(
        finalBio
      )

      setOriginalBio(
        finalBio
      )

      setSelectedPhoto(
        null
      )

      setPreviewUrl(
        saved.avatar_url
      )

      setSaveMessage(
        'Profile saved successfully. Your public identity is now updated.'
      )
    } catch (
      error
    ) {
      /*
        Do NOT console.error here.

        Next.js development overlay treats console errors
        as a red development error screen.

        We show the error cleanly inside the ProVN UI instead.
      */

      setSaveError(
        error instanceof
          Error
          ? error.message
          : 'Could not save profile changes.'
      )
    } finally {
      setSaving(
        false
      )
    }
  }

  /* =======================================================
     LOADING
  ======================================================== */

  if (
    loadState ===
    'loading'
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020203] text-white">

        <style>
          {`
            @media (pointer: fine) {
              html,
              body,
              body * {
                cursor: ${PROVN_CURSOR} !important;
              }
            }
          `}
        </style>

        <div className="text-center">

          <div className="mx-auto h-[38px] w-[38px] animate-spin rounded-full border border-[#55202a] border-t-[#dc3e54]" />

          <p className="mt-5 text-[7px] uppercase tracking-[0.26em] text-zinc-700">
            Loading Identity Studio
          </p>
        </div>
      </main>
    )
  }

  /* =======================================================
     ERROR
  ======================================================== */

  if (
    loadState ===
      'error' ||
    !profile
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020203] px-6 text-white">

        <div className="text-center">

          <p className="text-[7px] uppercase tracking-[0.26em] text-[#9b3544]">
            ProVN Identity
          </p>

          <h1 className="mt-5 text-[40px] font-black">
            Profile unavailable.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-flex h-[45px] items-center rounded-full border border-[#6d2430] bg-[#11070a] px-7 text-[8px] uppercase tracking-[0.15em]"
          >
            Return Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <style>
        {`
          @media (pointer: fine) {
            html,
            body,
            body * {
              cursor: ${PROVN_CURSOR} !important;
            }

            input[data-writing-field="true"],
            textarea[data-writing-field="true"],
            [contenteditable="true"] {
              cursor: text !important;
            }

            button,
            a,
            [role="button"] {
              cursor: ${PROVN_CURSOR} !important;
            }
          }

          html,
          body {
            background: #020203;
          }

          .provn-tilt {
            --mx: 50%;
            --my: 50%;

            position: relative;
            isolation: isolate;

            transform:
              perspective(1300px)
              rotateX(0deg)
              rotateY(0deg);

            transform-style:
              preserve-3d;

            will-change:
              transform;

            transition:
              transform
              520ms
              cubic-bezier(.16,1,.3,1),
              border-color
              280ms ease,
              box-shadow
              350ms ease;
          }

          .provn-tilt:hover {
            border-color:
              rgba(112,38,51,.82);

            box-shadow:
              0 34px 90px
              rgba(0,0,0,.30),
              0 0 42px
              rgba(153,23,43,.06);
          }

          .provn-light {
            position: absolute;
            inset: 0;

            pointer-events: none;

            border-radius: inherit;

            opacity: 0;

            background:
              radial-gradient(
                circle at
                var(--mx)
                var(--my),
                rgba(255,255,255,.055),
                rgba(196,43,64,.025) 22%,
                transparent 50%
              );

            transition:
              opacity 220ms ease;
          }

          .provn-tilt:hover
          .provn-light {
            opacity: 1;
          }

          .input-premium {
            transition:
              transform 220ms ease,
              border-color 220ms ease,
              box-shadow 220ms ease,
              background-color 220ms ease;
          }

          .input-premium:hover {
            border-color:
              rgba(102,35,48,.72);
          }

          .input-premium:focus {
            transform:
              translateY(-1px);

            border-color:
              rgba(194,56,75,.86);

            background:
              #090607;

            box-shadow:
              0 0 0 3px
              rgba(158,28,48,.07),
              0 0 29px
              rgba(145,20,41,.06);
          }

          .photo-button {
            transition:
              transform
              330ms
              cubic-bezier(.16,1,.3,1),
              border-color
              240ms ease,
              box-shadow
              300ms ease;
          }

          .photo-button:hover {
            transform:
              translateY(-4px)
              scale(1.025);

            border-color:
              rgba(218,65,85,.92);

            box-shadow:
              0 23px 50px
              rgba(0,0,0,.36),
              0 0 34px
              rgba(178,31,51,.12);
          }

          .save-button {
            position: relative;
            overflow: hidden;
          }

          .save-button::after {
            content: "";

            position: absolute;

            top: -100%;
            left: -35%;

            width: 16%;
            height: 300%;

            transform:
              rotate(19deg);

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.16),
                transparent
              );

            transition:
              left
              760ms
              cubic-bezier(.16,1,.3,1);
          }

          .save-button:not(:disabled):hover::after {
            left: 125%;
          }

          .back-button {
            box-shadow:
              inset 0 1px 0
              rgba(255,255,255,.04),
              0 0 20px
              rgba(157,28,46,.09);

            transition:
              transform 220ms ease,
              box-shadow 220ms ease,
              border-color 220ms ease;
          }

          .back-button:hover {
            transform:
              translateY(-2px);

            border-color:
              rgba(188,55,72,.88);

            box-shadow:
              0 10px 30px
              rgba(0,0,0,.30),
              0 0 30px
              rgba(182,38,57,.16);
          }

          .page-entry {
            animation:
              pageEntry
              540ms
              cubic-bezier(.16,1,.3,1)
              both;
          }

          @keyframes pageEntry {
            from {
              opacity: 0;
              transform:
                translateY(14px);
              filter:
                blur(4px);
            }

            to {
              opacity: 1;
              transform:
                translateY(0);
              filter:
                blur(0);
            }
          }

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .provn-tilt,
            .photo-button,
            .page-entry {
              animation:
                none !important;

              transition:
                none !important;

              transform:
                none !important;
            }
          }
        `}
      </style>

      <main className="relative min-h-screen overflow-x-clip bg-[#020203] text-white">

        {/* BACKGROUND */}

        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              'radial-gradient(circle at 6% 8%,rgba(111,8,28,.11),transparent 29%),radial-gradient(circle at 93% 14%,rgba(91,6,24,.08),transparent 27%),#020203',
          }}
        />

        <div
          className="pointer-events-none fixed inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)',

            backgroundSize:
              '90px 90px',
          }}
        />

        {/* HEADER */}

        <header className="sticky top-0 z-[1000] border-b border-[#43131b]/50 bg-[#020203]/[0.96] backdrop-blur-xl">

          <div className="mx-auto flex h-[78px] max-w-[1450px] items-center justify-between px-6 lg:px-10">

            <div className="flex items-center gap-5">

              <ProVNLogo />

              <div className="hidden h-[27px] w-px bg-white/[0.055] sm:block" />

              <div className="hidden sm:block">

                <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#963644]">
                  Identity Studio
                </p>

                <p className="mt-[3px] text-[7px] text-zinc-700">
                  Profile Configuration
                </p>
              </div>
            </div>

            <Link
              href={
                profileHref
              }
              className="back-button inline-flex h-[43px] min-w-[145px] items-center justify-center gap-3 rounded-full border border-[#722631]/80 bg-[#10070a]/90 px-5 text-[7px] font-semibold uppercase tracking-[0.16em] text-zinc-300"
            >
              <span className="text-[#ce4153]">
                <ArrowLeft />
              </span>

              Back to Profile
            </Link>
          </div>
        </header>

        {/* CONTENT */}

        <div className="page-entry relative z-10 mx-auto max-w-[1320px] px-6 pb-24 pt-10 lg:px-10">

          <div className="mb-8">

            <h1 className="text-[48px] font-black leading-[.96] tracking-[-0.055em] sm:text-[60px]">
              Shape your identity.
            </h1>

            <p className="mt-6 max-w-[760px] text-[11px] leading-6 text-zinc-600">
              Customize how your ProVN profile appears publicly.
              Your display name, bio and profile picture are published
              together when you save.
            </p>
          </div>

          <form
            onSubmit={
              saveProfile
            }
          >

            <div className="grid gap-6 lg:grid-cols-[430px_1fr]">

              {/* LEFT */}

              <div className="space-y-6">

                {/* LIVE PREVIEW */}

                <TiltPanel
                  strength={4.2}
                  lift={7}
                  className="overflow-hidden rounded-[27px] border border-[#64232f]/75 bg-[#070708]/95 p-6"
                >

                  <div className="flex items-center justify-between">

                    <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#9c3746]">
                      Live Identity Preview
                    </p>

                    <span className="rounded-full border border-[#59202a]/70 bg-[#11070a] px-3 py-[6px] text-[7px] uppercase tracking-[0.14em] text-[#993644]">
                      Public
                    </span>
                  </div>

                  <div className="mt-9 flex items-center gap-5">

                    <button
                      type="button"
                      onClick={
                        choosePhoto
                      }
                      disabled={
                        saving
                      }
                      className="photo-button group relative flex h-[126px] w-[126px] shrink-0 items-center justify-center overflow-hidden rounded-[31px] border border-[#792c39]/90 bg-gradient-to-br from-[#43121c] via-[#19090e] to-[#070708]"
                    >

                      {previewUrl ? (
                        <img
                          src={
                            previewUrl
                          }
                          alt="Profile preview"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <span className="text-[34px] font-black tracking-[-0.055em] text-[#e35163]">
                          {initials}
                        </span>
                      )}

                      <span className="pointer-events-none absolute inset-[6px] rounded-[25px] border border-white/[0.04]" />

                      <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/[0.82] via-transparent to-transparent pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">

                        <span className="text-[6px] font-semibold uppercase tracking-[0.15em] text-white">
                          Change Photo
                        </span>
                      </span>
                    </button>

                    <input
                      ref={
                        fileInputRef
                      }
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handlePhotoChange
                      }
                      className="hidden"
                    />

                    <div className="min-w-0">

                      <p className="text-[7px] uppercase tracking-[0.24em] text-[#963644]">
                        ProVN Identity
                      </p>

                      <h2 className="mt-5 truncate text-[28px] font-black tracking-[-0.045em]">
                        {displayPreview}
                      </h2>

                      <p className="mt-3 truncate text-[11px] font-semibold text-[#d94055]">
                        @{profile.username}
                      </p>
                    </div>
                  </div>

                  <p className="mt-7 min-h-[46px] text-[9px] leading-5 text-zinc-600">
                    {bio.trim() ||
                      'Add a short bio to describe your gaming identity.'}
                  </p>

                  <div className="mt-6 border-t border-white/[0.045] pt-5">

                    <div className="flex items-center justify-between">

                      <span
                        className={`h-[6px] w-[6px] rounded-full ${
                          selectedPhoto
                            ? 'bg-[#dd4055] shadow-[0_0_9px_rgba(221,64,85,.45)]'
                            : 'bg-zinc-800'
                        }`}
                      />

                      <p className="ml-3 mr-auto text-[7px] uppercase tracking-[0.15em] text-zinc-700">
                        {selectedPhoto
                          ? 'New profile photo ready to save'
                          : previewUrl
                            ? 'Current published profile photo'
                            : 'No profile photo added'}
                      </p>

                      <button
                        type="button"
                        onClick={
                          choosePhoto
                        }
                        disabled={
                          saving
                        }
                        className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#a83849] transition hover:text-[#e14a60] disabled:opacity-40"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </TiltPanel>

                {/* FOUNDATION */}

                <TiltPanel
                  strength={4}
                  lift={6}
                  className="rounded-[26px] border border-white/[0.05] bg-[#070708]/92 p-6"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-[7px] uppercase tracking-[0.24em] text-[#963644]">
                        Profile Foundation
                      </p>

                      <h2 className="mt-4 text-[23px] font-bold tracking-[-0.04em]">
                        Identity details.
                      </h2>

                      <p className="mt-3 text-[8px] text-zinc-700">
                        Profile completeness is not verification.
                      </p>
                    </div>

                    <span className="rounded-full border border-[#64232f]/75 bg-[#11070a] px-3 py-[7px] text-[7px] text-[#c23d50]">
                      {profileComplete}/3
                    </span>
                  </div>

                  <div className="mt-7 space-y-3">

                    <FoundationItem
                      icon={
                        <CheckIcon />
                      }
                      title="Display Name"
                      description="Your public profile name."
                      state={
                        displayName.trim()
                          ? 'Added'
                          : 'Missing'
                      }
                    />

                    <FoundationItem
                      icon={
                        <CheckIcon />
                      }
                      title="Bio"
                      description="Your short public identity statement."
                      state={
                        bio.trim()
                          ? 'Added'
                          : 'Missing'
                      }
                    />

                    <FoundationItem
                      icon={
                        <ImageIcon />
                      }
                      title="Profile Image"
                      description={
                        selectedPhoto
                          ? 'New image selected and ready to publish.'
                          : 'Your public ProVN portrait.'
                      }
                      state={
                        selectedPhoto
                          ? 'Unsaved'
                          : previewUrl
                            ? 'Added'
                            : 'Missing'
                      }
                    />
                  </div>
                </TiltPanel>

                {/* TRUST */}

                <TiltPanel
                  strength={4}
                  lift={6}
                  className="rounded-[26px] border border-white/[0.05] bg-[#070708]/92 p-6"
                >

                  <p className="text-[7px] uppercase tracking-[0.24em] text-[#963644]">
                    Trust Status
                  </p>

                  <h2 className="mt-4 text-[23px] font-bold tracking-[-0.04em]">
                    Verification layers.
                  </h2>

                  <div className="mt-7">

                    <div className="flex min-h-[57px] items-center border-b border-white/[0.045]">

                      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[10px] border border-[#60232d]/70 bg-[#11070a] text-[#c83e52]">
                        <CheckIcon />
                      </span>

                      <span className="ml-4 text-[8px] text-zinc-400">
                        Email Ownership
                      </span>

                      <span
                        className={`ml-auto text-[7px] font-semibold uppercase tracking-[0.13em] ${
                          emailVerified
                            ? 'text-emerald-500'
                            : 'text-zinc-700'
                        }`}
                      >
                        {emailVerified
                          ? 'Verified'
                          : 'Pending'}
                      </span>
                    </div>

                    <div className="flex min-h-[57px] items-center">

                      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[10px] border border-[#60232d]/70 bg-[#11070a] text-[#a53747]">
                        <GameIcon />
                      </span>

                      <span className="ml-4 text-[8px] text-zinc-400">
                        Game Identity
                      </span>

                      <span className="ml-auto text-[7px] uppercase tracking-[0.13em] text-zinc-700">
                        Not Connected
                      </span>
                    </div>
                  </div>
                </TiltPanel>
              </div>

              {/* RIGHT */}

              <TiltPanel
                strength={2.2}
                lift={4}
                className="h-fit overflow-hidden rounded-[28px] border border-[#60222e]/70 bg-[#070708]/95 p-7 sm:p-9"
              >

                <div>

                  <p className="text-[7px] uppercase tracking-[0.25em] text-[#963644]">
                    Public Profile
                  </p>

                  <h2 className="mt-5 text-[32px] font-black tracking-[-0.045em]">
                    Profile details.
                  </h2>

                  <p className="mt-5 text-[9px] leading-5 text-zinc-700">
                    Everything edited here is published together when you press Save Changes.
                  </p>
                </div>

                {/* USERNAME */}

                <div className="mt-12">

                  <div className="flex items-center justify-between">

                    <label className="text-[7px] font-semibold uppercase tracking-[0.17em] text-zinc-600">
                      Username
                    </label>

                    <span className="flex items-center gap-2 text-[6px] uppercase tracking-[0.13em] text-zinc-700">

                      <LockIcon />

                      Locked
                    </span>
                  </div>

                  <div className="mt-3 flex h-[57px] items-center rounded-[14px] border border-white/[0.055] bg-black/25 px-4">

                    <span className="mr-2 text-[18px] text-[#b63449]">
                      @
                    </span>

                    <span className="text-[11px] text-zinc-600">
                      {profile.username}
                    </span>
                  </div>
                </div>

                {/* DISPLAY NAME */}

                <div className="mt-8">

                  <div className="flex items-center justify-between">

                    <label
                      htmlFor="displayName"
                      className="text-[7px] font-semibold uppercase tracking-[0.17em] text-zinc-600"
                    >
                      Display Name
                    </label>

                    <span className="text-[6px] text-zinc-800">
                      {displayName.length}/50
                    </span>
                  </div>

                  <input
                    id="displayName"
                    data-writing-field="true"
                    value={
                      displayName
                    }
                    maxLength={50}
                    disabled={
                      saving
                    }
                    onChange={
                      event => {
                        setDisplayName(
                          event.target.value
                        )

                        setSaveMessage(
                          null
                        )

                        setSaveError(
                          null
                        )
                      }
                    }
                    placeholder="Your public name"
                    className="input-premium mt-3 h-[57px] w-full rounded-[14px] border border-white/[0.065] bg-black/25 px-4 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-800 disabled:opacity-50"
                  />
                </div>

                {/* BIO */}

                <div className="mt-8">

                  <div className="flex items-center justify-between">

                    <label
                      htmlFor="profileBio"
                      className="text-[7px] font-semibold uppercase tracking-[0.17em] text-zinc-600"
                    >
                      Bio
                    </label>

                    <span className="text-[6px] text-zinc-800">
                      {bio.length}/240
                    </span>
                  </div>

                  <textarea
                    id="profileBio"
                    data-writing-field="true"
                    value={
                      bio
                    }
                    maxLength={240}
                    disabled={
                      saving
                    }
                    onChange={
                      event => {
                        setBio(
                          event.target.value
                        )

                        setSaveMessage(
                          null
                        )

                        setSaveError(
                          null
                        )
                      }
                    }
                    placeholder="Describe your gaming identity..."
                    className="input-premium mt-3 min-h-[185px] w-full resize-none rounded-[15px] border border-white/[0.065] bg-black/25 px-4 py-4 text-[11px] leading-6 text-zinc-200 outline-none placeholder:text-zinc-800 disabled:opacity-50"
                  />
                </div>

                {/* STATUS */}

                <div className="mt-8 border-t border-white/[0.045] pt-7">

                  <div className="grid gap-3 sm:grid-cols-2">

                    <div className="rounded-[16px] border border-white/[0.05] bg-black/20 p-4">

                      <p className="text-[7px] uppercase tracking-[0.15em] text-zinc-700">
                        Email Ownership
                      </p>

                      <p
                        className={`mt-3 text-[10px] font-semibold ${
                          emailVerified
                            ? 'text-emerald-500'
                            : 'text-zinc-600'
                        }`}
                      >
                        {emailVerified
                          ? 'Verified'
                          : 'Pending'}
                      </p>
                    </div>

                    <div className="rounded-[16px] border border-white/[0.05] bg-black/20 p-4">

                      <p className="text-[7px] uppercase tracking-[0.15em] text-zinc-700">
                        Game Identity
                      </p>

                      <p className="mt-3 text-[10px] font-semibold text-zinc-600">
                        Not Connected
                      </p>
                    </div>
                  </div>
                </div>

                {/* PHOTO PENDING */}

                {selectedPhoto && (
                  <div className="mt-6 flex items-center rounded-[13px] border border-[#632330]/70 bg-[#11070a]/65 px-4 py-4">

                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[10px] border border-[#712733] bg-[#17090d] text-[#d34256]">
                      <ImageIcon />
                    </span>

                    <div className="ml-4 min-w-0">

                      <p className="text-[8px] font-semibold text-zinc-300">
                        New profile photo selected
                      </p>

                      <p className="mt-[4px] truncate text-[7px] text-zinc-700">
                        {selectedPhoto.name}
                      </p>
                    </div>

                    <span className="ml-auto pl-4 text-[6px] font-semibold uppercase tracking-[0.14em] text-[#b83b4d]">
                      Save Pending
                    </span>
                  </div>
                )}

                {/* ERROR */}

                {saveError && (
                  <div className="mt-6 rounded-[13px] border border-red-900/40 bg-red-950/[0.09] px-4 py-4 text-[8px] leading-5 text-[#df5669]">
                    {saveError}
                  </div>
                )}

                {/* SUCCESS */}

                {saveMessage && (
                  <div className="mt-6 rounded-[13px] border border-emerald-900/30 bg-emerald-950/[0.06] px-4 py-4 text-[8px] leading-5 text-emerald-500">
                    {saveMessage}
                  </div>
                )}

                {/* SAVE */}

                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/[0.045] pt-7">

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      !dirty
                    }
                    className="save-button group inline-flex h-[52px] min-w-[210px] items-center justify-center gap-8 rounded-[13px] border border-[#dc4156] bg-gradient-to-r from-[#911228] to-[#cf2841] px-7 text-[8px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_18px_45px_rgba(117,10,31,.22)] transition-all duration-200 hover:-translate-y-[2px] hover:border-[#fb6174] hover:shadow-[0_22px_55px_rgba(146,17,41,.28)] disabled:translate-y-0 disabled:border-white/[0.055] disabled:bg-none disabled:bg-[#0a0a0c] disabled:text-zinc-700 disabled:shadow-none"
                  >

                    <span className="relative z-[2]">
                      {saving
                        ? 'Saving Profile...'
                        : 'Save Changes'}
                    </span>

                    {!saving && (
                      <span className="relative z-[2] transition-transform duration-200 group-hover:translate-x-1">
                        <ArrowRight />
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={
                      saving ||
                      !dirty
                    }
                    onClick={
                      cancelChanges
                    }
                    className="h-[52px] min-w-[105px] rounded-[13px] border border-white/[0.055] bg-black/20 px-5 text-[7px] font-semibold uppercase tracking-[0.14em] text-zinc-600 transition hover:border-[#63232e]/75 hover:text-zinc-300 disabled:opacity-25"
                  >
                    Cancel
                  </button>

                  <div className="ml-auto flex items-center gap-3">

                    <span
                      className={`h-[6px] w-[6px] rounded-full ${
                        dirty
                          ? 'bg-[#d23d52] shadow-[0_0_9px_rgba(210,61,82,.45)]'
                          : 'bg-emerald-500'
                      }`}
                    />

                    <span
                      className={`text-[7px] font-semibold uppercase tracking-[0.13em] ${
                        dirty
                          ? 'text-[#a83849]'
                          : 'text-zinc-700'
                      }`}
                    >
                      {dirty
                        ? 'Unsaved Changes'
                        : 'Profile Saved'}
                    </span>
                  </div>
                </div>
              </TiltPanel>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}