'use client'

import Link from 'next/link'

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
  useParams,
} from 'next/navigation'

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
  fullName: string | null
  emailVerified: boolean
}

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

function handleTilt(
  event: ReactMouseEvent<HTMLElement>,
  amount = 4,
  lift = 6
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

  const rotateY =
    (x - 0.5) *
    amount *
    2

  const rotateX =
    -(y - 0.5) *
    amount *
    2

  element.style.transition =
    'transform 80ms linear, border-color 220ms ease, box-shadow 220ms ease'

  element.style.setProperty(
    '--rx',
    `${rotateX.toFixed(2)}deg`
  )

  element.style.setProperty(
    '--ry',
    `${rotateY.toFixed(2)}deg`
  )

  element.style.setProperty(
    '--lift',
    `-${lift}px`
  )

  element.style.setProperty(
    '--mx',
    `${(x * 100).toFixed(1)}%`
  )

  element.style.setProperty(
    '--my',
    `${(y * 100).toFixed(1)}%`
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
    '--rx',
    '0deg'
  )

  element.style.setProperty(
    '--ry',
    '0deg'
  )

  element.style.setProperty(
    '--lift',
    '0px'
  )

  element.style.setProperty(
    '--mx',
    '50%'
  )

  element.style.setProperty(
    '--my',
    '50%'
  )
}

