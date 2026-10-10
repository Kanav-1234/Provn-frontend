'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { PointerEvent as ReactPointerEvent } from 'react'

import { createClient } from '@/lib/supabase/client'

type UsernameState =
  | 'idle'
  | 'invalid'
  | 'checking'
  | 'available'
  | 'taken'
  | 'error'

type PasswordRules = {
  length: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  special: boolean
}

/* =========================================================
   NATIVE PROVN CURSOR

   CLEAN VERSION:
   - no heavy black blob
   - thin graphite edge
   - metallic body
   - subtle ProVN red accent
   - browser/native rendering
   - zero DOM tracking lag
========================================================= */

const provnCursorSvg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="14"
  height="17"
  viewBox="0 0 25 29"
>
  <defs>
    <linearGradient
      id="cursorBody"
      x1="3"
      y1="2"
      x2="18"
      y2="26"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="32%" stop-color="#f3f1f1"/>
      <stop offset="66%" stop-color="#d6d3d4"/>
      <stop offset="100%" stop-color="#aaa6a8"/>
    </linearGradient>

    <linearGradient
      id="cursorEdge"
      x1="2"
      y1="2"
      x2="18"
      y2="26"
      gradientUnits="userSpaceOnUse"
    >
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
    stroke-linejoin="round"
  />

  <path
    d="M11.55 17.2L15 24.05"
    fill="none"
    stroke="#cf3045"
    stroke-width=".9"
    stroke-linecap="round"
    opacity=".95"
  />
</svg>
`

const PROVN_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  provnCursorSvg
)}") 1 1, auto`

/* =========================================================
   PROVN MARK
========================================================= */

function ProVNMark() {
  return (
    <svg
      viewBox="0 0 58 58"
      aria-hidden="true"
      className="h-[48px] w-[48px] shrink-0 overflow-visible drop-shadow-[0_0_11px_rgba(226,32,57,.30)]"
    >
      <defs>
        <linearGradient
          id="signup-main"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#ff8a95" />
          <stop offset="12%" stopColor="#e65362" />
          <stop offset="30%" stopColor="#bb283b" />
          <stop offset="51%" stopColor="#811320" />
          <stop offset="72%" stopColor="#ad1c30" />
          <stop offset="100%" stopColor="#240508" />
        </linearGradient>

        <linearGradient
          id="signup-top"
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
          id="signup-edge"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#ffc7cc" />
          <stop offset="34%" stopColor="#ff5265" />
          <stop offset="100%" stopColor="#6c0716" />
        </linearGradient>
      </defs>

      <path
        d="M4.5 8.5 H39 L52 17.5 L44.5 20.5 H16.2 L8.7 15.3 Z"
        fill="url(#signup-top)"
        stroke="url(#signup-edge)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      <path
        d="M11.2 21.5 H37.6 C46.5 21.5 52.5 26.3 52.5 33 C52.5 40.4 46.8 45.4 37.6 45.4 H26.4 V36.9 H37.1 C40.9 36.9 43.4 35.2 43.4 32.8 C43.4 30.3 40.9 28.6 37.1 28.6 H23.6 V43.5 L12 55 Z"
        fill="url(#signup-main)"
        stroke="url(#signup-edge)"
        strokeWidth="0.8"
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

      <path
        d="M43.8 22.7 C49 24.8 51 28.2 51 32.8 C51 38.8 46.4 43.3 38.6 43.7"
        fill="none"
        stroke="#ff334c"
        strokeOpacity=".72"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* =========================================================
   PROVN LOGO
========================================================= */

function ProVNLogo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center"
    >
      <span className="relative transition-all duration-300 group-hover:scale-[1.06] group-hover:-rotate-[1deg]">
        <span className="pointer-events-none absolute inset-[8px] rounded-full bg-[#c31e35]/25 opacity-0 blur-[14px] transition-opacity duration-300 group-hover:opacity-100" />

        <span className="relative z-10">
          <ProVNMark />
        </span>
      </span>

      <span className="-ml-[3px] translate-y-[5px] text-[23px] font-black leading-none tracking-[-0.055em]">
        <span className="text-[#f6f3f3]">
          ro
        </span>

        <span className="text-[#e51f3b] drop-shadow-[0_0_8px_rgba(229,31,59,.18)]">
          VN
        </span>
      </span>
    </Link>
  )
}

/* =========================================================
   ICONS
========================================================= */

function EyeIcon({
  open,
}: {
  open: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" />

          <circle
            cx="12"
            cy="12"
            r="2.5"
          />
        </>
      ) : (
        <>
          <path d="M3 3l18 18" />

          <path d="M10.6 6.2A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.4 3.1" />

          <path d="M6.1 6.1C3.8 7.7 2.5 12 2.5 12s3.5 6 9.5 6a9.6 9.6 0 0 0 4-.8" />

          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      )}
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[13px] w-[13px]"
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

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[12px] w-[12px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  )
}

