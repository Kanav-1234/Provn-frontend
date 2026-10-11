'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  createClient,
} from '@/lib/supabase/client'

/* =========================================================
   TYPES
========================================================= */

type UsernameState =
  | 'idle'
  | 'checking'
  | 'available'
  | 'taken'
  | 'invalid'
  | 'error'

type SignupStep =
  | 'form'
  | 'otp'

const PENDING_SIGNUP_EMAIL_KEY =
  'provn.pending-signup-email'

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

const PROVN_CURSOR =
  `url("data:image/svg+xml,${encodeURIComponent(
    provnCursorSvg
  )}") 1 1, auto`

/* =========================================================
   PROVN MARK
========================================================= */

function ProVNMark({
  id,
  className = '',
}: {
  id: string
  className?: string
}) {
  const main =
    `${id}-main`

  const top =
    `${id}-top`

  const edge =
    `${id}-edge`

  return (
    <svg
      viewBox="0 0 58 58"
      aria-hidden="true"
      className={`h-[46px] w-[46px] shrink-0 overflow-visible ${className}`}
    >
      <defs>
        <linearGradient
          id={main}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#ffb7bd"
          />

          <stop
            offset="12%"
            stopColor="#fa7080"
          />

          <stop
            offset="31%"
            stopColor="#d13249"
          />

          <stop
            offset="53%"
            stopColor="#881321"
          />

          <stop
            offset="74%"
            stopColor="#b51d33"
          />

          <stop
            offset="100%"
            stopColor="#260408"
          />
        </linearGradient>

        <linearGradient
          id={top}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor="#72101b"
          />

          <stop
            offset="34%"
            stopColor="#e34759"
          />

          <stop
            offset="58%"
            stopColor="#ffc0c6"
          />

          <stop
            offset="100%"
            stopColor="#650a15"
          />
        </linearGradient>

        <linearGradient
          id={edge}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#ffe5e8"
          />

          <stop
            offset="35%"
            stopColor="#ff6071"
          />

          <stop
            offset="100%"
            stopColor="#620714"
          />
        </linearGradient>
      </defs>

      <path
        d="M4.5 8.5 H39 L52 17.5 L44.5 20.5 H16.2 L8.7 15.3 Z"
        fill={`url(#${top})`}
        stroke={`url(#${edge})`}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      <path
        d="M11.2 21.5 H37.6 C46.5 21.5 52.5 26.3 52.5 33 C52.5 40.4 46.8 45.4 37.6 45.4 H26.4 V36.9 H37.1 C40.9 36.9 43.4 35.2 43.4 32.8 C43.4 30.3 40.9 28.6 37.1 28.6 H23.6 V43.5 L12 55 Z"
        fill={`url(#${main})`}
        stroke={`url(#${edge})`}
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
        stroke="#ffe1e5"
        strokeOpacity=".67"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <path
        d="M43.8 22.7 C49 24.8 51 28.2 51 32.8 C51 38.8 46.4 43.3 38.6 43.7"
        fill="none"
        stroke="#ff4059"
        strokeOpacity=".72"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* =========================================================
   HEADER LOGO
========================================================= */

function ProVNLogo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center"
    >
      <span className="relative transition-transform duration-300 group-hover:scale-[1.07]">
        <span className="pointer-events-none absolute inset-[5px] rounded-full bg-[#d92340]/25 opacity-0 blur-[16px] transition-opacity duration-300 group-hover:opacity-100" />

        <ProVNMark
          id="signup-header-logo"
          className="relative z-10 drop-shadow-[0_0_11px_rgba(229,41,65,.26)]"
        />
      </span>

      <span className="-ml-[4px] translate-y-[4px] text-[22px] font-black leading-none tracking-[-0.055em]">
        <span className="text-[#f5f2f2]">
          ro
        </span>

        <span className="text-[#ed2744]">
          VN
        </span>
      </span>
    </Link>
  )
}

/* =========================================================
   EYE
========================================================= */

