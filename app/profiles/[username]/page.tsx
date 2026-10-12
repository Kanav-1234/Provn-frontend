'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type {
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

type CurrentUser = {
  id: string
  email: string | null
  emailVerified: boolean
  fullName: string | null
}

/* =========================================================
   PROVN CURSOR
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
   LARGE CARD TILT
========================================================= */

function BigTiltSurface({
  children,
  className = '',
  maxTilt = 5,
  lift = 7,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  lift?: number
}) {
  function handleMove(
    event: ReactMouseEvent<HTMLDivElement>
  ) {
    const element =
      event.currentTarget

    const rect =
      element.getBoundingClientRect()

    const x =
      (event.clientX -
        rect.left) /
      rect.width

    const y =
      (event.clientY -
        rect.top) /
      rect.height

    const rotateY =
      (x - 0.5) *
      maxTilt *
      2

    const rotateX =
      (0.5 - y) *
      maxTilt *
      2

    element.style.setProperty(
      '--card-rx',
      `${rotateX.toFixed(2)}deg`
    )

    element.style.setProperty(
      '--card-ry',
      `${rotateY.toFixed(2)}deg`
    )

    element.style.setProperty(
      '--card-lift',
      `-${lift}px`
    )

    element.style.setProperty(
      '--card-mx',
      `${(x * 100).toFixed(1)}%`
    )

    element.style.setProperty(
      '--card-my',
      `${(y * 100).toFixed(1)}%`
    )
  }

  function handleLeave(
    event: ReactMouseEvent<HTMLDivElement>
  ) {
    const element =
      event.currentTarget

    element.style.setProperty(
      '--card-rx',
      '0deg'
    )

    element.style.setProperty(
      '--card-ry',
      '0deg'
    )

    element.style.setProperty(
      '--card-lift',
      '0px'
    )

    element.style.setProperty(
      '--card-mx',
      '50%'
    )

    element.style.setProperty(
      '--card-my',
      '50%'
    )
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`provn-big-card ${className}`}
    >
      <span
        aria-hidden="true"
        className="provn-big-card-glare"
      />

      {children}
    </div>
  )
}

/* =========================================================
   AVATAR TILT
========================================================= */

function AvatarTiltSurface({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  function handleMove(
    event: ReactMouseEvent<HTMLDivElement>
  ) {
    const element =
      event.currentTarget

    const rect =
      element.getBoundingClientRect()

    const x =
      (event.clientX -
        rect.left) /
      rect.width

    const y =
      (event.clientY -
        rect.top) /
      rect.height

    const rotateY =
      (x - 0.5) * 24

    const rotateX =
      (0.5 - y) * 24

    element.style.setProperty(
      '--avatar-rx',
      `${rotateX.toFixed(2)}deg`
    )

    element.style.setProperty(
      '--avatar-ry',
      `${rotateY.toFixed(2)}deg`
    )

    element.style.setProperty(
      '--avatar-mx',
      `${(x * 100).toFixed(1)}%`
    )

    element.style.setProperty(
      '--avatar-my',
      `${(y * 100).toFixed(1)}%`
    )
  }

  function handleLeave(
    event: ReactMouseEvent<HTMLDivElement>
  ) {
    const element =
      event.currentTarget

    element.style.setProperty(
      '--avatar-rx',
      '0deg'
    )

    element.style.setProperty(
      '--avatar-ry',
      '0deg'
    )

    element.style.setProperty(
      '--avatar-mx',
      '50%'
    )

    element.style.setProperty(
      '--avatar-my',
      '50%'
    )
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`provn-avatar-tilt ${className}`}
    >
      <span
        aria-hidden="true"
        className="provn-avatar-glare"
      />

      {children}
    </div>
  )
}

/* =========================================================
   IDENTITY TILT
========================================================= */

function IdentityTiltSurface({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  function handleMove(
    event: ReactMouseEvent<HTMLDivElement>
  ) {
    const element =
      event.currentTarget

    const rect =
      element.getBoundingClientRect()

    const x =
      (event.clientX -
        rect.left) /
      rect.width

    const y =
      (event.clientY -
        rect.top) /
      rect.height

    const rotateY =
      (x - 0.5) * 8

    const rotateX =
      (0.5 - y) * 6

    element.style.setProperty(
      '--identity-rx',
      `${rotateX.toFixed(2)}deg`
    )

    element.style.setProperty(
      '--identity-ry',
      `${rotateY.toFixed(2)}deg`
    )

    element.style.setProperty(
      '--identity-mx',
      `${(x * 100).toFixed(1)}%`
    )

    element.style.setProperty(
      '--identity-my',
      `${(y * 100).toFixed(1)}%`
    )
  }

  function handleLeave(
    event: ReactMouseEvent<HTMLDivElement>
  ) {
    const element =
      event.currentTarget

    element.style.setProperty(
      '--identity-rx',
      '0deg'
    )

    element.style.setProperty(
      '--identity-ry',
      '0deg'
    )

    element.style.setProperty(
      '--identity-mx',
      '50%'
    )

    element.style.setProperty(
      '--identity-my',
      '50%'
    )
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`provn-identity-tilt ${className}`}
    >
      <span
        aria-hidden="true"
        className="provn-identity-glow"
      />

      {children}
    </div>
  )
}

/* =========================================================
   PROVN MARK
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
          id="profile-main"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#ff8a95" />
          <stop offset="13%" stopColor="#e65362" />
          <stop offset="32%" stopColor="#ba273a" />
          <stop offset="51%" stopColor="#811320" />
          <stop offset="72%" stopColor="#ad1c30" />
          <stop offset="100%" stopColor="#240508" />
        </linearGradient>

        <linearGradient
          id="profile-top"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stopColor="#77101b" />
          <stop offset="34%" stopColor="#df4355" />
          <stop offset="57%" stopColor="#ff9ea7" />
          <stop offset="100%" stopColor="#6e0b17" />
        </linearGradient>

        <linearGradient
          id="profile-edge"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#ffc7cc" />
          <stop offset="34%" stopColor="#ff5365" />
          <stop offset="100%" stopColor="#680715" />
        </linearGradient>
      </defs>

      <path
        d="M4.5 8.5 H39 L52 17.5 L44.5 20.5 H16.2 L8.7 15.3 Z"
        fill="url(#profile-top)"
        stroke="url(#profile-edge)"
        strokeWidth=".8"
        strokeLinejoin="round"
      />

      <path
        d="M11.2 21.5 H37.6 C46.5 21.5 52.5 26.3 52.5 33 C52.5 40.4 46.8 45.4 37.6 45.4 H26.4 V36.9 H37.1 C40.9 36.9 43.4 35.2 43.4 32.8 C43.4 30.3 40.9 28.6 37.1 28.6 H23.6 V43.5 L12 55 Z"
        fill="url(#profile-main)"
        stroke="url(#profile-edge)"
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

/* =========================================================
   LOGO
========================================================= */

