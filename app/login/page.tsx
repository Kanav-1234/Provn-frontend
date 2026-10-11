'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useState,
} from 'react'

/* =========================================================
   PROVN NATIVE CURSOR
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
  const main = `${id}-main`
  const top = `${id}-top`
  const edge = `${id}-edge`

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
          id="header-logo"
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
   STATUS ROW
========================================================= */

function StatusRow({
  number,
  label,
  value,
}: {
  number: string
  label: string
  value: string
}) {
  return (
    <div className="status-row flex items-center justify-between border-b border-white/[0.05] py-[12px] last:border-none">

      <div className="flex items-center gap-3">

        <span className="text-[7px] font-bold tracking-[0.17em] text-[#bb3c50]">
          {number}
        </span>

        <span className="text-[7px] uppercase tracking-[0.19em] text-zinc-600">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">

        <span className="h-[5px] w-[5px] rounded-full bg-[#ed4058] shadow-[0_0_12px_rgba(237,64,88,.80)]" />

        <span className="text-[7px] uppercase tracking-[0.14em] text-zinc-500">
          {value}
        </span>
      </div>
    </div>
  )
}

/* =========================================================
   LOGIN PAGE
========================================================= */

export default function LoginPage() {
  const router =
    useRouter()

  const [
    username,
    setUsername,
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
    verifiedNotice,
    setVerifiedNotice,
  ] =
    useState(false)

  const cleanedUsername =
    useMemo(
      () =>
        username
          .trim()
          .toLowerCase()
          .replace(/^@/, ''),
      [username]
    )

  const usernameValid =
    /^[a-z0-9._]{3,20}$/.test(
      cleanedUsername
    )

  const canSubmit =
    usernameValid &&
    password.length > 0 &&
    !loading

  useEffect(() => {
    const justVerified =
      window
        .sessionStorage
        .getItem(
          'provn.just-verified'
        )

    if (justVerified) {
      setVerifiedNotice(
        true
      )

      window
        .sessionStorage
        .removeItem(
          'provn.just-verified'
        )
    }
  }, [])

  /* =======================================================
     FULL RECTANGLE LIVE TILT
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

    const px =
      Math.min(
        Math.max(
          x /
            rect.width,
          0
        ),
        1
      )

    const py =
      Math.min(
        Math.max(
          y /
            rect.height,
          0
        ),
        1
      )

    /*
       LEFT  = negative rotateY
       RIGHT = positive rotateY

       approx:
       far left  -6°
       center      0°
       far right  +6°
    */

    const rotateY =
      (px - 0.5) *
      12

    const rotateX =
      (0.5 - py) *
      7

    /*
       shadow moves opposite cursor
    */

    const shadowX =
      (0.5 - px) *
      34

    const shadowY =
      25 +
      (0.5 - py) *
        15

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
      '25px'
    )
  }

  /* =======================================================
     INNER ACCESS CORE TILT
  ======================================================= */

  function handleModuleMove(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    /*
      Important:

      Prevent the core's movement
      from also constantly changing
      the large rectangle movement.
    */

    event.stopPropagation()

    const module =
      event.currentTarget

    const rect =
      module
        .getBoundingClientRect()

    const x =
      event.clientX -
      rect.left

    const y =
      event.clientY -
      rect.top

    const px =
      Math.min(
        Math.max(
          x /
            rect.width,
          0
        ),
        1
      )

    const py =
      Math.min(
        Math.max(
          y /
            rect.height,
          0
        ),
        1
      )

    const rotateY =
      (px - 0.5) *
      24

    const rotateX =
      (0.5 - py) *
      15

    const shadowX =
      (0.5 - px) *
      22

    const shadowY =
      12 +
      (0.5 - py) *
        13

    module.style.setProperty(
      '--module-rx',
      `${rotateX}deg`
    )

    module.style.setProperty(
      '--module-ry',
      `${rotateY}deg`
    )

    module.style.setProperty(
      '--module-mx',
      `${x}px`
    )

    module.style.setProperty(
      '--module-my',
      `${y}px`
    )

    module.style.setProperty(
      '--module-shadow-x',
      `${shadowX}px`
    )

    module.style.setProperty(
      '--module-shadow-y',
      `${shadowY}px`
    )
  }

  function resetModule(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    event.stopPropagation()

    const module =
      event.currentTarget

    module.style.setProperty(
      '--module-rx',
      '0deg'
    )

    module.style.setProperty(
      '--module-ry',
      '0deg'
    )

    module.style.setProperty(
      '--module-mx',
      '50%'
    )

    module.style.setProperty(
      '--module-my',
      '50%'
    )

    module.style.setProperty(
      '--module-shadow-x',
      '0px'
    )

    module.style.setProperty(
      '--module-shadow-y',
      '12px'
    )
  }

  /* =======================================================
     LOGIN
  ======================================================= */

  async function handleLogin(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError('')

    if (!usernameValid) {
      setError(
        'Enter your ProVN username.'
      )

      return
    }

    if (!password) {
      setError(
        'Enter your password.'
      )

      return
    }

    setLoading(true)

    try {
      const response =
        await fetch(
          '/api/auth/login',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            credentials:
              'same-origin',

            body:
              JSON.stringify({
                username:
                  cleanedUsername,

                password,
              }),
          }
        )

      const result =
        await response
          .json()
          .catch(
            () => ({})
          )

      if (!response.ok) {
        setError(
          result.error ||
            'Invalid username or password.'
        )

        return
      }

      router.replace('/')
      router.refresh()
    } catch (loginError) {
      console.error(
        'Login request failed:',
        loginError
      )

      setError(
        'Could not reach ProVN authentication. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>
        {`
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

          /* =============================================
             ENTRY ANIMATION

             VERY IMPORTANT:
             this animation is on the OUTER wrapper,
             NOT the tilting rectangle.
          ============================================== */

          @keyframes loginEntrance {
            from {
              opacity: 0;

              transform:
                translateY(18px)
                scale(.985);

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

          .login-entry {
            animation:
              loginEntrance
              .65s
              cubic-bezier(.16,1,.3,1)
              both;
          }

          /* =============================================
             ORBIT ANIMATIONS
          ============================================== */

          @keyframes orbitOne {
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

          @keyframes orbitTwo {
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

          @keyframes pulseDot {
            0%, 100% {
              opacity: .55;

              box-shadow:
                0 0 8px
                rgba(
                  241,
                  63,
                  91,
                  .45
                );
            }

            50% {
              opacity: 1;

              box-shadow:
                0 0 20px
                rgba(
                  241,
                  63,
                  91,
                  1
                );
            }
          }

          /* =============================================
             WHOLE LOGIN RECTANGLE LIVE 3D

             THIS NOW OWNS TRANSFORM.
             Nothing else overrides it.
          ============================================== */

          .login-shell {
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
              25px;

            --shell-lift:
              0px;

            --shell-scale:
              1;

            transform:
              perspective(1350px)
              translate3d(
                0,
                var(--shell-lift),
                0
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

            transform-origin:
              center center;

            will-change:
              transform;

            transition:
              transform
                85ms
                linear,

              border-color
                260ms ease,

              box-shadow
                260ms ease;
          }

          .login-shell:hover {
            --shell-lift:
              -7px;

            --shell-scale:
              1.008;

            border-color:
              rgba(
                255,
                255,
                255,
                .14
              );

            box-shadow:
              var(--shell-shadow-x)
              var(--shell-shadow-y)
              105px
              rgba(
                0,
                0,
                0,
                .76
              ),

              0 35px 85px
              rgba(
                0,
                0,
                0,
                .34
              ),

              0 0 0 1px
              rgba(
                231,
                54,
                78,
                .045
              ),

              0 0 95px
              rgba(
                128,
                13,
                33,
                .13
              );
          }

          /* smooth return after pointer leaves */

          .login-shell:not(:hover) {
            transition:
              transform
                480ms
                cubic-bezier(.16,1,.3,1),

              border-color
                280ms ease,

              box-shadow
                280ms ease;
          }

          /* =============================================
             ENTIRE RECTANGLE POINTER REFLECTION
          ============================================== */

          .shell-reflection {
            background:
              radial-gradient(
                430px circle
                at
                var(--shell-mx)
                var(--shell-my),

                rgba(
                  255,
                  255,
                  255,
                  .085
                ),

                rgba(
                  239,
                  61,
                  86,
                  .070
                )
                18%,

                rgba(
                  211,
                  41,
                  65,
                  .022
                )
                39%,

                transparent
                66%
              );

            opacity:
              0;

            transition:
              opacity
                220ms ease;
          }

          .login-shell:hover
          .shell-reflection {
            opacity:
              1;
          }

          /* metallic surface wash */

          .shell-glass {
            background:
              linear-gradient(
                115deg,

                transparent
                0%,

                rgba(
                  255,
                  255,
                  255,
                  .012
                )
                32%,

                rgba(
                  255,
                  255,
                  255,
                  .045
                )
                48%,

                rgba(
                  200,
                  44,
                  66,
                  .026
                )
                57%,

                transparent
                79%
              );

            opacity:
              .35;

            transition:
              opacity
                260ms ease;
          }

          .login-shell:hover
          .shell-glass {
            opacity:
              .7;
          }

          /* =============================================
             LAYER DEPTH
          ============================================== */

          .shell-left-depth {
            transform:
              translateZ(26px);

            transform-style:
              preserve-3d;
          }

          .shell-right-depth {
            transform:
              translateZ(20px);

            transform-style:
              preserve-3d;
          }

          /* =============================================
             INNER ACCESS CORE 3D
          ============================================== */

          .access-module {
            --module-rx:
              0deg;

            --module-ry:
              0deg;

            --module-mx:
              50%;

            --module-my:
              50%;

            --module-shadow-x:
              0px;

            --module-shadow-y:
              12px;

            position:
              relative;

            transform:
              perspective(800px)
              rotateX(
                var(--module-rx)
              )
              rotateY(
                var(--module-ry)
              );

            transform-style:
              preserve-3d;

            transform-origin:
              center center;

            will-change:
              transform;

            transition:
              transform
                70ms
                linear,

              box-shadow
                220ms ease,

              border-color
                220ms ease;

            box-shadow:
              var(--module-shadow-x)
              var(--module-shadow-y)
              38px
              rgba(
                0,
                0,
                0,
                .44
              ),

              0 0 72px
              rgba(
                176,
                24,
                49,
                .14
              );
          }

          .access-module:not(:hover) {
            transition:
              transform
                420ms
                cubic-bezier(.16,1,.3,1),

              box-shadow
                220ms ease,

              border-color
                220ms ease;
          }

          .access-module:hover {
            border-color:
              rgba(
                229,
                61,
                84,
                .75
              );

            box-shadow:
              var(--module-shadow-x)
              var(--module-shadow-y)
              52px
              rgba(
                0,
                0,
                0,
                .54
              ),

              0 0 105px
              rgba(
                194,
                31,
                56,
                .25
              );
          }

          .module-reflection {
            background:
              radial-gradient(
                150px circle
                at
                var(--module-mx)
                var(--module-my),

                rgba(
                  255,
                  255,
                  255,
                  .20
                ),

                rgba(
                  245,
                  70,
                  93,
                  .12
                )
                25%,

                transparent
                67%
              );

            opacity:
              0;

            transition:
              opacity
                180ms ease;
          }

          .access-module:hover
          .module-reflection {
            opacity:
              1;
          }

          .module-logo-depth {
            transform:
              translateZ(56px)
              scale(1);

            transition:
              transform
                220ms
                cubic-bezier(.16,1,.3,1),

              filter
                220ms ease;
          }

          .access-module:hover
          .module-logo-depth {
            transform:
              translateZ(84px)
              scale(1.08);

            filter:
              drop-shadow(
                0 13px 18px
                rgba(
                  0,
                  0,
                  0,
                  .44
                )
              )
              drop-shadow(
                0 0 17px
                rgba(
                  239,
                  55,
                  81,
                  .34
                )
              );
          }

          .module-corner-depth {
            transform:
              translateZ(20px);
          }

          .module-text-depth {
            transform:
              translateZ(27px);
          }

          /* =============================================
             FORM ELEMENTS
          ============================================== */

          .premium-field-shell {
            transition:
              transform
                210ms
                cubic-bezier(.16,1,.3,1),

              box-shadow
                210ms ease;
          }

          .premium-field-shell:hover {
            transform:
              translateY(-3px);

            box-shadow:
              0 15px 34px
              rgba(
                0,
                0,
                0,
                .20
              );
          }

          .premium-button {
            transition:
              transform
                220ms
                cubic-bezier(.16,1,.3,1),

              border-color
                220ms ease,

              box-shadow
                220ms ease,

              background-color
                220ms ease;
          }

          .premium-button:hover {
            transform:
              translateY(-3px)
              scale(1.006);
          }

          .premium-button:active {
            transform:
              translateY(0)
              scale(.997);
          }

          .status-row {
            transition:
              transform
                180ms ease,

              background-color
                180ms ease;
          }

          .status-row:hover {
            transform:
              translateX(4px);
          }

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .login-entry,
            .login-shell,
            .access-module,
            .premium-field-shell,
            .premium-button {
              animation:
                none !important;

              transform:
                none !important;

              transition:
                none !important;
            }
          }
        `}
      </style>

      <main className="relative min-h-screen overflow-hidden bg-[#020203] text-white">

        {/* ===============================================
            BACKGROUND
        ================================================ */}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 68% 19%, rgba(120,10,31,.15), transparent 28%), radial-gradient(circle at 9% 76%, rgba(84,5,20,.125), transparent 29%), radial-gradient(circle at 50% 110%, rgba(93,8,26,.08), transparent 38%), linear-gradient(125deg,#020203 0%,#040304 57%,#060205 100%)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
            backgroundSize:
              '88px 88px',
          }}
        />

        <div className="pointer-events-none absolute -left-[180px] top-[18%] h-[440px] w-[440px] rounded-full bg-[#5d0618]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -right-[180px] top-[8%] h-[500px] w-[500px] rounded-full bg-[#6f071c]/10 blur-[135px]" />

        {/* ===============================================
            HEADER
        ================================================ */}

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
            TRUE CENTERING AREA
        ================================================ */}

        <div className="relative z-10 flex min-h-[calc(100vh-72px)] w-full items-center justify-center px-5 pb-[72px] sm:px-7 lg:px-9">

          {/* =============================================
              OUTER ENTRY WRAPPER

              This handles entrance animation ONLY.
              It never touches live tilt transform.
          ============================================== */}

          <div className="login-entry w-full max-w-[930px]">

            {/* ===========================================
                ACTUAL 3D LOGIN RECTANGLE
            ============================================ */}

            <div
              onPointerMove={
                handleShellMove
              }
              onPointerLeave={
                resetShell
              }
              className="login-shell relative w-full overflow-hidden rounded-[28px] border border-white/[0.085] bg-[#070708]/[0.98] shadow-[0_46px_110px_rgba(0,0,0,.70)]"
            >

              {/* moving cursor reflection */}

              <div className="shell-reflection pointer-events-none absolute inset-0 z-[20]" />

              {/* surface metallic wash */}

              <div className="shell-glass pointer-events-none absolute inset-0 z-[19]" />

              {/* premium top highlight */}

              <div className="pointer-events-none absolute left-[3%] right-[3%] top-0 z-[24] h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent opacity-60" />

              {/* micro inner border */}

              <div className="pointer-events-none absolute inset-[1px] z-[23] rounded-[27px] border border-white/[0.016]" />

              <div className="relative z-[4] grid lg:grid-cols-[385px_minmax(0,1fr)]">

                {/* =========================================
                    LEFT ACCESS NODE
                ========================================== */}

                <aside className="relative hidden min-h-[570px] overflow-hidden border-r border-white/[0.055] p-8 lg:flex lg:flex-col">

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(circle at 48% 43%, rgba(150,19,42,.16), transparent 37%), linear-gradient(145deg,#0d080a 0%,#080708 55%,#050506 100%)',
                    }}
                  />

                  <div className="shell-left-depth relative z-10 flex h-full flex-col">

                    {/* TOP */}

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[8px] uppercase tracking-[0.35em] text-[#b83b4e]">
                          ACCESS NODE
                        </p>

                        <p className="mt-2 text-[6px] uppercase tracking-[0.21em] text-zinc-700">
                          PROVN / AUTH 002
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-full border border-[#82303d]/60 bg-[#16090c] px-3 py-[7px] shadow-[0_0_20px_rgba(132,24,43,.08)]">

                        <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#f1425b] shadow-[0_0_10px_rgba(241,66,91,.9)]" />

                        <span className="text-[6px] uppercase tracking-[0.19em] text-[#b64c5b]">
                          ONLINE
                        </span>
                      </div>
                    </div>

                    {/* =====================================
                        ACCESS CORE
                    ====================================== */}

                    <div className="my-auto flex items-center justify-center py-6">

                      <div className="relative h-[260px] w-full max-w-[285px]">

                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[230px] w-[230px] animate-[orbitOne_24s_linear_infinite] rounded-full border border-[#8d2030]/28" />

                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[185px] w-[185px] animate-[orbitTwo_17s_linear_infinite] rounded-full border border-[#a9283b]/28" />

                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#992439]/38 to-transparent" />

                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[88%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-[#992439]/34 to-transparent" />

                        <span className="pointer-events-none absolute left-[77%] top-[15%] h-[7px] w-[7px] animate-[pulseDot_2.3s_ease-in-out_infinite] rounded-full bg-[#f33c59]" />

                        <span className="pointer-events-none absolute bottom-[14%] left-[27%] h-[5px] w-[5px] rounded-full bg-[#cf3047] shadow-[0_0_12px_rgba(207,48,71,.8)]" />

                        {/* CORE OBJECT */}

                        <div
                          onPointerMove={
                            handleModuleMove
                          }
                          onPointerLeave={
                            resetModule
                          }
                          className="access-module absolute left-1/2 top-1/2 z-20 h-[126px] w-[126px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-[#ab2b40]/60 bg-[linear-gradient(145deg,#12090b_0%,#080506_48%,#050405_100%)]"
                        >

                          <div className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/[0.035]" />

                          <div className="module-reflection pointer-events-none absolute inset-0 z-30" />

                          <div className="pointer-events-none absolute -right-[35px] -top-[30px] h-[100px] w-[100px] rounded-full bg-[#c62841]/15 blur-[36px]" />

                          <div className="pointer-events-none absolute left-[15%] right-[15%] top-0 h-px bg-gradient-to-r from-transparent via-[#ff7585]/55 to-transparent" />

                          <div className="module-corner-depth absolute left-4 top-4 h-[10px] w-[10px] border-l border-t border-[#a83245]/55" />

                          <div className="module-corner-depth absolute right-4 top-4 h-[10px] w-[10px] border-r border-t border-[#a83245]/55" />

                          <div className="module-corner-depth absolute bottom-4 left-4 h-[10px] w-[10px] border-b border-l border-[#a83245]/55" />

                          <div className="module-corner-depth absolute bottom-4 right-4 h-[10px] w-[10px] border-b border-r border-[#a83245]/55" />

                          <div className="module-logo-depth relative z-20 flex h-full items-center justify-center">

                            <ProVNMark
                              id="interactive-core-logo"
                              className="h-[59px] w-[59px] drop-shadow-[0_0_18px_rgba(239,53,78,.30)]"
                            />
                          </div>

                          <div className="module-text-depth pointer-events-none absolute bottom-[10px] left-0 right-0 text-center">

                            <span className="text-[5px] uppercase tracking-[0.24em] text-[#71303b]">
                              PVN / CORE
                            </span>
                          </div>
                        </div>

                        {/* CORE LABEL */}

                        <div className="pointer-events-none absolute bottom-[-2px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center">

                          <p className="text-[6px] uppercase tracking-[0.31em] text-[#a03b4b]">
                            ACCESS CORE
                          </p>

                          <p className="mt-2 text-[6px] uppercase tracking-[0.18em] text-zinc-700">
                            LIVE IDENTITY GATEWAY
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* =====================================
                        STATUS
                    ====================================== */}

                    <div className="rounded-[17px] border border-white/[0.065] bg-[#080708]/65 px-4 shadow-[0_14px_35px_rgba(0,0,0,.18)] backdrop-blur-xl">

                      <StatusRow
                        number="01"
                        label="Gateway"
                        value="Ready"
                      />

                      <StatusRow
                        number="02"
                        label="Identity"
                        value="Active"
                      />

                      <StatusRow
                        number="03"
                        label="Session"
                        value="Protected"
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-between text-[6px] uppercase tracking-[0.18em] text-zinc-700">

                      <span>
                        NODE / 002
                      </span>

                      <span>
                        SECURE ACCESS
                      </span>
                    </div>
                  </div>
                </aside>

                {/* =========================================
                    RIGHT LOGIN SIDE
                ========================================== */}

                <section className="relative flex min-h-[570px] items-center px-7 py-9 sm:px-10 lg:px-10">

                  <div className="pointer-events-none absolute right-[-140px] top-[-130px] h-[310px] w-[310px] rounded-full bg-[#ba1735]/[0.055] blur-[100px]" />

                  <div className="shell-right-depth relative z-10 mx-auto w-full max-w-[410px]">

                    {/* TOP */}

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[8px] font-medium uppercase tracking-[0.34em] text-[#bd4052]">
                          SIGN IN
                        </p>

                        <div className="mt-[7px] flex items-center gap-2">

                          <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#ef4059] shadow-[0_0_10px_rgba(239,64,89,.85)]" />

                          <span className="text-[6px] uppercase tracking-[0.21em] text-zinc-700">
                            Secure Authentication Online
                          </span>
                        </div>
                      </div>

                      <span className="hidden rounded-full border border-[#84313e]/65 bg-[#17090c] px-3 py-[8px] text-[6px] font-medium uppercase tracking-[0.19em] text-[#bd4e5e] shadow-[0_0_20px_rgba(151,26,47,.08)] sm:inline-flex">
                        PROTECTED
                      </span>
                    </div>

                    {/* TITLE */}

                    <div className="mt-7">

                      <p className="text-[11px] font-medium text-zinc-500">
                        Welcome back.
                      </p>

                      <h1 className="mt-2 text-[40px] font-black leading-[.92] tracking-[-0.058em] sm:text-[45px]">

                        Enter{' '}

                        <span className="bg-gradient-to-r from-[#ef334f] via-[#e62643] to-[#b71531] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(225,42,67,.12)]">
                          ProVN.
                        </span>
                      </h1>

                      <p className="mt-5 max-w-[340px] text-[10px] leading-[1.9] text-zinc-500">
                        Continue to your gaming
                        identity, reputation and
                        opportunities.
                      </p>
                    </div>

                    {/* VERIFIED */}

                    {verifiedNotice && (
                      <div className="mt-5 flex items-center justify-between rounded-[12px] border border-emerald-900/40 bg-emerald-950/[0.08] px-4 py-3">

                        <div className="flex items-center gap-3">

                          <span className="h-[6px] w-[6px] rounded-full bg-emerald-500/80 shadow-[0_0_9px_rgba(34,197,94,.45)]" />

                          <div>

                            <p className="text-[7px] font-semibold uppercase tracking-[0.15em] text-emerald-500/80">
                              Identity Created
                            </p>

                            <p className="mt-1 text-[8px] text-zinc-500">
                              Your account is ready.
                            </p>
                          </div>
                        </div>

                        <span className="text-[6px] uppercase tracking-[0.15em] text-zinc-700">
                          VERIFIED
                        </span>
                      </div>
                    )}

                    {/* =====================================
                        FORM
                    ====================================== */}

                    <form
                      onSubmit={
                        handleLogin
                      }
                      noValidate
                      className="mt-7"
                    >

                      {/* USERNAME */}

                      <div>

                        <div className="mb-2 flex items-center justify-between">

                          <label className="text-[7px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                            Username
                          </label>

                          <span className="text-[6px] uppercase tracking-[0.18em] text-zinc-700">
                            ID / 01
                          </span>
                        </div>

                        <div className="premium-field-shell relative rounded-[13px]">

                          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-zinc-500">
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
                            className="h-[53px] w-full rounded-[13px] border border-white/[0.09] bg-[#09090b]/95 py-0 pl-8 pr-4 text-[13px] text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-600 hover:border-white/[0.14] focus:border-[#c2374b] focus:bg-[#0e090b] focus:shadow-[0_0_0_3px_rgba(190,43,65,.07),0_0_32px_rgba(132,15,35,.13)]"
                          />
                        </div>
                      </div>

                      {/* PASSWORD */}

                      <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between">

                          <label className="text-[7px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                            Password
                          </label>

                          <span className="text-[6px] uppercase tracking-[0.18em] text-zinc-700">
                            KEY / 02
                          </span>
                        </div>

                        <div className="premium-field-shell relative rounded-[13px]">

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
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="h-[53px] w-full rounded-[13px] border border-white/[0.09] bg-[#09090b]/95 px-4 pr-12 text-[13px] text-zinc-100 outline-none transition-all duration-200 placeholder:text-zinc-600 hover:border-white/[0.14] focus:border-[#c2374b] focus:bg-[#0e090b] focus:shadow-[0_0_0_3px_rgba(190,43,65,.07),0_0_32px_rgba(132,15,35,.13)]"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                value =>
                                  !value
                              )
                            }
                            aria-label={
                              showPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-all duration-200 hover:scale-110 hover:text-zinc-200"
                          >

                            <EyeIcon
                              open={
                                showPassword
                              }
                            />
                          </button>
                        </div>
                      </div>

                      {/* ERROR */}

                      {error && (
                        <div className="mt-4 rounded-[11px] border border-red-900/55 bg-red-950/20 px-4 py-3 text-[9px] leading-5 text-red-300">
                          {error}
                        </div>
                      )}

                      {/* LOGIN BUTTON */}

                      <button
                        type="submit"
                        disabled={
                          !canSubmit
                        }
                        className="premium-button group relative mt-5 flex h-[53px] w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#cf374e] bg-[linear-gradient(100deg,#851122_0%,#b91e35_48%,#e23149_100%)] text-[8px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_42px_rgba(128,12,32,.26)] hover:border-[#ff6677] hover:shadow-[0_24px_60px_rgba(166,19,44,.37)] disabled:translate-y-0 disabled:scale-100 disabled:border-white/[0.07] disabled:bg-none disabled:bg-[#101012] disabled:text-zinc-600 disabled:shadow-none"
                      >

                        <span className="pointer-events-none absolute inset-y-0 left-[-40%] w-[32%] -skew-x-[22deg] bg-white/[0.14] opacity-0 blur-[5px] transition-all duration-700 group-hover:left-[125%] group-hover:opacity-100" />

                        <span className="relative z-10 flex items-center gap-3">

                          {loading
                            ? 'AUTHENTICATING...'
                            : (
                              <>
                                ENTER PROVN

                                <span className="text-[13px] transition-transform duration-200 group-hover:translate-x-1.5">
                                  →
                                </span>
                              </>
                            )}
                        </span>
                      </button>
                    </form>

                    {/* =====================================
                        CREATE IDENTITY
                    ====================================== */}

                    <div className="mt-6 flex items-center justify-between gap-5 border-t border-white/[0.065] pt-5">

                      <div>

                        <p className="text-[6px] uppercase tracking-[0.23em] text-zinc-600">
                          New to ProVN?
                        </p>

                        <p className="mt-2 text-[9px] text-zinc-500">
                          Claim your identity.
                        </p>
                      </div>

                      <Link
                        href="/signup"
                        className="premium-button group inline-flex h-[42px] items-center justify-center gap-3 rounded-[11px] border border-white/[0.10] bg-white/[0.02] px-4 text-[7px] font-semibold uppercase tracking-[0.12em] text-zinc-300 hover:border-[#9a3847] hover:bg-[#17090c] hover:text-white hover:shadow-[0_12px_30px_rgba(0,0,0,.2)]"
                      >
                        Create Identity

                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>

                    {/* FOOTER */}

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.04] pt-3 text-[5px] uppercase tracking-[0.19em] text-zinc-700">

                      <span>
                        PROVN ACCESS SYSTEM
                      </span>

                      <span>
                        NODE 002 / SECURE
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}