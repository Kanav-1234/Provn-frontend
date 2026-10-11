'use client'

import Link from 'next/link'

import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/* =========================================================
   EXACT PROVN NATIVE CURSOR
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
   PROVN METALLIC MARK
========================================================= */

function ProVNMark({
  id,
  className = 'h-[48px] w-[48px]',
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
      className={`${className} shrink-0 overflow-visible drop-shadow-[0_0_11px_rgba(226,32,57,.30)]`}
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
            stopColor="#ff8a95"
          />

          <stop
            offset="12%"
            stopColor="#e65362"
          />

          <stop
            offset="30%"
            stopColor="#bb283b"
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
          id={top}
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
          id={edge}
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
            stopColor="#ff5265"
          />

          <stop
            offset="100%"
            stopColor="#6c0716"
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
        d="M23.7 28.6 L30.4 35.8 L26.4 36.9 L23.7 34.4 Z"
        fill="#29060c"
        opacity=".92"
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
   HEADER LOGO
========================================================= */

function ProVNLogo() {
  return (
    <Link
      href="/"
      aria-label="ProVN home"
      className="group inline-flex items-center"
    >
      <span className="relative transition-all duration-300 group-hover:scale-[1.06] group-hover:-rotate-[1deg]">
        <span className="pointer-events-none absolute inset-[8px] rounded-full bg-[#c31e35]/25 opacity-0 blur-[14px] transition-opacity duration-300 group-hover:opacity-100" />

        <span className="relative z-10">
          <ProVNMark
            id="login-logo"
          />
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
   PASSWORD EYE
========================================================= */

function EyeIcon({
  open,
}: {
  open: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none h-[18px] w-[18px]"
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
   LEFT STATUS ROW
========================================================= */

function AccessStatusRow({
  number,
  label,
  status,
}: {
  number: string
  label: string
  status: string
}) {
  return (
    <div className="flex h-[43px] items-center border-b border-white/[0.045] px-4 last:border-b-0">
      <span className="w-[29px] text-[8px] font-semibold text-[#b83447]">
        {number}
      </span>

      <span className="text-[8px] uppercase tracking-[0.18em] text-zinc-700">
        {label}
      </span>

      <span className="ml-auto flex items-center gap-2">
        <span className="h-[5px] w-[5px] rounded-full bg-[#e12f49] shadow-[0_0_10px_rgba(225,47,73,.8)]" />

        <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-600">
          {status}
        </span>
      </span>
    </div>
  )
}

/* =========================================================
   LOGIN PAGE
========================================================= */

export default function LoginPage() {
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

  /* =======================================================
     PREMIUM CARD TILT
  ======================================================== */

  const panelRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const panelRectRef =
    useRef<DOMRect | null>(
      null
    )

  const panelFrameRef =
    useRef<number | null>(
      null
    )

  const panelPointerRef =
    useRef({
      x: 0,
      y: 0,
    })

  /* =======================================================
     USERNAME NORMALIZATION
  ======================================================== */

  const cleanedUsername =
    useMemo(
      () =>
        username
          .trim()
          .toLowerCase()
          .replace(/^@/, ''),

      [
        username,
      ]
    )

  const usernameValid =
    /^[a-z0-9._]{3,20}$/.test(
      cleanedUsername
    )

  const canSubmit =
    usernameValid &&
    password.length > 0 &&
    !loading

  /* =======================================================
     IDENTITY VERIFIED MESSAGE
  ======================================================== */

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
     RAF CLEANUP
  ======================================================== */

  useEffect(() => {
    return () => {
      if (
        panelFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          panelFrameRef.current
        )
      }
    }
  }, [])

  /* =======================================================
     CARD TILT
  ======================================================== */

  function handlePanelEnter(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    if (
      !window
        .matchMedia(
          '(pointer: fine)'
        )
        .matches
    ) {
      return
    }

    panelRectRef.current =
      event
        .currentTarget
        .getBoundingClientRect()

    event
      .currentTarget
      .classList
      .add(
        'login-panel-tracking'
      )
  }

  function handlePanelMove(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    const panel =
      event.currentTarget

    if (
      panel.dataset
        .formHover ===
      'true'
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

    if (
      !panelRectRef.current
    ) {
      panelRectRef.current =
        panel
          .getBoundingClientRect()
    }

    panelPointerRef.current = {
      x:
        event.clientX,

      y:
        event.clientY,
    }

    if (
      panelFrameRef.current !==
      null
    ) {
      return
    }

    panelFrameRef.current =
      requestAnimationFrame(
        () => {
          panelFrameRef.current =
            null

          const rect =
            panelRectRef.current

          if (!rect) {
            return
          }

          const x =
            Math.max(
              0,
              Math.min(
                1,
                (
                  panelPointerRef
                    .current
                    .x -
                  rect.left
                ) /
                  rect.width
              )
            )

          const y =
            Math.max(
              0,
              Math.min(
                1,
                (
                  panelPointerRef
                    .current
                    .y -
                  rect.top
                ) /
                  rect.height
              )
            )

          const rotateY =
            (
              x -
              0.5
            ) *
            7

          const rotateX =
            (
              0.5 -
              y
            ) *
            4.8

          panel.style
            .setProperty(
              '--login-rx',
              `${rotateX}deg`
            )

          panel.style
            .setProperty(
              '--login-ry',
              `${rotateY}deg`
            )
        }
      )
  }

  function handlePanelLeave(
    event:
      ReactPointerEvent<HTMLDivElement>
  ) {
    if (
      panelFrameRef.current !==
      null
    ) {
      cancelAnimationFrame(
        panelFrameRef.current
      )

      panelFrameRef.current =
        null
    }

    panelRectRef.current =
      null

    const panel =
      event.currentTarget

    panel
      .classList
      .remove(
        'login-panel-tracking'
      )

    panel.style
      .setProperty(
        '--login-rx',
        '0deg'
      )

    panel.style
      .setProperty(
        '--login-ry',
        '0deg'
      )
  }

  function pausePanelTilt(
    event:
      ReactPointerEvent<HTMLElement>
  ) {
    const panel =
      event
        .currentTarget
        .closest(
          '.login-panel'
        ) as
          | HTMLDivElement
          | null

    if (!panel) {
      return
    }

    panel.dataset
      .formHover =
      'true'

    if (
      panelFrameRef.current !==
      null
    ) {
      cancelAnimationFrame(
        panelFrameRef.current
      )

      panelFrameRef.current =
        null
    }

    panel
      .classList
      .remove(
        'login-panel-tracking'
      )

    panel
      .classList
      .add(
        'login-panel-form'
      )

    panel.style
      .setProperty(
        '--login-rx',
        '0deg'
      )

    panel.style
      .setProperty(
        '--login-ry',
        '0deg'
      )
  }

  function resumePanelTilt(
    event:
      ReactPointerEvent<HTMLElement>
  ) {
    const panel =
      event
        .currentTarget
        .closest(
          '.login-panel'
        ) as
          | HTMLDivElement
          | null

    if (!panel) {
      return
    }

    delete panel
      .dataset
      .formHover

    panel
      .classList
      .remove(
        'login-panel-form'
      )

    panel
      .classList
      .add(
        'login-panel-tracking'
      )

    panelRectRef.current =
      panel
        .getBoundingClientRect()
  }

  /* =======================================================
     LOGIN
  ======================================================== */

  async function handleLogin(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (loading) {
      return
    }

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

    setLoading(
      true
    )

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

            cache:
              'no-store',

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

      if (
        !response.ok
      ) {
        setError(
          result.error ||
            'Invalid username or password.'
        )

        return
      }

      /*
        IMPORTANT FIX:

        Do a REAL browser navigation after login.

        This guarantees the browser applies the fresh
        Supabase auth cookies before the homepage loads.

        It also means HomeAuthButton sees the authenticated
        user immediately and changes Sign In -> Level Up.
      */

      window.location.replace(
        '/'
      )
    } catch (
      loginError
    ) {
      console.error(
        'Login request failed:',
        loginError
      )

      setError(
        'Could not reach ProVN authentication. Try again.'
      )
    } finally {
      setLoading(
        false
      )
    }
  }

  return (
    <>
      {/* ===================================================
          LOGIN PAGE CSS
      ==================================================== */}

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

          @keyframes provnLoginIn {
            from {
              opacity: 0;
              transform:
                translateY(12px)
                scale(.988);

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

          @keyframes provnCoreScan {
            0% {
              top: 9%;
              opacity: 0;
            }

            15% {
              opacity: .6;
            }

            50% {
              opacity: .28;
            }

            85% {
              opacity: .6;
            }

            100% {
              top: 90%;
              opacity: 0;
            }
          }

          @keyframes provnCorePulse {
            0%,
            100% {
              opacity: .42;
              transform:
                scale(.96);
            }

            50% {
              opacity: .8;
              transform:
                scale(1.04);
            }
          }

          .login-panel {
            --login-rx: 0deg;
            --login-ry: 0deg;
            --login-lift: 0px;
            --login-scale: 1;

            transform:
              perspective(1450px)
              translate3d(
                0,
                var(--login-lift),
                0
              )
              scale(
                var(--login-scale)
              )
              rotateX(
                var(--login-rx)
              )
              rotateY(
                var(--login-ry)
              );

            transform-style:
              preserve-3d;

            backface-visibility:
              hidden;

            will-change:
              transform;

            transition:
              transform
                420ms
                cubic-bezier(.16,1,.3,1),
              border-color
                220ms
                ease,
              box-shadow
                220ms
                ease;
          }

          .login-panel.login-panel-tracking {
            transition:
              border-color
                220ms
                ease,
              box-shadow
                220ms
                ease;
          }

          .login-panel.login-panel-form {
            transition:
              transform
                150ms
                cubic-bezier(.16,1,.3,1),
              border-color
                220ms
                ease,
              box-shadow
                220ms
                ease;
          }

          @media (hover: hover) and (pointer: fine) {
            .login-panel:hover {
              --login-lift: -6px;
              --login-scale: 1.004;

              border-color:
                rgba(
                  103,
                  34,
                  45,
                  .72
                );

              box-shadow:
                0
                42px
                110px
                rgba(
                  0,
                  0,
                  0,
                  .62
                ),

                0
                20px
                44px
                rgba(
                  72,
                  5,
                  18,
                  .15
                );
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .login-panel {
              transform:
                none
                !important;

              transition:
                none
                !important;
            }
          }
        `}
      </style>

      <main className="relative min-h-screen overflow-hidden bg-[#020203] text-white">
        {/* =================================================
            BACKGROUND
        ================================================= */}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 7% 17%, rgba(125,9,27,.13), transparent 31%), radial-gradient(circle at 93% 20%, rgba(115,10,29,.09), transparent 28%), radial-gradient(circle at 50% 110%, rgba(88,5,20,.11), transparent 43%), #020203',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)',

            backgroundSize:
              '76px 76px',

            WebkitMaskImage:
              'radial-gradient(circle at center,black,transparent 84%)',

            maskImage:
              'radial-gradient(circle at center,black,transparent 84%)',
          }}
        />

        <div className="pointer-events-none absolute left-1/2 top-[44%] h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#620819]/[0.065] blur-[155px]" />

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="absolute left-0 top-0 z-40 w-full">
          <div className="mx-auto flex h-[78px] max-w-[1500px] items-center justify-between px-5 sm:px-7 lg:px-10">
            <ProVNLogo />

            <Link
              href="/"
              className="group flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-700 transition-colors duration-200 hover:text-zinc-300"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                ←
              </span>

              Back to Home
            </Link>
          </div>
        </header>

        {/* =================================================
            PAGE
        ================================================= */}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] items-center justify-center px-5 pb-10 pt-[92px] sm:px-7 lg:px-10">
          <div className="w-full max-w-[1015px] [perspective:1450px]">
            <div
              ref={panelRef}
              onPointerEnter={
                handlePanelEnter
              }
              onPointerMove={
                handlePanelMove
              }
              onPointerLeave={
                handlePanelLeave
              }
              className="login-panel relative animate-[provnLoginIn_.6s_cubic-bezier(.16,1,.3,1)_both] overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#060607]/98 shadow-[0_44px_115px_rgba(0,0,0,.60)]"
            >
              {/* TOP METALLIC EDGE */}

              <div className="pointer-events-none absolute left-[7%] right-[7%] top-0 z-30 h-px bg-gradient-to-r from-transparent via-[#9a2d3d]/38 to-transparent" />

              <div className="relative z-10 grid lg:grid-cols-[.93fr_1.07fr]">
                {/* =========================================
                    LEFT ACCESS NODE
                ========================================== */}

                <section className="relative hidden min-h-[720px] overflow-hidden border-r border-white/[0.05] px-9 py-8 lg:flex lg:flex-col">
                  {/* BACKGROUND */}

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(circle at 49% 44%,rgba(122,15,34,.14),transparent 35%),linear-gradient(150deg,#090608,#050506 55%,#030304)',
                    }}
                  />

                  {/* TOP */}

                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.36em] text-[#a13848]">
                        ACCESS NODE
                      </p>

                      <p className="mt-[7px] text-[7px] uppercase tracking-[0.22em] text-zinc-800">
                        PROVN / AUTH 002
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-[#68222e]/65 bg-[#100709] px-3 py-[7px]">
                      <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#cb2f46] shadow-[0_0_8px_rgba(203,47,70,.75)]" />

                      <span className="text-[7px] uppercase tracking-[0.16em] text-[#81404a]">
                        ONLINE
                      </span>
                    </div>
                  </div>

                  {/* ACCESS CORE */}

                  <div className="relative z-10 flex flex-1 items-center justify-center">
                    <div className="relative flex h-[310px] w-[310px] items-center justify-center">
                      {/* ORBITS */}

                      <div className="absolute h-[245px] w-[245px] animate-spin rounded-full border border-[#7f1c2d]/25 [animation-duration:24s]">
                        <span className="absolute right-[30px] top-[20px] h-[7px] w-[7px] rounded-full bg-[#d63c50] shadow-[0_0_13px_rgba(214,60,80,.85)]" />
                      </div>

                      <div className="absolute h-[190px] w-[190px] animate-spin rounded-full border border-[#8d2433]/30 [animation-direction:reverse] [animation-duration:17s]">
                        <span className="absolute bottom-[10px] left-[24px] h-[5px] w-[5px] rounded-full bg-[#d42f46] shadow-[0_0_11px_rgba(212,47,70,.75)]" />
                      </div>

                      <div className="absolute h-[138px] w-[138px] rounded-full border border-[#8b2432]/22" />

                      <div className="absolute left-[20px] right-[20px] top-1/2 h-px bg-gradient-to-r from-transparent via-[#79202e]/30 to-transparent" />

                      <div className="absolute bottom-[18px] left-1/2 top-[18px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#79202e]/22 to-transparent" />

                      {/* CORE SQUARE */}

                      <div className="relative z-10 flex h-[128px] w-[128px] items-center justify-center rounded-[26px] border border-[#792a36]/75 bg-[#090709]/95 shadow-[0_20px_55px_rgba(0,0,0,.40),0_0_52px_rgba(119,13,31,.10),inset_0_1px_0_rgba(255,255,255,.025)]">
                        {/* CORNERS */}

                        <span className="absolute left-[16px] top-[16px] h-[11px] w-[11px] border-l border-t border-[#8d3440]/70" />

                        <span className="absolute right-[16px] top-[16px] h-[11px] w-[11px] border-r border-t border-[#8d3440]/70" />

                        <span className="absolute bottom-[16px] left-[16px] h-[11px] w-[11px] border-b border-l border-[#8d3440]/70" />

                        <span className="absolute bottom-[16px] right-[16px] h-[11px] w-[11px] border-b border-r border-[#8d3440]/70" />

                        {/* SCAN LINE */}

                        <span className="pointer-events-none absolute left-[15%] right-[15%] h-px animate-[provnCoreScan_3.1s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#db3f53]/45 to-transparent" />

                        {/* GLOW */}

                        <span className="pointer-events-none absolute h-[76px] w-[76px] animate-[provnCorePulse_2.7s_ease-in-out_infinite] rounded-full bg-[#a81830]/12 blur-[18px]" />

                        <div className="relative z-10 scale-[1.22]">
                          <ProVNMark
                            id="login-core"
                          />
                        </div>

                        <span className="absolute bottom-[9px] text-[6px] uppercase tracking-[0.24em] text-[#612934]">
                          PVN / CORE
                        </span>
                      </div>

                      <div className="absolute bottom-[7px] left-1/2 -translate-x-1/2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-px w-6 bg-[#69222f]/60" />

                          <p className="text-[7px] uppercase tracking-[0.25em] text-[#7b303c]">
                            ACCESS CORE
                          </p>

                          <span className="h-px w-6 bg-[#69222f]/60" />
                        </div>

                        <p className="mt-[8px] whitespace-nowrap text-[6px] uppercase tracking-[0.20em] text-zinc-800">
                          LIVE IDENTITY GATEWAY
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* STATUS BLOCK */}

                  <div className="relative z-10 overflow-hidden rounded-[16px] border border-white/[0.055] bg-black/25">
                    <AccessStatusRow
                      number="01"
                      label="Gateway"
                      status="Ready"
                    />

                    <AccessStatusRow
                      number="02"
                      label="Identity"
                      status="Active"
                    />

                    <AccessStatusRow
                      number="03"
                      label="Session"
                      status="Protected"
                    />
                  </div>

                  {/* BOTTOM */}

                  <div className="relative z-10 mt-5 flex items-center justify-between text-[6px] uppercase tracking-[0.20em] text-zinc-800">
                    <span>
                      NODE / 002
                    </span>

                    <span>
                      SECURE ACCESS
                    </span>
                  </div>
                </section>

                {/* =========================================
                    RIGHT LOGIN
                ========================================== */}

                <section
                  onPointerEnter={
                    pausePanelTilt
                  }
                  onPointerLeave={
                    resumePanelTilt
                  }
                  className="relative flex min-h-[720px] items-center px-6 py-8 sm:px-10 lg:px-10"
                >
                  <div className="pointer-events-none absolute right-[-150px] top-[-160px] h-[350px] w-[350px] rounded-full bg-[#971329]/[0.055] blur-[110px]" />

                  <div className="relative z-10 mx-auto w-full max-w-[445px]">
                    {/* TOP STATUS */}

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.34em] text-[#9f3847]">
                          SIGN IN
                        </p>

                        <div className="mt-[8px] flex items-center gap-2">
                          <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[#d52e45] shadow-[0_0_9px_rgba(213,46,69,.7)]" />

                          <span className="text-[7px] uppercase tracking-[0.20em] text-zinc-800">
                            SECURE AUTHENTICATION ONLINE
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full border border-[#63232d]/65 bg-[#100708] px-3 py-[8px] text-[7px] uppercase tracking-[0.16em] text-[#7c3540]">
                        PROTECTED
                      </span>
                    </div>

                    {/* TITLE */}

                    <p className="mt-7 text-[12px] text-zinc-600">
                      Welcome back.
                    </p>

                    <h1 className="mt-2 text-[45px] font-black leading-[0.94] tracking-[-0.055em] text-[#f7f3f3]">
                      Enter{' '}

                      <span className="text-[#d72e43]">
                        ProVN.
                      </span>
                    </h1>

                    <p className="mt-5 text-[11px] leading-5 text-zinc-600">
                      Continue to your gaming identity,
                      reputation and opportunities.
                    </p>

                    {/* VERIFIED NOTICE */}

                    {verifiedNotice && (
                      <div className="mt-7 flex min-h-[52px] items-center rounded-[13px] border border-emerald-900/45 bg-emerald-950/[0.08] px-4">
                        <span className="mr-3 h-[6px] w-[6px] rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,.75)]" />

                        <div>
                          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-emerald-500">
                            IDENTITY CREATED
                          </p>

                          <p className="mt-[5px] text-[7px] text-zinc-700">
                            Your account is ready.
                          </p>
                        </div>

                        <span className="ml-auto text-[7px] uppercase tracking-[0.14em] text-zinc-800">
                          VERIFIED
                        </span>
                      </div>
                    )}

                    {/* =====================================
                        LOGIN FORM
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
                          <label className="text-[8px] font-semibold uppercase tracking-[0.21em] text-zinc-500">
                            Username
                          </label>

                          <span className="text-[6px] uppercase tracking-[0.18em] text-zinc-800">
                            ID / 01
                          </span>
                        </div>

                        <div className="relative">
                          <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[14px] text-zinc-600">
                            @
                          </span>

                          <input
                            data-writing-field="true"
                            type="text"
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

                                setError(
                                  ''
                                )
                              }
                            }
                            placeholder="yourname"
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            maxLength={20}
                            className="h-[55px] w-full rounded-[13px] border border-white/[0.075] bg-[#070708] py-0 pl-8 pr-4 text-[13px] text-zinc-200 outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-zinc-800 hover:border-white/[0.13] focus:border-[#9b2a3a] focus:bg-[#0a0809] focus:shadow-[0_0_0_3px_rgba(173,37,55,.06),0_0_25px_rgba(117,13,29,.10)]"
                          />
                        </div>
                      </div>

                      {/* PASSWORD */}

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-[8px] font-semibold uppercase tracking-[0.21em] text-zinc-500">
                            Password
                          </label>

                          <span className="text-[6px] uppercase tracking-[0.18em] text-zinc-800">
                            KEY / 02
                          </span>
                        </div>

                        <div className="relative">
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

                                setError(
                                  ''
                                )
                              }
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="h-[55px] w-full rounded-[13px] border border-white/[0.075] bg-[#070708] px-4 pr-[54px] text-[13px] text-zinc-200 outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-zinc-800 hover:border-white/[0.13] focus:border-[#a62c3b] focus:bg-[#0a0809] focus:shadow-[0_0_0_3px_rgba(173,37,55,.06),0_0_25px_rgba(117,13,29,.10)]"
                          />

                          {/* =================================
                              FIXED EYE BUTTON
                          ================================= */}

                          <button
                            type="button"
                            aria-label={
                              showPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                            aria-pressed={
                              showPassword
                            }
                            onMouseDown={
                              event => {
                                /*
                                  Keep password input from losing
                                  focus when the eye is pressed.
                                */

                                event.preventDefault()
                              }
                            }
                            onClick={
                              event => {
                                event.preventDefault()

                                event.stopPropagation()

                                setShowPassword(
                                  current =>
                                    !current
                                )
                              }
                            }
                            className="pointer-events-auto absolute right-[10px] top-1/2 z-30 flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-[9px] text-zinc-700 transition-[background-color,color,transform] duration-150 hover:bg-white/[0.035] hover:text-zinc-300 active:scale-[0.92]"
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
                        <div className="mt-5 rounded-[12px] border border-red-900/60 bg-red-950/20 px-4 py-3 text-[10px] leading-5 text-red-300">
                          {error}
                        </div>
                      )}

                      {/* ENTER PROVN */}

                      <button
                        type="submit"
                        disabled={
                          !canSubmit
                        }
                        className="group relative mt-6 flex h-[56px] w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#b92b40] bg-gradient-to-r from-[#861123] via-[#a9182d] to-[#c42239] text-[9px] font-bold uppercase tracking-[0.19em] text-white shadow-[0_16px_38px_rgba(120,12,31,.22)] transition-[transform,border-color,box-shadow,filter] duration-200 hover:-translate-y-[2px] hover:border-[#e1485b] hover:brightness-[1.08] hover:shadow-[0_22px_52px_rgba(151,17,40,.31)] active:translate-y-0 active:scale-[0.993] disabled:translate-y-0 disabled:border-white/[0.055] disabled:bg-none disabled:bg-[#0b0b0d] disabled:text-zinc-700 disabled:shadow-none disabled:brightness-100"
                      >
                        <span className="pointer-events-none absolute inset-y-0 left-[-40%] w-[35%] -skew-x-[22deg] bg-white/[0.10] opacity-0 blur-[4px] transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

                        <span className="relative z-10 flex items-center gap-5">
                          {loading
                            ? 'AUTHENTICATING...'
                            : 'ENTER PROVN'}

                          {!loading && (
                            <span className="text-[14px] font-normal transition-transform duration-200 group-hover:translate-x-1">
                              →
                            </span>
                          )}
                        </span>
                      </button>
                    </form>

                    {/* =====================================
                        CREATE IDENTITY
                    ====================================== */}

                    <div className="my-6 h-px bg-white/[0.05]" />

                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <p className="text-[7px] uppercase tracking-[0.18em] text-zinc-800">
                          NEW TO PROVN?
                        </p>

                        <p className="mt-2 text-[8px] text-zinc-600">
                          Claim your identity.
                        </p>
                      </div>

                      <Link
                        href="/signup"
                        className="group inline-flex h-[45px] min-w-[132px] items-center justify-center gap-4 rounded-[12px] border border-white/[0.07] bg-white/[0.012] px-4 text-[8px] font-semibold uppercase tracking-[0.08em] text-zinc-400 transition-[transform,border-color,background-color,color] duration-200 hover:-translate-y-[1px] hover:border-[#6f2933] hover:bg-[#13090b] hover:text-white"
                      >
                        Create Identity

                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>

                    {/* BOTTOM META */}

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.035] pt-4 text-[6px] uppercase tracking-[0.18em] text-zinc-800">
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