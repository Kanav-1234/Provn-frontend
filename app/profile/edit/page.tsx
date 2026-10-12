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
}

type LoadState =
  | 'loading'
  | 'ready'
  | 'error'

const MAX_AVATAR_SIZE =
  5 * 1024 * 1024

const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

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
   PREMIUM TILT ENGINE
========================================================= */

function applyTilt(
  event: ReactMouseEvent<HTMLElement>,
  maxTilt: number,
  lift: number,
  scale: number,
  depth: number
) {
  const element =
    event.currentTarget

  const rect =
    element.getBoundingClientRect()

  const x =
    (event.clientX - rect.left) /
    rect.width

  const y =
    (event.clientY - rect.top) /
    rect.height

  const normalizedX =
    x - 0.5

  const normalizedY =
    y - 0.5

  const rotateY =
    normalizedX *
    maxTilt *
    2

  const rotateX =
    -normalizedY *
    maxTilt *
    2

  const shadowX =
    -normalizedX * 24

  const shadowY =
    28 +
    -normalizedY * 18

  element.style.transition =
    'transform 85ms linear, border-color 220ms ease, box-shadow 220ms ease'

  element.style.setProperty(
    '--tilt-rx',
    `${rotateX.toFixed(2)}deg`
  )

  element.style.setProperty(
    '--tilt-ry',
    `${rotateY.toFixed(2)}deg`
  )

  element.style.setProperty(
    '--tilt-lift',
    `-${lift}px`
  )

  element.style.setProperty(
    '--tilt-scale',
    String(scale)
  )

  element.style.setProperty(
    '--tilt-mx',
    `${(x * 100).toFixed(1)}%`
  )

  element.style.setProperty(
    '--tilt-my',
    `${(y * 100).toFixed(1)}%`
  )

  element.style.setProperty(
    '--tilt-shadow-x',
    `${shadowX.toFixed(1)}px`
  )

  element.style.setProperty(
    '--tilt-shadow-y',
    `${shadowY.toFixed(1)}px`
  )

  element.style.setProperty(
    '--tilt-depth',
    `${depth}px`
  )
}

function resetTilt(
  event: ReactMouseEvent<HTMLElement>
) {
  const element =
    event.currentTarget

  element.style.transition =
    'transform 520ms cubic-bezier(.16,1,.3,1), border-color 320ms ease, box-shadow 420ms ease'

  element.style.setProperty(
    '--tilt-rx',
    '0deg'
  )

  element.style.setProperty(
    '--tilt-ry',
    '0deg'
  )

  element.style.setProperty(
    '--tilt-lift',
    '0px'
  )

  element.style.setProperty(
    '--tilt-scale',
    '1'
  )

  element.style.setProperty(
    '--tilt-mx',
    '50%'
  )

  element.style.setProperty(
    '--tilt-my',
    '50%'
  )

  element.style.setProperty(
    '--tilt-shadow-x',
    '0px'
  )

  element.style.setProperty(
    '--tilt-shadow-y',
    '28px'
  )

  element.style.setProperty(
    '--tilt-depth',
    '0px'
  )
}

/* =========================================================
   MOTION PANELS
========================================================= */

function TiltPanel({
  children,
  className = '',
  maxTilt = 4.6,
  lift = 7,
  scale = 1.006,
  depth = 11,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  lift?: number
  scale?: number
  depth?: number
}) {
  return (
    <div
      onMouseMove={
        event =>
          applyTilt(
            event,
            maxTilt,
            lift,
            scale,
            depth
          )
      }
      onMouseLeave={
        resetTilt
      }
      className={`provn-motion-panel ${className}`}
    >
      <span
        aria-hidden="true"
        className="provn-pointer-reflection"
      />

      <span
        aria-hidden="true"
        className="provn-edge-response"
      />

      <span
        aria-hidden="true"
        className="provn-metal-sheen"
      />

      <div className="provn-panel-content">
        {children}
      </div>
    </div>
  )
}

function TiltForm({
  children,
  className = '',
  onSubmit,
}: {
  children: ReactNode
  className?: string
  onSubmit:
    (
      event: FormEvent<HTMLFormElement>
    ) => void
}) {
  return (
    <form
      onSubmit={
        onSubmit
      }
      onMouseMove={
        event =>
          applyTilt(
            event,
            2.5,
            5,
            1.002,
            7
          )
      }
      onMouseLeave={
        resetTilt
      }
      className={`provn-motion-panel provn-form-motion ${className}`}
    >
      <span
        aria-hidden="true"
        className="provn-pointer-reflection"
      />

      <span
        aria-hidden="true"
        className="provn-edge-response"
      />

      <span
        aria-hidden="true"
        className="provn-metal-sheen"
      />

      <div className="provn-panel-content">
        {children}
      </div>
    </form>
  )
}

/* =========================================================
   LOGO
========================================================= */