function TiltCard({
  children,
  className = '',
  strength = 4,
  lift = 6,
}: {
  children: ReactNode
  className?: string
  strength?: number
  lift?: number
}) {
  return (
    <div
      onMouseMove={
        event =>
          handleTilt(
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
      <span
        aria-hidden="true"
        className="provn-card-light"
      />

      <span
        aria-hidden="true"
        className="provn-card-sheen"
      />

      <div className="provn-card-content">
        {children}
      </div>
    </div>
  )
}

/* =========================================================
   ICONS
========================================================= */

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.2 10 3l7 6.2" />
      <path d="M5.5 8.4V17h9V8.4" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[11px] w-[11px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[11px] w-[11px]"
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

function GamepadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
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
      className="h-[17px] w-[17px]"
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
      <path d="M8 20h8" />
      <path d="M9 17h6" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[16px] w-[16px]"
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

function EditIcon() {
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
      <path d="m13.5 3.5 3 3-9 9-4 1 1-4 9-9Z" />
    </svg>
  )
}

function SettingsIcon() {
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
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2.8v1.4" />
      <path d="M10 15.8v1.4" />
      <path d="m4.9 4.9 1 1" />
      <path d="m14.1 14.1 1 1" />
      <path d="M2.8 10h1.4" />
      <path d="M15.8 10h1.4" />
      <path d="m4.9 15.1 1-1" />
      <path d="m14.1 5.9 1-1" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 4H4v12h4" />
      <path d="M11 6l4 4-4 4" />
      <path d="M15 10H7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m5 5 10 10" />
      <path d="m15 5-10 10" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3H3v5" />
      <path d="m3 3 6 6" />
      <path d="M16 3h5v5" />
      <path d="m21 3-6 6" />
      <path d="M8 21H3v-5" />
      <path d="m3 21 6-6" />
      <path d="M16 21h5v-5" />
      <path d="m21 21-6-6" />
    </svg>
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
          id="profile-main-final"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#ff8a95" />
          <stop offset="15%" stopColor="#e65362" />
          <stop offset="35%" stopColor="#b92438" />
          <stop offset="55%" stopColor="#76101d" />
          <stop offset="77%" stopColor="#ad1c30" />
          <stop offset="100%" stopColor="#260508" />
        </linearGradient>

        <linearGradient
          id="profile-top-final"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stopColor="#76101b" />
          <stop offset="38%" stopColor="#e34a5b" />
          <stop offset="58%" stopColor="#ff9ba5" />
          <stop offset="100%" stopColor="#670913" />
        </linearGradient>
      </defs>

      <path
        d="M4.5 8.5 H39 L52 17.5 L44.5 20.5 H16.2 L8.7 15.3 Z"
        fill="url(#profile-top-final)"
      />

      <path
        d="M11.2 21.5 H37.6 C46.5 21.5 52.5 26.3 52.5 33 C52.5 40.4 46.8 45.4 37.6 45.4 H26.4 V36.9 H37.1 C40.9 36.9 43.4 35.2 43.4 32.8 C43.4 30.3 40.9 28.6 37.1 28.6 H23.6 V43.5 L12 55 Z"
        fill="url(#profile-main-final)"
      />

      <path
        d="M11.8 29.2 L23.7 40.2 L23.7 49.3 L17.8 43.6 L11.8 38 Z"
        fill="#070405"
      />
    </svg>
  )
}

function ProVNLogo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center"
    >
      <span className="drop-shadow-[0_0_13px_rgba(218,39,61,.27)] transition-transform duration-300 group-hover:scale-[1.04]">
        <ProVNMark />
      </span>

      <span className="-ml-[4px] translate-y-[4px] text-[22px] font-black leading-none tracking-[-0.055em]">

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
   CINEMATIC PHOTO VIEWER
========================================================= */

function ProfilePhotoViewer({
  open,
  imageUrl,
  displayName,
  username,
  profileCode,
  ownProfile,
  onClose,
}: {
  open: boolean
  imageUrl: string | null
  displayName: string
  username: string
  profileCode: string
  ownProfile: boolean
  onClose: () => void
}) {
  const closeRef =
    useRef<HTMLButtonElement | null>(
      null
    )

  useEffect(() => {
    if (
      !open ||
      !imageUrl
    ) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    function keyHandler(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        'Escape'
      ) {
        onClose()
      }
    }

    window.addEventListener(
      'keydown',
      keyHandler
    )

    window.setTimeout(
      () =>
        closeRef.current?.focus(),
      80
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        keyHandler
      )
    }
  }, [
    open,
    imageUrl,
    onClose,
  ])

  if (
    !open ||
    !imageUrl
  ) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${displayName} profile photo`}
      onMouseDown={
        event => {
          if (
            event.target ===
            event.currentTarget
          ) {
            onClose()
          }
        }
      }
      className="provn-viewer-backdrop fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/[0.90] px-4 py-5 backdrop-blur-[16px] sm:px-7"
    >
      {/* IMAGE-BASED AMBIENT BACKDROP */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="provn-viewer-ambient absolute left-1/2 top-1/2 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 scale-[1.18] object-cover opacity-[0.18] blur-[85px]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.44),rgba(0,0,0,.80)_70%,#020203)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,rgba(172,33,52,.12),transparent_42%)]" />

        <div className="absolute left-[8%] top-[12%] h-[300px] w-[300px] rounded-full bg-[#99152b]/[0.08] blur-[110px]" />

        <div className="absolute bottom-[8%] right-[10%] h-[260px] w-[260px] rounded-full bg-[#63101f]/[0.10] blur-[105px]" />
      </div>

      {/* MAIN VIEWER */}

      <div
        onMouseDown={
          event =>
            event.stopPropagation()
        }
        className="provn-viewer-panel relative z-10 grid max-h-[92vh] w-full max-w-[1180px] overflow-hidden rounded-[31px] border border-[#64232f]/80 bg-[#050506]/[0.96] shadow-[0_60px_190px_rgba(0,0,0,.82),0_0_110px_rgba(121,18,37,.10)] lg:grid-cols-[1fr_320px]"
      >
        {/* PHOTO SIDE */}

        <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden border-b border-white/[0.045] bg-[#020203] p-6 sm:p-9 lg:min-h-[700px] lg:border-b-0 lg:border-r">

          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.18] object-cover opacity-[0.075] blur-[45px]"
          />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,.26)_63%,rgba(0,0,0,.55)_100%)]" />

          <div className="pointer-events-none absolute left-7 top-7 flex items-center gap-3">

            <span className="h-[5px] w-[5px] rounded-full bg-[#e04459] shadow-[0_0_10px_rgba(224,68,89,.62)]" />

            <span className="text-[7px] font-semibold uppercase tracking-[0.24em] text-[#a53a49]">
              Player Portrait
            </span>
          </div>

          <div className="provn-photo-frame relative z-10 flex max-h-[78vh] max-w-full items-center justify-center">

            <span className="pointer-events-none absolute -inset-[1px] rounded-[25px] bg-gradient-to-br from-[#ba374b]/50 via-white/[0.03] to-[#51131e]/50" />

            <img
              src={imageUrl}
              alt={`${displayName} profile photo`}
              className="relative max-h-[76vh] max-w-full select-none rounded-[24px] border border-black/80 object-contain shadow-[0_38px_110px_rgba(0,0,0,.68)]"
            />

            <span className="pointer-events-none absolute inset-[6px] rounded-[19px] border border-white/[0.05]" />
          </div>

          <div className="pointer-events-none absolute bottom-7 left-7 hidden items-center gap-3 sm:flex">

            <span className="h-px w-[30px] bg-[#7f2936]" />

            <span className="text-[6px] uppercase tracking-[0.22em] text-zinc-700">
              PROVN / PORTRAIT VIEW
            </span>
          </div>
        </section>

        {/* IDENTITY SIDE */}

        <aside className="relative flex flex-col bg-[linear-gradient(180deg,#090607,#050506)] p-7 sm:p-8">

          <div className="pointer-events-none absolute right-0 top-0 h-[240px] w-[200px] bg-[radial-gradient(circle_at_top_right,rgba(131,20,38,.12),transparent_70%)]" />

          <div className="relative flex items-center justify-between">

            <div>

              <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#a23a49]">
                ProVN Identity
              </p>

              <p className="mt-[5px] text-[7px] uppercase tracking-[0.13em] text-zinc-800">
                Public portrait
              </p>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close profile photo"
              className="group flex h-[43px] w-[43px] items-center justify-center rounded-full border border-[#61222d]/80 bg-[#11070a] text-zinc-500 shadow-[0_0_20px_rgba(147,28,46,.08)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#bb3b4e] hover:bg-[#19090c] hover:text-white hover:shadow-[0_0_28px_rgba(190,45,64,.17)]"
            >
              <XIcon />
            </button>
          </div>

          <div className="relative mt-12">

            <div className="mb-6 h-px w-full bg-gradient-to-r from-[#64222d] via-white/[0.05] to-transparent" />

            <p className="text-[29px] font-black leading-[1.03] tracking-[-0.045em] text-[#f3eff0]">
              {displayName}
            </p>

            <p className="mt-3 text-[12px] font-semibold text-[#d94055]">
              @{username}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">

              <div className="rounded-[15px] border border-white/[0.05] bg-black/20 p-4">

                <p className="text-[6px] uppercase tracking-[0.17em] text-zinc-700">
                  Identity
                </p>

                <p className="mt-3 text-[9px] font-semibold text-[#bd3c4f]">
                  Active
                </p>
              </div>

              <div className="rounded-[15px] border border-white/[0.05] bg-black/20 p-4">

                <p className="text-[6px] uppercase tracking-[0.17em] text-zinc-700">
                  PVN ID
                </p>

                <p className="mt-3 text-[9px] font-semibold text-zinc-400">
                  {profileCode}
                </p>
              </div>
            </div>

            <div className="mt-7 rounded-[17px] border border-[#54202a]/55 bg-[#0b0608] p-5">

              <div className="flex items-center gap-3">

                <span className="h-[5px] w-[5px] rounded-full bg-[#ce3d51] shadow-[0_0_8px_rgba(206,61,81,.48)]" />

                <p className="text-[7px] uppercase tracking-[0.17em] text-[#923441]">
                  Player Identity
                </p>
              </div>

              <p className="mt-4 text-[8px] leading-5 text-zinc-600">
                This portrait represents the public visual identity attached to this ProVN profile.
              </p>
            </div>
          </div>

          <div className="relative mt-auto pt-9">

            {ownProfile && (
              <Link
                href="/profile/edit"
                className="group flex h-[48px] w-full items-center justify-center gap-4 rounded-[13px] border border-[#8d2d3a]/80 bg-[#15080c] text-[7px] font-bold uppercase tracking-[0.16em] text-zinc-300 shadow-[0_14px_35px_rgba(0,0,0,.23)] transition-all hover:-translate-y-[2px] hover:border-[#cf4054] hover:bg-[#1c0a0f]"
              >
                <EditIcon />

                Manage Photo
              </Link>
            )}

            <div className="mt-5 flex items-center justify-between">

              <span className="text-[6px] uppercase tracking-[0.15em] text-zinc-800">
                Click outside to close
              </span>

              <span className="rounded-[7px] border border-white/[0.05] bg-black/25 px-[8px] py-[5px] text-[6px] uppercase tracking-[0.12em] text-zinc-700">
                ESC
              </span>
            </div>
          </div>
        </aside>
      </div>
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
  status,
  statusClass,
}: {
  icon: ReactNode
  title: string
  description: string
  status: string
  statusClass: string
}) {
  return (
    <div className="flex min-h-[70px] items-center rounded-[15px] border border-white/[0.05] bg-black/20 px-4 transition-all duration-300 hover:border-[#57202a]/70 hover:bg-[#0b0607]">

      <div className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-[11px] border border-[#59212a]/70 bg-[#10070a] text-[#bc3b4e]">
        {icon}
      </div>

      <div className="ml-4">

        <p className="text-[10px] text-zinc-300">
          {title}
        </p>

        <p className="mt-[4px] text-[7px] text-zinc-700">
          {description}
        </p>
      </div>

      <span
        className={`ml-auto pl-4 text-[7px] font-semibold uppercase tracking-[0.14em] ${statusClass}`}
      >
        {status}
      </span>
    </div>
  )
}

/* =========================================================
   PROGRESSION STAGE
========================================================= */

function ProgressStage({
  number,
  title,
  description,
  status,
  state,
}: {
  number: string
  title: string
  description: string
  status: string
  state:
    | 'complete'
    | 'current'
    | 'locked'
}) {
  const current =
    state === 'current'

  const complete =
    state === 'complete'

  return (
    <div
      className={`provn-stage relative min-h-[160px] rounded-[19px] border p-5 ${
        current
          ? 'border-[#7d2a37]/90 bg-[linear-gradient(145deg,#1a090e,#0c0709)] shadow-[0_16px_50px_rgba(93,10,28,.10)]'
          : complete
            ? 'border-white/[0.055] bg-black/20'
            : 'border-white/[0.04] bg-black/[0.14]'
      }`}
    >
      <div className="flex items-center justify-between">

        <span
          className={`text-[7px] font-semibold ${
            current
              ? 'text-[#e0475a]'
              : complete
                ? 'text-[#b93b4c]'
                : 'text-zinc-800'
          }`}
        >
          {number}
        </span>

        <span
          className={`h-[5px] w-[5px] rounded-full ${
            current
              ? 'bg-[#e14156] shadow-[0_0_9px_rgba(225,65,86,.52)]'
              : complete
                ? 'bg-[#b83a4c]'
                : 'bg-zinc-900'
          }`}
        />
      </div>

      <h4
        className={`mt-7 text-[13px] font-semibold ${
          state === 'locked'
            ? 'text-zinc-700'
            : 'text-zinc-300'
        }`}
      >
        {title}
      </h4>

      <p
        className={`mt-3 max-w-[300px] text-[7px] leading-4 ${
          state === 'locked'
            ? 'text-zinc-800'
            : 'text-zinc-700'
        }`}
      >
        {description}
      </p>

      <p
        className={`mt-5 text-[7px] font-semibold uppercase tracking-[0.15em] ${
          current
            ? 'text-[#d23f53]'
            : complete
              ? 'text-[#a43745]'
              : 'text-zinc-800'
        }`}
      >
        {status}
      </p>
    </div>
  )
}

/* =========================================================
   PROFILE CONTENT
========================================================= */

function ProfileContent() {
  const params =
    useParams()

  const usernameParam =
    params?.username

  const requestedUsername =
    (
      Array.isArray(
        usernameParam
      )
        ? usernameParam[0]
        : usernameParam
    )
      ?.toLowerCase()
      .trim() || ''

  const supabase =
    useMemo(
      () => createClient(),
      []
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
    accountOpen,
    setAccountOpen,
  ] =
    useState(false)

  const [
    photoOpen,
    setPhotoOpen,
  ] =
    useState(false)

  const accountRef =
    useRef<HTMLDivElement | null>(
      null
    )

  /* =======================================================
     LOAD PROFILE
  ======================================================== */

  useEffect(() => {
    if (
      !requestedUsername
    ) {
      return
    }

    let active = true

    async function load() {
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
        setProfile(null)
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
        const fullName =
          typeof user
            .user_metadata
            ?.full_name ===
          'string'
            ? user
                .user_metadata
                .full_name
                .trim()
            : null

        setCurrentUser({
          id:
            user.id,

          fullName,

          emailVerified:
            Boolean(
              user.email_confirmed_at
            ),
        })
      } else {
        setCurrentUser(null)
      }

      setLoading(false)
    }

    void load()

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
    function handleOutside(
      event: MouseEvent
    ) {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target as Node
        )
      ) {
        setAccountOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutside
      )
    }
  }, [])

  /* =======================================================
     LOGOUT
  ======================================================== */

  async function handleLogout() {
    await supabase.auth.signOut()

    window.location.replace(
      '/'
    )
  }

  /* =======================================================
     LOADING
  ======================================================== */

  if (
    loading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020203] text-white">

        <div className="text-center">

          <div className="mx-auto h-[38px] w-[38px] animate-spin rounded-full border border-[#55202a] border-t-[#dc3e54]" />

          <p className="mt-5 text-[7px] uppercase tracking-[0.26em] text-zinc-700">
            Loading Player Identity
          </p>
        </div>
      </main>
    )
  }

  /* =======================================================
     NOT FOUND
  ======================================================== */

  if (
    notFound ||
    !profile
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020203] px-6 text-center text-white">

        <div>

          <p className="text-[7px] uppercase tracking-[0.28em] text-[#a13847]">
            ProVN Identity
          </p>

          <h1 className="mt-4 text-[44px] font-black tracking-[-0.05em]">
            Profile not found.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-flex h-[46px] items-center justify-center rounded-full border border-[#762633] bg-[#12070a] px-7 text-[8px] font-semibold uppercase tracking-[0.16em]"
          >
            Return Home
          </Link>
        </div>
      </main>
    )
  }

  /* =======================================================
     DERIVED DATA
  ======================================================== */

  const ownProfile =
    currentUser?.id ===
    profile.id

  const displayName =
    profile.display_name?.trim() ||
    (
      ownProfile
        ? currentUser?.fullName
        : null
    ) ||
    profile.username

  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        item =>
          item[0]?.toUpperCase()
      )
      .join('') ||
    'P'

  const joined =
    profile.created_at
      ? new Intl.DateTimeFormat(
          'en-US',
          {
            month: 'short',
            year: 'numeric',
          }
        )
          .format(
            new Date(
              profile.created_at
            )
          )
          .toUpperCase()
      : '2026'

  const profileCode =
    profile.id
      .replaceAll(
        '-',
        ''
      )
      .slice(0, 8)
      .toUpperCase()

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
          }

          html,
          body {
            background: #020203;
          }

          /* ===============================================
             BIG CARD MOTION
          =============================================== */

          .provn-tilt {
            --rx: 0deg;
            --ry: 0deg;
            --lift: 0px;
            --mx: 50%;
            --my: 50%;

            position: relative;

            transform:
              perspective(1200px)
              translateY(
                var(--lift)
              )
              rotateX(
                var(--rx)
              )
              rotateY(
                var(--ry)
              );

            transform-style:
              preserve-3d;

            isolation:
              isolate;

            will-change:
              transform;
          }

          .provn-tilt:hover {
            box-shadow:
              0 30px 90px
              rgba(0,0,0,.32),
              0 0 36px
              rgba(123,17,36,.055);
          }

          .provn-card-content {
            position: relative;
            z-index: 4;

            transform:
              translateZ(8px);

            transition:
              transform
              260ms
              cubic-bezier(.16,1,.3,1);
          }

          .provn-tilt:hover
          .provn-card-content {
            transform:
              translateZ(16px);
          }

          .provn-card-light {
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
                var(--mx)
                var(--my),
                rgba(255,255,255,.055),
                rgba(192,42,61,.025) 22%,
                transparent 48%
              );

            transition:
              opacity
              220ms ease;
          }

          .provn-tilt:hover
          .provn-card-light {
            opacity: 1;
          }

          .provn-card-sheen {
            position: absolute;

            pointer-events: none;

            z-index: 3;

            top: -90%;
            left: -40%;

            height: 280%;
            width: 14%;

            opacity: 0;

            transform:
              rotate(16deg);

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.04),
                rgba(255,255,255,.075),
                rgba(255,255,255,.015),
                transparent
              );
          }

          .provn-tilt:hover
          .provn-card-sheen {
            animation:
              provnProfileSheen
              850ms
              cubic-bezier(.16,1,.3,1)
              1
              both;
          }

          /* ===============================================
             PROFILE PHOTO
          =============================================== */

          .provn-public-avatar {
            transition:
              transform
                320ms
                cubic-bezier(.16,1,.3,1),
              border-color
                250ms ease,
              box-shadow
                250ms ease;
          }

          .provn-public-avatar:hover {
            transform:
              translateY(-4px)
              scale(1.035);

            border-color:
              rgba(207,65,83,.92);

            box-shadow:
              0 25px 55px
              rgba(0,0,0,.43),
              0 0 35px
              rgba(178,31,51,.15);
          }

          .provn-public-avatar-photo {
            transition:
              transform
              480ms
              cubic-bezier(.16,1,.3,1);
          }

          .provn-public-avatar:hover
          .provn-public-avatar-photo {
            transform:
              scale(1.05);
          }

          .provn-avatar-overlay {
            opacity: 0;

            transition:
              opacity
              220ms ease;
          }

          .provn-public-avatar:hover
          .provn-avatar-overlay {
            opacity: 1;
          }

          .provn-avatar-expand {
            opacity: 0;

            transform:
              translateY(5px)
              scale(.9);

            transition:
              opacity 220ms ease,
              transform 260ms
              cubic-bezier(.16,1,.3,1);
          }

          .provn-public-avatar:hover
          .provn-avatar-expand {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }

          /* ===============================================
             CINEMATIC VIEWER
          =============================================== */

          .provn-viewer-backdrop {
            animation:
              viewerBackdropIn
              260ms ease
              both;
          }

          .provn-viewer-panel {
            animation:
              viewerPanelIn
              500ms
              cubic-bezier(.16,1,.3,1)
              both;
          }

          .provn-photo-frame {
            animation:
              viewerPhotoIn
              620ms
              cubic-bezier(.16,1,.3,1)
              80ms
              both;
          }

          .provn-viewer-ambient {
            animation:
              viewerAmbientIn
              900ms ease
              both;
          }

          /* ===============================================
             NAV GLOW
          =============================================== */

          .provn-always-glow {
            box-shadow:
              inset 0 1px 0
              rgba(255,255,255,.04),
              0 0 20px
              rgba(157,28,46,.09);

            transition:
              transform
              220ms
              cubic-bezier(.16,1,.3,1),
              border-color 220ms ease,
              box-shadow 220ms ease,
              background-color 220ms ease;
          }

          .provn-always-glow:hover {
            transform:
              translateY(-2px);

            border-color:
              rgba(188,55,72,.88);

            box-shadow:
              inset 0 1px 0
              rgba(255,255,255,.07),
              0 9px 30px
              rgba(0,0,0,.25),
              0 0 31px
              rgba(182,38,57,.17);
          }

          /* ===============================================
             PROGRESSION
          =============================================== */

          .provn-stage {
            transition:
              transform
              280ms
              cubic-bezier(.16,1,.3,1),
              border-color
              260ms ease,
              box-shadow
              260ms ease;
          }

          .provn-stage:hover {
            transform:
              translateY(-4px);

            box-shadow:
              0 18px 44px
              rgba(0,0,0,.20);
          }

          /* ===============================================
             KEYFRAMES
          =============================================== */

          @keyframes provnProfileSheen {
            0% {
              left: -40%;
              opacity: 0;
            }

            13% {
              opacity: 1;
            }

            100% {
              left: 125%;
              opacity: 0;
            }
          }

          @keyframes viewerBackdropIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes viewerPanelIn {
            from {
              opacity: 0;

              transform:
                translateY(22px)
                scale(.965);

              filter:
                blur(6px);
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

          @keyframes viewerPhotoIn {
            from {
              opacity: 0;

              transform:
                translateY(18px)
                scale(.95);
            }

            to {
              opacity: 1;

              transform:
                translateY(0)
                scale(1);
            }
          }

          @keyframes viewerAmbientIn {
            from {
              opacity: 0;
              transform:
                translate(-50%,-50%)
                scale(1.35);
            }

            to {
              opacity: .18;
              transform:
                translate(-50%,-50%)
                scale(1.18);
            }
          }

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .provn-tilt,
            .provn-card-content,
            .provn-public-avatar,
            .provn-public-avatar-photo,
            .provn-viewer-panel,
            .provn-photo-frame {
              transform:
                none !important;

              animation:
                none !important;

              transition:
                none !important;
            }
          }
        `}
      </style>

      {/* CINEMATIC PROFILE PHOTO VIEW */}

      <ProfilePhotoViewer
        open={
          photoOpen
        }
        imageUrl={
          profile.avatar_url
        }
        displayName={
          displayName
        }
        username={
          profile.username
        }
        profileCode={
          profileCode
        }
        ownProfile={
          ownProfile
        }
        onClose={
          () =>
            setPhotoOpen(false)
        }
      />

      <main className="relative min-h-screen overflow-x-clip bg-[#020203] text-white">

        {/* BACKGROUND */}

        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              'radial-gradient(circle at 7% 10%,rgba(112,9,27,.11),transparent 28%),radial-gradient(circle at 91% 14%,rgba(94,7,24,.075),transparent 27%),#020203',
          }}
        />

        <div
          className="pointer-events-none fixed inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)',

            backgroundSize:
              '90px 90px',
          }}
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="sticky top-0 z-[1000] border-b border-[#43131b]/50 bg-[#020203]/[0.96] shadow-[0_12px_40px_rgba(0,0,0,.25)] backdrop-blur-xl">

          <div className="mx-auto flex h-[78px] max-w-[1450px] items-center justify-between px-6 lg:px-10">

            <ProVNLogo />

            <div className="flex items-center gap-3">

              <Link
                href="/"
                className="provn-always-glow group inline-flex h-[43px] min-w-[110px] items-center justify-center gap-2 rounded-full border border-[#722631]/80 bg-[#10070a]/90 px-5 text-[7px] font-semibold uppercase tracking-[0.16em] text-zinc-300"
              >
                <span className="text-[#ce4153]">
                  <HomeIcon />
                </span>

                Home
              </Link>

              {ownProfile && (
                <div
                  ref={accountRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={
                      () =>
                        setAccountOpen(
                          current =>
                            !current
                        )
                    }
                    className="provn-always-glow inline-flex h-[43px] min-w-[126px] items-center justify-center gap-3 rounded-full border border-[#722631]/80 bg-[#10070a]/90 px-5 text-[7px] font-semibold uppercase tracking-[0.16em] text-zinc-300"
                  >
                    Account

                    <span
                      className={`text-[#c33e50] transition-transform duration-200 ${
                        accountOpen
                          ? 'rotate-180'
                          : ''
                      }`}
                    >
                      <ChevronIcon />
                    </span>
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 top-[54px] z-[100] w-[215px] overflow-hidden rounded-[17px] border border-[#55202a]/75 bg-[#080607]/[0.98] p-2 shadow-[0_28px_80px_rgba(0,0,0,.65)] backdrop-blur-2xl">

                      <Link
                        href="/profile/edit"
                        onClick={
                          () =>
                            setAccountOpen(false)
                        }
                        className="flex h-[43px] items-center gap-3 rounded-[11px] px-3 text-[8px] text-zinc-400 transition hover:bg-[#15090c] hover:text-white"
                      >
                        <span className="text-[#b73b4d]">
                          <EditIcon />
                        </span>

                        Edit Profile
                      </Link>

                      <Link
                        href="/account/settings"
                        onClick={
                          () =>
                            setAccountOpen(false)
                        }
                        className="flex h-[43px] items-center gap-3 rounded-[11px] px-3 text-[8px] text-zinc-400 transition hover:bg-[#15090c] hover:text-white"
                      >
                        <span className="text-[#b73b4d]">
                          <SettingsIcon />
                        </span>

                        Account Settings
                      </Link>

                      <div className="my-1 h-px bg-white/[0.045]" />

                      <button
                        type="button"
                        onClick={
                          handleLogout
                        }
                        className="flex h-[43px] w-full items-center gap-3 rounded-[11px] px-3 text-left text-[8px] text-zinc-500 transition hover:bg-[#17090d] hover:text-[#d14b5d]"
                      >
                        <span className="text-[#a63847]">
                          <LogoutIcon />
                        </span>

                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 mx-auto max-w-[1320px] px-6 pb-20 pt-12 lg:px-10 lg:pt-14">

          {/* PLAYER IDENTITY */}

          <div className="mb-5 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <span className="h-px w-[35px] bg-[#7d2937]" />

              <span className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#963644]">
                Player Identity
              </span>
            </div>

            <div className="flex items-center gap-2">

              <span className="h-[5px] w-[5px] rounded-full bg-[#d33c52] shadow-[0_0_9px_rgba(211,60,82,.48)]" />

              <span className="text-[7px] uppercase tracking-[0.15em] text-zinc-800">
                ProVN Profile Active
              </span>
            </div>
          </div>

          {/* =================================================
              HERO
          ================================================= */}

          <TiltCard
            strength={2.4}
            lift={4}
            className="overflow-hidden rounded-[27px] border border-[#58212a]/75 bg-[#070708]/95"
          >

            <div className="grid min-h-[325px] lg:grid-cols-[1fr_230px]">

              <div className="flex items-center px-7 py-10 lg:px-10">

                <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center">

                  {/* PHOTO */}

                  {profile.avatar_url ? (
                    <button
                      type="button"
                      onClick={
                        () =>
                          setPhotoOpen(true)
                      }
                      aria-label="Open profile photo"
                      title="Open profile photo"
                      className="provn-public-avatar group relative h-[150px] w-[150px] shrink-0 overflow-hidden rounded-[36px] border border-[#792c39]/90 bg-[#12070a]"
                    >
                      <img
                        src={
                          profile.avatar_url
                        }
                        alt={`${displayName} profile photo`}
                        className="provn-public-avatar-photo h-full w-full object-cover"
                      />

                      <span className="provn-avatar-overlay pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.62] via-black/[0.03] to-transparent" />

                      <span className="provn-avatar-expand pointer-events-none absolute bottom-[11px] right-[11px] flex h-[31px] w-[31px] items-center justify-center rounded-full border border-white/[0.12] bg-black/[0.66] text-white shadow-[0_8px_24px_rgba(0,0,0,.35)] backdrop-blur-md">
                        <ExpandIcon />
                      </span>

                      <span className="pointer-events-none absolute inset-[8px] rounded-[29px] border border-white/[0.035]" />
                    </button>
                  ) : (
                    <div className="provn-public-avatar relative flex h-[150px] w-[150px] shrink-0 items-center justify-center rounded-[36px] border border-[#792c39]/90 bg-gradient-to-br from-[#43121c] via-[#19090e] to-[#070708]">

                      <span className="text-[37px] font-black tracking-[-0.055em] text-[#e35163]">
                        {initials}
                      </span>

                      <span className="absolute inset-[8px] rounded-[29px] border border-white/[0.035]" />
                    </div>
                  )}

                  {/* IDENTITY */}

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-4">

                      <p className="text-[7px] font-semibold uppercase tracking-[0.28em] text-[#a03a49]">
                        ProVN Identity
                      </p>

                      <span className="inline-flex h-[29px] items-center gap-2 rounded-full border border-[#64232e]/70 bg-[#10070a] px-3 text-[7px] font-semibold uppercase tracking-[0.13em] text-[#a43a49]">

                        <span className="h-[5px] w-[5px] rounded-full bg-[#d13f54] shadow-[0_0_7px_rgba(209,63,84,.45)]" />

                        Profile Active
                      </span>
                    </div>

                    <h1 className="mt-4 text-[46px] font-black leading-none tracking-[-0.055em] text-[#f2eeee] sm:text-[57px]">
                      {displayName}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-3">

                      <span className="text-[14px] font-semibold text-[#dc4257]">
                        @{profile.username}
                      </span>

                      <span className="text-zinc-800">
                        •
                      </span>

                      <span className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        Joined {joined}
                      </span>

                      <span className="text-zinc-800">
                        •
                      </span>

                      <span className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        PVN {profileCode}
                      </span>
                    </div>

                    <p className="mt-6 max-w-[670px] text-[11px] leading-6 text-zinc-600">
                      {profile.bio ||
                        'Build your gaming identity through connected accounts, verified performance and reputation earned from real activity.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* LEVEL */}

              <div className="flex items-center justify-center border-t border-white/[0.045] p-7 lg:border-l lg:border-t-0">

                <div className="w-full max-w-[200px] rounded-[23px] border border-white/[0.055] bg-black/25 p-6">

                  <div className="flex items-center justify-between">

                    <span className="text-[7px] uppercase tracking-[0.18em] text-zinc-700">
                      Reputation
                    </span>

                    <span className="h-[5px] w-[5px] rounded-full bg-[#d64257] shadow-[0_0_8px_rgba(214,66,87,.50)]" />
                  </div>

                  <div className="mt-6 flex items-end gap-3">

                    <span className="text-[45px] font-black leading-none tracking-[-0.05em]">
                      01
                    </span>

                    <span className="mb-[5px] text-[7px] uppercase tracking-[0.15em] text-[#a43847]">
                      Level
                    </span>
                  </div>

                  <p className="mt-4 text-[8px] text-zinc-600">
                    Origin
                  </p>

                  <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-white/[0.055]">

                    <div className="h-full w-[32%] rounded-full bg-gradient-to-r from-[#a9152d] to-[#e94358]" />
                  </div>

                  <p className="mt-4 text-[7px] leading-4 text-zinc-700">
                    Connect your first game account to begin building reputation.
                  </p>
                </div>
              </div>
            </div>

            {/* STATS */}

            <div className="grid border-t border-white/[0.045] sm:grid-cols-4">

              <div className="min-h-[88px] border-b border-white/[0.045] px-5 py-5 sm:border-b-0 sm:border-r">

                <p className="text-[25px] font-black text-[#e14a5d]">
                  01
                </p>

                <p className="mt-1 text-[7px] uppercase tracking-[0.14em] text-zinc-700">
                  Profile Level
                </p>
              </div>

              <div className="min-h-[88px] border-b border-white/[0.045] px-5 py-5 sm:border-b-0 sm:border-r">

                <p className="text-[25px] font-black">
                  00
                </p>

                <p className="mt-1 text-[7px] uppercase tracking-[0.14em] text-zinc-700">
                  Game Accounts
                </p>
              </div>

              <div className="min-h-[88px] border-b border-white/[0.045] px-5 py-5 sm:border-b-0 sm:border-r">

                <p className="text-[25px] font-black">
                  00
                </p>

                <p className="mt-1 text-[7px] uppercase tracking-[0.14em] text-zinc-700">
                  Verified Proof
                </p>
              </div>

              <div className="min-h-[88px] px-5 py-5">

                <p className="text-[25px] font-black">
                  —
                </p>

                <p className="mt-1 text-[7px] uppercase tracking-[0.14em] text-zinc-700">
                  Reputation
                </p>
              </div>
            </div>
          </TiltCard>

          {/* =================================================
              FINAL HYBRID IDENTITY PROGRESSION
          ================================================= */}

          <TiltCard
            strength={3}
            lift={5}
            className="mt-6 overflow-hidden rounded-[25px] border border-white/[0.055] bg-[#070708]/90 p-7 lg:p-8"
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              <div>

                <p className="text-[7px] uppercase tracking-[0.26em] text-[#973644]">
                  Identity Progression
                </p>

                <h2 className="mt-4 text-[32px] font-black tracking-[-0.045em]">
                  Turn activity into credibility.
                </h2>

                <p className="mt-4 max-w-[690px] text-[10px] leading-5 text-zinc-700">
                  Your identity is established. Game accounts and verified proof are the layers that turn a profile into credible gaming reputation.
                </p>
              </div>

              {ownProfile && (
                <Link
                  href="/profile/edit"
                  className="group inline-flex h-[50px] min-w-[205px] shrink-0 items-center justify-center gap-7 rounded-[13px] border border-[#d03a50] bg-gradient-to-r from-[#891126] to-[#c5233b] px-6 text-[8px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_rgba(109,10,29,.20)] transition hover:-translate-y-[2px] hover:border-[#f05a6d]"
                >
                  Complete Profile

                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              )}
            </div>

            {/* PROGRESSION RAIL */}

            <div className="relative mt-8">

              <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-[21px] hidden h-px bg-gradient-to-r from-[#71303a]/35 via-[#9b263a]/55 to-white/[0.035] lg:block" />

              <div className="relative grid gap-3 lg:grid-cols-3">

                <ProgressStage
                  number="01"
                  title="Identity Foundation"
                  description="Your ProVN identity exists and your public username has been claimed."
                  status="Established"
                  state="complete"
                />

                <ProgressStage
                  number="02"
                  title="Game Accounts"
                  description="Connect the game identities that represent where and what you actually play."
                  status="Next"
                  state="current"
                />

                <ProgressStage
                  number="03"
                  title="Verified Proof"
                  description="Ranks, results and achievements become trusted evidence only after verification."
                  status="Locked"
                  state="locked"
                />
              </div>
            </div>
          </TiltCard>

          {/* =================================================
              TRUST + NEXT MILESTONE
          ================================================= */}

          <div className="mt-6 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">

            {/* TRUST */}

            <TiltCard
              strength={4.5}
              lift={7}
              className="rounded-[25px] border border-white/[0.055] bg-[#070708]/90 p-6"
            >

              <p className="text-[7px] uppercase tracking-[0.25em] text-[#943542]">
                Trust Layer
              </p>

              <h3 className="mt-4 text-[24px] font-bold tracking-[-0.04em]">
                Identity Status
              </h3>

              <p className="mt-3 text-[9px] text-zinc-700">
                Trust is built in layers, not granted by signup.
              </p>

              <div className="mt-7 space-y-3">

                <TrustRow
                  icon={
                    <ShieldIcon />
                  }
                  title="ProVN Profile"
                  description="Profile created and username reserved."
                  status="Active"
                  statusClass="text-[#c64053]"
                />

                {ownProfile && (
                  <TrustRow
                    icon={
                      <CheckIcon />
                    }
                    title="Email Ownership"
                    description="Ownership of the signup email."
                    status={
                      currentUser?.emailVerified
                        ? 'Verified'
                        : 'Pending'
                    }
                    statusClass={
                      currentUser?.emailVerified
                        ? 'text-emerald-500'
                        : 'text-zinc-700'
                    }
                  />
                )}

                <TrustRow
                  icon={
                    <GamepadIcon />
                  }
                  title="Game Verification"
                  description="No game account has been verified yet."
                  status="Pending"
                  statusClass="text-zinc-700"
                />
              </div>
            </TiltCard>

            {/* NEXT MILESTONE */}

            <TiltCard
              strength={4}
              lift={7}
              className="overflow-hidden rounded-[25px] border border-[#63232e]/70 bg-gradient-to-br from-[#11070a] via-[#080708] to-[#060607] p-7"
            >

              <div className="flex items-center justify-between">

                <p className="text-[7px] uppercase tracking-[0.25em] text-[#993746]">
                  Next Milestone
                </p>

                <span className="rounded-full border border-[#5b202a]/65 bg-[#10070a] px-3 py-[6px] text-[7px] uppercase tracking-[0.14em] text-[#8f3341]">
                  Step 02
                </span>
              </div>

              <h3 className="mt-7 text-[34px] font-black tracking-[-0.045em]">
                Connect your first game account.
              </h3>

              <p className="mt-4 max-w-[720px] text-[10px] leading-6 text-zinc-700">
                Your ProVN identity is established. Connect the account you actually play on to begin building verified performance history.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">

                <div className="rounded-[16px] border border-white/[0.05] bg-black/20 p-4">

                  <p className="text-[7px] uppercase tracking-[0.14em] text-zinc-700">
                    Identity
                  </p>

                  <p className="mt-3 text-[10px] font-semibold text-[#c33d50]">
                    Established
                  </p>
                </div>

                <div className="rounded-[16px] border border-[#692632]/70 bg-[#14090c] p-4">

                  <p className="text-[7px] uppercase tracking-[0.14em] text-zinc-700">
                    Game Accounts
                  </p>

                  <p className="mt-3 text-[10px] font-semibold text-[#dc4559]">
                    Connect Next
                  </p>
                </div>

                <div className="rounded-[16px] border border-white/[0.05] bg-black/20 p-4">

                  <p className="text-[7px] uppercase tracking-[0.14em] text-zinc-700">
                    Proof
                  </p>

                  <p className="mt-3 text-[10px] font-semibold text-zinc-700">
                    Locked
                  </p>
                </div>
              </div>

              {ownProfile && (
                <button
                  type="button"
                  className="mt-7 inline-flex h-[49px] min-w-[215px] items-center justify-center gap-8 rounded-[13px] border border-[#d23d51] bg-gradient-to-r from-[#881126] to-[#cf263e] px-6 text-[8px] font-bold uppercase tracking-[0.16em] shadow-[0_15px_38px_rgba(111,10,29,.18)] transition hover:-translate-y-[2px] hover:border-[#ee5669]"
                >
                  Add Your First Game

                  <span>
                    →
                  </span>
                </button>
              )}
            </TiltCard>
          </div>

          {/* =================================================
              PORTFOLIO + PROOF
          ================================================= */}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            <TiltCard
              strength={5}
              lift={8}
              className="min-h-[285px] rounded-[25px] border border-white/[0.055] bg-[#070708]/90 p-7"
            >

              <div className="flex items-center justify-between">

                <span className="flex h-[47px] w-[47px] items-center justify-center rounded-[14px] border border-[#692632]/75 bg-[#12070a] text-[#d14558]">
                  <GamepadIcon />
                </span>

                <span className="text-[7px] uppercase tracking-[0.14em] text-[#8e3340]">
                  Ready
                </span>
              </div>

              <p className="mt-8 text-[7px] uppercase tracking-[0.25em] text-[#963644]">
                Game Portfolio
              </p>

              <h3 className="mt-4 text-[25px] font-bold tracking-[-0.04em]">
                Build the games behind your identity.
              </h3>

              <p className="mt-4 max-w-[510px] text-[10px] leading-6 text-zinc-700">
                Connected game accounts such as Valorant, BGMI, Free Fire and EA FC will live here, each with its own verification state.
              </p>

              {ownProfile && (
                <button
                  type="button"
                  className="mt-7 text-[7px] font-semibold uppercase tracking-[0.16em] text-[#c43d50] transition hover:text-[#ec5265]"
                >
                  Connect Game &nbsp; →
                </button>
              )}
            </TiltCard>

            <TiltCard
              strength={5}
              lift={8}
              className="min-h-[285px] rounded-[25px] border border-[#5c222c]/65 bg-[#070708]/90 p-7"
            >

              <div className="flex items-center justify-between">

                <span className="flex h-[47px] w-[47px] items-center justify-center rounded-[14px] border border-[#692632]/75 bg-[#12070a] text-[#d14558]">
                  <TrophyIcon />
                </span>

                <span className="text-[7px] uppercase tracking-[0.14em] text-zinc-800">
                  Locked
                </span>
              </div>

              <p className="mt-8 text-[7px] uppercase tracking-[0.25em] text-[#963644]">
                Verified Proof
              </p>

              <h3 className="mt-4 text-[25px] font-bold tracking-[-0.04em]">
                Performance becomes proof.
              </h3>

              <p className="mt-4 max-w-[510px] text-[10px] leading-6 text-zinc-700">
                Verified ranks, achievements, results and competitive history will become the evidence behind your ProVN reputation.
              </p>

              <p className="mt-7 text-[7px] uppercase tracking-[0.15em] text-zinc-800">
                Requires Game
              </p>
            </TiltCard>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.04] pt-7 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[7px] uppercase tracking-[0.20em] text-zinc-800">
                PROVN / PLAYER IDENTITY
              </p>

              <p className="mt-2 text-[7px] text-zinc-800">
                Reputation built from real performance.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <span className="h-[5px] w-[5px] rounded-full bg-[#bd364a]" />

              <p className="text-[7px] uppercase tracking-[0.15em] text-zinc-800">
                @{profile.username} · PVN {profileCode}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

/* =========================================================
   SUSPENSE FALLBACK
========================================================= */

function ProfileRouteFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020203] text-white">

      <div className="text-center">

        <div className="mx-auto h-[38px] w-[38px] animate-spin rounded-full border border-[#55202a] border-t-[#dc3e54]" />

        <p className="mt-5 text-[7px] uppercase tracking-[0.26em] text-zinc-700">
          Loading Player Identity
        </p>
      </div>
    </main>
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