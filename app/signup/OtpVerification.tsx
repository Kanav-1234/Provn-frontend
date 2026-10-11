'use client'

import {
  ClipboardEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

type VerifyResult = {
  ok: boolean
  message?: string
}

type Props = {
  email: string
  brandMark?: ReactNode
  onVerify: (token: string) => Promise<VerifyResult>
  onResend: () => Promise<VerifyResult>
  onVerified: () => void
}

type Phase =
  | 'entry'
  | 'orbit'
  | 'success'

const OTP_LENGTH = 6

const ORBIT = [
  { x: 0, y: -96, r: 0 },
  { x: 84, y: -48, r: 5 },
  { x: 84, y: 48, r: -5 },
  { x: 0, y: 96, r: 2 },
  { x: -84, y: 48, r: -4 },
  { x: -84, y: -48, r: 4 },
]

function wait(ms: number) {
  return new Promise<void>(resolve => {
    window.setTimeout(resolve, ms)
  })
}

function maskEmail(email: string) {
  const [local, domain] = email.split('@')

  if (!domain) return email

  if (local.length <= 2) {
    return `${local[0] ?? ''}***@${domain}`
  }

  return `${local.slice(0, 2)}${'*'.repeat(
    Math.min(5, Math.max(2, local.length - 3))
  )}${local.slice(-1)}@${domain}`
}

function VerifiedCheck() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-[35px] w-[35px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m7 16 6 6L26 9" />
    </svg>
  )
}

