'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string | null
}

type LoadState = 'loading' | 'ready' | 'error'
type EmailStage = 'form' | 'otp' | 'success'
type VerifyResult = { ok: boolean; message?: string }
type OtpPhase = 'entry' | 'orbit' | 'success'

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
</svg>`

const PROVN_CURSOR =
  `url("data:image/svg+xml,${encodeURIComponent(
    provnCursorSvg
  )}") 1 1, auto`

/* =========================================================
   PREMIUM CARD MOTION
========================================================= */

function handlePremiumTilt(
  event: ReactMouseEvent<HTMLElement>,
  maxTilt = 3.4,
  lift = 7,
  depth = 12
) {
  const element = event.currentTarget
  const rect = element.getBoundingClientRect()

  const x =
    (event.clientX - rect.left) /
    rect.width

  const y =
    (event.clientY - rect.top) /
    rect.height

  element.style.transition =
    'transform 80ms linear, border-color 220ms ease, box-shadow 220ms ease'

  element.style.setProperty(
    '--settings-rx',
    `${(-(y - 0.5) * maxTilt * 2).toFixed(2)}deg`
  )

  element.style.setProperty(
    '--settings-ry',
    `${((x - 0.5) * maxTilt * 2).toFixed(2)}deg`
  )

  element.style.setProperty(
    '--settings-lift',
    `-${lift}px`
  )

  element.style.setProperty(
    '--settings-mx',
    `${(x * 100).toFixed(1)}%`
  )

  element.style.setProperty(
    '--settings-my',
    `${(y * 100).toFixed(1)}%`
  )

  element.style.setProperty(
    '--settings-depth',
    `${depth}px`
  )
}

function resetPremiumTilt(
  event: ReactMouseEvent<HTMLElement>
) {
  const element = event.currentTarget

  element.style.transition =
    'transform 560ms cubic-bezier(.16,1,.3,1), border-color 320ms ease, box-shadow 440ms ease'

  element.style.setProperty(
    '--settings-rx',
    '0deg'
  )

  element.style.setProperty(
    '--settings-ry',
    '0deg'
  )

  element.style.setProperty(
    '--settings-lift',
    '0px'
  )

  element.style.setProperty(
    '--settings-mx',
    '50%'
  )

  element.style.setProperty(
    '--settings-my',
    '50%'
  )

  element.style.setProperty(
    '--settings-depth',
    '0px'
  )
}