function EyeIcon({
  open,
}: {
  open: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
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

/* =========================================================
   IDENTITY VISUAL
========================================================= */

function IdentityVisual() {
  return (
    <div className="identity-visual relative mt-8 h-[235px] overflow-hidden rounded-[24px] border border-white/[0.065] bg-black/25">

      <div className="pointer-events-none absolute left-[-95px] top-1/2 h-[230px] w-[230px] -translate-y-1/2 rounded-full border border-[#711521]/20" />

      <div className="pointer-events-none absolute left-[-50px] top-1/2 h-[165px] w-[165px] -translate-y-1/2 rounded-full border border-[#711521]/22" />

      <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c1b2a]/31" />

      <div className="absolute left-1/2 top-1/2 h-[145px] w-[145px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9e2435]/37" />

      <div className="absolute left-1/2 top-1/2 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b32a3d]/46" />

      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#7b1b29]/45 to-transparent" />

      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-[#7b1b29]/42 to-transparent" />

      <div className="identity-core absolute left-1/2 top-1/2 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#a6293a]/60 bg-[#080406] shadow-[0_0_70px_rgba(184,28,51,.20)]">
        <div className="scale-[.78]">
          <ProVNMark id="signup-core" />
        </div>
      </div>

      <span className="absolute left-[59%] top-[17%] h-[7px] w-[7px] rounded-full bg-[#f32b49] shadow-[0_0_16px_rgba(243,43,73,.9)]" />

      <span className="absolute left-[69%] top-[43%] h-[5px] w-[5px] rounded-full bg-[#e92d48] shadow-[0_0_13px_rgba(233,45,72,.8)]" />

      <div className="visual-chip absolute left-5 top-5 rounded-[13px] border border-white/[0.065] bg-black/50 px-4 py-3">

        <p className="text-[6px] uppercase tracking-[0.28em] text-zinc-700">
          Identity
        </p>

        <p className="mt-1 text-[10px] font-bold text-zinc-300">
          PRIVATE
        </p>
      </div>

      <div className="visual-chip absolute right-5 top-5 rounded-[13px] border border-white/[0.065] bg-black/50 px-4 py-3">

        <p className="text-[6px] uppercase tracking-[0.28em] text-zinc-700">
          Username
        </p>

        <p className="mt-1 text-[10px] font-bold text-zinc-300">
          UNIQUE
        </p>
      </div>

      <div className="visual-chip absolute bottom-5 right-5 rounded-[13px] border border-white/[0.065] bg-black/50 px-4 py-3">

        <p className="text-[6px] uppercase tracking-[0.28em] text-zinc-700">
          Proof
        </p>

        <p className="mt-1 text-[10px] font-bold text-zinc-300">
          EARNED
        </p>
      </div>

      <div className="absolute bottom-5 left-5 flex items-center gap-2 text-[6px] uppercase tracking-[0.27em] text-[#792333]">

        <span className="h-[5px] w-[5px] rounded-full bg-[#d62c46]" />

        Identity Network
      </div>
    </div>
  )
}

/* =========================================================
   PAGE
========================================================= */

export default function SignupPage() {
  const router =
    useRouter()

  const supabase =
    useMemo(
      () => createClient(),
      []
    )

  const [
    step,
    setStep,
  ] =
    useState<SignupStep>(
      'form'
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
    usernameState,
    setUsernameState,
  ] =
    useState<UsernameState>(
      'idle'
    )

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

  /* OTP */

  const [
    otpEmail,
    setOtpEmail,
  ] =
    useState('')

  const [
    otp,
    setOtp,
  ] =
    useState([
      '',
      '',
      '',
      '',
      '',
      '',
    ])

  const [
    otpLoading,
    setOtpLoading,
  ] =
    useState(false)

  const [
    otpError,
    setOtpError,
  ] =
    useState('')

  const [
    verified,
    setVerified,
  ] =
    useState(false)

  const [
    resendSeconds,
    setResendSeconds,
  ] =
    useState(45)

  const otpRefs =
    useRef<
      Array<HTMLInputElement | null>
    >([])

  /* =======================================================
     VALIDATION
  ======================================================= */

  const cleanedUsername =
    useMemo(
      () =>
        username
          .trim()
          .toLowerCase()
          .replace(/^@/, ''),
      [username]
    )

  const cleanedEmail =
    useMemo(
      () =>
        email
          .trim()
          .toLowerCase(),
      [email]
    )

  const usernameFormatValid =
    /^[a-z0-9._]{3,20}$/.test(
      cleanedUsername
    )

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      cleanedEmail
    )

  const passwordRules = {
    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(
        password
      ),

    lowercase:
      /[a-z]/.test(
        password
      ),

    number:
      /\d/.test(
        password
      ),
  }

  const passwordValid =
    Object
      .values(
        passwordRules
      )
      .every(Boolean)

  const canSubmit =
    fullName
      .trim()
      .length >= 2 &&
    usernameFormatValid &&
    usernameState ===
      'available' &&
    emailValid &&
    passwordValid &&
    !loading

  /* =======================================================
     WHOLE SIGNUP RECTANGLE 3D MOVEMENT
  ======================================================= */

  function handleShellMove(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    const shell =
      event.currentTarget

    const rect =
      shell
        .getBoundingClientRect()

    const x =
      event.clientX -
      rect.left

    const y =
      event.clientY -
      rect.top

    const normalX =
      x / rect.width

    const normalY =
      y / rect.height

    /*
      Same premium effect as login.

      Left  ~= -5 degrees
      Right ~= +5 degrees
    */

    const rotateY =
      (normalX - 0.5) *
      10

    const rotateX =
      (0.5 - normalY) *
      6

    const shadowX =
      (0.5 - normalX) *
      28

    const shadowY =
      18 +
      (0.5 - normalY) *
        10

    shell.style.setProperty(
      '--shell-rx',
      `${rotateX}deg`
    )

    shell.style.setProperty(
      '--shell-ry',
      `${rotateY}deg`
    )

    shell.style.setProperty(
      '--shell-mx',
      `${x}px`
    )

    shell.style.setProperty(
      '--shell-my',
      `${y}px`
    )

    shell.style.setProperty(
      '--shell-shadow-x',
      `${shadowX}px`
    )

    shell.style.setProperty(
      '--shell-shadow-y',
      `${shadowY}px`
    )
  }

  function resetShell(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    const shell =
      event.currentTarget

    shell.style.setProperty(
      '--shell-rx',
      '0deg'
    )

    shell.style.setProperty(
      '--shell-ry',
      '0deg'
    )

    shell.style.setProperty(
      '--shell-mx',
      '50%'
    )

    shell.style.setProperty(
      '--shell-my',
      '50%'
    )

    shell.style.setProperty(
      '--shell-shadow-x',
      '0px'
    )

    shell.style.setProperty(
      '--shell-shadow-y',
      '18px'
    )
  }

  /* =======================================================
     USERNAME AVAILABILITY
  ======================================================= */

  useEffect(() => {
    if (!cleanedUsername) {
      setUsernameState(
        'idle'
      )

      return
    }

    if (!usernameFormatValid) {
      setUsernameState(
        'invalid'
      )

      return
    }

    let cancelled =
      false

    setUsernameState(
      'checking'
    )

    const timer =
      window.setTimeout(
        async () => {
          const {
            data,
            error:
              availabilityError,
          } =
            await supabase.rpc(
              'is_username_available',
              {
                p_username:
                  cleanedUsername,
              }
            )

          if (cancelled) {
            return
          }

          if (
            availabilityError
          ) {
            console.error(
              'Username availability failed:',
              availabilityError
            )

            setUsernameState(
              'error'
            )

            return
          }

          setUsernameState(
            data
              ? 'available'
              : 'taken'
          )
        },
        400
      )

    return () => {
      cancelled = true

      window.clearTimeout(
        timer
      )
    }
  }, [
    cleanedUsername,
    usernameFormatValid,
    supabase,
  ])

  /* =======================================================
     OTP TIMER
  ======================================================= */

  useEffect(() => {
    if (
      step !== 'otp' ||
      resendSeconds <= 0
    ) {
      return
    }

    const timer =
      window.setInterval(
        () => {
          setResendSeconds(
            current =>
              Math.max(
                current - 1,
                0
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
    step,
    resendSeconds,
  ])

  /* =======================================================
     SIGNUP
  ======================================================= */

  async function handleSignup(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError('')

    if (
      fullName
        .trim()
        .length < 2
    ) {
      setError(
        'Enter your full name.'
      )

      return
    }

    if (!usernameFormatValid) {
      setError(
        'Username must be 3–20 characters using lowercase letters, numbers, dots or underscores.'
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

    if (!emailValid) {
      setError(
        'Enter a valid email address.'
      )

      return
    }

    if (!passwordValid) {
      setError(
        'Create a stronger password before continuing.'
      )

      return
    }

    setLoading(true)

    try {
      const {
        data,
        error:
          signupError,
      } =
        await supabase
          .auth
          .signUp({
            email:
              cleanedEmail,

            password,

            options: {
              data: {
                full_name:
                  fullName
                    .trim(),

                username:
                  cleanedUsername,
              },
            },
          })

      if (signupError) {
        const message =
          signupError
            .message
            .toLowerCase()

        if (
          message.includes(
            'already'
          ) ||
          message.includes(
            'registered'
          )
        ) {
          setError(
            'An account already exists with this email.'
          )
        } else {
          setError(
            signupError
              .message ||
              'Could not create your ProVN identity.'
          )
        }

        return
      }

      /*
        If confirmation is disabled,
        signUp can create a session.

        End it and move to login.
      */

      if (data.session) {
        await supabase
          .auth
          .signOut()

        window
          .sessionStorage
          .removeItem(
            PENDING_SIGNUP_EMAIL_KEY
          )

        window
          .sessionStorage
          .setItem(
            'provn.just-verified',
            '1'
          )

        router.replace(
          '/login'
        )

        router.refresh()

        return
      }

      if (!data.user) {
        setError(
          'Could not create your ProVN identity. Please try again.'
        )

        return
      }

      window
        .sessionStorage
        .setItem(
          PENDING_SIGNUP_EMAIL_KEY,
          cleanedEmail
        )

      setOtpEmail(
        cleanedEmail
      )

      setOtp([
        '',
        '',
        '',
        '',
        '',
        '',
      ])

      setOtpError('')

      setResendSeconds(
        45
      )

      setStep(
        'otp'
      )
    } catch (signupFailure) {
      console.error(
        'ProVN signup failed:',
        signupFailure
      )

      setError(
        'Could not reach ProVN authentication. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  /* =======================================================
     OTP INPUT
  ======================================================= */

  function updateOtp(
    index: number,
    value: string
  ) {
    const digit =
      value
        .replace(
          /\D/g,
          ''
        )
        .slice(-1)

    setOtp(current => {
      const next =
        [...current]

      next[index] =
        digit

      return next
    })

    setOtpError('')

    if (
      digit &&
      index < 5
    ) {
      otpRefs
        .current[
          index + 1
        ]
        ?.focus()
    }
  }

  function handleOtpKeyDown(
    event:
      KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (
      event.key ===
        'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs
        .current[
          index - 1
        ]
        ?.focus()
    }

    if (
      event.key ===
        'ArrowLeft' &&
      index > 0
    ) {
      event.preventDefault()

      otpRefs
        .current[
          index - 1
        ]
        ?.focus()
    }

    if (
      event.key ===
        'ArrowRight' &&
      index < 5
    ) {
      event.preventDefault()

      otpRefs
        .current[
          index + 1
        ]
        ?.focus()
    }
  }

  function handleOtpPaste(
    event:
      ClipboardEvent<HTMLInputElement>
  ) {
    event.preventDefault()

    const digits =
      event
        .clipboardData
        .getData('text')
        .replace(
          /\D/g,
          ''
        )
        .slice(
          0,
          6
        )
        .split('')

    if (!digits.length) {
      return
    }

    const next =
      [
        '',
        '',
        '',
        '',
        '',
        '',
      ]

    digits.forEach(
      (
        digit,
        index
      ) => {
        next[index] =
          digit
      }
    )

    setOtp(next)

    otpRefs
      .current[
        Math.min(
          digits.length,
          5
        )
      ]
      ?.focus()
  }

  /* =======================================================
     VERIFY OTP
  ======================================================= */

  async function verifySignupOtp() {
    const token =
      otp.join('')

    setOtpError('')

    if (
      token.length !== 6
    ) {
      setOtpError(
        'Enter the complete 6-digit verification code.'
      )

      return
    }

    setOtpLoading(true)

    try {
      const {
        data,
        error:
          verifyError,
      } =
        await supabase
          .auth
          .verifyOtp({
            email:
              otpEmail,

            token,

            type:
              'signup',
          })

      if (
        verifyError ||
        !data.user
      ) {
        setOtpError(
          'That verification code is invalid or expired.'
        )

        return
      }

      /*
        OTP verification creates
        a temporary session.

        End it so normal sign-in
        remains separate.
      */

      const {
        error:
          signOutError,
      } =
        await supabase
          .auth
          .signOut()

      if (
        signOutError
      ) {
        console.error(
          'Temporary signup session sign-out failed:',
          signOutError
        )
      }

      window
        .sessionStorage
        .removeItem(
          PENDING_SIGNUP_EMAIL_KEY
        )

      setVerified(true)

      window.setTimeout(
        () => {
          window
            .sessionStorage
            .setItem(
              'provn.just-verified',
              '1'
            )

          router.replace(
            '/login'
          )

          router.refresh()
        },
        1700
      )
    } catch (verifyFailure) {
      console.error(
        'OTP verification failed:',
        verifyFailure
      )

      setOtpError(
        'Could not verify the code. Please try again.'
      )
    } finally {
      setOtpLoading(false)
    }
  }

  async function resendOtp() {
    if (
      resendSeconds > 0
    ) {
      return
    }

    setOtpError('')

    const {
      error:
        resendError,
    } =
      await supabase
        .auth
        .resend({
          type:
            'signup',

          email:
            otpEmail,
        })

    if (resendError) {
      setOtpError(
        'Could not resend the code yet. Try again shortly.'
      )

      return
    }

    setResendSeconds(
      45
    )
  }

  /* =======================================================
     SHARED STYLES
  ======================================================= */

  const pageStyles = `
    @media (pointer: fine) {
      html,
      body,
      body * {
        cursor:
          ${PROVN_CURSOR}
          !important;
      }

      input[data-writing-field="true"],
      textarea[data-writing-field="true"],
      [contenteditable="true"] {
        cursor:
          text
          !important;
      }

      button,
      a,
      select,
      [role="button"] {
        cursor:
          ${PROVN_CURSOR}
          !important;
      }
    }

    @keyframes pageEntry {
      from {
        opacity: 0;

        transform:
          translateY(16px)
          scale(.987);

        filter:
          blur(7px);
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

    @keyframes ringSpin {
      from {
        transform:
          translate(-50%, -50%)
          rotate(0deg);
      }

      to {
        transform:
          translate(-50%, -50%)
          rotate(360deg);
      }
    }

    @keyframes ringReverse {
      from {
        transform:
          translate(-50%, -50%)
          rotate(360deg);
      }

      to {
        transform:
          translate(-50%, -50%)
          rotate(0deg);
      }
    }

    /* ==========================================
       WHOLE SIGNUP RECTANGLE
    =========================================== */

    .signup-shell {
      --shell-rx:
        0deg;

      --shell-ry:
        0deg;

      --shell-mx:
        50%;

      --shell-my:
        50%;

      --shell-shadow-x:
        0px;

      --shell-shadow-y:
        18px;

      --shell-lift:
        0px;

      --shell-scale:
        1;

      transform:
        perspective(1450px)
        translateY(
          var(--shell-lift)
        )
        scale(
          var(--shell-scale)
        )
        rotateX(
          var(--shell-rx)
        )
        rotateY(
          var(--shell-ry)
        );

      transform-style:
        preserve-3d;

      will-change:
        transform;

      transition:
        transform
          145ms
          ease-out,

        border-color
          260ms ease,

        box-shadow
          260ms ease;
    }

    .signup-shell:hover {
      --shell-lift:
        -7px;

      --shell-scale:
        1.008;

      border-color:
        rgba(
          255,
          255,
          255,
          .13
        );

      box-shadow:
        var(--shell-shadow-x)
        var(--shell-shadow-y)
        95px
        rgba(
          0,
          0,
          0,
          .73
        ),

        0 35px 80px
        rgba(
          0,
          0,
          0,
          .34
        ),

        0 0 0 1px
        rgba(
          229,
          51,
          76,
          .035
        ),

        0 0 82px
        rgba(
          126,
          12,
          32,
          .11
        );
    }

    .shell-reflection {
      background:
        radial-gradient(
          440px circle
          at
          var(--shell-mx)
          var(--shell-my),

          rgba(
            255,
            255,
            255,
            .065
          ),

          rgba(
            235,
            52,
            78,
            .052
          )
          20%,

          rgba(
            235,
            52,
            78,
            .015
          )
          38%,

          transparent
          65%
        );

      opacity: 0;

      transition:
        opacity
        220ms ease;
    }

    .signup-shell:hover
    .shell-reflection {
      opacity: 1;
    }

    .shell-left-depth {
      transform:
        translateZ(24px);

      transform-style:
        preserve-3d;
    }

    .shell-right-depth {
      transform:
        translateZ(18px);

      transform-style:
        preserve-3d;
    }

    /* ==========================================
       INTERNAL POPS
    =========================================== */

    .identity-visual {
      transition:
        transform
          300ms
          cubic-bezier(.16,1,.3,1),

        border-color
          250ms ease,

        box-shadow
          250ms ease;
    }

    .identity-visual:hover {
      transform:
        translateY(-5px)
        scale(1.008);

      border-color:
        rgba(
          203,
          54,
          76,
          .28
        );

      box-shadow:
        0 22px 50px
        rgba(
          0,
          0,
          0,
          .25
        ),

        0 0 45px
        rgba(
          137,
          17,
          37,
          .08
        );
    }

    .identity-core {
      transition:
        transform
          300ms
          cubic-bezier(.16,1,.3,1),

        box-shadow
          300ms ease;
    }

    .identity-visual:hover
    .identity-core {
      transform:
        translate(-50%, -50%)
        scale(1.09);

      box-shadow:
        0 0 85px
        rgba(
          190,
          30,
          55,
          .29
        );
    }

    .visual-chip {
      transition:
        transform
          220ms ease,

        border-color
          220ms ease;
    }

    .visual-chip:hover {
      transform:
        translateY(-3px);

      border-color:
        rgba(
          220,
          59,
          80,
          .30
        );
    }

    .signup-field {
      transition:
        transform
          210ms
          cubic-bezier(.16,1,.3,1),

        box-shadow
          210ms ease;
    }

    .signup-field:hover {
      transform:
        translateY(-2px);

      box-shadow:
        0 13px 30px
        rgba(
          0,
          0,
          0,
          .18
        );
    }

    .signup-button {
      transition:
        transform
          220ms
          cubic-bezier(.16,1,.3,1),

        border-color
          220ms ease,

        box-shadow
          220ms ease;
    }

    .signup-button:hover {
      transform:
        translateY(-3px)
        scale(1.005);
    }

    .signup-button:active {
      transform:
        translateY(0)
        scale(.997);
    }

    @media (
      prefers-reduced-motion:
      reduce
    ) {
      .signup-shell,
      .identity-visual,
      .signup-field,
      .signup-button {
        transform:
          none !important;

        transition:
          none !important;
      }
    }
  `

  /* =======================================================
     OTP VIEW
  ======================================================= */

  if (
    step === 'otp'
  ) {
    return (
      <>
        <style>
          {pageStyles}
        </style>

        <main className="relative min-h-screen overflow-hidden bg-[#020203] text-white">

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 42%, rgba(112,10,28,.15), transparent 31%), radial-gradient(circle at 13% 17%, rgba(89,7,22,.11), transparent 28%), #020203',
            }}
          />

          <header className="relative z-40">

            <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 sm:px-8 lg:px-10">

              <ProVNLogo />

              <button
                type="button"
                onClick={() => {
                  setStep(
                    'form'
                  )

                  setOtpError('')
                }}
                className="text-[9px] font-medium text-zinc-600 transition-colors hover:text-zinc-300"
              >
                ← Change details
              </button>
            </div>
          </header>

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-[1400px] items-center justify-center px-5 pb-10">

            <div
              onPointerMove={
                handleShellMove
              }
              onPointerLeave={
                resetShell
              }
              className="signup-shell relative w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#070708]/95 shadow-[0_45px_110px_rgba(0,0,0,.66)]"
              style={{
                animation:
                  'pageEntry .55s cubic-bezier(.16,1,.3,1) both',
              }}
            >

              <div className="shell-reflection pointer-events-none absolute inset-0 z-[5]" />

              <div className="relative z-10 px-7 py-8 sm:px-10 sm:py-10">

                {verified ? (
                  <div className="flex min-h-[450px] flex-col items-center justify-center text-center">

                    <div className="relative h-[150px] w-[150px]">

                      <div className="absolute left-1/2 top-1/2 h-[145px] w-[145px] animate-[ringSpin_8s_linear_infinite] rounded-full border border-[#8d2132]/40" />

                      <div className="absolute left-1/2 top-1/2 h-[112px] w-[112px] animate-[ringReverse_5s_linear_infinite] rounded-full border border-[#b72b40]/38" />

                      <div className="absolute left-1/2 top-1/2 flex h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#b72e42]/60 bg-[#0c0608] shadow-[0_0_70px_rgba(184,28,51,.26)]">

                        <div className="scale-[.86]">
                          <ProVNMark id="verified-core" />
                        </div>
                      </div>
                    </div>

                    <p className="mt-7 text-[8px] uppercase tracking-[0.36em] text-[#a53a4a]">
                      Authentication Complete
                    </p>

                    <h1 className="mt-4 text-[35px] font-black tracking-[-0.045em]">

                      Identity{' '}

                      <span className="text-[#dc3349]">
                        Verified.
                      </span>
                    </h1>

                    <p className="mt-4 max-w-[350px] text-[11px] leading-6 text-zinc-600">
                      Your ProVN identity has
                      been created. Moving you
                      to secure access.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[8px] uppercase tracking-[0.34em] text-[#a43748]">
                          IDENTITY CHECK
                        </p>

                        <div className="mt-2 flex items-center gap-2">

                          <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#dc3149] shadow-[0_0_8px_rgba(220,49,73,.8)]" />

                          <span className="text-[7px] uppercase tracking-[0.2em] text-zinc-700">
                            Verification Node Active
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full border border-[#66242e]/60 bg-[#12080a] px-3 py-2 text-[6px] uppercase tracking-[0.2em] text-[#923f4a]">
                        STEP 02
                      </span>
                    </div>

                    <div className="mt-8 text-center">

                      <h1 className="text-[32px] font-black leading-none tracking-[-0.045em]">

                        Verify your{' '}

                        <span className="text-[#d92f47]">
                          identity.
                        </span>
                      </h1>

                      <p className="mx-auto mt-4 max-w-[410px] text-[11px] leading-6 text-zinc-600">

                        Enter the 6-digit code
                        sent to{' '}

                        <span className="text-zinc-400">
                          {otpEmail}
                        </span>
                      </p>
                    </div>

                    <div
                      onPaste={
                        handleOtpPaste
                      }
                      className="mt-8 grid grid-cols-6 gap-2.5"
                    >

                      {otp.map(
                        (
                          digit,
                          index
                        ) => (
                          <input
                            key={
                              index
                            }
                            ref={
                              element => {
                                otpRefs
                                  .current[
                                    index
                                  ] =
                                  element
                              }
                            }
                            data-writing-field="true"
                            inputMode="numeric"
                            autoComplete={
                              index === 0
                                ? 'one-time-code'
                                : 'off'
                            }
                            maxLength={1}
                            value={
                              digit
                            }
                            onChange={
                              event =>
                                updateOtp(
                                  index,
                                  event
                                    .target
                                    .value
                                )
                            }
                            onKeyDown={
                              event =>
                                handleOtpKeyDown(
                                  event,
                                  index
                                )
                            }
                            className="h-[58px] min-w-0 rounded-[12px] border border-white/[0.08] bg-[#09090b] text-center text-[20px] font-bold text-white outline-none transition focus:border-[#b02a3f] focus:bg-[#0e080a] focus:shadow-[0_0_0_3px_rgba(177,35,56,.07),0_0_24px_rgba(121,14,30,.13)]"
                          />
                        )
                      )}
                    </div>

                    {otpError && (
                      <div className="mt-5 rounded-[12px] border border-red-900/55 bg-red-950/20 px-4 py-3 text-[10px] leading-5 text-red-300">
                        {otpError}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={
                        verifySignupOtp
                      }
                      disabled={
                        otpLoading ||
                        otp.join('')
                          .length !== 6
                      }
                      className="signup-button group relative mt-6 flex h-[54px] w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#bd3043] bg-gradient-to-r from-[#841122] via-[#b41c32] to-[#d12a42] text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_16px_38px_rgba(120,12,31,.22)] hover:border-[#eb5263] hover:shadow-[0_20px_50px_rgba(152,18,40,.30)] disabled:translate-y-0 disabled:scale-100 disabled:border-white/[0.06] disabled:bg-none disabled:bg-[#0d0d0f] disabled:text-zinc-700 disabled:shadow-none"
                    >

                      <span className="pointer-events-none absolute inset-y-0 left-[-45%] w-[35%] -skew-x-[20deg] bg-white/[0.10] opacity-0 blur-[4px] transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

                      <span className="relative z-10">
                        {otpLoading
                          ? 'VERIFYING...'
                          : 'VERIFY IDENTITY →'}
                      </span>
                    </button>

                    <div className="mt-7 flex items-center justify-center gap-2 text-[8px] text-zinc-700">

                      <span>
                        Didn&apos;t receive it?
                      </span>

                      <button
                        type="button"
                        onClick={
                          resendOtp
                        }
                        disabled={
                          resendSeconds >
                          0
                        }
                        className="font-semibold text-zinc-500 transition-colors hover:text-zinc-200 disabled:text-zinc-700"
                      >
                        {resendSeconds >
                        0
                          ? `Resend in ${resendSeconds}s`
                          : 'Resend code'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  /* =======================================================
     SIGNUP FORM
  ======================================================= */

  return (
    <>
      <style>
        {pageStyles}
      </style>

      <main className="relative min-h-screen overflow-hidden bg-[#020203] text-white">

        {/* BACKGROUND */}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 7% 32%, rgba(119,8,28,.15), transparent 29%), radial-gradient(circle at 91% 21%, rgba(102,8,25,.09), transparent 29%), radial-gradient(circle at 50% 108%, rgba(94,6,23,.09), transparent 38%), #020203',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
            backgroundSize:
              '88px 88px',
          }}
        />

        {/* HEADER */}

        <header className="relative z-40">

          <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 sm:px-8 lg:px-10">

            <ProVNLogo />

            <Link
              href="/"
              className="group flex items-center gap-2 text-[9px] font-medium text-zinc-600 transition-all duration-200 hover:-translate-y-[1px] hover:text-zinc-300"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                ←
              </span>

              Back to Home
            </Link>
          </div>
        </header>

        {/* ===============================================
            SIGNUP RECTANGLE

            Compact again:
            MAX WIDTH 1120px
            NOT STRETCHED ACROSS SCREEN.
        ================================================ */}

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-[1400px] items-center justify-center px-5 pb-10 sm:px-7 lg:px-9">

          <div
            onPointerMove={
              handleShellMove
            }
            onPointerLeave={
              resetShell
            }
            className="signup-shell relative w-full max-w-[1120px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#070708]/[0.98] shadow-[0_46px_110px_rgba(0,0,0,.70)]"
            style={{
              animation:
                'pageEntry .6s cubic-bezier(.16,1,.3,1) both',
            }}
          >

            {/* CURSOR REFLECTION */}

            <div className="shell-reflection pointer-events-none absolute inset-0 z-[10]" />

            {/* METALLIC TOP */}

            <div className="pointer-events-none absolute left-[3%] right-[3%] top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent opacity-50" />

            <div className="pointer-events-none absolute inset-[1px] z-20 rounded-[27px] border border-white/[0.014]" />

            <div className="relative z-[3] grid lg:grid-cols-[.96fr_1.04fr]">

              {/* =========================================
                  LEFT
              ========================================== */}

              <section className="relative hidden min-h-[655px] overflow-hidden border-r border-white/[0.055] p-9 lg:flex lg:flex-col">

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 33% 48%,rgba(143,15,38,.15),transparent 43%),linear-gradient(145deg,#0d0709_0%,#080708_58%,#050506_100%)',
                  }}
                />

                <div className="shell-left-depth relative z-10 flex h-full flex-col">

                  <div>

                    <div className="flex items-center gap-3">

                      <span className="h-px w-8 bg-[#9d2c3d]" />

                      <p className="text-[7px] uppercase tracking-[0.38em] text-[#9b3746]">
                        PROVN / IDENTITY 001
                      </p>
                    </div>

                    <h1 className="mt-7 text-[47px] font-black leading-[0.91] tracking-[-0.058em]">

                      Your Game.
                      <br />

                      <span className="text-[#dc3048]">
                        Your Proof.
                      </span>

                      <br />

                      Your Identity.
                    </h1>

                    <p className="mt-6 max-w-[390px] text-[12px] leading-6 text-zinc-500">

                      Start with a real
                      identity. Build your
                      gaming proof, reputation
                      and opportunities over
                      time.
                    </p>

                    <IdentityVisual />
                  </div>

                  {/* BOTTOM CARDS */}

                  <div className="mt-6 grid grid-cols-3 gap-3">

                    <div className="visual-chip rounded-[14px] border border-white/[0.06] bg-white/[0.015] px-4 py-3.5">

                      <p className="text-[8px] font-bold text-[#bd3347]">
                        01
                      </p>

                      <p className="mt-2 text-[9px] text-zinc-500">
                        Claim Identity
                      </p>
                    </div>

                    <div className="visual-chip rounded-[14px] border border-white/[0.06] bg-white/[0.015] px-4 py-3.5">

                      <p className="text-[8px] font-bold text-[#bd3347]">
                        02
                      </p>

                      <p className="mt-2 text-[9px] text-zinc-500">
                        Build Proof
                      </p>
                    </div>

                    <div className="visual-chip rounded-[14px] border border-white/[0.06] bg-white/[0.015] px-4 py-3.5">

                      <p className="text-[8px] font-bold text-[#bd3347]">
                        03
                      </p>

                      <p className="mt-2 text-[9px] text-zinc-500">
                        Level Up
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* =========================================
                  RIGHT FORM
              ========================================== */}

              <section className="relative flex min-h-[655px] items-center px-7 py-8 sm:px-9 lg:px-10">

                <div className="pointer-events-none absolute right-[-150px] top-[-160px] h-[340px] w-[340px] rounded-full bg-[#9a142a]/[0.05] blur-[105px]" />

                <div className="shell-right-depth relative z-10 mx-auto w-full max-w-[470px]">

                  {/* TOP */}

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[8px] uppercase tracking-[0.34em] text-[#a33849]">
                        CREATE IDENTITY
                      </p>

                      <div className="mt-2 flex items-center gap-2">

                        <span className="h-[5px] w-[5px] rounded-full bg-[#d9324a] shadow-[0_0_8px_rgba(217,50,74,.75)]" />

                        <span className="text-[7px] uppercase tracking-[0.2em] text-zinc-700">
                          Identity Node Ready
                        </span>
                      </div>
                    </div>

                    <span className="hidden rounded-full border border-[#65232d]/60 bg-[#110709] px-3 py-[7px] text-[6px] uppercase tracking-[0.19em] text-[#8f3b48] sm:inline-flex">
                      STEP 01
                    </span>
                  </div>

                  {/* HEADING */}

                  <h2 className="mt-5 text-[34px] font-black leading-[.98] tracking-[-0.048em] sm:text-[38px]">

                    Build your{' '}

                    <span className="text-[#dc3048]">
                      ProVN identity.
                    </span>
                  </h2>

                  <p className="mt-3 text-[10px] leading-5 text-zinc-600">

                    Real identity underneath.
                    Your public presence stays
                    in your control.
                  </p>

                  {/* FORM */}

                  <form
                    onSubmit={
                      handleSignup
                    }
                    noValidate
                    className="mt-6"
                  >

                    {/* NAME + USERNAME */}

                    <div className="grid gap-4 sm:grid-cols-2">

                      {/* FULL NAME */}

                      <div>

                        <label className="mb-2 block text-[7px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                          Full Name
                        </label>

                        <div className="signup-field rounded-[12px]">

                          <input
                            data-writing-field="true"
                            value={
                              fullName
                            }
                            onChange={
                              event => {
                                setFullName(
                                  event
                                    .target
                                    .value
                                )

                                setError('')
                              }
                            }
                            placeholder="Kanav Agarwal"
                            autoComplete="name"
                            className="h-[52px] w-full rounded-[12px] border border-white/[0.08] bg-[#08080a]/95 px-4 text-[12px] text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-[#a62c3b] focus:bg-[#0d090b] focus:shadow-[0_0_0_3px_rgba(173,37,55,.07),0_0_26px_rgba(117,13,29,.10)]"
                          />
                        </div>

                        <p className="mt-2 text-[6px] leading-4 text-zinc-700">
                          Private by default.
                        </p>
                      </div>

                      {/* USERNAME */}

                      <div>

                        <label className="mb-2 block text-[7px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                          Username
                        </label>

                        <div className="signup-field relative rounded-[12px]">

                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-zinc-600">
                            @
                          </span>

                          <input
                            data-writing-field="true"
                            value={
                              username
                            }
                            onChange={
                              event => {
                                setUsername(
                                  event
                                    .target
                                    .value
                                    .toLowerCase()
                                    .replace(
                                      /\s/g,
                                      ''
                                    )
                                    .replace(
                                      /^@/,
                                      ''
                                    )
                                )

                                setError('')
                              }
                            }
                            placeholder="yourname"
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            maxLength={20}
                            className="h-[52px] w-full rounded-[12px] border border-white/[0.08] bg-[#08080a]/95 py-0 pl-8 pr-4 text-[12px] text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-[#a62c3b] focus:bg-[#0d090b] focus:shadow-[0_0_0_3px_rgba(173,37,55,.07),0_0_26px_rgba(117,13,29,.10)]"
                          />
                        </div>

                        <div className="mt-2 flex min-h-[16px] items-center justify-between gap-2">

                          <p className="max-w-[150px] truncate text-[6px] text-zinc-700">
                            provn.games/profiles/
                            {cleanedUsername ||
                              'yourname'}
                          </p>

                          {usernameState ===
                            'checking' && (
                            <span className="text-[6px] text-zinc-600">
                              Checking...
                            </span>
                          )}

                          {usernameState ===
                            'available' && (
                            <span className="text-[6px] text-emerald-500/80">
                              Available
                            </span>
                          )}

                          {usernameState ===
                            'taken' && (
                            <span className="text-[6px] text-red-400">
                              Taken
                            </span>
                          )}

                          {usernameState ===
                            'invalid' && (
                            <span className="text-[6px] text-red-400">
                              Invalid
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* EMAIL */}

                    <div className="mt-4">

                      <label className="mb-2 block text-[7px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                        Email
                      </label>

                      <div className="signup-field rounded-[12px]">

                        <input
                          data-writing-field="true"
                          type="email"
                          value={
                            email
                          }
                          onChange={
                            event => {
                              setEmail(
                                event
                                  .target
                                  .value
                              )

                              setError('')
                            }
                          }
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="h-[52px] w-full rounded-[12px] border border-white/[0.08] bg-[#08080a]/95 px-4 text-[12px] text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-[#a62c3b] focus:bg-[#0d090b] focus:shadow-[0_0_0_3px_rgba(173,37,55,.07),0_0_26px_rgba(117,13,29,.10)]"
                        />
                      </div>
                    </div>

                    {/* PASSWORD */}

                    <div className="mt-4">

                      <label className="mb-2 block text-[7px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                        Password
                      </label>

                      <div className="signup-field relative rounded-[12px]">

                        <input
                          data-writing-field="true"
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          value={
                            password
                          }
                          onChange={
                            event => {
                              setPassword(
                                event
                                  .target
                                  .value
                              )

                              setError('')
                            }
                          }
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                          className="h-[52px] w-full rounded-[12px] border border-white/[0.08] bg-[#08080a]/95 px-4 pr-12 text-[12px] text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-[#a62c3b] focus:bg-[#0d090b] focus:shadow-[0_0_0_3px_rgba(173,37,55,.07),0_0_26px_rgba(117,13,29,.10)]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              current =>
                                !current
                            )
                          }
                          aria-label={
                            showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-zinc-300"
                        >

                          <EyeIcon
                            open={
                              showPassword
                            }
                          />
                        </button>
                      </div>

                      {/* PASSWORD RULES */}

                      <div className="mt-3 grid grid-cols-4 gap-2">

                        {[
                          [
                            passwordRules.length,
                            '8+ chars',
                          ],
                          [
                            passwordRules.uppercase,
                            'Uppercase',
                          ],
                          [
                            passwordRules.lowercase,
                            'Lowercase',
                          ],
                          [
                            passwordRules.number,
                            'Number',
                          ],
                        ].map(
                          (
                            [
                              passed,
                              label,
                            ]
                          ) => (
                            <div
                              key={
                                String(
                                  label
                                )
                              }
                              className="flex items-center gap-1.5 text-[6px]"
                            >

                              <span
                                className={`h-[4px] w-[4px] rounded-full ${
                                  passed
                                    ? 'bg-emerald-500/80'
                                    : 'bg-zinc-800'
                                }`}
                              />

                              <span
                                className={
                                  passed
                                    ? 'text-zinc-500'
                                    : 'text-zinc-700'
                                }
                              >
                                {String(
                                  label
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* ERROR */}

                    {error && (
                      <div className="mt-4 rounded-[11px] border border-red-900/55 bg-red-950/20 px-4 py-3 text-[9px] leading-5 text-red-300">
                        {error}
                      </div>
                    )}

                    {/* CREATE ACCOUNT */}

                    <button
                      type="submit"
                      disabled={
                        !canSubmit
                      }
                      className="signup-button group relative mt-5 flex h-[54px] w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#bf3044] bg-gradient-to-r from-[#861122] via-[#b51d33] to-[#d02a42] text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_16px_40px_rgba(119,12,30,.22)] hover:border-[#e64b5e] hover:shadow-[0_22px_52px_rgba(151,17,40,.32)] disabled:translate-y-0 disabled:scale-100 disabled:border-white/[0.06] disabled:bg-none disabled:bg-[#0d0d0f] disabled:text-zinc-700 disabled:shadow-none"
                    >

                      <span className="pointer-events-none absolute inset-y-0 left-[-40%] w-[35%] -skew-x-[22deg] bg-white/[0.10] opacity-0 blur-[4px] transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

                      <span className="relative z-10">
                        {loading
                          ? 'CREATING IDENTITY...'
                          : 'CREATE ACCOUNT →'}
                      </span>
                    </button>
                  </form>

                  {/* SMALL META ONLY */}

                  <div className="mt-5 flex items-center justify-between text-[6px] uppercase tracking-[0.2em] text-zinc-800">

                    <span>
                      Private Identity
                    </span>

                    <span>
                      Verified Over Time
                    </span>
                  </div>

                  <p className="mt-5 text-center text-[7px] leading-5 text-zinc-700">

                    By creating an account,
                    you agree to ProVN&apos;s
                    Terms and Privacy Policy.
                  </p>

                  {/*
                    INTENTIONALLY NO:
                    "ALREADY LOCKED IN?"
                    or
                    "SIGN IN TO PROVN"
                  */}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}