export default function OtpVerification({
  email,
  brandMark,
  onVerify,
  onResend,
  onVerified,
}: Props) {
  const [digits, setDigits] =
    useState<string[]>(
      Array(OTP_LENGTH).fill('')
    )

  const [phase, setPhase] =
    useState<Phase>('entry')

  const [error, setError] =
    useState('')

  const [notice, setNotice] =
    useState('')

  const [resendSeconds, setResendSeconds] =
    useState(60)

  const [resending, setResending] =
    useState(false)

  const [shake, setShake] =
    useState(false)

  const inputs =
    useRef<Array<HTMLInputElement | null>>([])

  const verificationStarted =
    useRef(false)

  const token = digits.join('')

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        inputs.current[0]?.focus()
      }, 350)

    return () =>
      window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (resendSeconds <= 0) return

    const timer =
      window.setInterval(() => {
        setResendSeconds(value =>
          Math.max(0, value - 1)
        )
      }, 1000)

    return () =>
      window.clearInterval(timer)
  }, [resendSeconds])

  useEffect(() => {
    if (
      token.length !== OTP_LENGTH ||
      phase !== 'entry' ||
      verificationStarted.current
    ) {
      return
    }

    verificationStarted.current = true

    void verify(token)
  }, [token, phase])

  async function verify(
    completeToken: string
  ) {
    setError('')
    setNotice('')

    /*
      1. Straight row turns into the
         six-point identity orbit.
    */
    setPhase('orbit')

    await wait(760)

    /*
      2. Supabase verification happens
         while the scanner is moving.
    */
    const result =
      await onVerify(completeToken)

    if (!result.ok) {
      /*
        Wrong code:
        orbit reverses back into input row.
      */
      setPhase('entry')

      verificationStarted.current = false

      setDigits(
        Array(OTP_LENGTH).fill('')
      )

      setError(
        result.message ||
          'That verification code is invalid or expired.'
      )

      setShake(true)

      window.setTimeout(
        () => setShake(false),
        460
      )

      window.setTimeout(
        () => inputs.current[0]?.focus(),
        200
      )

      return
    }

    /*
      Hold scanner briefly before success.
    */
    await wait(320)

    /*
      3. Six nodes collapse into
         one verified identity tile.
    */
    setPhase('success')

    await wait(1850)

    onVerified()
  }

  function distribute(
    startIndex: number,
    rawValue: string
  ) {
    const clean =
      rawValue
        .replace(/\D/g, '')
        .slice(0, OTP_LENGTH)

    if (!clean) return

    const next = [...digits]

    let target = startIndex

    for (
      let index = 0;
      index < clean.length &&
      target < OTP_LENGTH;
      index += 1
    ) {
      next[target] = clean[index]
      target += 1
    }

    setDigits(next)
    setError('')
    setNotice('')

    const firstEmpty =
      next.findIndex(value => !value)

    if (firstEmpty >= 0) {
      inputs.current[firstEmpty]?.focus()
    } else {
      inputs.current[OTP_LENGTH - 1]?.focus()
    }
  }

  function handleChange(
    index: number,
    value: string
  ) {
    if (phase !== 'entry') return

    const clean =
      value.replace(/\D/g, '')

    /*
      Browser OTP autofill may place the
      complete OTP into the first field.
    */
    if (clean.length > 1) {
      distribute(index, clean)
      return
    }

    const next = [...digits]

    next[index] =
      clean.slice(-1)

    setDigits(next)
    setError('')
    setNotice('')

    if (
      clean &&
      index < OTP_LENGTH - 1
    ) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(
    index: number,
    event:
      KeyboardEvent<HTMLInputElement>
  ) {
    if (phase !== 'entry') return

    if (event.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
        return
      }

      if (index > 0) {
        const next = [...digits]
        next[index - 1] = ''

        setDigits(next)

        inputs.current[index - 1]?.focus()
      }

      return
    }

    if (
      event.key === 'ArrowLeft' &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus()
    }

    if (
      event.key === 'ArrowRight' &&
      index < OTP_LENGTH - 1
    ) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handlePaste(
    event:
      ClipboardEvent<HTMLDivElement>
  ) {
    if (phase !== 'entry') return

    const pasted =
      event.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, OTP_LENGTH)

    if (!pasted) return

    event.preventDefault()

    const next =
      Array(OTP_LENGTH).fill('')

    pasted
      .split('')
      .forEach((digit, index) => {
        next[index] = digit
      })

    setDigits(next)
    setError('')
    setNotice('')

    const empty =
      next.findIndex(value => !value)

    if (empty >= 0) {
      inputs.current[empty]?.focus()
    } else {
      inputs.current[OTP_LENGTH - 1]?.focus()
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

    verificationStarted.current = false

    setDigits(
      Array(OTP_LENGTH).fill('')
    )

    setResendSeconds(60)

    setNotice(
      'A fresh verification code has been sent.'
    )

    window.setTimeout(
      () => inputs.current[0]?.focus(),
      120
    )
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-[540px]">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.34em] text-[#a23b4a]">
            PROVN / VERIFY
          </p>

          <div className="mt-[7px] flex items-center gap-2">
            <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#df3048] shadow-[0_0_9px_rgba(223,48,72,.85)]" />

            <span className="text-[8px] uppercase tracking-[0.22em] text-zinc-700">
              SECURE IDENTITY NODE ACTIVE
            </span>
          </div>
        </div>

        <span className="hidden rounded-full border border-[#682531]/70 bg-[#12080a] px-3 py-[7px] text-[8px] uppercase tracking-[0.19em] text-[#9b4450] sm:inline-flex">
          EMAIL OTP
        </span>
      </div>

      <h2 className="mt-5 text-[35px] font-black leading-[0.96] tracking-[-0.05em] sm:text-[41px]">
        Verify Your{' '}
        <span className="text-[#dc3048]">
          Identity.
        </span>
      </h2>

      <p className="mt-3 max-w-[490px] text-[13px] leading-6 text-zinc-500">
        Enter the six-digit code sent to{' '}
        <span className="font-medium text-zinc-300">
          {maskEmail(email)}
        </span>
        .
      </p>

      {/* MAIN OTP ARENA */}

      <div
        onPaste={handlePaste}
        className={`
          relative mt-8 h-[375px] overflow-hidden
          rounded-[27px]
          border border-white/[0.06]
          bg-[#050506]/95
          shadow-[inset_0_1px_0_rgba(255,255,255,.025),0_25px_80px_rgba(0,0,0,.28)]

          ${
            shake
              ? 'animate-[provnOtpShake_.44s_ease]'
              : ''
          }
        `}
      >
        {/* AMBIENT LIGHT */}

        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          style={{
            background:
              phase === 'success'
                ? 'radial-gradient(circle at 50% 50%, rgba(16,185,129,.16), transparent 40%)'
                : 'radial-gradient(circle at 50% 50%, rgba(186,27,54,.18), transparent 43%)',
          }}
        />

        {/* GRID */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />

        {/* ORBIT 1 */}

        <div
          className={`
            pointer-events-none absolute
            left-1/2 top-1/2
            h-[248px] w-[248px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full border
            transition-all duration-700

            ${
              phase === 'entry'
                ? 'scale-[.45] border-transparent opacity-0'
                : phase === 'orbit'
                  ? 'scale-100 border-[#8e293a]/40 opacity-100'
                  : 'scale-[.18] border-emerald-500/15 opacity-0'
            }
          `}
        />

        {/* ORBIT 2 */}

        <div
          className={`
            pointer-events-none absolute
            left-1/2 top-1/2
            h-[190px] w-[190px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full border
            transition-all duration-700

            ${
              phase === 'entry'
                ? 'scale-[.4] border-transparent opacity-0'
                : phase === 'orbit'
                  ? 'scale-100 border-[#a82f41]/25 opacity-100'
                  : 'scale-[.12] border-transparent opacity-0'
            }
          `}
        />

        {/* ROTATING SCANNER */}

        <div
          className={`
            pointer-events-none absolute
            left-1/2 top-1/2
            h-[248px] w-[248px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            transition-opacity duration-300

            ${
              phase === 'orbit'
                ? 'animate-[spin_1.2s_linear_infinite] opacity-100'
                : 'opacity-0'
            }
          `}
        >
          <span className="absolute left-1/2 top-[-5px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[#f23a54] shadow-[0_0_23px_rgba(242,58,84,.95)]" />

          <span className="absolute bottom-[17px] right-[17px] h-[5px] w-[5px] rounded-full bg-[#a72c40] shadow-[0_0_12px_rgba(167,44,64,.8)]" />
        </div>

        {/* VERTICAL SCAN */}

        <div
          className={`
            pointer-events-none absolute
            left-[8%] right-[8%]
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#cf3048]/60
            to-transparent

            ${
              phase === 'orbit'
                ? 'animate-[provnScan_1.4s_ease-in-out_infinite] opacity-100'
                : 'opacity-0'
            }
          `}
        />

        {/* CENTER BRAND NODE */}

        <div
          className={`
            pointer-events-none absolute
            left-1/2 top-1/2
            flex h-[64px] w-[64px]
            -translate-x-1/2 -translate-y-1/2
            items-center justify-center
            rounded-full
            border border-[#922c3d]/40
            bg-[#090608]
            shadow-[0_0_40px_rgba(166,29,51,.16)]
            transition-all duration-500

            ${
              phase === 'orbit'
                ? 'scale-100 opacity-100'
                : 'scale-[.42] opacity-0'
            }
          `}
        >
          <div className="scale-[.62]">
            {brandMark ?? (
              <span className="font-black text-[#dc3048]">
                P
              </span>
            )}
          </div>
        </div>

        {/* STATUS */}

        <div
          className={`
            absolute left-0 right-0 top-7
            text-center
            transition-all duration-300

            ${
              phase === 'success'
                ? '-translate-y-2 opacity-0'
                : 'translate-y-0 opacity-100'
            }
          `}
        >
          <p className="text-[8px] uppercase tracking-[0.31em] text-zinc-700">
            {phase === 'orbit'
              ? 'VERIFYING IDENTITY SIGNATURE'
              : 'ENTER SECURITY CODE'}
          </p>
        </div>

        {/* SIX DIGIT CARDS */}

        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {digits.map((digit, index) => {
            const rowX =
              (index - 2.5) * 60

            let x = rowX
            let y = 0
            let rotation = 0
            let scale = 1
            let opacity = 1

            if (phase === 'orbit') {
              x = ORBIT[index].x
              y = ORBIT[index].y
              rotation = ORBIT[index].r
              scale = 0.96
            }

            if (phase === 'success') {
              x = 0
              y = 0

              rotation =
                index % 2 === 0
                  ? 80
                  : -80

              scale = 0.03
              opacity = 0
            }

            return (
              <div
                key={index}
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
                      index * 38
                    }ms,
                     opacity 300ms ease ${
                       phase === 'success'
                         ? index * 22
                         : 0
                     }ms`,
                }}
              >
                <input
                  ref={element => {
                    inputs.current[index] =
                      element
                  }}
                  data-writing-field="true"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={
                    index === 0
                      ? 'one-time-code'
                      : 'off'
                  }
                  maxLength={
                    index === 0
                      ? OTP_LENGTH
                      : 1
                  }
                  value={digit}
                  disabled={
                    phase !== 'entry'
                  }
                  onChange={event =>
                    handleChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={event =>
                    handleKeyDown(
                      index,
                      event
                    )
                  }
                  aria-label={`OTP digit ${
                    index + 1
                  }`}
                  className={`
                    h-[53px] w-[53px]
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
          })}

          {/* SUCCESS TILE */}

          <div
            className="pointer-events-none absolute left-0 top-0 flex flex-col items-center"
            style={{
              transform:
                phase === 'success'
                  ? 'translate(-50%, -50%) scale(1)'
                  : 'translate(-50%, -50%) scale(.4)',
              opacity:
                phase === 'success'
                  ? 1
                  : 0,
              transition:
                'transform 820ms cubic-bezier(.16,1,.3,1) 220ms, opacity 430ms ease 230ms',
            }}
          >
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-[32px] border border-emerald-500/35 bg-[#06100c] text-emerald-400 shadow-[0_0_74px_rgba(16,185,129,.15),inset_0_0_32px_rgba(16,185,129,.06)]">
              <div className="absolute -inset-[10px] animate-[provnVerifiedPulse_1.45s_ease-out_infinite] rounded-[38px] border border-emerald-500/15" />

              <div className="absolute -inset-[24px] rounded-[49px] border border-emerald-500/[0.045]" />

              <VerifiedCheck />
            </div>

            <p className="mt-6 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.30em] text-emerald-400">
              Identity Verified
            </p>

            <p className="mt-2 whitespace-nowrap text-[8px] uppercase tracking-[0.21em] text-zinc-700">
              Access Granted
            </p>
          </div>
        </div>

        {/* BOTTOM TEXT */}

        <div
          className={`
            absolute bottom-7 left-0 right-0
            text-center
            transition-opacity duration-300

            ${
              phase === 'success'
                ? 'opacity-0'
                : 'opacity-100'
            }
          `}
        >
          {phase === 'entry' ? (
            <p className="text-[9px] text-zinc-700">
              Type or paste your six-digit verification code.
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="h-[4px] w-[4px] animate-pulse rounded-full bg-[#da3048]" />

              <p className="text-[8px] uppercase tracking-[0.24em] text-[#87333f]">
                Matching secure identity signature
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-[12px] border border-red-900/55 bg-red-950/20 px-4 py-3 text-[11px] leading-5 text-red-300">
          {error}
        </div>
      )}

      {notice && !error && (
        <div className="mt-4 rounded-[12px] border border-emerald-900/35 bg-emerald-950/10 px-4 py-3 text-[11px] leading-5 text-emerald-400">
          {notice}
        </div>
      )}

      {/* RESEND */}

      <div
        className={`
          mt-5 flex items-center justify-center gap-2
          transition-opacity

          ${
            phase === 'entry'
              ? 'opacity-100'
              : 'pointer-events-none opacity-0'
          }
        `}
      >
        <span className="text-[10px] text-zinc-700">
          Didn&apos;t receive it?
        </span>

        <button
          type="button"
          disabled={
            resendSeconds > 0 ||
            resending
          }
          onClick={resend}
          className="text-[10px] font-semibold text-[#bb4253] transition-colors hover:text-[#ec6073] disabled:text-zinc-700"
        >
          {resending
            ? 'Sending...'
            : resendSeconds > 0
              ? `Resend in ${resendSeconds}s`
              : 'Resend code'}
        </button>
      </div>

      <style>
        {`
          @keyframes provnVerifiedPulse {
            0% {
              opacity: .75;
              transform: scale(.90);
            }

            70% {
              opacity: 0;
              transform: scale(1.20);
            }

            100% {
              opacity: 0;
              transform: scale(1.20);
            }
          }

          @keyframes provnOtpShake {
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

          @keyframes provnScan {
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
        `}
      </style>
    </div>
  )
}