/* =========================================================
   STANDARD INPUT
========================================================= */

function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  rightElement,
}: {
  label: string
  type?: string
  value: string
  onChange: (
    value: string
  ) => void
  placeholder: string
  autoComplete?: string
  rightElement?: ReactNode
}) {
  return (
    <div className="group">
      <label className="mb-2 block text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors duration-200 group-focus-within:text-[#cb4c5b]">
        {label}
      </label>

      <div className="relative">
        <input
          data-writing-field="true"
          type={type}
          value={value}
          onChange={event =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="h-[55px] w-full rounded-[13px] border border-white/[0.075] bg-[#08080a]/95 px-4 pr-12 text-[14px] text-zinc-100 outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-zinc-700 hover:border-white/[0.14] hover:bg-[#0b0b0e] focus:border-[#a62c3b] focus:bg-[#0d090b] focus:shadow-[0_0_0_3px_rgba(173,37,55,.07),0_0_26px_rgba(117,13,29,.11)]"
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   USERNAME
========================================================= */

function UsernameField({
  value,
  onChange,
  status,
}: {
  value: string
  onChange: (
    value: string
  ) => void
  status: UsernameState
}) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    )

  const cleaned =
    value
      .trim()
      .toLowerCase()

  function normalizeUsername(
    input: string
  ) {
    return input
      .toLowerCase()
      .replace(
        /\s/g,
        ''
      )
  }

  function syncInputValue() {
    const input =
      inputRef.current

    if (!input) {
      return
    }

    const next =
      normalizeUsername(
        input.value
      )

    if (
      input.value !==
      next
    ) {
      input.value =
        next
    }

    if (
      next !== value
    ) {
      onChange(
        next
      )
    }
  }

  useEffect(() => {
    const timers = [
      window.setTimeout(
        syncInputValue,
        50
      ),

      window.setTimeout(
        syncInputValue,
        250
      ),

      window.setTimeout(
        syncInputValue,
        700
      ),

      window.setTimeout(
        syncInputValue,
        1500
      ),
    ]

    return () => {
      timers.forEach(
        timer => {
          window.clearTimeout(
            timer
          )
        }
      )
    }
  }, [])

  let message = ''

  let messageClass =
    'text-zinc-600'

  if (
    value &&
    status ===
      'invalid'
  ) {
    message =
      '3–20 characters. Use lowercase letters, numbers, _ or .'

    messageClass =
      'text-[#d85a68]'
  }

  if (
    status ===
    'checking'
  ) {
    message =
      'Checking availability...'

    messageClass =
      'text-zinc-500'
  }

  if (
    status ===
    'available'
  ) {
    message =
      `@${cleaned} is available`

    messageClass =
      'text-emerald-400'
  }

  if (
    status ===
    'taken'
  ) {
    message =
      `@${cleaned} is already taken. Try another.`

    messageClass =
      'text-[#ff5a6e]'
  }

  if (
    status ===
    'error'
  ) {
    message =
      'Could not check username. Try again.'

    messageClass =
      'text-amber-400'
  }

  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors duration-200 group-focus-within:text-[#cb4c5b]">
          Username
        </label>

        {status ===
          'available' && (
          <span className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
            <CheckIcon />

            Available
          </span>
        )}

        {status ===
          'taken' && (
          <span className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#ff5a6e]">
            <CrossIcon />

            Taken
          </span>
        )}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-zinc-600">
          @
        </span>

        <input
          ref={
            inputRef
          }
          data-writing-field="true"
          name="provn-signup-handle"
          value={
            value
          }
          onInput={
            event => {
              const next =
                normalizeUsername(
                  event
                    .currentTarget
                    .value
                )

              if (
                event
                  .currentTarget
                  .value !==
                next
              ) {
                event.currentTarget.value =
                  next
              }

              onChange(
                next
              )
            }
          }
          onChange={
            event => {
              onChange(
                normalizeUsername(
                  event
                    .currentTarget
                    .value
                )
              )
            }
          }
          onFocus={() => {
            window.setTimeout(
              syncInputValue,
              0
            )

            window.setTimeout(
              syncInputValue,
              100
            )
          }}
          onBlur={
            syncInputValue
          }
          placeholder="yourname"
          autoComplete="off"
          spellCheck={
            false
          }
          autoCapitalize="none"
          autoCorrect="off"
          required
          maxLength={
            20
          }
          className={`h-[55px] w-full rounded-[13px] border bg-[#08080a]/95 py-0 pl-8 pr-12 text-[14px] text-zinc-100 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-zinc-700 ${
            status ===
            'available'
              ? 'border-emerald-700/55 focus:border-emerald-500/70 focus:shadow-[0_0_0_3px_rgba(16,185,129,.06)]'
              : status ===
                    'taken' ||
                  status ===
                    'invalid'
                ? 'border-[#8d2636]/75 focus:border-[#d43d52]'
                : 'border-white/[0.075] hover:border-white/[0.14] focus:border-[#a62c3b] focus:shadow-[0_0_0_3px_rgba(173,37,55,.07),0_0_26px_rgba(117,13,29,.11)]'
          }`}
        />

        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          {status ===
            'checking' && (
            <div className="h-[14px] w-[14px] animate-spin rounded-full border border-zinc-700 border-t-[#d42d42]" />
          )}

          {status ===
            'available' && (
            <span className="text-emerald-400">
              <CheckIcon />
            </span>
          )}

          {status ===
            'taken' && (
            <span className="text-[#ff5a6e]">
              <CrossIcon />
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 min-h-[16px]">
        {message ? (
          <p
            className={`text-[10px] leading-4 ${messageClass}`}
          >
            {message}
          </p>
        ) : (
          <p className="text-[9px] tracking-[0.02em] text-zinc-700">
            provn.games/profiles/
            {cleaned ||
              'yourname'}
          </p>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   PASSWORD REQUIREMENT
========================================================= */

function PasswordRequirement({
  passed,
  children,
}: {
  passed: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`flex items-center gap-2 text-[9px] transition-colors duration-200 ${
        passed
          ? 'text-emerald-400'
          : 'text-zinc-600'
      }`}
    >
      <span
        className={`flex h-[14px] w-[14px] items-center justify-center rounded-full border transition-all duration-200 ${
          passed
            ? 'border-emerald-500/50 bg-emerald-500/10'
            : 'border-white/[0.08] bg-white/[0.015]'
        }`}
      >
        {passed && (
          <CheckIcon />
        )}
      </span>

      {children}
    </div>
  )
}

/* =========================================================
   PASSWORD CHECKLIST
========================================================= */

function PasswordChecklist({
  rules,
  password,
}: {
  rules: PasswordRules
  password: string
}) {
  if (
    !password
  ) {
    return (
      <p className="mt-3 text-[9px] leading-4 text-zinc-700">
        Use a strong password to
        protect your ProVN identity.
      </p>
    )
  }

  const score =
    Object
      .values(
        rules
      )
      .filter(
        Boolean
      )
      .length

  const label =
    score <= 2
      ? 'Weak'
      : score <= 4
        ? 'Getting stronger'
        : 'Strong'

  return (
    <div className="mt-3 rounded-[12px] border border-white/[0.05] bg-black/20 px-3.5 py-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[8px] uppercase tracking-[0.18em] text-zinc-600">
          Password strength
        </span>

        <span
          className={`text-[8px] font-semibold uppercase tracking-[0.16em] ${
            score === 5
              ? 'text-emerald-400'
              : score >= 3
                ? 'text-[#c94a59]'
                : 'text-zinc-600'
          }`}
        >
          {label}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-5 gap-1">
        {[
          1,
          2,
          3,
          4,
          5,
        ].map(
          level => (
            <div
              key={
                level
              }
              className={`h-[2px] rounded-full transition-all duration-300 ${
                score >=
                level
                  ? score ===
                    5
                    ? 'bg-emerald-500/80'
                    : 'bg-[#b42a3d]'
                  : 'bg-white/[0.055]'
              }`}
            />
          )
        )}
      </div>

      <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        <PasswordRequirement
          passed={
            rules.length
          }
        >
          8+ characters
        </PasswordRequirement>

        <PasswordRequirement
          passed={
            rules.uppercase
          }
        >
          1 uppercase letter
        </PasswordRequirement>

        <PasswordRequirement
          passed={
            rules.lowercase
          }
        >
          1 lowercase letter
        </PasswordRequirement>

        <PasswordRequirement
          passed={
            rules.number
          }
        >
          1 number
        </PasswordRequirement>

        <PasswordRequirement
          passed={
            rules.special
          }
        >
          1 special character
        </PasswordRequirement>
      </div>
    </div>
  )
}

/* =========================================================
   IDENTITY VISUAL
========================================================= */

function FloatingCard({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className: string
}) {
  return (
    <div
      className={`absolute rounded-[15px] border border-white/[0.08] bg-black/75 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,.42)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#752934] hover:bg-[#0d0709]/90 ${className}`}
    >
      <p className="text-[8px] uppercase tracking-[0.24em] text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-[12px] font-semibold tracking-[-0.02em] text-zinc-200">
        {value}
      </p>
    </div>
  )
}

function IdentityVisual() {
  return (
    <div className="relative h-[245px] overflow-hidden rounded-[24px] border border-white/[0.055] bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,.025)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(146,18,39,.13),transparent_48%)]" />

      <div className="absolute left-1/2 top-1/2 h-[198px] w-[198px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border border-[#8d2433]/28 [animation-duration:22s]">
        <span className="absolute left-[20px] top-[22px] h-[7px] w-[7px] rounded-full bg-[#e82c45] shadow-[0_0_15px_rgba(232,44,69,.9)]" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-[148px] w-[148px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border border-[#a52a3a]/25 [animation-direction:reverse] [animation-duration:15s]">
        <span className="absolute bottom-[8px] right-[24px] h-[5px] w-[5px] rounded-full bg-[#ff5369] shadow-[0_0_12px_rgba(255,83,105,.85)]" />
      </div>

      <div className="absolute left-1/2 top-1/2 h-[116px] w-[116px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#72212d]/28" />

      <div className="absolute left-1/2 top-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#a72c3d]/55 bg-[#060607] shadow-[0_0_55px_rgba(170,25,48,.20),inset_0_0_22px_rgba(144,24,43,.08)]">
        <div className="absolute inset-[11px] animate-pulse rounded-full bg-[#bd1e36]/10 blur-[9px]" />

        <div className="relative z-10 scale-[1.02]">
          <ProVNMark />
        </div>
      </div>

      <div className="absolute left-[10%] right-[10%] top-1/2 h-px bg-gradient-to-r from-transparent via-[#8e2433]/32 to-transparent" />

      <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#741b29]/16 to-transparent" />

      <FloatingCard
        label="IDENTITY"
        value="PRIVATE"
        className="left-[18px] top-[18px]"
      />

      <FloatingCard
        label="USERNAME"
        value="UNIQUE"
        className="right-[18px] top-[18px]"
      />

      <FloatingCard
        label="PROOF"
        value="EARNED"
        className="bottom-[18px] right-[18px]"
      />

      <div className="absolute bottom-[22px] left-[22px] flex items-center gap-2">
        <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#cc3046] shadow-[0_0_8px_rgba(204,48,70,.75)]" />

        <p className="text-[8px] uppercase tracking-[0.28em] text-[#74333d]">
          Identity Network
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   SMOOTH INTERACTIVE PANEL
========================================================= */

function InteractivePanel({
  left,
  right,
}: {
  left: ReactNode
  right: ReactNode
}) {
  const panelRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const glowRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const leftRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const rightRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const animationFrameRef =
    useRef<number | null>(
      null
    )

  const latestMovementRef =
    useRef<{
      x: number
      y: number
    } | null>(
      null
    )

  useEffect(() => {
    return () => {
      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        )
      }
    }
  }, [])

  function renderMovement() {
    animationFrameRef.current =
      null

    const movement =
      latestMovementRef.current

    if (!movement) {
      return
    }

    const {
      x,
      y,
    } =
      movement

    const rotateY =
      (x - 0.5) *
      3.8

    const rotateX =
      (0.5 - y) *
      3

    if (
      panelRef.current
    ) {
      panelRef.current.style.transition =
        'none'

      panelRef.current.style.transform =
        `perspective(1800px) translate3d(0,-3px,0) scale(1.006) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

      panelRef.current.style.boxShadow =
        `${-rotateY}px ${36 + rotateX}px 100px rgba(0,0,0,.66), 0 18px 48px rgba(91,7,23,.14)`
    }

    if (
      glowRef.current
    ) {
      glowRef.current.style.opacity =
        '1'

      glowRef.current.style.background =
        `radial-gradient(450px circle at ${x * 100}% ${y * 100}%, rgba(235,47,72,.09), transparent 64%)`
    }

    if (
      leftRef.current
    ) {
      leftRef.current.style.transform =
        `translate3d(${(x - 0.5) * 5}px, ${(y - 0.5) * 4}px, 12px)`
    }

    if (
      rightRef.current
    ) {
      rightRef.current.style.transform =
        `translate3d(${(x - 0.5) * -2}px, ${(y - 0.5) * -1.5}px, 8px)`
    }
  }

  function handleMove(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    if (
      window.innerWidth <
      1024
    ) {
      return
    }

    if (
      !window
        .matchMedia(
          '(pointer: fine)'
        )
        .matches
    ) {
      return
    }

    const rect =
      event
        .currentTarget
        .getBoundingClientRect()

    latestMovementRef.current =
      {
        x:
          (
            event.clientX -
            rect.left
          ) /
          rect.width,

        y:
          (
            event.clientY -
            rect.top
          ) /
          rect.height,
      }

    if (
      animationFrameRef.current ===
      null
    ) {
      animationFrameRef.current =
        requestAnimationFrame(
          renderMovement
        )
    }
  }

  function handleLeave() {
    latestMovementRef.current =
      null

    if (
      animationFrameRef.current !==
      null
    ) {
      cancelAnimationFrame(
        animationFrameRef.current
      )

      animationFrameRef.current =
        null
    }

    if (
      panelRef.current
    ) {
      panelRef.current.style.transition =
        'transform 420ms cubic-bezier(.16,1,.3,1), box-shadow 400ms ease'

      panelRef.current.style.transform =
        'perspective(1800px) translate3d(0,0,0) scale(1) rotateX(0deg) rotateY(0deg)'

      panelRef.current.style.boxShadow =
        ''
    }

    if (
      glowRef.current
    ) {
      glowRef.current.style.opacity =
        '0'
    }

    if (
      leftRef.current
    ) {
      leftRef.current.style.transform =
        'translate3d(0,0,0)'
    }

    if (
      rightRef.current
    ) {
      rightRef.current.style.transform =
        'translate3d(0,0,0)'
    }
  }

  return (
    <div
      onPointerMove={
        handleMove
      }
      onPointerLeave={
        handleLeave
      }
      className="relative w-full max-w-[1160px] [perspective:1800px]"
    >
      <div className="pointer-events-none absolute bottom-[-40px] left-1/2 h-[42px] w-[75%] -translate-x-1/2 rounded-full bg-black/80 blur-[27px]" />

      <div className="pointer-events-none absolute -inset-px rounded-[31px] bg-gradient-to-br from-white/[0.09] via-transparent to-[#862431]/18 opacity-70" />

      <div
        ref={
          panelRef
        }
        className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#070708]/95 shadow-[0_44px_115px_rgba(0,0,0,.60)] [transform-style:preserve-3d] will-change-transform"
      >
        <div className="pointer-events-none absolute left-[3%] right-[3%] top-0 z-[3] h-px bg-gradient-to-r from-transparent via-[#b53748]/45 to-transparent" />

        <div
          ref={
            glowRef
          }
          className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-150"
        />

        <div className="relative z-10 grid lg:grid-cols-[.97fr_1.03fr]">
          <div
            ref={
              leftRef
            }
            className="hidden border-r border-white/[0.05] [transform-style:preserve-3d] will-change-transform lg:block"
          >
            {left}
          </div>

          <div
            ref={
              rightRef
            }
            className="[transform-style:preserve-3d] will-change-transform"
          >
            {right}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   SIGNUP PAGE
========================================================= */

export default function SignupPage() {
  const router =
    useRouter()

  const pageRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const [
    fullName,
    setFullName,
  ] =
    useState('')

  const [
    username,
    setUsername,
  ] =
    useState('')

  const [
    usernameState,
    setUsernameState,
  ] =
    useState<UsernameState>(
      'idle'
    )

  const [
    email,
    setEmail,
  ] =
    useState('')

  const [
    password,
    setPassword,
  ] =
    useState('')

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false)

  const [
    loading,
    setLoading,
  ] =
    useState(false)

  const [
    error,
    setError,
  ] =
    useState('')

  const [
    success,
    setSuccess,
  ] =
    useState('')

  const cleanedFullName =
    fullName
      .trim()
      .replace(
        /\s+/g,
        ' '
      )

  const fullNameValid =
    cleanedFullName.length >=
      2 &&
    cleanedFullName.length <=
      80

  const cleanedUsername =
    username
      .trim()
      .toLowerCase()

  const usernameValid =
    /^[a-z0-9._]{3,20}$/.test(
      cleanedUsername
    )

  const cleanedEmail =
    email
      .trim()
      .toLowerCase()

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      cleanedEmail
    )

  const passwordRules =
    useMemo<PasswordRules>(
      () => ({
        length:
          password.length >=
          8,

        uppercase:
          /[A-Z]/.test(
            password
          ),

        lowercase:
          /[a-z]/.test(
            password
          ),

        number:
          /[0-9]/.test(
            password
          ),

        special:
          /[^A-Za-z0-9\s]/.test(
            password
          ),
      }),
      [
        password,
      ]
    )

  const passwordStrong =
    Object
      .values(
        passwordRules
      )
      .every(
        Boolean
      )

  const canSubmit =
    fullNameValid &&
    usernameState ===
      'available' &&
    emailValid &&
    passwordStrong &&
    !loading

  /* =======================================================
     PAGE ENTRANCE
  ======================================================== */

  useEffect(() => {
    const page =
      pageRef.current

    if (!page) {
      return
    }

    page.style.opacity =
      '0'

    page.style.transform =
      'translateY(8px) scale(.995)'

    page.style.transition =
      'opacity 520ms cubic-bezier(.16,1,.3,1), transform 650ms cubic-bezier(.16,1,.3,1)'

    const frame =
      requestAnimationFrame(
        () => {
          requestAnimationFrame(
            () => {
              page.style.opacity =
                '1'

              page.style.transform =
                'translateY(0px) scale(1)'
            }
          )
        }
      )

    return () => {
      cancelAnimationFrame(
        frame
      )
    }
  }, [])

  /* =======================================================
     USERNAME AVAILABILITY
  ======================================================== */

  useEffect(() => {
    setError('')

    if (
      !username
    ) {
      setUsernameState(
        'idle'
      )

      return
    }

    if (
      !usernameValid
    ) {
      setUsernameState(
        'invalid'
      )

      return
    }

    setUsernameState(
      'checking'
    )

    let cancelled =
      false

    const timer =
      window.setTimeout(
        async () => {
          try {
            const supabase =
              createClient()

            const {
              data,
              error:
                usernameError,
            } =
              await supabase.rpc(
                'is_username_available',
                {
                  p_username:
                    cleanedUsername,
                }
              )

            if (
              cancelled
            ) {
              return
            }

            if (
              usernameError
            ) {
              console.error(
                'Username availability error:',
                usernameError
              )

              setUsernameState(
                'error'
              )

              return
            }

            setUsernameState(
              data === true
                ? 'available'
                : 'taken'
            )
          } catch (
            usernameError
          ) {
            if (
              cancelled
            ) {
              return
            }

            console.error(
              'Username availability request failed:',
              usernameError
            )

            setUsernameState(
              'error'
            )
          }
        },
        450
      )

    return () => {
      cancelled =
        true

      window.clearTimeout(
        timer
      )
    }
  }, [
    username,
    usernameValid,
    cleanedUsername,
  ])

  async function checkUsernameNow() {
    const supabase =
      createClient()

    const {
      data,
      error:
        checkError,
    } =
      await supabase.rpc(
        'is_username_available',
        {
          p_username:
            cleanedUsername,
        }
      )

    if (
      checkError
    ) {
      throw checkError
    }

    return (
      data === true
    )
  }

  /* =======================================================
     SIGNUP
  ======================================================== */

  async function handleSignup(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (
      !fullNameValid
    ) {
      setError(
        'Enter your full name before continuing.'
      )

      return
    }

    if (
      !usernameValid
    ) {
      setError(
        'Choose a valid username before continuing.'
      )

      return
    }

    if (
      usernameState !==
      'available'
    ) {
      setError(
        'Choose an available username before continuing.'
      )

      return
    }

    if (
      !emailValid
    ) {
      setError(
        'Enter a valid email address.'
      )

      return
    }

    if (
      !passwordStrong
    ) {
      setError(
        'Complete all password requirements before continuing.'
      )

      return
    }

    setLoading(
      true
    )

    try {
      const stillAvailable =
        await checkUsernameNow()

      if (
        !stillAvailable
      ) {
        setUsernameState(
          'taken'
        )

        setError(
          `@${cleanedUsername} was just taken. Choose another username.`
        )

        return
      }

      const supabase =
        createClient()

      const {
        data,
        error:
          signupError,
      } =
        await supabase.auth.signUp(
          {
            email:
              cleanedEmail,

            password,

            options: {
              data: {
                username:
                  cleanedUsername,

                full_name:
                  cleanedFullName,
              },
            },
          }
        )

      if (
        signupError
      ) {
        const message =
          signupError
            .message
            .toLowerCase()

        if (
          message.includes(
            'database error'
          ) ||
          message.includes(
            'duplicate'
          ) ||
          message.includes(
            'unique'
          )
        ) {
          setUsernameState(
            'taken'
          )

          setError(
            'That username is no longer available. Choose another one.'
          )

          return
        }

        setError(
          signupError.message
        )

        return
      }

      if (
        data.session
      ) {
        router.push(
          '/'
        )

        router.refresh()

        return
      }

      setSuccess(
        `Identity reserved. We sent a verification link to ${cleanedEmail}.`
      )
    } catch (
      signupFailure
    ) {
      console.error(
        'Signup failed:',
        signupFailure
      )

      setError(
        'Something went wrong while creating your ProVN identity. Try again.'
      )
    } finally {
      setLoading(
        false
      )
    }
  }

  /* =======================================================
     LEFT PANEL
  ======================================================== */

  const leftPanel = (
    <div className="relative flex min-h-[700px] flex-col justify-between overflow-hidden p-10 xl:p-11">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(158,23,43,.16),transparent_39%),linear-gradient(145deg,#0d080a_0%,#080708_54%,#050506_100%)]" />

      <div className="pointer-events-none absolute left-[-210px] top-[115px] h-[490px] w-[490px] rounded-full border border-[#8e2634]/18" />

      <div className="pointer-events-none absolute left-[-140px] top-[185px] h-[350px] w-[350px] rounded-full border border-[#ae3241]/10" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#9f3040]" />

          <p className="text-[9px] uppercase tracking-[0.38em] text-[#9e414e]">
            PROVN / IDENTITY 001
          </p>
        </div>

        <h1 className="mt-7 text-[48px] font-black leading-[0.92] tracking-[-0.055em] xl:text-[54px]">
          <span className="text-[#f7f3f3]">
            Your Game.
          </span>

          <br />

          <span className="text-[#d42d42]">
            Your Proof.
          </span>

          <br />

          <span className="text-[#f7f3f3]">
            Your Identity.
          </span>
        </h1>

        <p className="mt-6 max-w-[395px] text-[14px] leading-7 text-zinc-500">
          Start with a real identity.
          Build your gaming proof,
          reputation and opportunities
          over time.
        </p>
      </div>

      <div className="relative z-10 my-6">
        <IdentityVisual />
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-3">
        {[
          [
            '01',
            'Claim Identity',
          ],

          [
            '02',
            'Build Proof',
          ],

          [
            '03',
            'Level Up',
          ],
        ].map(
          ([
            number,
            label,
          ]) => (
            <div
              key={
                number
              }
              className="rounded-[14px] border border-white/[0.055] bg-white/[0.018] px-4 py-3 transition-all duration-300 hover:-translate-y-[2px] hover:border-[#6e2731] hover:bg-[#11080a]"
            >
              <p className="text-[10px] font-semibold text-[#ca4858]">
                {number}
              </p>

              <p className="mt-1 text-[10px] text-zinc-500">
                {label}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )

  /* =======================================================
     RIGHT PANEL
  ======================================================== */

  const rightPanel = (
    <div className="relative flex min-h-[700px] items-center px-6 py-9 sm:px-10 lg:px-10 xl:px-12">
      <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-[330px] w-[330px] rounded-full bg-[#971329]/[0.055] blur-[105px]" />

      <div className="relative z-10 mx-auto w-full max-w-[515px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.34em] text-[#9e3746]">
              CREATE ACCOUNT
            </p>

            <div className="mt-[7px] flex items-center gap-2">
              <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#d62e45] shadow-[0_0_8px_rgba(214,46,69,.7)]" />

              <span className="text-[8px] uppercase tracking-[0.22em] text-zinc-700">
                Identity Node Online
              </span>
            </div>
          </div>

          <span className="hidden rounded-full border border-[#65242e]/65 bg-[#12080a] px-3 py-[7px] text-[8px] uppercase tracking-[0.19em] text-[#94414d] sm:inline-flex">
            IDENTITY ACCESS
          </span>
        </div>

        <h2 className="mt-5 text-[34px] font-black leading-[0.96] tracking-[-0.05em] sm:text-[40px]">
          Claim Your{' '}

          <span className="text-[#d72e43]">
            Identity.
          </span>
        </h2>

        <p className="mt-3 text-[13px] leading-6 text-zinc-500">
          Real identity underneath.
          Your public presence stays in
          your control.
        </p>

        <form
          onSubmit={
            handleSignup
          }
          noValidate
          className="mt-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <InputField
                label="Full Name"
                value={
                  fullName
                }
                onChange={
                  setFullName
                }
                placeholder="Kanav Agarwal"
                autoComplete="name"
              />

              <p className="mt-2 text-[9px] leading-4 text-zinc-700">
                Private by default. You
                decide later if it appears
                publicly.
              </p>
            </div>

            <UsernameField
              value={
                username
              }
              onChange={
                setUsername
              }
              status={
                usernameState
              }
            />
          </div>

          <div className="mt-5">
            <InputField
              label="Email"
              type="email"
              value={
                email
              }
              onChange={
                setEmail
              }
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="mt-5">
            <InputField
              label="Password"
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              value={
                password
              }
              onChange={
                setPassword
              }
              placeholder="Create a strong password"
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      current =>
                        !current
                    )
                  }
                  className="text-zinc-600 transition-colors duration-150 hover:text-zinc-300"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <EyeIcon
                    open={
                      showPassword
                    }
                  />
                </button>
              }
            />

            <PasswordChecklist
              rules={
                passwordRules
              }
              password={
                password
              }
            />
          </div>

          {error && (
            <div className="mt-5 rounded-[12px] border border-red-900/60 bg-red-950/20 px-4 py-3 text-[12px] leading-5 text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-[12px] border border-emerald-900/60 bg-emerald-950/20 px-4 py-3 text-[12px] leading-5 text-emerald-300">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={
              !canSubmit
            }
            className="group relative mt-6 flex h-[56px] w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#c02f42] bg-gradient-to-r from-[#8a1224] via-[#b91d34] to-[#d52942] text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_16px_38px_rgba(120,12,31,.22)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-[2px] hover:border-[#e64b5d] hover:shadow-[0_22px_52px_rgba(151,17,40,.33)] active:translate-y-0 active:scale-[0.992] disabled:translate-y-0 disabled:border-white/[0.06] disabled:bg-none disabled:bg-[#0d0d0f] disabled:text-zinc-700 disabled:shadow-none"
          >
            <span className="pointer-events-none absolute inset-y-0 left-[-40%] w-[35%] -skew-x-[22deg] bg-white/[0.10] opacity-0 blur-[4px] transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

            <span className="relative z-10">
              {loading
                ? 'Claiming Identity...'
                : 'Create Account →'}
            </span>
          </button>

          <div className="mt-4 flex items-center justify-between gap-3 text-[8px] uppercase tracking-[0.16em] text-zinc-700">
            <span>
              Private Identity
            </span>

            <span>
              Verified Over Time
            </span>
          </div>

          <p className="mt-4 text-center text-[10px] leading-5 text-zinc-700">
            By creating an account, you
            agree to ProVN&apos;s Terms
            and Privacy Policy.
          </p>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.055]" />

          <span className="text-[8px] uppercase tracking-[0.24em] text-zinc-700">
            Already locked in?
          </span>

          <div className="h-px flex-1 bg-white/[0.055]" />
        </div>

        <Link
          href="/login"
          className="group flex h-[50px] w-full items-center justify-center gap-2 rounded-[13px] border border-white/[0.075] bg-white/[0.015] text-[11px] font-semibold text-zinc-400 transition-[transform,border-color,background-color,color] duration-200 hover:-translate-y-[1px] hover:border-[#70303a] hover:bg-[#14090c] hover:text-white"
        >
          Sign In to ProVN

          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  )

  /* =======================================================
     PAGE
  ======================================================== */

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
            select,
            [role="button"] {
              cursor: ${PROVN_CURSOR} !important;
            }

          }
        `}
      </style>

      <main className="relative min-h-screen overflow-hidden bg-[#020203] text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 7% 17%, rgba(125,9,27,.13), transparent 31%), radial-gradient(circle at 93% 20%, rgba(115,10,29,.09), transparent 28%), radial-gradient(circle at 50% 110%, rgba(88,5,20,.11), transparent 43%), #020203',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.095]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',

            backgroundSize:
              '76px 76px',
          }}
        />

        <div className="pointer-events-none absolute -left-[285px] top-[150px] h-[650px] w-[650px] animate-spin rounded-full border border-[#70202c]/14 [animation-duration:38s]" />

        <div className="pointer-events-none absolute -right-[325px] bottom-[-170px] h-[710px] w-[710px] animate-spin rounded-full border border-[#812430]/13 [animation-direction:reverse] [animation-duration:46s]" />

        <div className="pointer-events-none absolute left-[8%] top-[39%] h-[7px] w-[7px] animate-pulse rounded-full bg-[#c42d43] shadow-[0_0_16px_rgba(196,45,67,.65)]" />

        <div className="pointer-events-none absolute right-[9%] top-[47%] h-[6px] w-[6px] animate-pulse rounded-full bg-[#c22b40] shadow-[0_0_14px_rgba(194,43,64,.58)]" />

        <div className="pointer-events-none absolute bottom-[14%] left-[18%] h-[4px] w-[4px] animate-pulse rounded-full bg-[#9f2638] shadow-[0_0_10px_rgba(159,38,56,.58)]" />

        <header className="absolute left-0 top-0 z-40 w-full">
          <div className="mx-auto flex h-[82px] max-w-[1500px] items-center justify-between px-5 sm:px-7 lg:px-10">
            <ProVNLogo />

            <Link
              href="/"
              className="group flex items-center gap-2 text-[11px] font-medium text-zinc-600 transition-colors duration-200 hover:text-zinc-200"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                ←
              </span>

              Back to Home
            </Link>
          </div>
        </header>

        <div
          ref={
            pageRef
          }
          className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] items-center justify-center px-5 pb-12 pt-[102px] sm:px-7 lg:px-10"
        >
          <InteractivePanel
            left={
              leftPanel
            }
            right={
              rightPanel
            }
          />
        </div>
      </main>
    </>
  )
}