function ProVNMark({
  className = 'h-[44px] w-[44px]',
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 58 58"
      aria-hidden="true"
      className={`${className} shrink-0 overflow-visible drop-shadow-[0_0_12px_rgba(226,32,57,.30)]`}
    >
      <defs>
        <linearGradient
          id="edit-main"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#ff8a95"
          />
          <stop
            offset="13%"
            stopColor="#e65362"
          />
          <stop
            offset="32%"
            stopColor="#ba273a"
          />
          <stop
            offset="51%"
            stopColor="#811320"
          />
          <stop
            offset="72%"
            stopColor="#ad1c30"
          />
          <stop
            offset="100%"
            stopColor="#240508"
          />
        </linearGradient>

        <linearGradient
          id="edit-top"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor="#77101b"
          />
          <stop
            offset="34%"
            stopColor="#df4355"
          />
          <stop
            offset="57%"
            stopColor="#ff9ea7"
          />
          <stop
            offset="100%"
            stopColor="#6e0b17"
          />
        </linearGradient>

        <linearGradient
          id="edit-edge"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#ffc7cc"
          />
          <stop
            offset="34%"
            stopColor="#ff5365"
          />
          <stop
            offset="100%"
            stopColor="#680715"
          />
        </linearGradient>
      </defs>

      <path
        d="M4.5 8.5 H39 L52 17.5 L44.5 20.5 H16.2 L8.7 15.3 Z"
        fill="url(#edit-top)"
        stroke="url(#edit-edge)"
        strokeWidth=".8"
        strokeLinejoin="round"
      />

      <path
        d="M11.2 21.5 H37.6 C46.5 21.5 52.5 26.3 52.5 33 C52.5 40.4 46.8 45.4 37.6 45.4 H26.4 V36.9 H37.1 C40.9 36.9 43.4 35.2 43.4 32.8 C43.4 30.3 40.9 28.6 37.1 28.6 H23.6 V43.5 L12 55 Z"
        fill="url(#edit-main)"
        stroke="url(#edit-edge)"
        strokeWidth=".8"
        strokeLinejoin="round"
      />

      <path
        d="M11.8 29.2 L23.7 40.2 L23.7 49.3 L17.8 43.6 L11.8 38 Z"
        fill="#070405"
      />

      <path
        d="M7.2 10 H38.2 L47.2 16.3"
        fill="none"
        stroke="#ffd3d7"
        strokeOpacity=".66"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ProVNLogo() {
  return (
    <Link
      href="/"
      aria-label="ProVN home"
      className="group inline-flex items-center"
    >
      <span className="relative">

        <span className="pointer-events-none absolute inset-[7px] rounded-full bg-[#d1213c]/20 opacity-0 blur-[15px] transition-opacity duration-300 group-hover:opacity-100" />

        <ProVNMark />
      </span>

      <span className="-ml-[3px] translate-y-[4px] text-[22px] font-black leading-none tracking-[-0.055em]">

        <span className="text-[#f4f1f1]">
          ro
        </span>

        <span className="text-[#e51f3b]">
          VN
        </span>
      </span>
    </Link>
  )
}

/* =========================================================
   ICONS
========================================================= */

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[13px] w-[13px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 10H5" />
      <path d="m9 6-4 4 4 4" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[13px] w-[13px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
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
      aria-hidden="true"
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
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
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
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
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
        cy="10"
        r="2"
      />

      <path d="m4 18 5-5 4 4 2-2 5 5" />
    </svg>
  )
}

function GamepadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 8.5h7a5 5 0 0 1 4.7 3.3l1.1 3.2c.8 2.3-1.9 4.2-3.8 2.7l-2.1-1.7H8.6l-2.1 1.7C4.6 19.2 1.9 17.3 2.7 15l1.1-3.2a5 5 0 0 1 4.7-3.3Z" />

      <path d="M7 12v3" />
      <path d="M5.5 13.5h3" />
      <path d="M16.5 12.5h.01" />
      <path d="M18 14h.01" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 19 6v5c0 4.8-2.9 8.1-7 10-4.1-1.9-7-5.2-7-10V6l7-3Z" />
    </svg>
  )
}

/* =========================================================
   FOUNDATION ROW
========================================================= */