function PremiumPanel({
  children,
  className = '',
  maxTilt = 3.4,
  lift = 7,
  depth = 12,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  lift?: number
  depth?: number
}) {
  return (
    <section
      onMouseMove={event =>
        handlePremiumTilt(
          event,
          maxTilt,
          lift,
          depth
        )
      }
      onMouseLeave={resetPremiumTilt}
      className={`settings-premium-panel ${className}`}
    >
      <span
        aria-hidden="true"
        className="settings-pointer-light"
      />

      <span
        aria-hidden="true"
        className="settings-edge-light"
      />

      <span
        aria-hidden="true"
        className="settings-sheen"
      />

      <div className="settings-panel-content">
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
          id="settings-main"
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
            offset="15%"
            stopColor="#e65362"
          />

          <stop
            offset="35%"
            stopColor="#b92438"
          />

          <stop
            offset="55%"
            stopColor="#76101d"
          />

          <stop
            offset="77%"
            stopColor="#ad1c30"
          />

          <stop
            offset="100%"
            stopColor="#260508"
          />
        </linearGradient>

        <linearGradient
          id="settings-top"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor="#76101b"
          />

          <stop
            offset="38%"
            stopColor="#e34a5b"
          />

          <stop
            offset="58%"
            stopColor="#ff9ba5"
          />

          <stop
            offset="100%"
            stopColor="#670913"
          />
        </linearGradient>
      </defs>

      <path
        d="M4.5 8.5 H39 L52 17.5 L44.5 20.5 H16.2 L8.7 15.3 Z"
        fill="url(#settings-top)"
      />

      <path
        d="M11.2 21.5 H37.6 C46.5 21.5 52.5 26.3 52.5 33 C52.5 40.4 46.8 45.4 37.6 45.4 H26.4 V36.9 H37.1 C40.9 36.9 43.4 35.2 43.4 32.8 C43.4 30.3 40.9 28.6 37.1 28.6 H23.6 V43.5 L12 55 Z"
        fill="url(#settings-main)"
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
   ICONS
========================================================= */

function ArrowLeftIcon() {
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

function ArrowRightIcon() {
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
      className="h-[13px] w-[13px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
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

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
      />

      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="8"
        cy="12"
        r="4"
      />

      <path d="M12 12h9" />
      <path d="M17 12v3" />
      <path d="M20 12v2" />
    </svg>
  )
}

function DevicesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="4"
        width="14"
        height="11"
        rx="2"
      />

      <path d="M8 19h4" />

      <rect
        x="17"
        y="8"
        width="4"
        height="10"
        rx="1"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 20c.8-4.1 3.3-6 7.5-6s6.7 1.9 7.5 6" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 19 6v5c0 4.8-2.9 8.1-7 10-4.1-1.9-7-5.2-7-10V6l7-3Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M9 3h6l1 4H8l1-4Z" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[11px] w-[11px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="6"
        y="6"
        width="9"
        height="9"
        rx="2"
      />

      <path d="M12 6V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
    </svg>
  )
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SectionHeading({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[14px] border border-[#64232e]/70 bg-[#12070a] text-[#cc4054] shadow-[0_0_22px_rgba(153,25,45,.08)]">
        {icon}
      </span>

      <div>
        <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#993746]">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-[23px] font-bold tracking-[-0.04em] text-[#f2eeee]">
          {title}
        </h2>

        <p className="mt-2 max-w-[620px] text-[9px] leading-5 text-zinc-700">
          {description}
        </p>
      </div>
    </div>
  )
}

function StatusPill({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'good' | 'locked'
}) {
  const className =
    tone === 'good'
      ? 'border-emerald-900/35 bg-emerald-950/[0.08] text-emerald-500'
      : tone === 'locked'
        ? 'border-white/[0.05] bg-black/20 text-zinc-700'
        : 'border-[#5f222d]/65 bg-[#10070a] text-[#a73a49]'

  return (
    <span
      className={`inline-flex h-[28px] items-center rounded-full border px-3 text-[7px] font-semibold uppercase tracking-[0.14em] ${className}`}
    >
      {children}
    </span>
  )
}

function passwordIsStrong(
  password: string
) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

/* =========================================================
   EMAIL OTP — SAME MOTION LANGUAGE AS SIGNUP
========================================================= */

const OTP_LENGTH = 6

const OTP_ORBIT = [
  { x: 0, y: -96, r: 0 },
  { x: 84, y: -48, r: 5 },
  { x: 84, y: 48, r: -5 },
  { x: 0, y: 96, r: 2 },
  { x: -84, y: 48, r: -4 },
  { x: -84, y: -48, r: 4 },
]

function wait(ms: number) {
  return new Promise<void>(
    resolve =>
      window.setTimeout(
        resolve,
        ms
      )
  )
}

function maskEmail(
  email: string
) {
  const [local, domain] =
    email.split('@')

  if (!domain) {
    return email
  }

  if (local.length <= 2) {
    return `${local[0] ?? ''}***@${domain}`
  }

  return `${local.slice(
    0,
    2
  )}${'*'.repeat(
    Math.min(
      5,
      Math.max(
        2,
        local.length - 3
      )
    )
  )}${local.slice(-1)}@${domain}`
}

function BigVerifiedCheck() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-[35px] w-[35px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 16 6 6L26 9" />
    </svg>
  )
}

function EmailOtpVerification({
  email,
  onVerify,
  onResend,
  onVerified,
}: {
  email: string
  onVerify:
    (
      token: string
    ) =>
      Promise<VerifyResult>
  onResend:
    () =>
      Promise<VerifyResult>
  onVerified:
    () => void
}) {
  const [
    digits,
    setDigits,
  ] =
    useState<string[]>(
      Array(
        OTP_LENGTH
      ).fill('')
    )

  const [
    phase,
    setPhase,
  ] =
    useState<OtpPhase>(
      'entry'
    )

  const [
    error,
    setError,
  ] =
    useState('')

  const [
    notice,
    setNotice,
  ] =
    useState('')

  const [
    resendSeconds,
    setResendSeconds,
  ] =
    useState(60)

  const [
    resending,
    setResending,
  ] =
    useState(false)

  const [
    shake,
    setShake,
  ] =
    useState(false)

  const inputs =
    useRef<
      Array<
        HTMLInputElement |
        null
      >
    >([])

  const verificationStarted =
    useRef(false)

  const token =
    digits.join('')

  useEffect(() => {
    const timer =
      window.setTimeout(
        () =>
          inputs.current[0]
            ?.focus(),
        350
      )

    return () =>
      window.clearTimeout(
        timer
      )
  }, [])

  useEffect(() => {
    if (
      resendSeconds <= 0
    ) {
      return
    }

    const timer =
      window.setInterval(
        () => {
          setResendSeconds(
            value =>
              Math.max(
                0,
                value - 1
              )
          )
        },
        1000
      )

    return () =>
      window.clearInterval(
        timer
      )
  }, [
    resendSeconds,
  ])

  useEffect(() => {
    if (
      token.length !==
        OTP_LENGTH ||
      phase !== 'entry' ||
      verificationStarted.current
    ) {
      return
    }

    verificationStarted.current =
      true

    void verify(
      token
    )
  }, [
    token,
    phase,
  ])

  async function verify(
    completeToken: string
  ) {
    setError('')
    setNotice('')

    setPhase(
      'orbit'
    )

    await wait(
      760
    )

    const result =
      await onVerify(
        completeToken
      )

    if (!result.ok) {
      setPhase(
        'entry'
      )

      verificationStarted.current =
        false

      setDigits(
        Array(
          OTP_LENGTH
        ).fill('')
      )

      setError(
        result.message ||
          'That verification code is invalid or expired.'
      )

      setShake(true)

      window.setTimeout(
        () =>
          setShake(
            false
          ),
        460
      )

      window.setTimeout(
        () =>
          inputs.current[0]
            ?.focus(),
        200
      )

      return
    }

    await wait(
      320
    )

    setPhase(
      'success'
    )

    await wait(
      1850
    )

    onVerified()
  }

  function distribute(
    startIndex: number,
    rawValue: string
  ) {
    const clean =
      rawValue
        .replace(
          /\D/g,
          ''
        )
        .slice(
          0,
          OTP_LENGTH
        )

    if (!clean) {
      return
    }

    const next = [
      ...digits,
    ]

    let target =
      startIndex

    for (
      let index = 0;
      index <
        clean.length &&
      target <
        OTP_LENGTH;
      index += 1
    ) {
      next[target] =
        clean[index]

      target += 1
    }

    setDigits(next)
    setError('')
    setNotice('')

    const firstEmpty =
      next.findIndex(
        value =>
          !value
      )

    if (
      firstEmpty >= 0
    ) {
      inputs.current[
        firstEmpty
      ]?.focus()
    } else {
      inputs.current[
        OTP_LENGTH - 1
      ]?.focus()
    }
  }

  function handleChange(
    index: number,
    value: string
  ) {
    if (
      phase !== 'entry'
    ) {
      return
    }

    const clean =
      value.replace(
        /\D/g,
        ''
      )

    if (
      clean.length > 1
    ) {
      distribute(
        index,
        clean
      )

      return
    }

    const next = [
      ...digits,
    ]

    next[index] =
      clean.slice(-1)

    setDigits(next)
    setError('')
    setNotice('')

    if (
      clean &&
      index <
        OTP_LENGTH - 1
    ) {
      inputs.current[
        index + 1
      ]?.focus()
    }
  }

  function handleKeyDown(
    index: number,
    event:
      KeyboardEvent<HTMLInputElement>
  ) {
    if (
      phase !== 'entry'
    ) {
      return
    }

    if (
      event.key ===
      'Backspace'
    ) {
      if (
        digits[index]
      ) {
        const next = [
          ...digits,
        ]

        next[index] =
          ''

        setDigits(next)

        return
      }

      if (
        index > 0
      ) {
        const next = [
          ...digits,
        ]

        next[
          index - 1
        ] = ''

        setDigits(next)

        inputs.current[
          index - 1
        ]?.focus()
      }

      return
    }

    if (
      event.key ===
        'ArrowLeft' &&
      index > 0
    ) {
      inputs.current[
        index - 1
      ]?.focus()
    }

    if (
      event.key ===
        'ArrowRight' &&
      index <
        OTP_LENGTH - 1
    ) {
      inputs.current[
        index + 1
      ]?.focus()
    }
  }

  function handlePaste(
    event:
      ClipboardEvent<HTMLDivElement>
  ) {
    if (
      phase !== 'entry'
    ) {
      return
    }

    const pasted =
      event
        .clipboardData
        .getData(
          'text'
        )
        .replace(
          /\D/g,
          ''
        )
        .slice(
          0,
          OTP_LENGTH
        )

    if (!pasted) {
      return
    }

    event.preventDefault()

    const next =
      Array(
        OTP_LENGTH
      ).fill('')

    pasted
      .split('')
      .forEach(
        (
          digit,
          index
        ) => {
          next[index] =
            digit
        }
      )

    setDigits(next)
    setError('')
    setNotice('')

    const empty =
      next.findIndex(
        value =>
          !value
      )

    if (
      empty >= 0
    ) {
      inputs.current[
        empty
      ]?.focus()
    } else {
      inputs.current[
        OTP_LENGTH - 1
      ]?.focus()
    }
  }

  async function resend() {
    if (
      resendSeconds > 0 ||
      resending ||
      phase !== 'entry'
    ) {
      return
    }

    setResending(true)
    setError('')
    setNotice('')

    const result =
      await onResend()

    setResending(false)

    if (!result.ok) {
      setError(
        result.message ||
          'Could not send another code.'
      )

      return
    }

    verificationStarted.current =
      false

    setDigits(
      Array(
        OTP_LENGTH
      ).fill('')
    )

    setResendSeconds(
      60
    )

    setNotice(
      'A fresh verification code has been sent.'
    )

    window.setTimeout(
      () =>
        inputs.current[0]
          ?.focus(),
      120
    )
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-[620px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-[0.34em] text-[#a23b4a]">
            PROVN / EMAIL VERIFY
          </p>

          <div className="mt-[7px] flex items-center gap-2">
            <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#df3048] shadow-[0_0_9px_rgba(223,48,72,.85)]" />

            <span className="text-[7px] uppercase tracking-[0.22em] text-zinc-700">
              SECURE EMAIL NODE ACTIVE
            </span>
          </div>
        </div>

        <span className="hidden rounded-full border border-[#682531]/70 bg-[#12080a] px-3 py-[7px] text-[7px] uppercase tracking-[0.19em] text-[#9b4450] sm:inline-flex">
          EMAIL OTP
        </span>
      </div>

      <h3 className="mt-5 text-[30px] font-black leading-[0.96] tracking-[-0.05em] sm:text-[36px]">
        Verify New{' '}
        <span className="text-[#dc3048]">
          Email.
        </span>
      </h3>

      <p className="mt-3 max-w-[520px] text-[10px] leading-5 text-zinc-600">
        Enter the six-digit code sent to{' '}
        <span className="font-medium text-zinc-300">
          {maskEmail(
            email
          )}
        </span>
        .
      </p>

      <div
        onPaste={
          handlePaste
        }
        className={`
          relative mt-7
          h-[360px]
          overflow-hidden
          rounded-[24px]
          border
          border-white/[0.06]
          bg-[#050506]/95
          shadow-[inset_0_1px_0_rgba(255,255,255,.025),0_25px_80px_rgba(0,0,0,.28)]
          ${
            shake
              ? 'animate-[provnEmailOtpShake_.44s_ease]'
              : ''
          }
        `}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          style={{
            background:
              phase ===
              'success'
                ? 'radial-gradient(circle at 50% 50%, rgba(16,185,129,.16), transparent 40%)'
                : 'radial-gradient(circle at 50% 50%, rgba(186,27,54,.18), transparent 43%)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',

            backgroundSize:
              '38px 38px',
          }}
        />

        <div
          className={`
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[248px]
            w-[248px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            transition-all
            duration-700
            ${
              phase ===
              'entry'
                ? 'scale-[.45] border-transparent opacity-0'
                : phase ===
                    'orbit'
                  ? 'scale-100 border-[#8e293a]/40 opacity-100'
                  : 'scale-[.18] border-emerald-500/15 opacity-0'
            }
          `}
        />

        <div
          className={`
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[190px]
            w-[190px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            transition-all
            duration-700
            ${
              phase ===
              'entry'
                ? 'scale-[.4] border-transparent opacity-0'
                : phase ===
                    'orbit'
                  ? 'scale-100 border-[#a82f41]/25 opacity-100'
                  : 'scale-[.12] border-transparent opacity-0'
            }
          `}
        />

        <div
          className={`
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[248px]
            w-[248px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            transition-opacity
            duration-300
            ${
              phase ===
              'orbit'
                ? 'animate-[spin_1.2s_linear_infinite] opacity-100'
                : 'opacity-0'
            }
          `}
        >
          <span className="absolute left-1/2 top-[-5px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[#f23a54] shadow-[0_0_23px_rgba(242,58,84,.95)]" />

          <span className="absolute bottom-[17px] right-[17px] h-[5px] w-[5px] rounded-full bg-[#a72c40] shadow-[0_0_12px_rgba(167,44,64,.8)]" />
        </div>

        <div
          className={`
            pointer-events-none
            absolute
            left-[8%]
            right-[8%]
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#cf3048]/60
            to-transparent
            ${
              phase ===
              'orbit'
                ? 'animate-[provnEmailScan_1.4s_ease-in-out_infinite] opacity-100'
                : 'opacity-0'
            }
          `}
        />

        <div
          className={`
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            flex
            h-[64px]
            w-[64px]
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-[#922c3d]/40
            bg-[#090608]
            shadow-[0_0_40px_rgba(166,29,51,.16)]
            transition-all
            duration-500
            ${
              phase ===
              'orbit'
                ? 'scale-100 opacity-100'
                : 'scale-[.42] opacity-0'
            }
          `}
        >
          <div className="scale-[.62]">
            <ProVNMark />
          </div>
        </div>

        <div
          className={`
            absolute
            left-0
            right-0
            top-7
            text-center
            transition-all
            duration-300
            ${
              phase ===
              'success'
                ? '-translate-y-2 opacity-0'
                : 'translate-y-0 opacity-100'
            }
          `}
        >
          <p className="text-[7px] uppercase tracking-[0.31em] text-zinc-700">
            {phase ===
            'orbit'
              ? 'VERIFYING EMAIL OWNERSHIP'
              : 'ENTER SECURITY CODE'}
          </p>
        </div>

        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {digits.map(
            (
              digit,
              index
            ) => {
              const rowX =
                (
                  index -
                  2.5
                ) *
                60

              let x =
                rowX

              let y = 0
              let rotation =
                0

              let scale =
                1

              let opacity =
                1

              if (
                phase ===
                'orbit'
              ) {
                x =
                  OTP_ORBIT[
                    index
                  ].x

                y =
                  OTP_ORBIT[
                    index
                  ].y

                rotation =
                  OTP_ORBIT[
                    index
                  ].r

                scale =
                  0.96
              }

              if (
                phase ===
                'success'
              ) {
                x = 0
                y = 0

                rotation =
                  index %
                    2 ===
                  0
                    ? 80
                    : -80

                scale =
                  0.03

                opacity =
                  0
              }

              return (
                <div
                  key={
                    index
                  }
                  className="absolute left-0 top-0"
                  style={{
                    transform: `
                      translate(-50%, -50%)
                      translate3d(${x}px, ${y}px, 0)
                      rotate(${rotation}deg)
                      scale(${scale})
                    `,

                    opacity,

                    transition:
                      `transform 800ms cubic-bezier(.16,1,.3,1) ${
                        index *
                        38
                      }ms,
                      opacity 300ms ease ${
                        phase ===
                        'success'
                          ? index *
                            22
                          : 0
                      }ms`,
                  }}
                >
                  <input
                    ref={
                      element => {
                        inputs.current[
                          index
                        ] =
                          element
                      }
                    }
                    data-writing-field="true"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={
                      index ===
                      0
                        ? 'one-time-code'
                        : 'off'
                    }
                    maxLength={
                      index ===
                      0
                        ? OTP_LENGTH
                        : 1
                    }
                    value={
                      digit
                    }
                    disabled={
                      phase !==
                      'entry'
                    }
                    onChange={
                      event =>
                        handleChange(
                          index,
                          event
                            .target
                            .value
                        )
                    }
                    onKeyDown={
                      event =>
                        handleKeyDown(
                          index,
                          event
                        )
                    }
                    aria-label={`Email OTP digit ${
                      index +
                      1
                    }`}
                    className={`
                      h-[53px]
                      w-[53px]
                      rounded-[14px]
                      border
                      bg-[#101014]
                      text-center
                      text-[20px]
                      font-bold
                      text-white
                      outline-none
                      transition-[border-color,background-color,box-shadow,transform]
                      duration-150
                      ${
                        digit
                          ? 'border-[#87313e] bg-[#120a0d] shadow-[0_0_21px_rgba(190,39,61,.10)]'
                          : 'border-white/[0.085]'
                      }
                      focus:-translate-y-[1px]
                      focus:border-[#dc3c51]
                      focus:bg-[#130b0e]
                      focus:shadow-[0_0_0_3px_rgba(207,46,68,.08),0_0_25px_rgba(137,16,34,.12)]
                    `}
                  />
                </div>
              )
            }
          )}

          <div
            className="pointer-events-none absolute left-0 top-0 flex flex-col items-center"
            style={{
              transform:
                phase ===
                'success'
                  ? 'translate(-50%, -50%) scale(1)'
                  : 'translate(-50%, -50%) scale(.4)',

              opacity:
                phase ===
                'success'
                  ? 1
                  : 0,

              transition:
                'transform 820ms cubic-bezier(.16,1,.3,1) 220ms, opacity 430ms ease 230ms',
            }}
          >
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-[32px] border border-emerald-500/35 bg-[#06100c] text-emerald-400 shadow-[0_0_74px_rgba(16,185,129,.15),inset_0_0_32px_rgba(16,185,129,.06)]">
              <div className="absolute -inset-[10px] animate-[provnEmailVerifiedPulse_1.45s_ease-out_infinite] rounded-[38px] border border-emerald-500/15" />

              <div className="absolute -inset-[24px] rounded-[49px] border border-emerald-500/[0.045]" />

              <BigVerifiedCheck />
            </div>

            <p className="mt-6 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.30em] text-emerald-400">
              Email Verified
            </p>

            <p className="mt-2 whitespace-nowrap text-[8px] uppercase tracking-[0.21em] text-zinc-700">
              Ownership Updated
            </p>
          </div>
        </div>

        <div
          className={`
            absolute
            bottom-7
            left-0
            right-0
            text-center
            transition-opacity
            duration-300
            ${
              phase ===
              'success'
                ? 'opacity-0'
                : 'opacity-100'
            }
          `}
        >
          {phase ===
          'entry' ? (
            <p className="text-[8px] text-zinc-700">
              Type or paste your six-digit verification code.
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="h-[4px] w-[4px] animate-pulse rounded-full bg-[#da3048]" />

              <p className="text-[7px] uppercase tracking-[0.24em] text-[#87333f]">
                Matching secure email signature
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-[12px] border border-red-900/55 bg-red-950/20 px-4 py-3 text-[9px] leading-5 text-red-300">
          {error}
        </div>
      )}

      {notice &&
        !error && (
          <div className="mt-4 rounded-[12px] border border-emerald-900/35 bg-emerald-950/10 px-4 py-3 text-[9px] leading-5 text-emerald-400">
            {notice}
          </div>
        )}

      <div
        className={`
          mt-5
          flex
          items-center
          justify-center
          gap-2
          transition-opacity
          ${
            phase ===
            'entry'
              ? 'opacity-100'
              : 'pointer-events-none opacity-0'
          }
        `}
      >
        <span className="text-[9px] text-zinc-700">
          Didn&apos;t receive it?
        </span>

        <button
          type="button"
          disabled={
            resendSeconds >
              0 ||
            resending
          }
          onClick={
            resend
          }
          className="text-[9px] font-semibold text-[#bb4253] transition-colors hover:text-[#ec6073] disabled:text-zinc-700"
        >
          {resending
            ? 'Sending...'
            : resendSeconds >
                0
              ? `Resend in ${resendSeconds}s`
              : 'Resend code'}
        </button>
      </div>
    </div>
  )
}

/* =========================================================
   PAGE
========================================================= */

export default function AccountSettingsPage() {
  const supabase =
    useMemo(
      () =>
        createClient(),
      []
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
    currentEmail,
    setCurrentEmail,
  ] =
    useState('')

  const [
    emailVerified,
    setEmailVerified,
  ] =
    useState(false)

  const [
    newEmail,
    setNewEmail,
  ] =
    useState('')

  const [
    emailPassword,
    setEmailPassword,
  ] =
    useState('')

  const [
    emailSaving,
    setEmailSaving,
  ] =
    useState(false)

  const [
    emailError,
    setEmailError,
  ] =
    useState<
      string |
      null
    >(null)

  const [
    emailStage,
    setEmailStage,
  ] =
    useState<EmailStage>(
      'form'
    )

  const [
    pendingEmail,
    setPendingEmail,
  ] =
    useState('')

  const [
    currentPassword,
    setCurrentPassword,
  ] =
    useState('')

  const [
    newPassword,
    setNewPassword,
  ] =
    useState('')

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState('')

  const [
    passwordSaving,
    setPasswordSaving,
  ] =
    useState(false)

  const [
    passwordMessage,
    setPasswordMessage,
  ] =
    useState<
      string |
      null
    >(null)

  const [
    passwordError,
    setPasswordError,
  ] =
    useState<
      string |
      null
    >(null)

  const [
    sessionsSaving,
    setSessionsSaving,
  ] =
    useState(false)

  const [
    sessionMessage,
    setSessionMessage,
  ] =
    useState<
      string |
      null
    >(null)

  const [
    deleteOpen,
    setDeleteOpen,
  ] =
    useState(false)

  const [
    deleteUsername,
    setDeleteUsername,
  ] =
    useState('')

  const [
    deletePassword,
    setDeletePassword,
  ] =
    useState('')

  const [
    deleting,
    setDeleting,
  ] =
    useState(false)

  const [
    deleteError,
    setDeleteError,
  ] =
    useState<
      string |
      null
    >(null)

  const [
    copied,
    setCopied,
  ] =
    useState(false)

  /* =======================================================
     LOAD ACCOUNT
  ======================================================== */

  useEffect(() => {
    let active =
      true

    async function load() {
      const {
        data:
          userResult,
        error:
          userError,
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
        window
          .location
          .replace(
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

      if (!active) {
        return
      }

      if (
        profileError ||
        !profileResult
      ) {
        console.error(
          'Account settings profile load failed:',
          profileError
        )

        setLoadState(
          'error'
        )

        return
      }

      setProfile(
        profileResult
      )

      setCurrentEmail(
        user.email ||
          ''
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
    }

    void load()

    return () => {
      active =
        false
    }
  }, [
    supabase,
  ])

  const displayName =
    profile
      ?.display_name
      ?.trim() ||
    profile
      ?.username ||
    'Player'

  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(
        0,
        2
      )
      .map(
        item =>
          item[0]
            ?.toUpperCase()
      )
      .join('') ||
    'P'

  const profileHref =
    profile
      ?.username
      ? `/profiles/${encodeURIComponent(
          profile.username
        )}`
      : '/'

  const profileCode =
    profile
      ? profile.id
          .replaceAll(
            '-',
            ''
          )
          .slice(
            0,
            8
          )
          .toUpperCase()
      : ''

  const joined =
    profile
      ?.created_at
      ? new Intl.DateTimeFormat(
          'en-US',
          {
            month:
              'short',

            year:
              'numeric',
          }
        )
          .format(
            new Date(
              profile
                .created_at
            )
          )
          .toUpperCase()
      : ''

  /* =======================================================
     REAUTH
  ======================================================== */

  async function reauthenticate(
    password: string
  ) {
    if (
      !currentEmail
    ) {
      throw new Error(
        'No email is available for this account.'
      )
    }

    if (
      !password
    ) {
      throw new Error(
        'Enter your current password.'
      )
    }

    const {
      error,
    } =
      await supabase
        .auth
        .signInWithPassword({
          email:
            currentEmail,

          password,
        })

    if (
      error
    ) {
      throw new Error(
        'Current password is incorrect.'
      )
    }
  }

  /* =======================================================
     START EMAIL CHANGE
  ======================================================== */

  async function handleEmailChange(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event
      .preventDefault()

    if (
      emailSaving
    ) {
      return
    }

    setEmailError(
      null
    )

    const email =
      newEmail
        .trim()
        .toLowerCase()

    if (
      !email
    ) {
      setEmailError(
        'Enter your new email address.'
      )

      return
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setEmailError(
        'Enter a valid email address.'
      )

      return
    }

    if (
      email ===
      currentEmail
        .trim()
        .toLowerCase()
    ) {
      setEmailError(
        'That is already your current email.'
      )

      return
    }

    setEmailSaving(
      true
    )

    try {
      await reauthenticate(
        emailPassword
      )

      const {
        error,
      } =
        await supabase
          .auth
          .updateUser({
            email,
          })

      if (
        error
      ) {
        throw error
      }

      setPendingEmail(
        email
      )

      setEmailPassword(
        ''
      )

      setNewEmail(
        ''
      )

      setEmailStage(
        'otp'
      )
    } catch (
      error
    ) {
      setEmailError(
        error instanceof
        Error
          ? error.message
          : 'Could not change email.'
      )
    } finally {
      setEmailSaving(
        false
      )
    }
  }

  /* =======================================================
     VERIFY EMAIL OTP
  ======================================================== */

  async function verifyEmailOtp(
    token: string
  ): Promise<VerifyResult> {
    if (
      !pendingEmail
    ) {
      return {
        ok: false,

        message:
          'No pending email change was found.',
      }
    }

    try {
      const {
        data,
        error,
      } =
        await supabase
          .auth
          .verifyOtp({
            email:
              pendingEmail,

            token,

            type:
              'email_change',
          })

      if (
        error
      ) {
        return {
          ok: false,

          message:
            error.message ||
            'That verification code is invalid or expired.',
        }
      }

      const refreshedUser =
        data.user ||
        (
          await supabase
            .auth
            .getUser()
        ).data.user

      setCurrentEmail(
        refreshedUser
          ?.email ||
        pendingEmail
      )

      setEmailVerified(
        Boolean(
          refreshedUser
            ?.email_confirmed_at
        )
      )

      return {
        ok: true,
      }
    } catch (
      error
    ) {
      return {
        ok: false,

        message:
          error instanceof
          Error
            ? error.message
            : 'Could not verify the email code.',
      }
    }
  }

  async function resendEmailOtp():
    Promise<VerifyResult> {
    if (
      !pendingEmail
    ) {
      return {
        ok: false,

        message:
          'No pending email change was found.',
      }
    }

    try {
      const {
        error,
      } =
        await supabase
          .auth
          .resend({
            type:
              'email_change',

            email:
              pendingEmail,
          })

      if (
        error
      ) {
        return {
          ok: false,

          message:
            error.message ||
            'Could not resend the verification code.',
        }
      }

      return {
        ok: true,
      }
    } catch (
      error
    ) {
      return {
        ok: false,

        message:
          error instanceof
          Error
            ? error.message
            : 'Could not resend the verification code.',
      }
    }
  }

  function finishEmailVerification() {
    setPendingEmail(
      ''
    )

    setEmailError(
      null
    )

    setEmailStage(
      'success'
    )
  }

  function resetEmailChange() {
    setPendingEmail(
      ''
    )

    setNewEmail(
      ''
    )

    setEmailPassword(
      ''
    )

    setEmailError(
      null
    )

    setEmailStage(
      'form'
    )
  }

  /* =======================================================
     PASSWORD
  ======================================================== */

  async function handlePasswordChange(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event
      .preventDefault()

    if (
      passwordSaving
    ) {
      return
    }

    setPasswordError(
      null
    )

    setPasswordMessage(
      null
    )

    if (
      !passwordIsStrong(
        newPassword
      )
    ) {
      setPasswordError(
        'Use at least 8 characters with uppercase, lowercase, number and symbol.'
      )

      return
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        'The new passwords do not match.'
      )

      return
    }

    if (
      newPassword ===
      currentPassword
    ) {
      setPasswordError(
        'Your new password must be different from your current password.'
      )

      return
    }

    setPasswordSaving(
      true
    )

    try {
      await reauthenticate(
        currentPassword
      )

      const {
        error,
      } =
        await supabase
          .auth
          .updateUser({
            password:
              newPassword,
          })

      if (
        error
      ) {
        throw error
      }

      setCurrentPassword(
        ''
      )

      setNewPassword(
        ''
      )

      setConfirmPassword(
        ''
      )

      setPasswordMessage(
        'Password updated successfully.'
      )
    } catch (
      error
    ) {
      setPasswordError(
        error instanceof
        Error
          ? error.message
          : 'Could not update password.'
      )
    } finally {
      setPasswordSaving(
        false
      )
    }
  }

  /* =======================================================
     SESSION
  ======================================================== */

  async function handleSignOutOthers() {
    if (
      sessionsSaving
    ) {
      return
    }

    setSessionsSaving(
      true
    )

    setSessionMessage(
      null
    )

    try {
      const {
        error,
      } =
        await supabase
          .auth
          .signOut({
            scope:
              'others',
          })

      if (
        error
      ) {
        throw error
      }

      setSessionMessage(
        'Other active sessions have been signed out.'
      )
    } catch {
      setSessionMessage(
        'Could not sign out other sessions.'
      )
    } finally {
      setSessionsSaving(
        false
      )
    }
  }

  async function handleLogout() {
    await supabase
      .auth
      .signOut()

    window
      .location
      .replace('/')
  }

  /* =======================================================
     DELETE
  ======================================================== */

  async function handleDeleteAccount(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event
      .preventDefault()

    if (
      deleting ||
      !profile
    ) {
      return
    }

    setDeleteError(
      null
    )

    if (
      deleteUsername
        .trim()
        .toLowerCase() !==
      profile
        .username
        .trim()
        .toLowerCase()
    ) {
      setDeleteError(
        `Type ${profile.username} exactly to confirm.`
      )

      return
    }

    setDeleting(
      true
    )

    try {
      await reauthenticate(
        deletePassword
      )

      const response =
        await fetch(
          '/api/account/delete',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                username:
                  profile.username,
              }),
          }
        )

      const result =
        await response
          .json()

      if (
        !response.ok ||
        !result.ok
      ) {
        throw new Error(
          result.error ||
          'Could not delete account.'
        )
      }

      window
        .location
        .replace('/')
    } catch (
      error
    ) {
      setDeleteError(
        error instanceof
        Error
          ? error.message
          : 'Could not delete account.'
      )

      setDeleting(
        false
      )
    }
  }

  async function copyProfileId() {
    if (
      !profileCode
    ) {
      return
    }

    try {
      await navigator
        .clipboard
        .writeText(
          `PVN ${profileCode}`
        )

      setCopied(
        true
      )

      window
        .setTimeout(
          () =>
            setCopied(
              false
            ),
          1400
        )
    } catch {
      //
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
            Loading Account Control
          </p>
        </div>
      </main>
    )
  }

  if (
    loadState ===
      'error' ||
    !profile
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020203] px-6 text-center text-white">
        <div>
          <p className="text-[7px] uppercase tracking-[0.28em] text-[#a13847]">
            ProVN Account
          </p>

          <h1 className="mt-4 text-[42px] font-black tracking-[-0.05em]">
            Account settings unavailable.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-flex h-[46px] items-center rounded-full border border-[#762633] bg-[#12070a] px-7 text-[8px] font-semibold uppercase tracking-[0.16em]"
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
            textarea {
              cursor: text !important;
            }
          }

          html,
          body {
            background: #020203;
          }

          .settings-premium-panel {
            --settings-rx: 0deg;
            --settings-ry: 0deg;
            --settings-lift: 0px;
            --settings-mx: 50%;
            --settings-my: 50%;
            --settings-depth: 0px;

            position: relative;
            isolation: isolate;

            transform:
              perspective(1250px)
              translate3d(
                0,
                var(--settings-lift),
                0
              )
              rotateX(
                var(--settings-rx)
              )
              rotateY(
                var(--settings-ry)
              );

            transform-style:
              preserve-3d;

            will-change:
              transform;

            box-shadow:
              0 24px 70px
              rgba(0,0,0,.16);
          }

          .settings-premium-panel:hover {
            border-color:
              rgba(111,38,51,.82);

            box-shadow:
              0 35px 95px
              rgba(0,0,0,.35),
              0 0 48px
              rgba(146,22,42,.065);
          }

          .settings-panel-content {
            position: relative;
            z-index: 4;

            transform:
              translateZ(
                var(--settings-depth)
              );

            transition:
              transform
              260ms
              cubic-bezier(.16,1,.3,1);
          }

          .settings-pointer-light {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 2;
            border-radius: inherit;
            opacity: 0;

            background:
              radial-gradient(
                circle
                at
                var(--settings-mx)
                var(--settings-my),
                rgba(255,255,255,.065),
                rgba(212,53,75,.026) 21%,
                transparent 49%
              );

            transition:
              opacity 220ms ease;
          }

          .settings-premium-panel:hover
          .settings-pointer-light {
            opacity: 1;
          }

          .settings-edge-light {
            position: absolute;
            inset: 0;
            z-index: 3;
            pointer-events: none;
            border-radius: inherit;
            opacity: 0;

            box-shadow:
              inset 0 1px 0
              rgba(255,255,255,.06),
              inset 0 -1px 0
              rgba(191,48,68,.025);

            transition:
              opacity 220ms ease;
          }

          .settings-premium-panel:hover
          .settings-edge-light {
            opacity: 1;
          }

          .settings-sheen {
            position: absolute;
            z-index: 3;
            pointer-events: none;
            top: -90%;
            left: -45%;
            height: 280%;
            width: 15%;
            opacity: 0;
            transform: rotate(17deg);

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.025),
                rgba(255,255,255,.068),
                rgba(255,255,255,.018),
                transparent
              );
          }

          .settings-premium-panel:hover
          .settings-sheen {
            animation:
              settingsSheen
              880ms
              cubic-bezier(.16,1,.3,1)
              1
              both;
          }

          .settings-field {
            transition:
              border-color 220ms ease,
              background-color 220ms ease,
              box-shadow 220ms ease,
              transform 220ms ease;
          }

          .settings-field:hover {
            border-color:
              rgba(102,37,49,.72);
          }

          .settings-field:focus {
            border-color:
              rgba(190,56,75,.80);

            background:
              #0b0608;

            transform:
              translateY(-1px);

            box-shadow:
              0 0 0 3px
              rgba(154,28,46,.07),
              0 0 30px
              rgba(128,18,37,.07);
          }

          .settings-button {
            position: relative;
            overflow: hidden;
          }

          .settings-button::after {
            content: "";

            position: absolute;
            top: -80%;
            left: -42%;
            width: 18%;
            height: 260%;

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

          .settings-button:not(:disabled):hover::after {
            left: 128%;
          }

          .always-glow {
            box-shadow:
              inset 0 1px 0
              rgba(255,255,255,.04),
              0 0 20px
              rgba(157,28,46,.09);

            transition:
              transform 220ms
              cubic-bezier(.16,1,.3,1),
              border-color 220ms ease,
              box-shadow 220ms ease;
          }

          .always-glow:hover {
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

          .settings-entry {
            animation:
              settingsEntry
              .55s
              cubic-bezier(.16,1,.3,1)
              both;
          }

          @keyframes settingsSheen {
            0% {
              left: -45%;
              opacity: 0;
            }

            12% {
              opacity: 1;
            }

            100% {
              left: 126%;
              opacity: 0;
            }
          }

          @keyframes settingsEntry {
            from {
              opacity: 0;

              transform:
                translateY(15px);

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

          @keyframes provnEmailVerifiedPulse {
            0% {
              opacity: .75;
              transform: scale(.90);
            }

            70%,
            100% {
              opacity: 0;
              transform: scale(1.20);
            }
          }

          @keyframes provnEmailOtpShake {
            0%,
            100% {
              transform: translateX(0);
            }

            20% {
              transform: translateX(-5px);
            }

            40% {
              transform: translateX(5px);
            }

            60% {
              transform: translateX(-3px);
            }

            80% {
              transform: translateX(3px);
            }
          }

          @keyframes provnEmailScan {
            0% {
              top: 20%;
              opacity: 0;
            }

            18% {
              opacity: .8;
            }

            50% {
              opacity: .45;
            }

            82% {
              opacity: .8;
            }

            100% {
              top: 80%;
              opacity: 0;
            }
          }

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .settings-premium-panel,
            .settings-panel-content {
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

      <main className="relative min-h-screen overflow-x-clip bg-[#020203] text-white">
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              'radial-gradient(circle at 6% 8%,rgba(111,8,28,.11),transparent 28%),radial-gradient(circle at 92% 13%,rgba(94,7,24,.07),transparent 27%),#020203',
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

        <header className="sticky top-0 z-[1000] border-b border-[#43131b]/50 bg-[#020203]/[0.96] shadow-[0_12px_40px_rgba(0,0,0,.25)] backdrop-blur-xl">
          <div className="mx-auto flex h-[78px] max-w-[1450px] items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-5">
              <ProVNLogo />

              <div className="hidden h-[27px] w-px bg-white/[0.055] sm:block" />

              <div className="hidden sm:block">
                <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#963644]">
                  Account Control
                </p>

                <p className="mt-[3px] text-[7px] text-zinc-700">
                  Security & Identity
                </p>
              </div>
            </div>

            <Link
              href={
                profileHref
              }
              className="always-glow group inline-flex h-[43px] min-w-[145px] items-center justify-center gap-3 rounded-full border border-[#722631]/80 bg-[#10070a]/90 px-5 text-[7px] font-semibold uppercase tracking-[0.16em] text-zinc-300"
            >
              <span className="text-[#ce4153]">
                <ArrowLeftIcon />
              </span>

              Back to Profile
            </Link>
          </div>
        </header>

        {/* CONTENT */}

        <div className="settings-entry relative z-10 mx-auto max-w-[1320px] px-6 pb-24 pt-12 lg:px-10 lg:pt-14">
          <div className="mb-9">
            <div className="flex items-center gap-3">
              <span className="h-px w-[34px] bg-[#7d2937]" />

              <p className="text-[7px] font-semibold uppercase tracking-[0.28em] text-[#963644]">
                Account Settings
              </p>
            </div>

            <h1 className="mt-5 text-[46px] font-black tracking-[-0.055em] sm:text-[60px]">
              Control your account.
            </h1>

            <p className="mt-5 max-w-[700px] text-[11px] leading-6 text-zinc-600">
              Manage authentication, security and login information without changing your gaming verification, proof or reputation.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* LEFT */}

            <div className="space-y-6">
              <PremiumPanel
                maxTilt={5}
                lift={8}
                depth={14}
                className="rounded-[25px] border border-[#5c212c]/65 bg-[#070708]/92 p-6"
              >
                <p className="text-[7px] uppercase tracking-[0.25em] text-[#963644]">
                  Account Identity
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="relative flex h-[78px] w-[78px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-[#722733]/85 bg-gradient-to-br from-[#40121b] via-[#17090d] to-[#070708]">
                    {profile
                      .avatar_url ? (
                      <img
                        src={
                          profile
                            .avatar_url
                        }
                        alt={
                          displayName
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[23px] font-black tracking-[-0.045em] text-[#df4a5e]">
                        {initials}
                      </span>
                    )}

                    <span className="pointer-events-none absolute inset-[5px] rounded-[17px] border border-white/[0.035]" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-[18px] font-bold tracking-[-0.03em]">
                      {displayName}
                    </h2>

                    <p className="mt-2 text-[10px] font-semibold text-[#d74256]">
                      @{profile.username}
                    </p>

                    <div className="mt-3">
                      <StatusPill>
                        Account Active
                      </StatusPill>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.05] pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[6px] uppercase tracking-[0.18em] text-zinc-800">
                        ProVN ID
                      </p>

                      <p className="mt-2 text-[9px] font-semibold text-zinc-500">
                        PVN {profileCode}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        copyProfileId
                      }
                      className="flex h-[32px] items-center gap-2 rounded-[9px] border border-white/[0.055] bg-black/20 px-3 text-[7px] text-zinc-600 transition hover:border-[#63232e] hover:text-zinc-300"
                    >
                      <CopyIcon />

                      {copied
                        ? 'Copied'
                        : 'Copy'}
                    </button>
                  </div>

                  {joined && (
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[7px] uppercase tracking-[0.15em] text-zinc-800">
                        Account Since
                      </span>

                      <span className="text-[8px] text-zinc-600">
                        {joined}
                      </span>
                    </div>
                  )}
                </div>
              </PremiumPanel>

              <PremiumPanel
                maxTilt={5}
                lift={8}
                depth={14}
                className="rounded-[25px] border border-white/[0.05] bg-[#070708]/88 p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[7px] uppercase tracking-[0.25em] text-[#963644]">
                    Identity Rules
                  </p>

                  <span className="flex h-[35px] w-[35px] items-center justify-center rounded-[11px] border border-[#59212b]/65 bg-[#11070a] text-[#b83c4e]">
                    <ShieldIcon />
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-[8px] font-medium text-zinc-400">
                      Username
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-zinc-300">
                        @{profile.username}
                      </p>

                      <StatusPill tone="locked">
                        Locked
                      </StatusPill>
                    </div>

                    <p className="mt-3 text-[7px] leading-4 text-zinc-700">
                      Your username is part of your ProVN identity and public profile URL.
                    </p>
                  </div>

                  <div className="h-px bg-white/[0.045]" />

                  <div>
                    <p className="text-[8px] font-medium text-zinc-400">
                      Email Ownership
                    </p>

                    <div className="mt-2">
                      <StatusPill
                        tone={
                          emailVerified
                            ? 'good'
                            : 'default'
                        }
                      >
                        {emailVerified
                          ? 'Verified'
                          : 'Pending'}
                      </StatusPill>
                    </div>

                    <p className="mt-3 text-[7px] leading-4 text-zinc-700">
                      Email ownership verifies account access only. It does not verify game accounts or performance.
                    </p>
                  </div>
                </div>
              </PremiumPanel>
            </div>

            {/* RIGHT */}

            <div className="space-y-6">

              {/* LOGIN IDENTITY */}

              <PremiumPanel
                maxTilt={3}
                lift={7}
                depth={11}
                className="rounded-[27px] border border-[#5d222c]/60 bg-[#070708]/92 p-6 sm:p-8"
              >
                <SectionHeading
                  icon={
                    <UserIcon />
                  }
                  eyebrow="Account"
                  title="Login identity."
                  description="Authentication details remain separate from your public gaming identity."
                />

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[16px] border border-white/[0.05] bg-black/20 p-5">
                    <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                      Username
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[11px] font-semibold text-zinc-300">
                        @{profile.username}
                      </p>

                      <span className="text-zinc-700">
                        <LockIcon />
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[16px] border border-white/[0.05] bg-black/20 p-5">
                    <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                      Email
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <p className="truncate text-[11px] font-semibold text-zinc-300">
                        {currentEmail}
                      </p>

                      {emailVerified && (
                        <span className="text-emerald-500">
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </PremiumPanel>

              {/* EMAIL */}

              <PremiumPanel
                maxTilt={3}
                lift={8}
                depth={12}
                className="rounded-[27px] border border-[#5d222c]/60 bg-[#070708]/92 p-6 sm:p-8"
              >
                <SectionHeading
                  icon={
                    <MailIcon />
                  }
                  eyebrow="Email Security"
                  title={
                    emailStage ===
                    'otp'
                      ? 'Verify new email.'
                      : emailStage ===
                          'success'
                        ? 'Email updated.'
                        : 'Change email address.'
                  }
                  description={
                    emailStage ===
                    'otp'
                      ? 'Complete the same six-digit ProVN verification flow used when an identity is created.'
                      : emailStage ===
                          'success'
                        ? 'Your verified sign-in email has been updated successfully.'
                        : 'Your password is required first. ProVN then sends a six-digit verification code to the new email address.'
                  }
                />

                {emailStage ===
                  'form' && (
                  <>
                    <div className="mt-6 rounded-[16px] border border-[#55212a]/55 bg-[#10070a]/55 p-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-[1px] flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border border-[#672631]/70 text-[#bf3c4e]">
                          <ShieldIcon />
                        </span>

                        <div>
                          <p className="text-[8px] font-semibold text-zinc-400">
                            Protected email change
                          </p>

                          <p className="mt-2 text-[7px] leading-4 text-zinc-700">
                            Your current password is checked first. Your sign-in email changes only after the six-digit code sent to the new address is verified.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form
                      onSubmit={
                        handleEmailChange
                      }
                      className="mt-7"
                    >
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="newEmail"
                            className="text-[7px] font-semibold uppercase tracking-[0.17em] text-zinc-600"
                          >
                            New Email
                          </label>

                          <input
                            id="newEmail"
                            type="email"
                            autoComplete="email"
                            data-writing-field="true"
                            value={
                              newEmail
                            }
                            onChange={
                              event => {
                                setNewEmail(
                                  event
                                    .target
                                    .value
                                )

                                setEmailError(
                                  null
                                )
                              }
                            }
                            placeholder="new@email.com"
                            className="settings-field mt-3 h-[53px] w-full rounded-[14px] border border-white/[0.065] bg-black/25 px-4 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-800"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="emailPassword"
                            className="text-[7px] font-semibold uppercase tracking-[0.17em] text-zinc-600"
                          >
                            Current Password
                          </label>

                          <input
                            id="emailPassword"
                            type="password"
                            autoComplete="current-password"
                            data-writing-field="true"
                            value={
                              emailPassword
                            }
                            onChange={
                              event => {
                                setEmailPassword(
                                  event
                                    .target
                                    .value
                                )

                                setEmailError(
                                  null
                                )
                              }
                            }
                            placeholder="••••••••"
                            className="settings-field mt-3 h-[53px] w-full rounded-[14px] border border-white/[0.065] bg-black/25 px-4 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-800"
                          />
                        </div>
                      </div>

                      {emailError && (
                        <div className="mt-5 rounded-[13px] border border-red-900/40 bg-red-950/[0.09] px-4 py-3 text-[8px] text-[#d95567]">
                          {emailError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={
                          emailSaving
                        }
                        className="settings-button mt-6 inline-flex h-[48px] min-w-[180px] items-center justify-center gap-5 rounded-[13px] border border-[#c43b50] bg-gradient-to-r from-[#831126] to-[#c5273e] px-6 text-[7px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_38px_rgba(103,10,27,.20)] transition hover:-translate-y-[2px] hover:border-[#ee5669] disabled:translate-y-0 disabled:opacity-50"
                      >
                        <span className="relative z-[2]">
                          {emailSaving
                            ? 'Sending Code...'
                            : 'Change Email'}
                        </span>

                        {!emailSaving && (
                          <span className="relative z-[2]">
                            <ArrowRightIcon />
                          </span>
                        )}
                      </button>
                    </form>
                  </>
                )}

                {emailStage ===
                  'otp' && (
                  <div className="mt-7 animate-[settingsEntry_.55s_cubic-bezier(.16,1,.3,1)_both]">
                    <EmailOtpVerification
                      email={
                        pendingEmail
                      }
                      onVerify={
                        verifyEmailOtp
                      }
                      onResend={
                        resendEmailOtp
                      }
                      onVerified={
                        finishEmailVerification
                      }
                    />

                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={
                          resetEmailChange
                        }
                        className="h-[38px] rounded-[10px] border border-white/[0.05] bg-black/20 px-4 text-[7px] font-semibold uppercase tracking-[0.14em] text-zinc-700 transition hover:border-[#5c222d]/70 hover:text-zinc-400"
                      >
                        Use Different Email
                      </button>
                    </div>
                  </div>
                )}

                {emailStage ===
                  'success' && (
                  <div className="mt-7 animate-[settingsEntry_.55s_cubic-bezier(.16,1,.3,1)_both]">
                    <div className="rounded-[18px] border border-emerald-900/30 bg-emerald-950/[0.055] p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <span className="relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] border border-emerald-900/40 bg-emerald-950/[0.12] text-emerald-500">
                          <span className="absolute inset-[-7px] animate-[provnEmailVerifiedPulse_1.45s_ease-out_infinite] rounded-[18px] border border-emerald-500/10" />

                          <CheckIcon />
                        </span>

                        <div>
                          <p className="text-[9px] font-semibold text-emerald-500">
                            Email verified successfully.
                          </p>

                          <p className="mt-2 text-[8px] leading-5 text-zinc-600">
                            Your ProVN sign-in email is now{' '}
                            <span className="font-semibold text-zinc-400">
                              {currentEmail}
                            </span>
                            .
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        resetEmailChange
                      }
                      className="mt-6 inline-flex h-[43px] items-center rounded-[11px] border border-[#6e2632]/75 bg-[#11070a] px-5 text-[7px] font-semibold uppercase tracking-[0.14em] text-zinc-400 transition hover:border-[#b2394b] hover:text-white"
                    >
                      Change Another Email
                    </button>
                  </div>
                )}
              </PremiumPanel>

              {/* PASSWORD */}

              <PremiumPanel
                maxTilt={3}
                lift={8}
                depth={12}
                className="rounded-[27px] border border-[#5d222c]/60 bg-[#070708]/92 p-6 sm:p-8"
              >
                <SectionHeading
                  icon={
                    <KeyIcon />
                  }
                  eyebrow="Password"
                  title="Update password."
                  description="Confirm your existing password before replacing it with a strong new credential."
                />

                <form
                  onSubmit={
                    handlePasswordChange
                  }
                  className="mt-8"
                >
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="text-[7px] font-semibold uppercase tracking-[0.17em] text-zinc-600"
                    >
                      Current Password
                    </label>

                    <input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      value={
                        currentPassword
                      }
                      onChange={
                        event => {
                          setCurrentPassword(
                            event
                              .target
                              .value
                          )

                          setPasswordError(
                            null
                          )

                          setPasswordMessage(
                            null
                          )
                        }
                      }
                      placeholder="••••••••"
                      className="settings-field mt-3 h-[53px] w-full rounded-[14px] border border-white/[0.065] bg-black/25 px-4 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-800"
                    />
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="text-[7px] font-semibold uppercase tracking-[0.17em] text-zinc-600"
                      >
                        New Password
                      </label>

                      <input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        value={
                          newPassword
                        }
                        onChange={
                          event => {
                            setNewPassword(
                              event
                                .target
                                .value
                            )

                            setPasswordError(
                              null
                            )

                            setPasswordMessage(
                              null
                            )
                          }
                        }
                        placeholder="••••••••"
                        className="settings-field mt-3 h-[53px] w-full rounded-[14px] border border-white/[0.065] bg-black/25 px-4 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-800"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="text-[7px] font-semibold uppercase tracking-[0.17em] text-zinc-600"
                      >
                        Confirm New Password
                      </label>

                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={
                          confirmPassword
                        }
                        onChange={
                          event => {
                            setConfirmPassword(
                              event
                                .target
                                .value
                            )

                            setPasswordError(
                              null
                            )

                            setPasswordMessage(
                              null
                            )
                          }
                        }
                        placeholder="••••••••"
                        className="settings-field mt-3 h-[53px] w-full rounded-[14px] border border-white/[0.065] bg-black/25 px-4 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-[14px] border border-white/[0.05] bg-black/20 p-4">
                    <p className="text-[7px] uppercase tracking-[0.15em] text-zinc-700">
                      Password Standard
                    </p>

                    <p className="mt-2 text-[8px] leading-4 text-zinc-600">
                      8+ characters · uppercase · lowercase · number · symbol
                    </p>
                  </div>

                  {passwordError && (
                    <div className="mt-5 rounded-[13px] border border-red-900/40 bg-red-950/[0.09] px-4 py-3 text-[8px] text-[#d95567]">
                      {passwordError}
                    </div>
                  )}

                  {passwordMessage && (
                    <div className="mt-5 rounded-[13px] border border-emerald-900/30 bg-emerald-950/[0.06] px-4 py-3 text-[8px] text-emerald-500">
                      {passwordMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      passwordSaving
                    }
                    className="settings-button mt-6 inline-flex h-[48px] min-w-[190px] items-center justify-center gap-5 rounded-[13px] border border-[#c43b50] bg-gradient-to-r from-[#831126] to-[#c5273e] px-6 text-[7px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_38px_rgba(103,10,27,.20)] transition hover:-translate-y-[2px] hover:border-[#ee5669] disabled:translate-y-0 disabled:opacity-50"
                  >
                    <span className="relative z-[2]">
                      {passwordSaving
                        ? 'Updating...'
                        : 'Change Password'}
                    </span>

                    {!passwordSaving && (
                      <span className="relative z-[2]">
                        <ArrowRightIcon />
                      </span>
                    )}
                  </button>
                </form>
              </PremiumPanel>

              {/* SESSIONS */}

              <PremiumPanel
                maxTilt={3}
                lift={8}
                depth={12}
                className="rounded-[27px] border border-[#5d222c]/60 bg-[#070708]/92 p-6 sm:p-8"
              >
                <SectionHeading
                  icon={
                    <DevicesIcon />
                  }
                  eyebrow="Sessions"
                  title="Session control."
                  description="Remove access from other devices or end the session on this device."
                />

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-white/[0.05] bg-black/20 p-5 transition hover:border-[#57202a]/65 hover:bg-[#0c0608]">
                    <p className="text-[8px] font-semibold text-zinc-300">
                      Other devices
                    </p>

                    <p className="mt-3 text-[8px] leading-5 text-zinc-700">
                      End every other active ProVN session while keeping this device signed in.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleSignOutOthers
                      }
                      disabled={
                        sessionsSaving
                      }
                      className="mt-5 inline-flex h-[41px] items-center rounded-[11px] border border-[#6e2632]/75 bg-[#11070a] px-5 text-[7px] font-semibold uppercase tracking-[0.14em] text-zinc-400 transition hover:border-[#b2394b] hover:text-white disabled:opacity-50"
                    >
                      {sessionsSaving
                        ? 'Signing Out...'
                        : 'Sign Out Other Devices'}
                    </button>
                  </div>

                  <div className="rounded-[18px] border border-white/[0.05] bg-black/20 p-5 transition hover:border-[#57202a]/65 hover:bg-[#0c0608]">
                    <p className="text-[8px] font-semibold text-zinc-300">
                      This device
                    </p>

                    <p className="mt-3 text-[8px] leading-5 text-zinc-700">
                      End your current session and return to the ProVN homepage.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="mt-5 inline-flex h-[41px] items-center rounded-[11px] border border-[#6e2632]/75 bg-[#11070a] px-5 text-[7px] font-semibold uppercase tracking-[0.14em] text-[#bd4051] transition hover:border-[#c03c4f] hover:bg-[#17090d]"
                    >
                      Log Out
                    </button>
                  </div>
                </div>

                {sessionMessage && (
                  <div className="mt-5 rounded-[13px] border border-[#502029]/60 bg-black/20 px-4 py-3 text-[8px] text-zinc-500">
                    {sessionMessage}
                  </div>
                )}
              </PremiumPanel>

              {/* DELETE */}

              <PremiumPanel
                maxTilt={2.5}
                lift={7}
                depth={10}
                className="rounded-[27px] border border-[#5c1b25]/70 bg-[linear-gradient(145deg,#0a0406,#070708)] p-6 sm:p-8"
              >
                <SectionHeading
                  icon={
                    <TrashIcon />
                  }
                  eyebrow="Danger Zone"
                  title="Delete account."
                  description="Permanently remove your ProVN authentication identity and linked public profile."
                />

                {!deleteOpen ? (
                  <div className="mt-8 flex flex-col gap-5 rounded-[18px] border border-[#5a1d27]/55 bg-[#100508]/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[9px] font-semibold text-zinc-300">
                        Permanent deletion
                      </p>

                      <p className="mt-2 max-w-[520px] text-[8px] leading-5 text-zinc-700">
                        This action cannot be undone. Do not use this control unless you intend to permanently remove the account.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        () =>
                          setDeleteOpen(
                            true
                          )
                      }
                      className="h-[43px] shrink-0 rounded-[12px] border border-red-900/50 bg-red-950/[0.13] px-5 text-[7px] font-bold uppercase tracking-[0.14em] text-red-500 transition hover:border-red-700/70 hover:bg-red-950/[0.20]"
                    >
                      Delete Account
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={
                      handleDeleteAccount
                    }
                    className="mt-8 rounded-[19px] border border-red-900/45 bg-red-950/[0.06] p-5"
                  >
                    <p className="text-[9px] font-semibold text-red-400">
                      Final confirmation
                    </p>

                    <p className="mt-3 text-[8px] leading-5 text-zinc-700">
                      Type{' '}
                      <span className="font-semibold text-zinc-400">
                        {profile.username}
                      </span>{' '}
                      and enter your current password.
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        value={
                          deleteUsername
                        }
                        onChange={
                          event => {
                            setDeleteUsername(
                              event
                                .target
                                .value
                            )

                            setDeleteError(
                              null
                            )
                          }
                        }
                        placeholder={`Type ${profile.username}`}
                        className="settings-field h-[50px] rounded-[13px] border border-red-950/70 bg-black/30 px-4 text-[10px] text-zinc-300 outline-none placeholder:text-zinc-800"
                      />

                      <input
                        type="password"
                        autoComplete="current-password"
                        value={
                          deletePassword
                        }
                        onChange={
                          event => {
                            setDeletePassword(
                              event
                                .target
                                .value
                            )

                            setDeleteError(
                              null
                            )
                          }
                        }
                        placeholder="Current password"
                        className="settings-field h-[50px] rounded-[13px] border border-red-950/70 bg-black/30 px-4 text-[10px] text-zinc-300 outline-none placeholder:text-zinc-800"
                      />
                    </div>

                    {deleteError && (
                      <p className="mt-4 text-[8px] text-red-500">
                        {deleteError}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={
                          deleting
                        }
                        className="h-[43px] rounded-[11px] border border-red-700/65 bg-red-950/[0.22] px-5 text-[7px] font-bold uppercase tracking-[0.15em] text-red-400 transition hover:bg-red-950/[0.35] disabled:opacity-50"
                      >
                        {deleting
                          ? 'Deleting...'
                          : 'Permanently Delete'}
                      </button>

                      <button
                        type="button"
                        onClick={
                          () => {
                            setDeleteOpen(
                              false
                            )

                            setDeleteUsername(
                              ''
                            )

                            setDeletePassword(
                              ''
                            )

                            setDeleteError(
                              null
                            )
                          }
                        }
                        className="h-[43px] rounded-[11px] border border-white/[0.05] bg-black/20 px-5 text-[7px] font-semibold uppercase tracking-[0.15em] text-zinc-600 transition hover:text-zinc-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </PremiumPanel>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}