function ProVNLogo() {
  return (
    <Link
      href="/"
      aria-label="ProVN home"
      className="group inline-flex items-center"
    >
      <span className="relative">
        <span className="pointer-events-none absolute inset-[8px] rounded-full bg-[#d1213c]/20 opacity-0 blur-[14px] transition-opacity duration-300 group-hover:opacity-100" />

        <span className="relative">
          <ProVNMark />
        </span>
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 10 3.5 3.5L16 5.5" />
    </svg>
  )
}

function ChevronIcon({
  open,
}: {
  open: boolean
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-[13px] w-[13px] transition-transform duration-200 ${
        open
          ? 'rotate-180'
          : ''
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function ArrowIcon() {
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

function GamepadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[20px] w-[20px]"
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

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[20px] w-[20px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H4v1a4 4 0 0 0 4 4" />
      <path d="M16 6h4v1a4 4 0 0 1-4 4" />
      <path d="M12 12v5" />
      <path d="M8.5 20h7" />
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
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 19 6v5c0 4.8-2.9 8.1-7 10-4.1-1.9-7-5.2-7-10V6l7-3Z" />
    </svg>
  )
}

/* =========================================================
   PROFILE ACTIVE
========================================================= */

function ProfileActivePill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#5f242d]/75 bg-[#11080a]/80 px-3 py-[7px] text-[7px] font-semibold uppercase tracking-[0.15em] text-[#bd4958]">
      <span className="relative flex h-[13px] w-[13px] items-center justify-center">
        <span className="absolute h-[9px] w-[9px] rounded-full bg-[#b52c40]/20" />

        <span className="relative h-[4px] w-[4px] rounded-full bg-[#e1495e] shadow-[0_0_8px_rgba(225,73,94,.55)]" />
      </span>

      Profile Active
    </span>
  )
}

/* =========================================================
   STAT
========================================================= */

function Stat({
  value,
  label,
  accent = false,
}: {
  value: string
  label: string
  accent?: boolean
}) {
  return (
    <div className="relative overflow-hidden border-r border-white/[0.05] px-5 py-5 last:border-r-0">
      <div className="pointer-events-none absolute -right-8 -top-8 h-[90px] w-[90px] rounded-full bg-[#a51c34]/[0.05] blur-[30px]" />

      <p
        className={`relative text-[24px] font-black leading-none tracking-[-0.045em] ${
          accent
            ? 'text-[#e44a5f]'
            : 'text-[#efeded]'
        }`}
      >
        {value}
      </p>

      <p className="relative mt-2 text-[7px] uppercase tracking-[0.18em] text-zinc-700">
        {label}
      </p>
    </div>
  )
}

/* =========================================================
   TRUST ROW
========================================================= */

function TrustRow({
  icon,
  title,
  description,
  state,
  stateTone = 'neutral',
}: {
  icon: ReactNode
  title: string
  description: string
  state: string
  stateTone?: 'neutral' | 'positive' | 'accent'
}) {
  const tone =
    stateTone === 'positive'
      ? 'text-emerald-500'
      : stateTone === 'accent'
        ? 'text-[#c34254]'
        : 'text-zinc-600'

  return (
    <div className="flex min-h-[70px] items-center rounded-[15px] border border-white/[0.05] bg-black/20 px-4 transition-colors duration-300 hover:border-white/[0.085] hover:bg-white/[0.015]">
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] border border-[#67232e]/65 bg-[#12080b] text-[#b94050]">
        {icon}
      </span>

      <div className="ml-4 min-w-0">
        <p className="text-[10px] font-medium text-zinc-300">
          {title}
        </p>

        <p className="mt-[5px] text-[8px] text-zinc-700">
          {description}
        </p>
      </div>

      <span
        className={`ml-auto shrink-0 pl-4 text-[7px] font-semibold uppercase tracking-[0.15em] ${tone}`}
      >
        {state}
      </span>
    </div>
  )
}

/* =========================================================
   ROADMAP
========================================================= */

function RoadmapStep({
  number,
  title,
  text,
  status,
  complete = false,
  current = false,
}: {
  number: string
  title: string
  text: string
  status: string
  complete?: boolean
  current?: boolean
}) {
  return (
    <div
      className={`relative min-h-[150px] overflow-hidden rounded-[17px] border p-5 ${
        complete
          ? 'border-white/[0.055] bg-black/20'
          : current
            ? 'border-[#752936]/75 bg-[#14090c]'
            : 'border-white/[0.045] bg-black/15'
      }`}
    >
      {current && (
        <div className="pointer-events-none absolute -right-8 -top-8 h-[100px] w-[100px] rounded-full bg-[#ad1831]/10 blur-[35px]" />
      )}

      <div className="relative flex items-center justify-between">
        <span
          className={`text-[8px] font-bold ${
            complete
              ? 'text-[#b74655]'
              : current
                ? 'text-[#d84357]'
                : 'text-zinc-700'
          }`}
        >
          {number}
        </span>

        <span
          className={`h-[5px] w-[5px] rounded-full ${
            complete
              ? 'bg-[#aa3142]'
              : current
                ? 'bg-[#e14458] shadow-[0_0_9px_rgba(225,68,88,.65)]'
                : 'bg-zinc-800'
          }`}
        />
      </div>

      <p className="relative mt-7 text-[12px] font-semibold text-zinc-300">
        {title}
      </p>

      <p className="relative mt-2 text-[8px] leading-4 text-zinc-700">
        {text}
      </p>

      <p
        className={`relative mt-4 text-[7px] font-semibold uppercase tracking-[0.14em] ${
          complete
            ? 'text-[#9d3b49]'
            : current
              ? 'text-[#b23b4b]'
              : 'text-zinc-800'
        }`}
      >
        {status}
      </p>
    </div>
  )
}

/* =========================================================
   FEATURE PANEL
========================================================= */

function FeaturePanel({
  icon,
  eyebrow,
  title,
  description,
  action,
  disabled = false,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  description: string
  action: string
  disabled?: boolean
}) {
  return (
    <BigTiltSurface
      maxTilt={6}
      lift={8}
      className="group relative min-h-[250px] overflow-hidden rounded-[23px] border border-white/[0.052] bg-[#070708]/88 p-7 hover:border-[#71303b]/80"
    >
      <div className="pointer-events-none absolute -right-[75px] -top-[80px] h-[230px] w-[230px] rounded-full bg-[#96152c]/[0.06] blur-[70px]" />

      <div className="relative z-[3] flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="provn-main-icon flex h-[45px] w-[45px] items-center justify-center rounded-[14px] border border-[#68242f]/70 bg-[#16090d] text-[#d34c5d]">
            {icon}
          </span>

          <span
            className={`text-[7px] uppercase tracking-[0.16em] ${
              disabled
                ? 'text-zinc-800'
                : 'text-[#8f3542]'
            }`}
          >
            {disabled
              ? 'Locked'
              : 'Ready'}
          </span>
        </div>

        <p className="mt-9 text-[7px] uppercase tracking-[0.25em] text-[#963846]">
          {eyebrow}
        </p>

        <h3 className="mt-3 text-[24px] font-bold tracking-[-0.035em] text-[#efeded]">
          {title}
        </h3>

        <p className="mt-3 max-w-[430px] text-[11px] leading-6 text-zinc-600">
          {description}
        </p>

        <button
          type="button"
          disabled={disabled}
          className={`mt-7 inline-flex w-fit items-center gap-3 text-[8px] font-bold uppercase tracking-[0.16em] transition-colors ${
            disabled
              ? 'text-zinc-800'
              : 'text-[#c24657] hover:text-[#f15b70]'
          }`}
        >
          {action}

          {!disabled && (
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          )}
        </button>
      </div>
    </BigTiltSurface>
  )
}

/* =========================================================
   FALLBACK
========================================================= */

function ProfileRouteFallback() {
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
          Loading Profile
        </p>
      </div>
    </main>
  )
}

/* =========================================================
   PROFILE CONTENT
========================================================= */

function ProfileContent() {
  const params =
    useParams<{
      username: string
    }>()

  const supabase =
    useMemo(
      () =>
        createClient(),
      []
    )

  const menuRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const [
    profile,
    setProfile,
  ] =
    useState<Profile | null>(
      null
    )

  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<CurrentUser | null>(
      null
    )

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    notFound,
    setNotFound,
  ] =
    useState(false)

  const [
    accountMenuOpen,
    setAccountMenuOpen,
  ] =
    useState(false)

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false)

  const requestedUsername =
    decodeURIComponent(
      params.username ?? ''
    )
      .trim()
      .toLowerCase()
      .replace(
        /^@/,
        ''
      )

  /* =======================================================
     LOAD PROFILE
  ======================================================== */

  useEffect(() => {
    let active = true

    async function loadProfile() {
      setLoading(true)
      setNotFound(false)

      const [
        profileResult,
        userResult,
      ] =
        await Promise.all([
          supabase
            .from('profiles')
            .select(
              'id, username, display_name, avatar_url, bio, created_at'
            )
            .eq(
              'username',
              requestedUsername
            )
            .maybeSingle(),

          supabase
            .auth
            .getUser(),
        ])

      if (!active) {
        return
      }

      if (
        profileResult.error ||
        !profileResult.data
      ) {
        if (
          profileResult.error
        ) {
          console.error(
            'Profile lookup failed:',
            profileResult.error
          )
        }

        setNotFound(true)
        setLoading(false)

        return
      }

      setProfile(
        profileResult.data
      )

      const user =
        userResult.data.user

      if (user) {
        const rawFullName =
          user
            .user_metadata
            ?.full_name

        setCurrentUser({
          id:
            user.id,

          email:
            user.email ??
            null,

          emailVerified:
            Boolean(
              user.email_confirmed_at
            ),

          fullName:
            typeof rawFullName ===
            'string'
              ? rawFullName.trim()
              : null,
        })
      } else {
        setCurrentUser(
          null
        )
      }

      setLoading(false)
    }

    if (
      requestedUsername
    ) {
      void loadProfile()
    }

    return () => {
      active = false
    }
  }, [
    requestedUsername,
    supabase,
  ])

  /* =======================================================
     ACCOUNT MENU
  ======================================================== */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      const target =
        event.target as Node

      if (
        menuRef.current &&
        !menuRef.current.contains(
          target
        )
      ) {
        setAccountMenuOpen(
          false
        )
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      )
    }
  }, [])

  /* =======================================================
     LOG OUT
  ======================================================== */

  async function handleLogout() {
    if (loggingOut) {
      return
    }

    setLoggingOut(true)

    try {
      const {
        error,
      } =
        await supabase
          .auth
          .signOut()

      if (error) {
        console.error(
          'ProVN logout failed:',
          error
        )

        setLoggingOut(false)

        return
      }

      window.location.replace(
        '/'
      )
    } catch (
      logoutError
    ) {
      console.error(
        'ProVN logout failed:',
        logoutError
      )

      setLoggingOut(false)
    }
  }

  /* =======================================================
     DERIVED DATA
  ======================================================== */

  const ownProfile =
    Boolean(
      profile &&
      currentUser &&
      profile.id ===
        currentUser.id
    )

  const displayName =
    profile
      ?.display_name
      ?.trim() ||
    (
      ownProfile
        ? currentUser
            ?.fullName
        : null
    ) ||
    profile
      ?.username ||
    'ProVN Player'

  const initials =
    displayName
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

  const joinedDate =
    profile
      ?.created_at
      ? new Intl.DateTimeFormat(
          'en',
          {
            month:
              'short',
            year:
              'numeric',
          }
        ).format(
          new Date(
            profile.created_at
          )
        )
      : 'New'

  const identityCode =
    profile
      ? profile.id
          .replace(
            /-/g,
            ''
          )
          .slice(
            0,
            8
          )
          .toUpperCase()
      : '--------'

  if (loading) {
    return (
      <ProfileRouteFallback />
    )
  }

  if (
    notFound ||
    !profile
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020203] px-6 text-white">
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

        <div className="max-w-[500px] text-center">
          <ProVNMark className="mx-auto h-[64px] w-[64px]" />

          <p className="mt-7 text-[8px] uppercase tracking-[0.32em] text-[#943847]">
            Profile Not Found
          </p>

          <h1 className="mt-4 text-[40px] font-black leading-[.98] tracking-[-0.05em]">
            This ProVN identity does not exist.
          </h1>

          <p className="mt-5 text-[12px] text-zinc-600">
            @{requestedUsername}
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex h-[46px] items-center justify-center rounded-full border border-[#722633]/75 bg-[#12080b] px-8 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-300 transition-all hover:-translate-y-1 hover:border-[#ad394a] hover:text-white"
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

          .provn-big-card {
            --card-rx: 0deg;
            --card-ry: 0deg;
            --card-lift: 0px;
            --card-mx: 50%;
            --card-my: 50%;

            transform:
              perspective(1050px)
              translate3d(
                0,
                var(--card-lift),
                0
              )
              rotateX(
                var(--card-rx)
              )
              rotateY(
                var(--card-ry)
              );

            transform-style:
              preserve-3d;

            transform-origin:
              center center;

            isolation:
              isolate;

            will-change:
              transform;

            transition:
              transform 145ms cubic-bezier(.16,1,.3,1),
              border-color 280ms ease,
              box-shadow 280ms ease;
          }

          .provn-big-card:hover {
            box-shadow:
              0 35px 84px rgba(0,0,0,.36),
              0 0 44px rgba(145,22,43,.075);
          }

          .provn-big-card-glare {
            position:
              absolute;

            inset:
              0;

            z-index:
              2;

            border-radius:
              inherit;

            pointer-events:
              none;

            opacity:
              0;

            background:
              radial-gradient(
                circle
                at
                var(--card-mx)
                var(--card-my),
                rgba(255,255,255,.055),
                rgba(255,255,255,.012) 22%,
                transparent 48%
              );

            transition:
              opacity 220ms ease;
          }

          .provn-big-card:hover
          .provn-big-card-glare {
            opacity:
              1;
          }

          .provn-avatar-tilt {
            --avatar-rx: 0deg;
            --avatar-ry: 0deg;
            --avatar-mx: 50%;
            --avatar-my: 50%;

            position:
              relative;

            transform:
              perspective(620px)
              rotateX(
                var(--avatar-rx)
              )
              rotateY(
                var(--avatar-ry)
              );

            transform-style:
              preserve-3d;

            transform-origin:
              center center;

            will-change:
              transform;

            transition:
              transform 115ms cubic-bezier(.16,1,.3,1),
              filter 250ms ease;
          }

          .provn-avatar-tilt:hover {
            filter:
              drop-shadow(
                0 30px 34px rgba(0,0,0,.36)
              )
              drop-shadow(
                0 0 24px rgba(174,34,55,.12)
              );
          }

          .provn-avatar-card {
            position:
              relative;

            transform:
              translateZ(0)
              scale(1);

            transform-style:
              preserve-3d;

            transition:
              transform 240ms cubic-bezier(.16,1,.3,1),
              border-color 240ms ease,
              box-shadow 240ms ease;
          }

          .provn-avatar-tilt:hover
          .provn-avatar-card {
            transform:
              translateZ(38px)
              scale(1.04);

            border-color:
              rgba(198,59,78,.82);

            box-shadow:
              0 28px 64px rgba(0,0,0,.46),
              0 0 44px rgba(171,28,49,.16);
          }

          .provn-avatar-initial {
            transform:
              translateZ(0)
              scale(1);

            transform-style:
              preserve-3d;

            transition:
              transform 250ms cubic-bezier(.16,1,.3,1),
              text-shadow 250ms ease;
          }

          .provn-avatar-tilt:hover
          .provn-avatar-initial {
            transform:
              translateZ(70px)
              scale(1.085);

            text-shadow:
              0 11px 24px rgba(0,0,0,.36),
              0 0 20px rgba(222,67,87,.18);
          }

          .provn-avatar-id {
            transform:
              translateZ(10px)
              scale(1);

            transform-style:
              preserve-3d;

            transition:
              transform 250ms cubic-bezier(.16,1,.3,1),
              box-shadow 250ms ease;
          }

          .provn-avatar-tilt:hover
          .provn-avatar-id {
            transform:
              translateZ(76px)
              rotate(5deg)
              scale(1.09);

            box-shadow:
              0 14px 28px rgba(0,0,0,.30),
              0 0 22px rgba(208,53,75,.13);
          }

          .provn-avatar-glare {
            position:
              absolute;

            inset:
              0;

            z-index:
              9;

            pointer-events:
              none;

            border-radius:
              32px;

            opacity:
              0;

            background:
              radial-gradient(
                circle
                at
                var(--avatar-mx)
                var(--avatar-my),
                rgba(255,255,255,.105),
                rgba(255,255,255,.02) 28%,
                transparent 55%
              );

            transition:
              opacity 220ms ease;
          }

          .provn-avatar-tilt:hover
          .provn-avatar-glare {
            opacity:
              1;
          }

          .provn-identity-tilt {
            --identity-rx: 0deg;
            --identity-ry: 0deg;
            --identity-mx: 50%;
            --identity-my: 50%;

            position:
              relative;

            transform:
              perspective(900px)
              rotateX(
                var(--identity-rx)
              )
              rotateY(
                var(--identity-ry)
              );

            transform-style:
              preserve-3d;

            transform-origin:
              center center;

            will-change:
              transform;

            transition:
              transform 135ms cubic-bezier(.16,1,.3,1),
              filter 240ms ease;
          }

          .provn-identity-tilt:hover {
            filter:
              drop-shadow(
                0 18px 28px rgba(0,0,0,.22)
              );
          }

          .provn-identity-glow {
            position:
              absolute;

            inset:
              -20px;

            z-index:
              0;

            pointer-events:
              none;

            opacity:
              0;

            border-radius:
              28px;

            background:
              radial-gradient(
                circle
                at
                var(--identity-mx)
                var(--identity-my),
                rgba(165,29,48,.08),
                rgba(255,255,255,.013) 22%,
                transparent 56%
              );

            transition:
              opacity 230ms ease;
          }

          .provn-identity-tilt:hover
          .provn-identity-glow {
            opacity:
              1;
          }

          .provn-identity-eyebrow {
            position:
              relative;

            z-index:
              3;

            transform:
              translateZ(0);

            transition:
              transform 220ms cubic-bezier(.16,1,.3,1);
          }

          .provn-identity-tilt:hover
          .provn-identity-eyebrow {
            transform:
              translateZ(30px)
              translateY(-1px);
          }

          .provn-identity-name {
            position:
              relative;

            z-index:
              3;

            transform:
              translateZ(0);

            transition:
              transform 240ms cubic-bezier(.16,1,.3,1),
              text-shadow 240ms ease;
          }

          .provn-identity-tilt:hover
          .provn-identity-name {
            transform:
              translateZ(46px);

            text-shadow:
              0 18px 34px rgba(0,0,0,.20);
          }

          .provn-identity-meta {
            position:
              relative;

            z-index:
              3;

            transform:
              translateZ(0);

            transition:
              transform 240ms cubic-bezier(.16,1,.3,1);
          }

          .provn-identity-tilt:hover
          .provn-identity-meta {
            transform:
              translateZ(21px);
          }

          .provn-main-icon {
            transform:
              translateZ(0)
              rotate(0deg)
              scale(1);

            transform-style:
              preserve-3d;

            transition:
              transform 250ms cubic-bezier(.16,1,.3,1),
              border-color 250ms ease,
              box-shadow 250ms ease;
          }

          .provn-big-card:hover
          .provn-main-icon {
            transform:
              translateZ(36px)
              rotate(-3deg)
              scale(1.08);

            border-color:
              rgba(164,54,69,.80);

            box-shadow:
              0 16px 32px rgba(0,0,0,.31),
              0 0 27px rgba(190,46,67,.10);
          }

          /* ===============================================
             PERMANENT NAV BUTTON GLOW
          =============================================== */

          .provn-nav-glow {
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.045),
              0 8px 26px rgba(0,0,0,.24),
              0 0 18px rgba(169,35,53,.11);

            transition:
              transform 220ms cubic-bezier(.16,1,.3,1),
              border-color 220ms ease,
              background-color 220ms ease,
              box-shadow 220ms ease,
              color 220ms ease;
          }

          .provn-nav-glow:hover {
            transform:
              translateY(-2px);

            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.07),
              0 12px 32px rgba(0,0,0,.30),
              0 0 28px rgba(196,45,65,.18);
          }

          @keyframes profileEntry {
            from {
              opacity: 0;

              transform:
                translateY(14px)
                scale(.993);

              filter:
                blur(5px);
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

          @keyframes softPulse {
            0%,
            100% {
              opacity: .48;
              transform: scale(.92);
            }

            50% {
              opacity: 1;
              transform: scale(1.08);
            }
          }

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .provn-big-card,
            .provn-avatar-tilt,
            .provn-avatar-card,
            .provn-avatar-initial,
            .provn-avatar-id,
            .provn-identity-tilt,
            .provn-identity-eyebrow,
            .provn-identity-name,
            .provn-identity-meta,
            .provn-main-icon {
              transform:
                none !important;

              transition:
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
              'radial-gradient(circle at 10% 8%,rgba(116,8,29,.13),transparent 29%),radial-gradient(circle at 91% 17%,rgba(94,7,24,.08),transparent 28%),radial-gradient(circle at 50% 110%,rgba(70,5,18,.09),transparent 43%),#020203',
          }}
        />

        <div
          className="pointer-events-none fixed inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)',

            backgroundSize:
              '78px 78px',

            WebkitMaskImage:
              'radial-gradient(circle at center,black,transparent 88%)',

            maskImage:
              'radial-gradient(circle at center,black,transparent 88%)',
          }}
        />

        {/* =================================================
            FIXED PROFILE NAVBAR
        ================================================= */}

        <header className="fixed inset-x-0 top-0 z-[1000] border-b border-[#47131d]/45 bg-[#020203]/[0.94] shadow-[0_14px_50px_rgba(0,0,0,.34)] backdrop-blur-2xl">

          {/* subtle red atmosphere */}

          <div className="pointer-events-none absolute right-[3%] top-[-45px] h-[100px] w-[340px] rounded-full bg-[#7f1227]/[0.065] blur-[55px]" />

          <div className="pointer-events-none absolute left-[1%] top-[-45px] h-[100px] w-[240px] rounded-full bg-[#751023]/[0.04] blur-[55px]" />

          {/* bottom metallic line */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#84293a]/40 to-transparent" />

          <div className="mx-auto flex h-[72px] max-w-[1450px] items-center justify-between px-5 sm:px-7 lg:px-10">

            <ProVNLogo />

            <div className="flex items-center gap-3">

              {/* ===========================================
                  PERMANENTLY GLOWING HOME BUTTON
              ============================================ */}

              <Link
                href="/"
                aria-label="Back to ProVN home"
                className="
                  provn-nav-glow
                  group
                  relative
                  isolate
                  inline-flex
                  h-[42px]
                  min-w-[102px]
                  items-center
                  justify-center
                  gap-[9px]
                  overflow-hidden
                  rounded-full
                  border
                  border-[#7d2936]/90
                  bg-[#13070a]/95
                  px-5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[#eee8e9]
                  hover:border-[#c03d50]
                  hover:bg-[#1a090d]
                  hover:text-white
                "
              >
                {/* permanent inner red light */}

                <span className="pointer-events-none absolute -left-5 top-1/2 h-[55px] w-[55px] -translate-y-1/2 rounded-full bg-[#c12c43]/[0.11] blur-[20px]" />

                {/* top shine */}

                <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8293]/20 to-transparent" />

                {/* arrow */}

                <span className="relative z-[2] text-[11px] text-[#df4a5e] drop-shadow-[0_0_8px_rgba(223,74,94,.35)] transition-transform duration-200 group-hover:-translate-x-[2px]">
                  ←
                </span>

                <span className="relative z-[2]">
                  Home
                </span>
              </Link>

              {/* ===========================================
                  PERMANENTLY GLOWING ACCOUNT BUTTON
              ============================================ */}

              {ownProfile && (
                <div
                  ref={menuRef}
                  className="relative"
                >
                  <button
                    type="button"

                    onClick={() =>
                      setAccountMenuOpen(
                        current =>
                          !current
                      )
                    }

                    className="
                      provn-nav-glow
                      group
                      relative
                      isolate
                      inline-flex
                      h-[42px]
                      min-w-[122px]
                      items-center
                      justify-center
                      gap-[11px]
                      overflow-hidden
                      rounded-full
                      border
                      border-[#812b38]/90
                      bg-[#14070a]/95
                      px-5
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#f0e9ea]
                      hover:border-[#c53f52]
                      hover:bg-[#1c090e]
                      hover:text-white
                    "
                  >
                    {/* permanent ambient glow */}

                    <span className="pointer-events-none absolute -right-4 top-1/2 h-[58px] w-[58px] -translate-y-1/2 rounded-full bg-[#bb2941]/[0.10] blur-[20px]" />

                    {/* metallic top highlight */}

                    <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8797]/20 to-transparent" />

                    <span className="relative z-[2]">
                      Account
                    </span>

                    <span className="relative z-[2] text-[#cf4356] drop-shadow-[0_0_7px_rgba(207,67,86,.28)]">
                      <ChevronIcon
                        open={
                          accountMenuOpen
                        }
                      />
                    </span>
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 top-[52px] z-[1100] w-[230px] overflow-hidden rounded-[17px] border border-[#5f202b]/80 bg-[#070708]/[0.985] p-2 shadow-[0_28px_90px_rgba(0,0,0,.78),0_0_35px_rgba(114,18,35,.10)] backdrop-blur-2xl">

                      <div className="px-3 pb-3 pt-2">
                        <p className="text-[7px] uppercase tracking-[0.19em] text-zinc-700">
                          ProVN Account
                        </p>

                        <p className="mt-2 truncate text-[10px] font-medium text-zinc-400">
                          @{profile.username}
                        </p>
                      </div>

                      <div className="h-px bg-white/[0.05]" />

                      <button
                        type="button"
                        className="mt-2 flex h-[42px] w-full items-center rounded-[10px] px-3 text-left text-[9px] text-zinc-500 transition-all hover:bg-[#18090c] hover:text-zinc-200"
                      >
                        Edit Profile

                        <span className="ml-auto text-[#7e2d39]">
                          →
                        </span>
                      </button>

                      <button
                        type="button"
                        className="flex h-[42px] w-full items-center rounded-[10px] px-3 text-left text-[9px] text-zinc-500 transition-all hover:bg-[#18090c] hover:text-zinc-200"
                      >
                        Account Settings

                        <span className="ml-auto text-[#7e2d39]">
                          →
                        </span>
                      </button>

                      <div className="my-2 h-px bg-white/[0.05]" />

                      <button
                        type="button"

                        disabled={
                          loggingOut
                        }

                        onClick={
                          handleLogout
                        }

                        className="flex h-[42px] w-full items-center rounded-[10px] px-3 text-left text-[9px] text-[#c34254] transition-all hover:bg-red-950/20 hover:text-[#f26074] disabled:opacity-50"
                      >
                        {loggingOut
                          ? 'Logging Out...'
                          : 'Log Out'}

                        <span className="ml-auto">
                          ↗
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =================================================
            FIXED NAVBAR SPACER

            Navbar is 72px fixed.
            This prevents page content hiding underneath it.
        ================================================= */}

        <div
          aria-hidden="true"
          className="h-[72px]"
        />

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 pb-20 pt-10 sm:px-7 lg:px-10 lg:pt-14">

          <div className="animate-[profileEntry_.6s_cubic-bezier(.16,1,.3,1)_both]">

            {/* PAGE LABEL */}

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#87313e]" />

                <p className="text-[7px] font-semibold uppercase tracking-[0.31em] text-[#8e3542]">
                  Player Identity
                </p>
              </div>

              <div className="hidden items-center gap-2 sm:flex">

                <span className="h-[5px] w-[5px] animate-[softPulse_2.2s_ease-in-out_infinite] rounded-full bg-[#d13d53] shadow-[0_0_9px_rgba(209,61,83,.45)]" />

                <span className="text-[7px] uppercase tracking-[0.17em] text-zinc-700">
                  ProVN Profile Active
                </span>
              </div>
            </div>

            {/* =================================================
                HERO
            ================================================= */}

            <BigTiltSurface
              maxTilt={4.5}
              lift={6}
              className="relative overflow-hidden rounded-[30px] border border-[#5d222c]/65 bg-[#070708]/95 shadow-[0_42px_120px_rgba(0,0,0,.48)]"
            >
              <div className="pointer-events-none absolute inset-x-[8%] top-0 h-px bg-gradient-to-r from-transparent via-[#bc394b]/50 to-transparent" />

              <div className="pointer-events-none absolute -left-[100px] -top-[100px] h-[320px] w-[320px] rounded-full bg-[#8f1529]/[0.075] blur-[100px]" />

              <div className="pointer-events-none absolute -right-[100px] bottom-[-170px] h-[380px] w-[380px] rounded-full bg-[#8e1429]/[0.055] blur-[115px]" />

              <div className="relative z-[3] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">

                <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

                  {/* AVATAR */}

                  <div className="shrink-0">

                    <AvatarTiltSurface className="relative">

                      <div className="provn-avatar-card relative flex h-[140px] w-[140px] items-center justify-center overflow-hidden rounded-[34px] border border-[#782c38]/80 bg-gradient-to-br from-[#42121c] via-[#19090d] to-[#070708] shadow-[0_22px_58px_rgba(0,0,0,.45),0_0_50px_rgba(130,18,38,.13)]">

                        <div className="pointer-events-none absolute inset-[8px] rounded-[27px] border border-white/[0.035]" />

                        {profile.avatar_url ? (
                          <img
                            src={
                              profile.avatar_url
                            }
                            alt={
                              displayName
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="provn-avatar-initial relative z-[3] text-[39px] font-black tracking-[-0.055em] text-[#e05264]">
                            {initials}
                          </span>
                        )}
                      </div>

                      <span className="provn-avatar-id absolute -bottom-[8px] -right-[8px] z-[8] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#7e2b37]/70 bg-[#100609] text-[7px] font-bold uppercase tracking-[0.08em] text-[#c54557] shadow-[0_0_20px_rgba(177,33,53,.12)]">
                        ID
                      </span>
                    </AvatarTiltSurface>
                  </div>

                  {/* IDENTITY */}

                  <IdentityTiltSurface className="min-w-0 flex-1">

                    <div className="provn-identity-eyebrow flex flex-wrap items-center gap-3">

                      <p className="text-[8px] font-semibold uppercase tracking-[0.31em] text-[#9d3947]">
                        ProVN Identity
                      </p>

                      <ProfileActivePill />
                    </div>

                    <h1 className="provn-identity-name mt-4 break-words text-[43px] font-black leading-[.94] tracking-[-0.055em] text-[#f5f2f2] sm:text-[55px]">
                      {displayName}
                    </h1>

                    <div className="provn-identity-meta mt-4 flex flex-wrap items-center gap-3">

                      <span className="text-[15px] font-semibold text-[#da4054]">
                        @{profile.username}
                      </span>

                      <span className="h-[3px] w-[3px] rounded-full bg-zinc-800" />

                      <span className="text-[7px] uppercase tracking-[0.17em] text-zinc-700">
                        Joined {joinedDate}
                      </span>

                      <span className="h-[3px] w-[3px] rounded-full bg-zinc-800" />

                      <span className="text-[7px] uppercase tracking-[0.17em] text-zinc-700">
                        PVN {identityCode}
                      </span>
                    </div>

                    <p className="provn-identity-meta mt-5 max-w-[650px] text-[12px] leading-6 text-zinc-600">
                      {profile.bio?.trim() ||
                        'A professional gaming identity built through connected accounts, verified performance and reputation earned from real activity.'}
                    </p>
                  </IdentityTiltSurface>

                  {/* REPUTATION */}

                  <div className="w-full rounded-[21px] border border-white/[0.055] bg-black/25 p-6 lg:w-[215px]">

                    <div className="flex items-center justify-between">

                      <p className="text-[7px] uppercase tracking-[0.21em] text-zinc-700">
                        Reputation
                      </p>

                      <span className="h-[5px] w-[5px] rounded-full bg-[#c63e50]" />
                    </div>

                    <div className="mt-6 flex items-end gap-2">

                      <p className="text-[44px] font-black leading-none tracking-[-0.06em] text-[#f3eeee]">
                        01
                      </p>

                      <span className="pb-[4px] text-[8px] uppercase tracking-[0.15em] text-[#9d3b47]">
                        Level
                      </span>
                    </div>

                    <p className="mt-3 text-[9px] font-medium text-zinc-500">
                      Origin
                    </p>

                    <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-white/[0.055]">

                      <div className="h-full w-[33%] rounded-full bg-gradient-to-r from-[#9a192c] to-[#dc4055]" />
                    </div>

                    <p className="mt-3 text-[8px] leading-4 text-zinc-700">
                      Connect your first game account to begin building reputation.
                    </p>
                  </div>
                </div>
              </div>

              {/* STATS */}

              <div className="relative z-[3] grid grid-cols-2 border-t border-white/[0.045] bg-black/20 sm:grid-cols-4">

                <Stat
                  value="01"
                  label="Profile Level"
                  accent
                />

                <Stat
                  value="00"
                  label="Game Accounts"
                />

                <Stat
                  value="00"
                  label="Verified Proof"
                />

                <Stat
                  value="—"
                  label="Reputation"
                />
              </div>
            </BigTiltSurface>

            {/* =================================================
                PROGRESSION
            ================================================= */}

            <BigTiltSurface
              maxTilt={5}
              lift={7}
              className="relative mt-6 rounded-[25px] border border-white/[0.052] bg-[#070708]/84 p-6 sm:p-7 lg:p-8"
            >
              <div className="relative z-[3]">

                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                  <div>

                    <p className="text-[8px] uppercase tracking-[0.28em] text-[#963744]">
                      Identity Progression
                    </p>

                    <h2 className="mt-3 text-[30px] font-black tracking-[-0.045em] text-[#efeded]">
                      Turn activity into credibility.
                    </h2>

                    <p className="mt-3 max-w-[650px] text-[11px] leading-6 text-zinc-600">
                      Your profile starts with an identity. Connected game accounts and verified proof are what make that identity credible.
                    </p>
                  </div>

                  {ownProfile && (
                    <button
                      type="button"
                      className="group inline-flex h-[47px] shrink-0 items-center justify-center gap-5 rounded-[12px] border border-[#b82c40] bg-gradient-to-r from-[#7e1020] via-[#a7192d] to-[#c4263b] px-7 text-[8px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_15px_38px_rgba(109,11,28,.22)] transition-all duration-200 hover:-translate-y-[2px] hover:border-[#e54b5e] hover:shadow-[0_22px_48px_rgba(139,15,36,.28)]"
                    >
                      Complete Profile

                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        <ArrowIcon />
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-8 grid gap-3 md:grid-cols-3">

                  <RoadmapStep
                    number="01"
                    title="Identity Foundation"
                    text="Your ProVN profile exists and your public username has been claimed."
                    status="Established"
                    complete
                  />

                  <RoadmapStep
                    number="02"
                    title="Game Accounts"
                    text="Connect the game identities that represent where and what you actually play."
                    status="Next"
                    current
                  />

                  <RoadmapStep
                    number="03"
                    title="Verified Proof"
                    text="Ranks, results and achievements become trusted evidence only after verification."
                    status="Locked"
                  />
                </div>
              </div>
            </BigTiltSurface>

            {/* =================================================
                TRUST + NEXT
            ================================================= */}

            <div className="mt-6 grid gap-6 lg:grid-cols-[.78fr_1.22fr]">

              {/* TRUST */}

              <BigTiltSurface
                maxTilt={5.5}
                lift={7}
                className="relative rounded-[23px] border border-white/[0.052] bg-[#070708]/88 p-6 sm:p-7"
              >
                <div className="relative z-[3]">

                  <p className="text-[8px] uppercase tracking-[0.27em] text-[#923643]">
                    Trust Layer
                  </p>

                  <h2 className="mt-3 text-[23px] font-bold tracking-[-0.035em] text-[#efeded]">
                    Identity Status
                  </h2>

                  <p className="mt-2 text-[10px] leading-5 text-zinc-700">
                    Trust is built in layers, not granted by signup.
                  </p>

                  <div className="mt-7 space-y-3">

                    <TrustRow
                      icon={
                        <ShieldIcon />
                      }
                      title="ProVN Profile"
                      description="Profile created and username reserved."
                      state="Active"
                      stateTone="accent"
                    />

                    <TrustRow
                      icon={
                        <CheckIcon />
                      }
                      title="Email Ownership"
                      description={
                        ownProfile
                          ? 'Ownership of the signup email.'
                          : 'Email ownership status is private.'
                      }
                      state={
                        ownProfile
                          ? currentUser
                              ?.emailVerified
                            ? 'Verified'
                            : 'Pending'
                          : 'Private'
                      }
                      stateTone={
                        ownProfile &&
                        currentUser
                          ?.emailVerified
                          ? 'positive'
                          : 'neutral'
                      }
                    />

                    <TrustRow
                      icon={
                        <GamepadIcon />
                      }
                      title="Game Verification"
                      description="No game account has been verified yet."
                      state="Pending"
                    />
                  </div>
                </div>
              </BigTiltSurface>

              {/* NEXT MILESTONE */}

              <BigTiltSurface
                maxTilt={5.5}
                lift={7}
                className="relative overflow-hidden rounded-[23px] border border-[#61232d]/70 bg-gradient-to-br from-[#15090d] via-[#0a0809] to-[#060607] p-6 sm:p-7 lg:p-8"
              >
                <div className="pointer-events-none absolute -right-[90px] -top-[90px] h-[280px] w-[280px] rounded-full bg-[#9e1730]/[0.085] blur-[85px]" />

                <div className="relative z-[3]">

                  <div className="flex items-center justify-between">

                    <p className="text-[8px] uppercase tracking-[0.28em] text-[#a03c49]">
                      Next Milestone
                    </p>

                    <span className="rounded-full border border-[#67232d]/65 bg-[#12080a] px-3 py-[6px] text-[7px] uppercase tracking-[0.14em] text-[#8d3642]">
                      Step 02
                    </span>
                  </div>

                  <h2 className="mt-5 max-w-[620px] text-[32px] font-black leading-[1] tracking-[-0.045em] text-[#f3eeee]">
                    Connect your first game account.
                  </h2>

                  <p className="mt-4 max-w-[640px] text-[11px] leading-6 text-zinc-600">
                    Your ProVN identity is established. The next step is to connect a real game account. Each game identity is verified independently using the strongest supported method for that title.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">

                    <div className="rounded-[14px] border border-white/[0.05] bg-black/20 p-4">

                      <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        Identity
                      </p>

                      <p className="mt-3 text-[11px] font-semibold text-[#b94353]">
                        Established
                      </p>
                    </div>

                    <div className="rounded-[14px] border border-[#67232e]/65 bg-[#12090b] p-4">

                      <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        Game Accounts
                      </p>

                      <p className="mt-3 text-[11px] font-semibold text-[#d14658]">
                        Connect Next
                      </p>
                    </div>

                    <div className="rounded-[14px] border border-white/[0.04] bg-black/15 p-4">

                      <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        Proof
                      </p>

                      <p className="mt-3 text-[11px] font-semibold text-zinc-600">
                        Locked
                      </p>
                    </div>
                  </div>

                  {ownProfile && (
                    <button
                      type="button"
                      className="group mt-7 inline-flex h-[48px] items-center justify-center gap-5 rounded-[12px] border border-[#b82d41] bg-gradient-to-r from-[#801020] via-[#a7192d] to-[#c7263c] px-7 text-[8px] font-bold uppercase tracking-[0.17em] text-white shadow-[0_15px_38px_rgba(110,11,28,.22)] transition-all duration-200 hover:-translate-y-[2px] hover:border-[#e64b5e] hover:shadow-[0_22px_50px_rgba(140,15,37,.28)]"
                    >
                      Add Your First Game

                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        <ArrowIcon />
                      </span>
                    </button>
                  )}
                </div>
              </BigTiltSurface>
            </div>

            {/* =================================================
                GAME PORTFOLIO + PROOF
            ================================================= */}

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <FeaturePanel
                icon={
                  <GamepadIcon />
                }
                eyebrow="Game Portfolio"
                title="Build the games behind your identity."
                description="Connected game accounts such as Valorant, BGMI, Free Fire and EA FC will live here, each with its own verification state."
                action="Connect Game"
              />

              <FeaturePanel
                icon={
                  <TrophyIcon />
                }
                eyebrow="Verified Proof"
                title="Performance becomes proof."
                description="Verified ranks, achievements, results and competitive history will become the evidence behind your ProVN reputation."
                action="Requires Game"
                disabled
              />
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.04] pt-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-[7px] uppercase tracking-[0.22em] text-zinc-800">
                  PROVN / PLAYER IDENTITY
                </p>

                <p className="mt-2 text-[8px] text-zinc-700">
                  Reputation built from real performance.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="h-[5px] w-[5px] rounded-full bg-[#ac3043]" />

                <p className="text-[7px] uppercase tracking-[0.18em] text-zinc-800">
                  @{profile.username} · PVN {identityCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

/* =========================================================
   PAGE EXPORT
========================================================= */

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <ProfileRouteFallback />
      }
    >
      <ProfileContent />
    </Suspense>
  )
}