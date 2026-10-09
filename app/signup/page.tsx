'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
  PointerEvent as ReactPointerEvent,
} from 'react'

import {
  createClient,
} from '@/lib/supabase/client'

/* =========================================================
   PROVN MARK
========================================================= */

function ProVNMark() {
  return (
    <svg
      viewBox="0 0 58 58"
      aria-hidden="true"
      className="
        h-[48px]
        w-[48px]
        shrink-0
        overflow-visible
        drop-shadow-[0_0_11px_rgba(226,32,57,.30)]
      "
    >
      <defs>
        <linearGradient
          id="signup-main"
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
          id="signup-top"
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
          id="signup-edge"
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
        d="
          M4.5 8.5
          H39
          L52 17.5
          L44.5 20.5
          H16.2
          L8.7 15.3
          Z
        "
        fill="url(#signup-top)"
        stroke="url(#signup-edge)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      <path
        d="
          M11.2 21.5
          H37.6
          C46.5 21.5
          52.5 26.3
          52.5 33
          C52.5 40.4
          46.8 45.4
          37.6 45.4
          H26.4
          V36.9
          H37.1
          C40.9 36.9
          43.4 35.2
          43.4 32.8
          C43.4 30.3
          40.9 28.6
          37.1 28.6
          H23.6
          V43.5
          L12 55
          Z
        "
        fill="url(#signup-main)"
        stroke="url(#signup-edge)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      <path
        d="
          M11.8 29.2
          L23.7 40.2
          L23.7 49.3
          L17.8 43.6
          L11.8 38
          Z
        "
        fill="#070405"
      />

      <path
        d="
          M7.2 10
          H38.2
          L47.2 16.3
        "
        fill="none"
        stroke="#ffd3d7"
        strokeOpacity=".66"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <path
        d="
          M43.8 22.7
          C49 24.8
          51 28.2
          51 32.8
          C51 38.8
          46.4 43.3
          38.6 43.7
        "
        fill="none"
        stroke="#ff334c"
        strokeOpacity=".72"
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
      className="
        group/logo
        inline-flex
        items-center
      "
    >
      <span
        className="
          relative
          transition-all
          duration-300
          group-hover/logo:scale-[1.06]
          group-hover/logo:-rotate-[1deg]
        "
      >
        <span
          className="
            pointer-events-none
            absolute
            inset-[8px]
            rounded-full
            bg-[#c31e35]/25
            opacity-0
            blur-[14px]
            transition-opacity
            duration-300
            group-hover/logo:opacity-100
          "
        />

        <span className="relative z-10">
          <ProVNMark />
        </span>
      </span>

      <span
        className="
          -ml-[3px]
          translate-y-[4px]
          text-[23px]
          font-black
          leading-none
          tracking-[-0.055em]
        "
      >
        <span className="text-[#f6f3f3]">
          ro
        </span>

        <span
          className="
            text-[#e51f3b]
            drop-shadow-[0_0_8px_rgba(229,31,59,.18)]
          "
        >
          VN
        </span>
      </span>
    </Link>
  )
}

/* =========================================================
   FAST PROVN CURSOR
========================================================= */

function ProVNCursor() {
  const cursorRef =
    useRef<HTMLDivElement | null>(
      null
    )

  const ringRef =
    useRef<HTMLDivElement | null>(
      null
    )

  useEffect(() => {
    const cursor =
      cursorRef.current

    const ring =
      ringRef.current

    if (
      !cursor ||
      !ring
    ) {
      return
    }

    const finePointer =
      window.matchMedia(
        '(pointer: fine)'
      )

    if (
      !finePointer.matches
    ) {
      return
    }

    const style =
      document.createElement(
        'style'
      )

    style.textContent = `
      @media (pointer: fine) {
        html,
        body,
        body * {
          cursor: none !important;
        }
      }
    `

    document.head.appendChild(
      style
    )

    const selector =
      'a, button, input, textarea, select, label, [role="button"], [data-cursor-active]'

    let visible = false
    let interactive = false
    let pressed = false

    function isInteractive(
      target:
        EventTarget | null
    ) {
      if (
        !(
          target instanceof
          Element
        )
      ) {
        return false
      }

      return Boolean(
        target.closest(
          selector
        )
      )
    }

    function setVisible(
      next: boolean
    ) {
      visible = next

      cursor!.style.opacity =
        next
          ? '1'
          : '0'
    }

    function setInteractive(
      next: boolean
    ) {
      interactive = next

      if (!pressed) {
        ring!.style.transform =
          next
            ? 'scale(1.31)'
            : 'scale(1)'
      }

      ring!.style.borderColor =
        next
          ? 'rgba(255,64,87,.98)'
          : 'rgba(223,35,60,.84)'

      ring!.style.backgroundColor =
        next
          ? 'rgba(6,4,5,.97)'
          : 'rgba(3,3,4,.92)'

      ring!.style.boxShadow =
        next
          ? '0 0 17px rgba(229,31,59,.32), inset 0 0 9px rgba(255,46,70,.06)'
          : '0 0 9px rgba(229,31,59,.18)'
    }

    function handleMove(
      event:
        PointerEvent
    ) {
      cursor!.style.transform =
        `translate3d(${event.clientX - 15}px, ${event.clientY - 15}px, 0)`

      if (!visible) {
        setVisible(
          true
        )
      }
    }

    function handleOver(
      event:
        PointerEvent
    ) {
      setInteractive(
        isInteractive(
          event.target
        )
      )
    }

    function handleOut(
      event:
        PointerEvent
    ) {
      setInteractive(
        isInteractive(
          event.relatedTarget
        )
      )
    }

    function handleDown() {
      pressed = true

      ring!.style.transform =
        interactive
          ? 'scale(1.11)'
          : 'scale(.84)'
    }

    function handleUp(
      event:
        PointerEvent
    ) {
      pressed = false

      const next =
        isInteractive(
          event.target
        )

      interactive = next

      ring!.style.transform =
        next
          ? 'scale(1.31)'
          : 'scale(1)'
    }

    function hide() {
      setVisible(
        false
      )
    }

    function show() {
      setVisible(
        true
      )
    }

    window.addEventListener(
      'pointermove',
      handleMove,
      {
        passive: true,
      }
    )

    document.addEventListener(
      'pointerover',
      handleOver,
      {
        passive: true,
      }
    )

    document.addEventListener(
      'pointerout',
      handleOut,
      {
        passive: true,
      }
    )

    window.addEventListener(
      'pointerdown',
      handleDown,
      {
        passive: true,
      }
    )

    window.addEventListener(
      'pointerup',
      handleUp,
      {
        passive: true,
      }
    )

    document.addEventListener(
      'mouseleave',
      hide
    )

    document.addEventListener(
      'mouseenter',
      show
    )

    return () => {
      window.removeEventListener(
        'pointermove',
        handleMove
      )

      document.removeEventListener(
        'pointerover',
        handleOver
      )

      document.removeEventListener(
        'pointerout',
        handleOut
      )

      window.removeEventListener(
        'pointerdown',
        handleDown
      )

      window.removeEventListener(
        'pointerup',
        handleUp
      )

      document.removeEventListener(
        'mouseleave',
        hide
      )

      document.removeEventListener(
        'mouseenter',
        show
      )

      style.remove()
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        z-[9999]
        hidden
        h-[30px]
        w-[30px]
        opacity-0
        transition-opacity
        duration-75
        md:block
      "
      style={{
        transform:
          'translate3d(-100px,-100px,0)',
        willChange:
          'transform',
      }}
    >
      <div
        ref={ringRef}
        className="
          absolute
          inset-0
          rounded-full
          border
          border-[#df233c]/85
          bg-[#030304]/90
          transition-[transform,border-color,background-color,box-shadow]
          duration-100
          ease-out
        "
        style={{
          transform:
            'scale(1)',
          boxShadow:
            '0 0 9px rgba(229,31,59,.18)',
        }}
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[6px]
          w-[6px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#e51f3b]
          shadow-[0_0_7px_rgba(229,31,59,.72)]
        "
      />
    </div>
  )
}

/* =========================================================
   EYE ICON
========================================================= */

function EyeIcon({
  open,
}: {
  open: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="
        h-[18px]
        w-[18px]
      "
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

/* =========================================================
   INPUT
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
    <div
      className="
        group/input
      "
    >
      <label
        className="
          mb-2
          block
          text-[9px]
          font-medium
          uppercase
          tracking-[0.22em]
          text-zinc-500
          transition-colors
          duration-300
          group-focus-within/input:text-[#cb4c5b]
        "
      >
        {label}
      </label>

      <div
        className="
          relative
        "
      >
        <input
          data-cursor-active
          type={type}
          value={value}
          onChange={event =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          autoComplete={
            autoComplete
          }
          required
          className="
            h-[55px]
            w-full
            rounded-[13px]
            border
            border-white/[0.075]
            bg-[#08080a]/95
            px-4
            pr-12
            text-[14px]
            text-zinc-100
            outline-none
            transition-all
            duration-300
            placeholder:text-zinc-700
            hover:border-white/[0.14]
            hover:bg-[#0b0b0e]
            focus:border-[#a62c3b]
            focus:bg-[#0d090b]
            focus:shadow-[0_0_0_3px_rgba(173,37,55,.07),0_0_30px_rgba(117,13,29,.13)]
          "
        />

        {rightElement && (
          <div
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
            "
          >
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   FLOATING CARD
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
      className={`
        absolute
        rounded-[15px]
        border
        border-white/[0.08]
        bg-black/75
        px-4
        py-3
        shadow-[0_18px_50px_rgba(0,0,0,.42)]
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-[#752934]
        hover:bg-[#0d0709]/90
        ${className}
      `}
    >
      <p
        className="
          text-[8px]
          uppercase
          tracking-[0.24em]
          text-zinc-600
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-[12px]
          font-semibold
          tracking-[-0.02em]
          text-zinc-200
        "
      >
        {value}
      </p>
    </div>
  )
}

/* =========================================================
   IDENTITY CORE
========================================================= */

function IdentityVisual() {
  return (
    <div
      className="
        relative
        h-[245px]
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.055]
        bg-black/25
        shadow-[inset_0_1px_0_rgba(255,255,255,.025)]
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,rgba(146,18,39,.13),transparent_48%)]
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[198px]
          w-[198px]
          -translate-x-1/2
          -translate-y-1/2
          animate-spin
          rounded-full
          border
          border-[#8d2433]/28
          [animation-duration:22s]
        "
      >
        <span
          className="
            absolute
            left-[20px]
            top-[22px]
            h-[7px]
            w-[7px]
            rounded-full
            bg-[#e82c45]
            shadow-[0_0_15px_rgba(232,44,69,.9)]
          "
        />
      </div>

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[148px]
          w-[148px]
          -translate-x-1/2
          -translate-y-1/2
          animate-spin
          rounded-full
          border
          border-[#a52a3a]/25
          [animation-direction:reverse]
          [animation-duration:15s]
        "
      >
        <span
          className="
            absolute
            bottom-[8px]
            right-[24px]
            h-[5px]
            w-[5px]
            rounded-full
            bg-[#ff5369]
            shadow-[0_0_12px_rgba(255,83,105,.85)]
          "
        />
      </div>

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[116px]
          w-[116px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#72212d]/28
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          flex
          h-[92px]
          w-[92px]
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-[#a72c3d]/55
          bg-[#060607]
          shadow-[0_0_55px_rgba(170,25,48,.20),inset_0_0_22px_rgba(144,24,43,.08)]
        "
      >
        <div
          className="
            absolute
            inset-[11px]
            animate-pulse
            rounded-full
            bg-[#bd1e36]/10
            blur-[9px]
          "
        />

        <div
          className="
            relative
            z-10
            scale-[1.02]
          "
        >
          <ProVNMark />
        </div>
      </div>

      <div
        className="
          absolute
          left-[10%]
          right-[10%]
          top-1/2
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#8e2433]/32
          to-transparent
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-1/2
          top-0
          w-px
          -translate-x-1/2
          bg-gradient-to-b
          from-transparent
          via-[#741b29]/16
          to-transparent
        "
      />

      <FloatingCard
        label="PROFILE"
        value="VERIFIED"
        className="
          left-[18px]
          top-[18px]
        "
      />

      <FloatingCard
        label="STATUS"
        value="ONLINE"
        className="
          right-[18px]
          top-[18px]
        "
      />

      <FloatingCard
        label="MATCH"
        value="READY"
        className="
          bottom-[18px]
          right-[18px]
        "
      />

      <div
        className="
          absolute
          bottom-[22px]
          left-[22px]
          flex
          items-center
          gap-2
        "
      >
        <span
          className="
            h-[5px]
            w-[5px]
            animate-pulse
            rounded-full
            bg-[#cc3046]
            shadow-[0_0_8px_rgba(204,48,70,.75)]
          "
        />

        <p
          className="
            text-[8px]
            uppercase
            tracking-[0.28em]
            text-[#74333d]
          "
        >
          Network Active
        </p>
      </div>
    </div>
  )
}

/* =========================================================
   INTERACTIVE PANEL
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
      !window.matchMedia(
        '(pointer: fine)'
      ).matches
    ) {
      return
    }

    const rect =
      event.currentTarget.getBoundingClientRect()

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

    /*
      Restrained movement.

      Enough to feel alive
      without making the
      form annoying to use.
    */

    const rotateY =
      (x - 0.5) * 4.8

    const rotateX =
      (0.5 - y) * 3.8

    if (
      panelRef.current
    ) {
      panelRef.current.style.transition =
        'transform 55ms linear, box-shadow 80ms linear'

      panelRef.current.style.transform =
        `perspective(1800px) translateY(-4px) scale(1.008) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

      panelRef.current.style.boxShadow =
        `${-rotateY}px ${39 + rotateX}px 108px rgba(0,0,0,.68), 0 20px 54px rgba(91,7,23,.17)`
    }

    if (
      glowRef.current
    ) {
      glowRef.current.style.opacity =
        '1'

      glowRef.current.style.background =
        `radial-gradient(470px circle at ${x * 100}% ${y * 100}%, rgba(235,47,72,.11), transparent 64%)`
    }

    if (
      leftRef.current
    ) {
      leftRef.current.style.transform =
        `translate3d(${(x - 0.5) * 8}px, ${(y - 0.5) * 6}px, 18px)`
    }

    if (
      rightRef.current
    ) {
      rightRef.current.style.transform =
        `translate3d(${(x - 0.5) * -3}px, ${(y - 0.5) * -2}px, 10px)`
    }
  }

  function handleLeave() {
    if (
      panelRef.current
    ) {
      panelRef.current.style.transition =
        'transform 480ms cubic-bezier(.16,1,.3,1), box-shadow 420ms ease'

      panelRef.current.style.transform =
        'perspective(1800px) translateY(0px) scale(1) rotateX(0deg) rotateY(0deg)'

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
      data-cursor-active
      onPointerMove={
        handleMove
      }
      onPointerLeave={
        handleLeave
      }
      className="
        relative
        w-full
        max-w-[1160px]
        [perspective:1800px]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          bottom-[-40px]
          left-1/2
          h-[42px]
          w-[75%]
          -translate-x-1/2
          rounded-full
          bg-black/80
          blur-[27px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -inset-px
          rounded-[31px]
          bg-gradient-to-br
          from-white/[0.09]
          via-transparent
          to-[#862431]/18
          opacity-70
        "
      />

      <div
        ref={panelRef}
        className="
          relative
          overflow-hidden
          rounded-[30px]
          border
          border-white/[0.07]
          bg-[#070708]/95
          shadow-[0_44px_115px_rgba(0,0,0,.60)]
          [transform-style:preserve-3d]
          will-change-transform
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-[3%]
            right-[3%]
            top-0
            z-[3]
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#b53748]/45
            to-transparent
          "
        />

        <div
          ref={glowRef}
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            opacity-0
            transition-opacity
            duration-200
          "
        />

        <div
          className="
            relative
            z-10
            grid
            lg:grid-cols-[.97fr_1.03fr]
          "
        >
          <div
            ref={leftRef}
            className="
              hidden
              border-r
              border-white/[0.05]
              transition-transform
              duration-100
              [transform-style:preserve-3d]
              lg:block
            "
          >
            {left}
          </div>

          <div
            ref={rightRef}
            className="
              transition-transform
              duration-100
              [transform-style:preserve-3d]
            "
          >
            {right}
          </div>
        </div>
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
    confirmPassword,
    setConfirmPassword,
  ] =
    useState('')

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
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

  useEffect(() => {
    const page =
      pageRef.current

    if (!page) {
      return
    }

    page.style.opacity =
      '0'

    page.style.transform =
      'translateY(12px) scale(.992)'

    page.style.transition =
      'opacity 700ms cubic-bezier(.16,1,.3,1), transform 850ms cubic-bezier(.16,1,.3,1)'

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

  async function handleSignup(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError('')
    setSuccess('')

    const cleanedName =
      fullName.trim()

    const cleanedUsername =
      username
        .trim()
        .toLowerCase()

    const cleanedEmail =
      email
        .trim()
        .toLowerCase()

    if (
      !cleanedName ||
      !cleanedUsername ||
      !cleanedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError(
        'Complete all fields to continue.'
      )

      return
    }

    if (
      !/^[a-z0-9_.]{3,20}$/.test(
        cleanedUsername
      )
    ) {
      setError(
        'Username must be 3 to 20 characters and use only letters, numbers, _ or .'
      )

      return
    }

    if (
      password.length <
      8
    ) {
      setError(
        'Password must contain at least 8 characters.'
      )

      return
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      )

      return
    }

    setLoading(
      true
    )

    try {
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
                full_name:
                  cleanedName,

                username:
                  cleanedUsername,
              },
            },
          }
        )

      if (
        signupError
      ) {
        setError(
          signupError.message
        )

        return
      }

      if (
        data.session
      ) {
        router.push(
          '/onboarding'
        )

        router.refresh()

        return
      }

      setSuccess(
        'Account created. Check your email to verify your ProVN account.'
      )
    } catch {
      setError(
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(
        false
      )
    }
  }

  const leftPanel = (
    <div
      className="
        relative
        flex
        min-h-[680px]
        flex-col
        justify-between
        overflow-hidden
        p-10
        xl:p-11
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_16%_20%,rgba(158,23,43,.16),transparent_39%),linear-gradient(145deg,#0d080a_0%,#080708_54%,#050506_100%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[-210px]
          top-[115px]
          h-[490px]
          w-[490px]
          rounded-full
          border
          border-[#8e2634]/18
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[-140px]
          top-[185px]
          h-[350px]
          w-[350px]
          rounded-full
          border
          border-[#ae3241]/10
        "
      />

      <div
        className="
          relative
          z-10
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              h-px
              w-8
              bg-[#9f3040]
            "
          />

          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.38em]
              text-[#9e414e]
            "
          >
            PROVN / IDENTITY 001
          </p>
        </div>

        <h1
          className="
            mt-7
            text-[48px]
            font-black
            leading-[0.92]
            tracking-[-0.055em]
            xl:text-[54px]
          "
        >
          <span
            className="
              text-[#f7f3f3]
            "
          >
            Your Game.
          </span>

          <br />

          <span
            className="
              text-[#d42d42]
            "
          >
            Your Proof.
          </span>

          <br />

          <span
            className="
              text-[#f7f3f3]
            "
          >
            Your Identity.
          </span>
        </h1>

        <p
          className="
            mt-6
            max-w-[395px]
            text-[14px]
            leading-7
            text-zinc-500
          "
        >
          Build your gaming identity,
          prove your performance and
          unlock the people and
          opportunities around your game.
        </p>
      </div>

      <div
        className="
          relative
          z-10
          my-6
        "
      >
        <IdentityVisual />
      </div>

      <div
        className="
          relative
          z-10
          grid
          grid-cols-3
          gap-3
        "
      >
        {[
          [
            '01',
            'Build Identity',
          ],

          [
            '02',
            'Prove Skill',
          ],

          [
            '03',
            'Get Discovered',
          ],
        ].map(
          ([number, label]) => (
            <div
              key={number}
              className="
                rounded-[14px]
                border
                border-white/[0.055]
                bg-white/[0.018]
                px-4
                py-3
                transition-all
                duration-300
                hover:-translate-y-[2px]
                hover:border-[#6e2731]
                hover:bg-[#11080a]
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                  text-[#ca4858]
                "
              >
                {number}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-zinc-500
                "
              >
                {label}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )

  const rightPanel = (
    <div
      className="
        relative
        flex
        min-h-[680px]
        items-center
        px-6
        py-9
        sm:px-10
        lg:px-10
        xl:px-12
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          right-[-150px]
          top-[-150px]
          h-[330px]
          w-[330px]
          rounded-full
          bg-[#971329]/[0.055]
          blur-[105px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[515px]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <div>
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.34em]
                text-[#9e3746]
              "
            >
              CREATE ACCOUNT
            </p>

            <div
              className="
                mt-[7px]
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  h-[5px]
                  w-[5px]
                  animate-pulse
                  rounded-full
                  bg-[#d62e45]
                  shadow-[0_0_8px_rgba(214,46,69,.7)]
                "
              />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.22em]
                  text-zinc-700
                "
              >
                Identity Node Online
              </span>
            </div>
          </div>

          <span
            className="
              hidden
              rounded-full
              border
              border-[#65242e]/65
              bg-[#12080a]
              px-3
              py-[7px]
              text-[8px]
              uppercase
              tracking-[0.19em]
              text-[#94414d]
              sm:inline-flex
            "
          >
            IDENTITY ACCESS
          </span>
        </div>

        <h2
          className="
            mt-5
            text-[34px]
            font-black
            leading-[0.96]
            tracking-[-0.05em]
            sm:text-[40px]
          "
        >
          Create Your{' '}

          <span
            className="
              text-[#d72e43]
            "
          >
            Identity.
          </span>
        </h2>

        <p
          className="
            mt-3
            text-[13px]
            leading-6
            text-zinc-500
          "
        >
          One account.
          Every side of gaming.
        </p>

        <form
          onSubmit={
            handleSignup
          }
          className="
            mt-7
          "
        >
          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
            "
          >
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

            <InputField
              label="Username"
              value={
                username
              }
              onChange={
                setUsername
              }
              placeholder="kanav"
              autoComplete="username"
            />
          </div>

          <div
            className="
              mt-5
            "
          >
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

          <div
            className="
              mt-5
            "
          >
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
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              rightElement={
                <button
                  data-cursor-active
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      current =>
                        !current
                    )
                  }
                  className="
                    text-zinc-600
                    transition-colors
                    duration-200
                    hover:text-zinc-300
                  "
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
          </div>

          <div
            className="
              mt-5
            "
          >
            <InputField
              label="Confirm Password"
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              value={
                confirmPassword
              }
              onChange={
                setConfirmPassword
              }
              placeholder="Repeat your password"
              autoComplete="new-password"
              rightElement={
                <button
                  data-cursor-active
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      current =>
                        !current
                    )
                  }
                  className="
                    text-zinc-600
                    transition-colors
                    duration-200
                    hover:text-zinc-300
                  "
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <EyeIcon
                    open={
                      showConfirmPassword
                    }
                  />
                </button>
              }
            />
          </div>

          {error && (
            <div
              className="
                mt-5
                rounded-[12px]
                border
                border-red-900/60
                bg-red-950/20
                px-4
                py-3
                text-[12px]
                leading-5
                text-red-300
              "
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="
                mt-5
                rounded-[12px]
                border
                border-emerald-900/60
                bg-emerald-950/20
                px-4
                py-3
                text-[12px]
                leading-5
                text-emerald-300
              "
            >
              {success}
            </div>
          )}

          <button
            data-cursor-active
            type="submit"
            disabled={
              loading
            }
            className="
              group/button
              relative
              mt-6
              flex
              h-[56px]
              w-full
              items-center
              justify-center
              overflow-hidden
              rounded-[13px]
              border
              border-[#c02f42]
              bg-gradient-to-r
              from-[#8a1224]
              via-[#b91d34]
              to-[#d52942]
              text-[11px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-white
              shadow-[0_16px_38px_rgba(120,12,31,.22)]
              transition-all
              duration-300
              hover:-translate-y-[2px]
              hover:border-[#e64b5d]
              hover:shadow-[0_22px_52px_rgba(151,17,40,.33)]
              active:translate-y-0
              active:scale-[0.992]
              disabled:opacity-55
            "
          >
            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-[-40%]
                w-[35%]
                -skew-x-[22deg]
                bg-white/[0.10]
                opacity-0
                blur-[4px]
                transition-all
                duration-700
                group-hover/button:left-[120%]
                group-hover/button:opacity-100
              "
            />

            <span
              className="
                relative
                z-10
              "
            >
              {loading
                ? 'Creating Identity...'
                : 'Create Account →'}
            </span>
          </button>

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              gap-3
              text-[8px]
              uppercase
              tracking-[0.16em]
              text-zinc-700
            "
          >
            <span>
              Secure Identity
            </span>

            <span>
              Protected Access
            </span>
          </div>

          <p
            className="
              mt-4
              text-center
              text-[10px]
              leading-5
              text-zinc-700
            "
          >
            By creating an account,
            you agree to ProVN&apos;s
            Terms and Privacy Policy.
          </p>
        </form>

        <div
          className="
            my-6
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              h-px
              flex-1
              bg-white/[0.055]
            "
          />

          <span
            className="
              text-[8px]
              uppercase
              tracking-[0.24em]
              text-zinc-700
            "
          >
            Already a player?
          </span>

          <div
            className="
              h-px
              flex-1
              bg-white/[0.055]
            "
          />
        </div>

        <Link
          href="/login"
          data-cursor-active
          className="
            group/login
            flex
            h-[50px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-[13px]
            border
            border-white/[0.075]
            bg-white/[0.015]
            text-[11px]
            font-semibold
            text-zinc-400
            transition-all
            duration-300
            hover:-translate-y-[1px]
            hover:border-[#70303a]
            hover:bg-[#14090c]
            hover:text-white
          "
        >
          Sign In to ProVN

          <span
            className="
              transition-transform
              duration-300
              group-hover/login:translate-x-1
            "
          >
            →
          </span>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <ProVNCursor />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#020203]
          text-white
        "
      >
        {/* BASE BACKGROUND */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
          "
          style={{
            background:
              'radial-gradient(circle at 7% 17%, rgba(125,9,27,.13), transparent 31%), radial-gradient(circle at 93% 20%, rgba(115,10,29,.09), transparent 28%), radial-gradient(circle at 50% 110%, rgba(88,5,20,.11), transparent 43%), #020203',
          }}
        />

        {/* GRID */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.095]
          "
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',

            backgroundSize:
              '76px 76px',
          }}
        />

        {/* ORBITS */}

        <div
          className="
            pointer-events-none
            absolute
            -left-[285px]
            top-[150px]
            h-[650px]
            w-[650px]
            animate-spin
            rounded-full
            border
            border-[#70202c]/14
            [animation-duration:38s]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-[325px]
            bottom-[-170px]
            h-[710px]
            w-[710px]
            animate-spin
            rounded-full
            border
            border-[#812430]/13
            [animation-direction:reverse]
            [animation-duration:46s]
          "
        />

        {/* SMALL LIGHTS */}

        <div
          className="
            pointer-events-none
            absolute
            left-[8%]
            top-[39%]
            h-[7px]
            w-[7px]
            animate-pulse
            rounded-full
            bg-[#c42d43]
            shadow-[0_0_16px_rgba(196,45,67,.65)]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[9%]
            top-[47%]
            h-[6px]
            w-[6px]
            animate-pulse
            rounded-full
            bg-[#c22b40]
            shadow-[0_0_14px_rgba(194,43,64,.58)]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[14%]
            left-[18%]
            h-[4px]
            w-[4px]
            animate-pulse
            rounded-full
            bg-[#9f2638]
            shadow-[0_0_10px_rgba(159,38,56,.58)]
          "
        />

        {/* HEADER */}

        <header
          className="
            absolute
            left-0
            top-0
            z-40
            w-full
          "
        >
          <div
            className="
              mx-auto
              flex
              h-[82px]
              max-w-[1500px]
              items-center
              justify-between
              px-5
              sm:px-7
              lg:px-10
            "
          >
            <ProVNLogo />

            <Link
              href="/"
              data-cursor-active
              className="
                group
                flex
                items-center
                gap-2
                text-[11px]
                font-medium
                text-zinc-600
                transition-colors
                duration-300
                hover:text-zinc-200
              "
            >
              <span
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-x-1
                "
              >
                ←
              </span>

              Back to Home
            </Link>
          </div>
        </header>

        {/* PAGE */}

        <div
          ref={pageRef}
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-screen
            max-w-[1500px]
            items-center
            justify-center
            px-5
            pb-12
            pt-[102px]
            sm:px-7
            lg:px-10
          "
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