function FoundationRow({
  icon,
  title,
  description,
  complete,
}: {
  icon: ReactNode
  title: string
  description: string
  complete: boolean
}) {
  return (
    <div className="flex min-h-[68px] items-center rounded-[15px] border border-white/[0.05] bg-black/20 px-4 transition-[border-color,background-color,box-shadow] duration-300 hover:border-[#59212b]/75 hover:bg-[#0c0608] hover:shadow-[0_10px_30px_rgba(0,0,0,.15)]">

      <span
        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] border ${
          complete
            ? 'border-[#6d2934]/75 bg-[#14090c] text-[#d14458]'
            : 'border-white/[0.05] bg-black/25 text-zinc-700'
        }`}
      >
        {icon}
      </span>

      <div className="ml-4 min-w-0">

        <p className="text-[10px] font-medium text-zinc-300">
          {title}
        </p>

        <p className="mt-[4px] text-[8px] text-zinc-700">
          {description}
        </p>
      </div>

      <span
        className={`ml-auto shrink-0 pl-4 text-[7px] font-semibold uppercase tracking-[0.15em] ${
          complete
            ? 'text-[#bd4051]'
            : 'text-zinc-700'
        }`}
      >
        {complete
          ? 'Added'
          : 'Missing'}
      </span>
    </div>
  )
}

/* =========================================================
   TRUST ROW
========================================================= */

function TrustRow({
  icon,
  title,
  status,
  statusTone = 'muted',
}: {
  icon: ReactNode
  title: string
  status: string
  statusTone?: 'green' | 'accent' | 'muted'
}) {
  const tone =
    statusTone === 'green'
      ? 'text-emerald-500'
      : statusTone === 'accent'
        ? 'text-[#bd4051]'
        : 'text-zinc-700'

  return (
    <div className="flex min-h-[58px] items-center border-b border-white/[0.045] py-3 last:border-b-0">

      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] border border-[#57202a]/65 bg-[#10070a] text-[#a83a49]">
        {icon}
      </span>

      <span className="ml-3 text-[9px] text-zinc-400">
        {title}
      </span>

      <span
        className={`ml-auto text-[7px] font-semibold uppercase tracking-[0.14em] ${tone}`}
      >
        {status}
      </span>
    </div>
  )
}

/* =========================================================
   STORAGE HELPERS
========================================================= */

function getAvatarExtension(
  type: string
) {
  if (
    type === 'image/png'
  ) {
    return 'png'
  }

  if (
    type === 'image/webp'
  ) {
    return 'webp'
  }

  return 'jpg'
}

function extractAvatarStoragePath(
  url: string | null,
  userId: string
) {
  if (!url) {
    return null
  }

  try {
    const parsed =
      new URL(url)

    const marker =
      '/storage/v1/object/public/avatars/'

    const index =
      parsed.pathname.indexOf(
        marker
      )

    if (
      index === -1
    ) {
      return null
    }

    const path =
      decodeURIComponent(
        parsed.pathname.slice(
          index +
          marker.length
        )
      )

    if (
      !path.startsWith(
        `${userId}/`
      )
    ) {
      return null
    }

    return path
  } catch {
    return null
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function EditProfilePage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    )

  const fileInputRef =
    useRef<HTMLInputElement | null>(
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
    userId,
    setUserId,
  ] =
    useState<string | null>(
      null
    )

  const [
    displayName,
    setDisplayName,
  ] =
    useState('')

  const [
    bio,
    setBio,
  ] =
    useState('')

  const [
    originalDisplayName,
    setOriginalDisplayName,
  ] =
    useState('')

  const [
    originalBio,
    setOriginalBio,
  ] =
    useState('')

  const [
    emailVerified,
    setEmailVerified,
  ] =
    useState(false)

  const [
    avatarFile,
    setAvatarFile,
  ] =
    useState<File | null>(
      null
    )

  const [
    avatarPreviewUrl,
    setAvatarPreviewUrl,
  ] =
    useState<string | null>(
      null
    )

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    uploadingAvatar,
    setUploadingAvatar,
  ] =
    useState(false)

  const [
    saved,
    setSaved,
  ] =
    useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(
      null
    )

  /* =======================================================
     BLOB CLEANUP
  ======================================================== */

  useEffect(() => {
    return () => {
      if (
        avatarPreviewUrl?.startsWith(
          'blob:'
        )
      ) {
        URL.revokeObjectURL(
          avatarPreviewUrl
        )
      }
    }
  }, [
    avatarPreviewUrl,
  ])

  /* =======================================================
     LOAD PROFILE
  ======================================================== */

  useEffect(() => {
    let active = true

    async function loadProfile() {
      const {
        data: userResult,
        error: userError,
      } =
        await supabase
          .auth
          .getUser()

      if (!active) {
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

      setUserId(
        user.id
      )

      const {
        data: profileResult,
        error: profileError,
      } =
        await supabase
          .from('profiles')
          .select(
            'id, username, display_name, avatar_url, bio'
          )
          .eq(
            'id',
            user.id
          )
          .maybeSingle()

      if (!active) {
        return
      }

      if (
        profileError ||
        !profileResult
      ) {
        console.error(
          'Could not load profile:',
          profileError
        )

        setLoadState(
          'error'
        )

        return
      }

      const metadataName =
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
        metadataName ||
        profileResult.username

      const initialBio =
        profileResult
          .bio
          ?.trim() ||
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

      setEmailVerified(
        Boolean(
          user.email_confirmed_at
        )
      )

      setLoadState(
        'ready'
      )
    }

    void loadProfile()

    return () => {
      active = false
    }
  }, [
    supabase,
  ])

  /* =======================================================
     DERIVED STATE
  ======================================================== */

  const cleanDisplayName =
    displayName.trim()

  const cleanBio =
    bio.trim()

  const currentAvatarUrl =
    avatarPreviewUrl ||
    profile?.avatar_url ||
    null

  const avatarChanged =
    Boolean(
      avatarFile
    )

  const dirty =
    cleanDisplayName !==
      originalDisplayName.trim() ||
    cleanBio !==
      originalBio.trim() ||
    avatarChanged

  const nameAdded =
    Boolean(
      cleanDisplayName
    )

  const bioAdded =
    Boolean(
      cleanBio
    )

  const avatarAdded =
    Boolean(
      currentAvatarUrl
    )

  const foundationCount =
    [
      nameAdded,
      bioAdded,
      avatarAdded,
    ].filter(Boolean).length

  const initials =
    (
      cleanDisplayName ||
      profile?.username ||
      'P'
    )
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        part =>
          part[0]
            ?.toUpperCase()
      )
      .join('') ||
    'P'

  const profileHref =
    profile?.username
      ? `/profiles/${encodeURIComponent(
          profile.username
        )}`
      : '/'

  /* =======================================================
     CLICK AVATAR
  ======================================================== */

  function openAvatarPicker() {
    fileInputRef
      .current
      ?.click()
  }

  function handleAvatarInput(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0]

    event.target.value = ''

    if (!file) {
      return
    }

    setSaved(false)
    setErrorMessage(null)

    if (
      !ALLOWED_AVATAR_TYPES.includes(
        file.type
      )
    ) {
      setErrorMessage(
        'Use a JPEG, PNG or WebP profile image.'
      )

      return
    }

    if (
      file.size >
      MAX_AVATAR_SIZE
    ) {
      setErrorMessage(
        'Profile images must be 5 MB or smaller.'
      )

      return
    }

    const previewUrl =
      URL.createObjectURL(
        file
      )

    setAvatarFile(
      file
    )

    setAvatarPreviewUrl(
      previewUrl
    )
  }

  /* =======================================================
     SAVE
  ======================================================== */

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (
      saving ||
      !profile ||
      !userId
    ) {
      return
    }

    setSaved(false)
    setErrorMessage(null)

    if (
      cleanDisplayName &&
      cleanDisplayName.length < 2
    ) {
      setErrorMessage(
        'Display name must be at least 2 characters.'
      )

      return
    }

    if (
      cleanDisplayName.length > 50
    ) {
      setErrorMessage(
        'Display name cannot exceed 50 characters.'
      )

      return
    }

    if (
      cleanBio.length > 240
    ) {
      setErrorMessage(
        'Bio cannot exceed 240 characters.'
      )

      return
    }

    setSaving(true)

    let uploadedPath:
      string | null =
      null

    const previousAvatarUrl =
      profile.avatar_url

    try {
      let newAvatarUrl:
        string | undefined =
        undefined

      /* ===============================================
         UPLOAD IMAGE
      =============================================== */

      if (
        avatarFile
      ) {
        setUploadingAvatar(
          true
        )

        const extension =
          getAvatarExtension(
            avatarFile.type
          )

        uploadedPath =
          `${userId}/avatar-${Date.now()}.${extension}`

        const {
          error:
            uploadError,
        } =
          await supabase
            .storage
            .from(
              'avatars'
            )
            .upload(
              uploadedPath,
              avatarFile,
              {
                contentType:
                  avatarFile.type,

                cacheControl:
                  '3600',

                upsert:
                  false,
              }
            )

        if (
          uploadError
        ) {
          throw new Error(
            uploadError.message ||
            'Could not upload profile image.'
          )
        }

        const {
          data:
            publicUrlResult,
        } =
          supabase
            .storage
            .from(
              'avatars'
            )
            .getPublicUrl(
              uploadedPath
            )

        if (
          !publicUrlResult
            .publicUrl
        ) {
          throw new Error(
            'Could not create profile image URL.'
          )
        }

        newAvatarUrl =
          publicUrlResult
            .publicUrl
      }

      /* ===============================================
         PROFILE UPDATE
      =============================================== */

      const payload: {
        displayName: string
        bio: string
        avatarUrl?: string
      } = {
        displayName:
          cleanDisplayName,

        bio:
          cleanBio,
      }

      if (
        newAvatarUrl
      ) {
        payload.avatarUrl =
          newAvatarUrl
      }

      const response =
        await fetch(
          '/api/profile/update',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        )

      const result =
        await response.json()

      if (
        !response.ok ||
        !result.ok
      ) {
        throw new Error(
          result.error ||
            'Could not save profile changes.'
        )
      }

      const updatedProfile =
        result.profile as Profile

      /* ===============================================
         CLEAN OLD AVATAR
      =============================================== */

      if (
        avatarFile &&
        previousAvatarUrl &&
        previousAvatarUrl !==
          updatedProfile.avatar_url
      ) {
        const oldPath =
          extractAvatarStoragePath(
            previousAvatarUrl,
            userId
          )

        if (
          oldPath
        ) {
          const {
            error:
              deleteError,
          } =
            await supabase
              .storage
              .from(
                'avatars'
              )
              .remove([
                oldPath,
              ])

          if (
            deleteError
          ) {
            console.warn(
              'Old avatar cleanup failed:',
              deleteError
            )
          }
        }
      }

      /* ===============================================
         LOCAL STATE
      =============================================== */

      setProfile(
        current =>
          current
            ? {
                ...current,
                ...updatedProfile,
              }
            : updatedProfile
      )

      const updatedName =
        updatedProfile
          .display_name ??
        ''

      const updatedBio =
        updatedProfile
          .bio ??
        ''

      setDisplayName(
        updatedName
      )

      setBio(
        updatedBio
      )

      setOriginalDisplayName(
        updatedName
      )

      setOriginalBio(
        updatedBio
      )

      setAvatarFile(
        null
      )

      setAvatarPreviewUrl(
        null
      )

      setSaved(
        true
      )

      window.setTimeout(
        () =>
          setSaved(false),
        2600
      )
    } catch (
      error
    ) {
      if (
        uploadedPath
      ) {
        await supabase
          .storage
          .from(
            'avatars'
          )
          .remove([
            uploadedPath,
          ])
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not save profile changes.'
      )
    } finally {
      setSaving(false)
      setUploadingAvatar(false)
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

          <div className="mx-auto h-[38px] w-[38px] animate-spin rounded-full border border-[#54202a] border-t-[#df4055]" />

          <p className="mt-5 text-[8px] uppercase tracking-[0.28em] text-zinc-700">
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

        <div className="max-w-[520px] text-center">

          <p className="text-[8px] uppercase tracking-[0.3em] text-[#a63a49]">
            ProVN Identity
          </p>

          <h1 className="mt-4 text-[38px] font-black tracking-[-0.05em]">
            We couldn&apos;t load your profile.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-flex h-[46px] items-center rounded-full border border-[#752633] bg-[#12070a] px-7 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-300"
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

            input,
            textarea,
            [contenteditable="true"] {
              cursor: text !important;
            }
          }

          .provn-motion-panel {
            --tilt-rx: 0deg;
            --tilt-ry: 0deg;
            --tilt-lift: 0px;
            --tilt-scale: 1;
            --tilt-mx: 50%;
            --tilt-my: 50%;
            --tilt-shadow-x: 0px;
            --tilt-shadow-y: 28px;
            --tilt-depth: 0px;

            position: relative;

            transform:
              perspective(1150px)
              translate3d(
                0,
                var(--tilt-lift),
                0
              )
              rotateX(
                var(--tilt-rx)
              )
              rotateY(
                var(--tilt-ry)
              )
              scale(
                var(--tilt-scale)
              );

            transform-style:
              preserve-3d;

            isolation:
              isolate;

            will-change:
              transform;

            box-shadow:
              var(--tilt-shadow-x)
              var(--tilt-shadow-y)
              76px
              rgba(0,0,0,.22);
          }

          .provn-motion-panel:hover {
            border-color:
              rgba(117,41,54,.74);

            box-shadow:
              var(--tilt-shadow-x)
              var(--tilt-shadow-y)
              78px
              rgba(0,0,0,.38),
              0 0 40px
              rgba(145,22,43,.075);
          }

          .provn-panel-content {
            position: relative;

            z-index: 5;

            transform:
              translateZ(
                var(--tilt-depth)
              );

            transform-style:
              preserve-3d;

            transition:
              transform
              220ms
              cubic-bezier(.16,1,.3,1);
          }

          .provn-pointer-reflection {
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
            border-radius: inherit;
            opacity: 0;

            background:
              radial-gradient(
                circle
                at
                var(--tilt-mx)
                var(--tilt-my),
                rgba(255,255,255,.075),
                rgba(255,255,255,.026) 18%,
                rgba(190,42,63,.018) 32%,
                transparent 53%
              );

            transition:
              opacity
              220ms
              ease;
          }

          .provn-motion-panel:hover
          .provn-pointer-reflection {
            opacity: 1;
          }

          .provn-edge-response {
            position: absolute;
            inset: 0;
            z-index: 3;
            pointer-events: none;
            border-radius: inherit;
            opacity: 0;

            box-shadow:
              inset 0 1px 0
              rgba(255,255,255,.065);

            transition:
              opacity
              220ms
              ease;
          }

          .provn-motion-panel:hover
          .provn-edge-response {
            opacity: 1;
          }

          .provn-metal-sheen {
            position: absolute;

            z-index: 4;

            pointer-events: none;

            top: -80%;
            left: -42%;

            width: 18%;
            height: 260%;

            opacity: 0;

            transform:
              rotate(18deg);

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.038),
                rgba(255,255,255,.073),
                rgba(255,255,255,.018),
                transparent
              );
          }

          .provn-motion-panel:hover
          .provn-metal-sheen {
            animation:
              provnSheenPass
              900ms
              cubic-bezier(.16,1,.3,1)
              1
              both;
          }

          /* CLICKABLE AVATAR */

          .provn-avatar-button {
            position: relative;

            transform:
              translateZ(0)
              scale(1);

            transform-style:
              preserve-3d;

            transition:
              transform
                300ms
                cubic-bezier(.16,1,.3,1),
              border-color
                260ms ease,
              box-shadow
                260ms ease;
          }

          .provn-preview-panel:hover
          .provn-avatar-button {
            transform:
              translateZ(50px)
              rotate(-2.3deg)
              scale(1.045);

            border-color:
              rgba(207,62,82,.88);

            box-shadow:
              0 30px 65px
              rgba(0,0,0,.46),
              0 0 42px
              rgba(175,31,52,.16);
          }

          .provn-avatar-button:hover {
            transform:
              translateZ(58px)
              rotate(-2.3deg)
              scale(1.065)
              !important;
          }

          .provn-avatar-overlay {
            position: absolute;

            inset: 0;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: inherit;

            background:
              linear-gradient(
                180deg,
                rgba(2,2,3,.08),
                rgba(2,2,3,.82)
              );

            backdrop-filter:
              blur(2px);

            opacity: 0;

            transition:
              opacity
              220ms ease;
          }

          .provn-avatar-button:hover
          .provn-avatar-overlay {
            opacity: 1;
          }

          .provn-avatar-overlay-text {
            transform:
              translateY(7px);

            opacity: 0;

            transition:
              transform
                260ms
                cubic-bezier(.16,1,.3,1),
              opacity
                220ms ease;
          }

          .provn-avatar-button:hover
          .provn-avatar-overlay-text {
            transform:
              translateY(0);

            opacity: 1;
          }

          .provn-avatar-ring {
            position: absolute;

            inset: 7px;

            border-radius: 23px;

            border:
              1px solid
              rgba(255,255,255,.035);

            pointer-events: none;
          }

          .provn-avatar-dot {
            position: absolute;

            right: 9px;
            bottom: 9px;

            width: 6px;
            height: 6px;

            border-radius: 999px;

            background:
              #db4055;

            box-shadow:
              0 0 11px
              rgba(219,64,85,.58);

            transition:
              transform 250ms ease;
          }

          .provn-avatar-button:hover
          .provn-avatar-dot {
            transform:
              scale(1.3);
          }

          .provn-preview-name {
            transition:
              transform
                300ms
                cubic-bezier(.16,1,.3,1),
              text-shadow
                300ms ease;
          }

          .provn-preview-panel:hover
          .provn-preview-name {
            transform:
              translateZ(29px);

            text-shadow:
              0 16px 30px
              rgba(0,0,0,.22);
          }

          /* FIELDS */

          .provn-edit-field {
            transition:
              border-color 220ms ease,
              background-color 220ms ease,
              box-shadow 220ms ease,
              transform 220ms ease;
          }

          .provn-edit-field:hover {
            border-color:
              rgba(104,38,49,.75);
          }

          .provn-edit-field:focus {
            border-color:
              rgba(186,55,74,.78);

            background:
              rgba(15,6,9,.94);

            box-shadow:
              0 0 0 3px
              rgba(157,29,48,.07),
              0 0 34px
              rgba(130,18,37,.075);

            transform:
              translateY(-1px);
          }

          /* NAV */

          .provn-nav-glow {
            box-shadow:
              inset 0 1px 0
              rgba(255,255,255,.045),
              0 8px 26px
              rgba(0,0,0,.24),
              0 0 18px
              rgba(169,35,53,.11);

            transition:
              transform 220ms
              cubic-bezier(.16,1,.3,1),
              border-color 220ms ease,
              background-color 220ms ease,
              box-shadow 220ms ease;
          }

          .provn-nav-glow:hover {
            transform:
              translateY(-2px);

            box-shadow:
              inset 0 1px 0
              rgba(255,255,255,.07),
              0 12px 32px
              rgba(0,0,0,.30),
              0 0 28px
              rgba(196,45,65,.18);
          }

          /* SAVE */

          .provn-save-button {
            position: relative;

            overflow: hidden;
          }

          .provn-save-button::after {
            content: "";

            position: absolute;

            top: -70%;
            left: -45%;

            width: 22%;
            height: 230%;

            transform:
              rotate(18deg);

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.12),
                transparent
              );

            transition:
              left
              700ms
              cubic-bezier(.16,1,.3,1);
          }

          .provn-save-button:not(:disabled):hover::after {
            left: 130%;
          }

          @keyframes provnSheenPass {
            0% {
              left: -42%;
              opacity: 0;
            }

            12% {
              opacity: 1;
            }

            72% {
              opacity: .72;
            }

            100% {
              left: 128%;
              opacity: 0;
            }
          }

          @keyframes editorEntry {
            from {
              opacity: 0;

              transform:
                translateY(14px)
                scale(.994);

              filter:
                blur(4px);
            }

            to {
              opacity: 1;

              transform:
                translateY(0)
                scale(1);

              filter:
                blur(0);
            }
          }

          @keyframes successIn {
            from {
              opacity: 0;
              transform:
                translateY(5px);
            }

            to {
              opacity: 1;
              transform:
                translateY(0);
            }
          }

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .provn-motion-panel,
            .provn-panel-content,
            .provn-avatar-button,
            .provn-preview-name {
              transform:
                none !important;

              animation:
                none !important;
            }
          }
        `}
      </style>

      {/* HIDDEN AVATAR FILE INPUT */}

      <input
        ref={
          fileInputRef
        }
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={
          handleAvatarInput
        }
        className="hidden"
      />

      <main className="relative min-h-screen overflow-x-clip bg-[#020203] text-white">

        {/* BACKGROUND */}

        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              'radial-gradient(circle at 10% 8%,rgba(116,8,29,.13),transparent 29%),radial-gradient(circle at 91% 17%,rgba(94,7,24,.08),transparent 28%),radial-gradient(circle at 50% 110%,rgba(70,5,18,.09),transparent 43%),#020203',
          }}
        />

        <div
          className="pointer-events-none fixed inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.021) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.021) 1px,transparent 1px)',

            backgroundSize:
              '78px 78px',
          }}
        />

        {/* HEADER */}

        <header className="fixed inset-x-0 top-0 z-[1000] border-b border-[#47131d]/45 bg-[#020203]/[0.94] shadow-[0_14px_50px_rgba(0,0,0,.34)] backdrop-blur-2xl">

          <div className="mx-auto flex h-[72px] max-w-[1450px] items-center justify-between px-5 sm:px-7 lg:px-10">

            <div className="flex items-center gap-5">

              <ProVNLogo />

              <div className="hidden h-[25px] w-px bg-white/[0.055] sm:block" />

              <div className="hidden sm:block">

                <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#8f3542]">
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
              className="provn-nav-glow group inline-flex h-[42px] min-w-[142px] items-center justify-center gap-[10px] rounded-full border border-[#7d2936]/90 bg-[#13070a]/95 px-5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#eee8e9]"
            >
              <span className="text-[#df4a5e]">
                <ArrowLeftIcon />
              </span>

              Back to Profile
            </Link>
          </div>
        </header>

        <div className="h-[72px]" />

        {/* CONTENT */}

        <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-20 pt-10 sm:px-7 lg:px-10 lg:pt-14">

          <div className="animate-[editorEntry_.6s_cubic-bezier(.16,1,.3,1)_both]">

            {/* PAGE TITLE */}

            <div className="mb-8">

              <div className="flex items-center gap-3">

                <span className="h-px w-9 bg-[#8c3040]" />

                <p className="text-[7px] font-semibold uppercase tracking-[0.31em] text-[#983745]">
                  Profile Configuration
                </p>
              </div>

              <h1 className="mt-5 text-[45px] font-black tracking-[-0.055em] text-[#f4f0f1] sm:text-[58px]">
                Shape your identity.
              </h1>

              <p className="mt-5 max-w-[680px] text-[12px] leading-6 text-zinc-600">
                Customize how your ProVN profile appears publicly. Profile details are separate from game verification, proof and reputation.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">

              {/* LEFT */}

              <div className="space-y-6">

                {/* LIVE PREVIEW */}

                <TiltPanel
                  maxTilt={8}
                  lift={11}
                  scale={1.01}
                  depth={17}
                  className="provn-preview-panel relative overflow-hidden rounded-[27px] border border-[#5d222c]/65 bg-[#070708]/95 p-7"
                >

                  <div className="flex items-center justify-between">

                    <p className="text-[7px] uppercase tracking-[0.27em] text-[#9c3947]">
                      Live Identity Preview
                    </p>

                    <span className="rounded-full border border-[#5c202b]/65 bg-[#10070a] px-3 py-[6px] text-[7px] uppercase tracking-[0.14em] text-[#9f3a48]">
                      Public
                    </span>
                  </div>

                  <div className="mt-8 flex items-center gap-5">

                    {/* CLICK THIS AVATAR DIRECTLY */}

                    <button
                      type="button"
                      onClick={
                        openAvatarPicker
                      }
                      aria-label="Change profile picture"
                      className="provn-avatar-button group relative flex h-[110px] w-[110px] shrink-0 items-center justify-center overflow-hidden rounded-[29px] border border-[#782b38]/85 bg-gradient-to-br from-[#42121c] via-[#18090d] to-[#070708] text-left"
                    >

                      <span className="provn-avatar-ring" />

                      {currentAvatarUrl ? (
                        <img
                          src={
                            currentAvatarUrl
                          }
                          alt={
                            cleanDisplayName ||
                            profile.username
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[32px] font-black tracking-[-0.055em] text-[#e15163]">
                          {initials}
                        </span>
                      )}

                      <span className="provn-avatar-overlay">

                        <span className="provn-avatar-overlay-text text-center">

                          <span className="block text-[7px] font-bold uppercase tracking-[0.18em] text-white">
                            Change
                          </span>

                          <span className="mt-[4px] block text-[6px] uppercase tracking-[0.14em] text-zinc-500">
                            Profile Photo
                          </span>
                        </span>
                      </span>

                      <span className="provn-avatar-dot" />
                    </button>

                    <div className="min-w-0">

                      <p className="text-[7px] uppercase tracking-[0.25em] text-[#913541]">
                        ProVN Identity
                      </p>

                      <h2 className="provn-preview-name mt-3 truncate text-[28px] font-black tracking-[-0.045em]">
                        {cleanDisplayName ||
                          profile.username}
                      </h2>

                      <p className="mt-2 text-[11px] font-semibold text-[#d54256]">
                        @{profile.username}
                      </p>
                    </div>
                  </div>

                  <p className="mt-7 text-[10px] leading-5 text-zinc-600">
                    {cleanBio ||
                      'Add a short bio to describe your gaming identity.'}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.05] pt-5">

                    <p className="text-[7px] uppercase tracking-[0.14em] text-zinc-800">
                      {avatarFile
                        ? 'New profile photo selected'
                        : profile.avatar_url
                          ? 'Click photo to replace'
                          : 'Click initials to add photo'}
                    </p>

                    {avatarFile && (
                      <span className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#bd4051]">
                        Save to publish
                      </span>
                    )}
                  </div>
                </TiltPanel>

                {/* FOUNDATION */}

                <TiltPanel
                  maxTilt={4.7}
                  lift={7}
                  scale={1.006}
                  depth={11}
                  className="rounded-[24px] border border-white/[0.052] bg-[#070708]/88 p-6"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-[7px] uppercase tracking-[0.27em] text-[#913541]">
                        Profile Foundation
                      </p>

                      <h3 className="mt-3 text-[22px] font-bold tracking-[-0.035em]">
                        Identity details.
                      </h3>

                      <p className="mt-2 text-[9px] text-zinc-700">
                        Profile completeness is not verification.
                      </p>
                    </div>

                    <span className="rounded-full border border-[#61222c]/70 bg-[#11080a] px-3 py-[7px] text-[7px] text-[#a93c4b]">
                      {foundationCount} / 3
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">

                    <FoundationRow
                      icon={
                        <CheckIcon />
                      }
                      title="Display Name"
                      description="Your public profile name."
                      complete={
                        nameAdded
                      }
                    />

                    <FoundationRow
                      icon={
                        <CheckIcon />
                      }
                      title="Bio"
                      description="Your short public identity statement."
                      complete={
                        bioAdded
                      }
                    />

                    <FoundationRow
                      icon={
                        <ImageIcon />
                      }
                      title="Profile Image"
                      description={
                        avatarFile
                          ? 'New image selected and ready to publish.'
                          : 'Your visual identity across ProVN.'
                      }
                      complete={
                        avatarAdded
                      }
                    />
                  </div>
                </TiltPanel>

                {/* TRUST */}

                <TiltPanel
                  maxTilt={4.7}
                  lift={7}
                  scale={1.006}
                  depth={11}
                  className="rounded-[24px] border border-white/[0.052] bg-[#070708]/88 p-6"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[7px] uppercase tracking-[0.27em] text-[#913541]">
                        Trust Status
                      </p>

                      <h3 className="mt-3 text-[21px] font-bold tracking-[-0.035em]">
                        Verification layers.
                      </h3>
                    </div>

                    <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border border-[#57202a]/70 text-[#b43e4d]">
                      <ShieldIcon />
                    </span>
                  </div>

                  <div className="mt-5">

                    <TrustRow
                      icon={
                        <CheckIcon />
                      }
                      title="Email Ownership"
                      status={
                        emailVerified
                          ? 'Verified'
                          : 'Pending'
                      }
                      statusTone={
                        emailVerified
                          ? 'green'
                          : 'muted'
                      }
                    />

                    <TrustRow
                      icon={
                        <GamepadIcon />
                      }
                      title="Game Identity"
                      status="Not Connected"
                    />

                    <TrustRow
                      icon={
                        <LockIcon />
                      }
                      title="Verified Proof"
                      status="Locked"
                    />
                  </div>
                </TiltPanel>
              </div>

              {/* RIGHT FORM */}

              <TiltForm
                onSubmit={
                  handleSubmit
                }
                className="relative overflow-hidden rounded-[28px] border border-[#5d202b]/70 bg-[#070708]/95 shadow-[0_40px_110px_rgba(0,0,0,.40)]"
              >

                <div className="px-6 py-7 sm:px-8 lg:px-9 lg:py-9">

                  <div className="border-b border-white/[0.05] pb-7">

                    <p className="text-[7px] uppercase tracking-[0.28em] text-[#963744]">
                      Public Profile
                    </p>

                    <h2 className="mt-3 text-[31px] font-black tracking-[-0.045em]">
                      Profile details.
                    </h2>

                    <p className="mt-3 text-[10px] leading-5 text-zinc-700">
                      These fields control what other players see on your public ProVN profile.
                    </p>
                  </div>

                  {/* USERNAME */}

                  <div className="mt-8">

                    <div className="flex items-center justify-between">

                      <label className="text-[8px] font-semibold uppercase tracking-[0.17em] text-zinc-500">
                        Username
                      </label>

                      <span className="flex items-center gap-2 text-[7px] uppercase tracking-[0.13em] text-zinc-700">

                        <LockIcon />

                        Locked
                      </span>
                    </div>

                    <div className="mt-3 flex h-[54px] items-center rounded-[14px] border border-white/[0.055] bg-black/25 px-4">

                      <span className="text-[#a33a49]">
                        @
                      </span>

                      <span className="ml-1 text-[12px] text-zinc-500">
                        {profile.username}
                      </span>
                    </div>
                  </div>

                  {/* DISPLAY NAME */}

                  <div className="mt-8">

                    <div className="flex items-center justify-between">

                      <label
                        htmlFor="displayName"
                        className="text-[8px] font-semibold uppercase tracking-[0.17em] text-zinc-500"
                      >
                        Display Name
                      </label>

                      <span className="text-[7px] text-zinc-700">
                        {displayName.length}/50
                      </span>
                    </div>

                    <input
                      id="displayName"
                      type="text"
                      maxLength={50}
                      value={
                        displayName
                      }
                      onChange={
                        event => {
                          setDisplayName(
                            event.target.value
                          )

                          setSaved(false)
                        }
                      }
                      className="provn-edit-field mt-3 h-[56px] w-full rounded-[15px] border border-white/[0.065] bg-black/25 px-4 text-[12px] text-zinc-200 outline-none"
                    />
                  </div>

                  {/* BIO */}

                  <div className="mt-8">

                    <div className="flex items-center justify-between">

                      <label
                        htmlFor="bio"
                        className="text-[8px] font-semibold uppercase tracking-[0.17em] text-zinc-500"
                      >
                        Bio
                      </label>

                      <span className="text-[7px] text-zinc-700">
                        {bio.length}/240
                      </span>
                    </div>

                    <textarea
                      id="bio"
                      maxLength={240}
                      rows={7}
                      value={
                        bio
                      }
                      onChange={
                        event => {
                          setBio(
                            event.target.value
                          )

                          setSaved(false)
                        }
                      }
                      className="provn-edit-field mt-3 min-h-[185px] w-full resize-none rounded-[15px] border border-white/[0.065] bg-black/25 p-4 text-[12px] leading-6 text-zinc-200 outline-none"
                    />
                  </div>

                  {/* STATUS */}

                  <div className="mt-8 grid gap-3 border-t border-white/[0.05] pt-7 sm:grid-cols-2">

                    <div className="rounded-[16px] border border-white/[0.05] bg-black/20 p-4">

                      <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        Email Ownership
                      </p>

                      <p className="mt-3 text-[10px] font-semibold text-emerald-500">
                        {emailVerified
                          ? 'Verified'
                          : 'Pending'}
                      </p>
                    </div>

                    <div className="rounded-[16px] border border-white/[0.05] bg-black/20 p-4">

                      <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        Game Identity
                      </p>

                      <p className="mt-3 text-[10px] font-semibold text-zinc-600">
                        Not Connected
                      </p>
                    </div>
                  </div>

                  {/* ERROR */}

                  {errorMessage && (
                    <div className="mt-7 rounded-[15px] border border-red-900/45 bg-red-950/10 px-4 py-4 text-[9px] text-[#db596b]">
                      {errorMessage}
                    </div>
                  )}

                  {/* SUCCESS */}

                  {saved && (
                    <div className="mt-7 flex animate-[successIn_.3s_ease_both] items-center gap-3 rounded-[15px] border border-emerald-900/30 bg-emerald-950/[0.07] px-4 py-4 text-[9px] text-emerald-500">

                      <CheckIcon />

                      Profile changes saved successfully.
                    </div>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.05] pt-7 sm:flex-row sm:items-center">

                    <button
                      type="submit"

                      /* IMPORTANT FIX:
                         only disabled while saving.
                         No !dirty here.
                      */

                      disabled={
                        saving
                      }

                      className="provn-save-button group inline-flex h-[52px] min-w-[205px] items-center justify-center gap-5 rounded-[13px] border border-[#c33348] bg-gradient-to-r from-[#801020] via-[#a9192e] to-[#c9283e] px-7 text-[8px] font-bold uppercase tracking-[0.17em] text-white shadow-[0_16px_42px_rgba(109,11,28,.24)] transition-all hover:-translate-y-[2px] hover:border-[#ec5266] hover:shadow-[0_22px_52px_rgba(139,15,37,.30)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-white/[0.05] disabled:bg-none disabled:bg-[#101011] disabled:text-zinc-700 disabled:shadow-none"
                    >
                      <span className="relative z-[2]">

                        {uploadingAvatar
                          ? 'Uploading Photo...'
                          : saving
                            ? 'Saving...'
                            : 'Save Changes'}
                      </span>

                      {!saving && (
                        <span className="relative z-[2] transition-transform duration-200 group-hover:translate-x-1">
                          <ArrowRightIcon />
                        </span>
                      )}
                    </button>

                    <Link
                      href={
                        profileHref
                      }
                      className="inline-flex h-[52px] items-center justify-center rounded-[13px] border border-white/[0.055] bg-black/20 px-7 text-[8px] font-semibold uppercase tracking-[0.15em] text-zinc-600 transition hover:border-[#64232d] hover:text-zinc-300"
                    >
                      Cancel
                    </Link>

                    <span
                      className={`sm:ml-auto text-[7px] uppercase tracking-[0.13em] ${
                        dirty
                          ? 'text-[#953542]'
                          : 'text-zinc-800'
                      }`}
                    >
                      {dirty
                        ? 'Unsaved changes'
                        : 'All changes saved'}
                    </span>
                  </div>
                </div>
              </TiltForm>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}