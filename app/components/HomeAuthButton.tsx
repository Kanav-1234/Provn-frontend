'use client'

import Link from 'next/link'

import {
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

type AuthState = {
  signedIn: boolean
  username: string | null
}

/* =========================================================
   HELPERS
========================================================= */

function cleanUsername(
  value: unknown
) {
  if (
    typeof value !== 'string'
  ) {
    return null
  }

  const username =
    value
      .trim()
      .toLowerCase()
      .replace(/^@/, '')

  return username || null
}

/* =========================================================
   ICONS
========================================================= */

function AccessIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 5H7.8A2.8 2.8 0 0 0 5 7.8v8.4A2.8 2.8 0 0 0 7.8 19H10" />
      <path d="M13.5 8 17.5 12l-4 4" />
      <path d="M9.5 12h8" />
    </svg>
  )
}

function CrownIcon() {
  return (
    <span
      aria-hidden="true"
      className="translate-y-[-1px] text-[15px] leading-none"
    >
      ♛
    </span>
  )
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
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

/* =========================================================
   COMPONENT
========================================================= */

export default function HomeAuthButton() {
  const supabase =
    useMemo(
      () =>
        createClient(),
      []
    )

  const [
    authState,
    setAuthState,
  ] =
    useState<AuthState | null>(
      null
    )

  const [
    opening,
    setOpening,
  ] =
    useState(false)

  const navigatingRef =
    useRef(false)

  /* =======================================================
     RESOLVE CURRENT PROFILE USERNAME
  ======================================================== */

  async function getProfileUsername() {
    const {
      data: userResult,
      error: userError,
    } =
      await supabase
        .auth
        .getUser()

    if (
      userError ||
      !userResult.user
    ) {
      return {
        loggedIn: false,
        username: null,
      }
    }

    const user =
      userResult.user

    const metadataUsername =
      cleanUsername(
        user
          .user_metadata
          ?.username
      )

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from('profiles')
        .select('username')
        .eq(
          'id',
          user.id
        )
        .maybeSingle()

    if (profileError) {
      console.warn(
        'ProVN profile username lookup failed:',
        profileError.message
      )
    }

    const profileUsername =
      cleanUsername(
        profile?.username
      )

    return {
      loggedIn: true,

      username:
        profileUsername ??
        metadataUsername,
    }
  }

  /* =======================================================
     AUTH STATE
  ======================================================== */

  useEffect(() => {
    let active = true

    async function initialize() {
      const result =
        await getProfileUsername()

      if (!active) {
        return
      }

      setAuthState({
        signedIn:
          result.loggedIn,

        username:
          result.username,
      })
    }

    void initialize()

    const {
      data: listener,
    } =
      supabase
        .auth
        .onAuthStateChange(
          (
            _event,
            session
          ) => {
            if (!active) {
              return
            }

            if (!session?.user) {
              setAuthState({
                signedIn: false,
                username: null,
              })

              return
            }

            const immediateUsername =
              cleanUsername(
                session
                  .user
                  .user_metadata
                  ?.username
              )

            setAuthState({
              signedIn: true,
              username:
                immediateUsername,
            })

            window.setTimeout(
              () => {
                void (
                  async () => {
                    const result =
                      await getProfileUsername()

                    if (!active) {
                      return
                    }

                    setAuthState({
                      signedIn:
                        result.loggedIn,

                      username:
                        result.username,
                    })
                  }
                )()
              },
              0
            )
          }
        )

    return () => {
      active = false

      listener
        .subscription
        .unsubscribe()
    }
  }, [
    supabase,
  ])

  /* =======================================================
     OPEN CURRENT USER PROFILE
  ======================================================== */

  async function openProfile() {
    if (
      navigatingRef.current
    ) {
      return
    }

    navigatingRef.current =
      true

    setOpening(true)

    try {
      let username =
        authState?.username ??
        null

      if (!username) {
        const result =
          await getProfileUsername()

        if (
          !result.loggedIn
        ) {
          window.location.href =
            '/login'

          return
        }

        username =
          result.username
      }

      if (!username) {
        console.error(
          'No ProVN username found for current user.'
        )

        navigatingRef.current =
          false

        setOpening(false)

        return
      }

      window.location.href =
        `/profiles/${encodeURIComponent(
          username
        )}`
    } catch (
      error
    ) {
      console.error(
        'Failed to open ProVN profile:',
        error
      )

      navigatingRef.current =
        false

      setOpening(false)
    }
  }

  /* =======================================================
     LOADING PLACEHOLDER
  ======================================================== */

  if (
    authState === null
  ) {
    return (
      <span
        aria-hidden="true"
        className="relative z-[99999] inline-flex h-[52px] min-w-[178px] rounded-full"
      />
    )
  }

  /* =======================================================
     SIGNED IN — LEVEL UP
  ======================================================== */

  if (
    authState.signedIn
  ) {
    return (
      <button
        type="button"

        disabled={
          opening
        }

        onPointerDown={event => {
          if (
            event.pointerType ===
              'mouse' &&
            event.button !== 0
          ) {
            return
          }

          event.stopPropagation()

          void openProfile()
        }}

        onClick={event => {
          event.stopPropagation()

          if (
            event.detail === 0
          ) {
            void openProfile()
          }
        }}

        aria-label="Open your ProVN profile"

        className="
          group
          pointer-events-auto
          relative
          z-[99999]
          isolate
          inline-flex
          h-[52px]
          min-w-[178px]
          items-center
          justify-center
          overflow-hidden
          rounded-full
          border
          border-[#7d2835]/85
          bg-[#0b0406]/90
          px-[10px]
          shadow-[inset_0_1px_0_rgba(255,255,255,.055),0_12px_34px_rgba(0,0,0,.24),0_0_0_1px_rgba(97,22,34,.16)]
          backdrop-blur-2xl
          transition-all
          duration-300
          hover:-translate-y-[2px]
          hover:border-[#bd4052]
          hover:bg-[#13070a]
          hover:shadow-[inset_0_1px_0_rgba(255,255,255,.075),0_18px_45px_rgba(0,0,0,.30),0_0_34px_rgba(177,32,53,.17)]
          active:translate-y-0
          active:scale-[0.985]
          disabled:opacity-70
        "

        style={{
          pointerEvents:
            'auto',

          position:
            'relative',

          zIndex:
            99999,
        }}
      >
        {/* LEFT RED AMBIENT GLOW */}

        <span className="pointer-events-none absolute -left-8 top-1/2 h-[86px] w-[86px] -translate-y-1/2 rounded-full bg-[#c5223c]/[0.11] blur-[28px] transition-all duration-500 group-hover:bg-[#df334d]/[0.17]" />

        {/* RIGHT RED AMBIENT GLOW */}

        <span className="pointer-events-none absolute -right-10 top-1/2 h-[75px] w-[75px] -translate-y-1/2 rounded-full bg-[#7a1525]/[0.08] blur-[30px] transition-all duration-500 group-hover:bg-[#b42339]/[0.12]" />

        {/* METALLIC TOP EDGE */}

        <span className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8b9a]/25 to-transparent" />

        {/* BOTTOM EDGE */}

        <span className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#5f1723]/55 to-transparent" />

        {/* MOVING SHEEN */}

        <span className="pointer-events-none absolute left-[-55%] top-[-35%] h-[175%] w-[32%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/[0.055] to-transparent blur-[2px] transition-all duration-700 ease-out group-hover:left-[120%]" />

        {/* INNER GLASS */}

        <span className="pointer-events-none absolute inset-[4px] rounded-full border border-white/[0.025]" />

        <div className="relative z-[3] flex w-full items-center">
          {/* ICON */}

          <span className="
            flex
            h-[34px]
            w-[34px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#802b37]/80
            bg-gradient-to-br
            from-[#210b10]
            via-[#130609]
            to-[#080304]
            text-[#e34c61]
            shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_6px_18px_rgba(0,0,0,.30)]
            transition-all
            duration-300
            group-hover:scale-[1.07]
            group-hover:border-[#b43c4c]
            group-hover:text-[#ff6579]
            group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,.09),0_8px_22px_rgba(0,0,0,.36),0_0_18px_rgba(199,42,64,.12)]
          ">
            <CrownIcon />
          </span>

          {/* TEXT */}

          <span className="ml-[14px] text-[13px] font-semibold tracking-[-0.015em] text-[#f3efef]">
            {opening
              ? 'Opening...'
              : 'Level Up'}
          </span>

          {/* ARROW */}

          <span className="
            ml-auto
            mr-[7px]
            flex
            h-[25px]
            w-[25px]
            translate-x-[-3px]
            items-center
            justify-center
            rounded-full
            text-[#79303b]
            opacity-50
            transition-all
            duration-300
            group-hover:translate-x-0
            group-hover:bg-[#250b10]
            group-hover:text-[#e34b60]
            group-hover:opacity-100
          ">
            <ArrowIcon />
          </span>
        </div>
      </button>
    )
  }

  /* =======================================================
     SIGNED OUT — PREMIUM SIGN IN
  ======================================================== */

  return (
    <Link
      href="/login"

      aria-label="Sign in to ProVN"

      className="
        group
        pointer-events-auto
        relative
        z-[99999]
        isolate
        inline-flex
        h-[52px]
        min-w-[178px]
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-[#7b2734]/85
        bg-[#0a0405]/90
        px-[10px]
        shadow-[inset_0_1px_0_rgba(255,255,255,.055),0_12px_34px_rgba(0,0,0,.24),0_0_0_1px_rgba(97,22,34,.16)]
        backdrop-blur-2xl
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-[#bd4052]
        hover:bg-[#13070a]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,.075),0_18px_45px_rgba(0,0,0,.30),0_0_34px_rgba(177,32,53,.17)]
        active:translate-y-0
        active:scale-[0.985]
      "

      style={{
        pointerEvents:
          'auto',

        position:
          'relative',

        zIndex:
          99999,
      }}
    >
      {/* LEFT GLOW */}

      <span className="pointer-events-none absolute -left-8 top-1/2 h-[88px] w-[88px] -translate-y-1/2 rounded-full bg-[#c5223c]/[0.11] blur-[28px] transition-all duration-500 group-hover:bg-[#e02c48]/[0.18]" />

      {/* RIGHT GLOW */}

      <span className="pointer-events-none absolute -right-8 top-1/2 h-[72px] w-[72px] -translate-y-1/2 rounded-full bg-[#721322]/[0.07] blur-[28px] transition-all duration-500 group-hover:bg-[#a71d31]/[0.11]" />

      {/* METALLIC TOP EDGE */}

      <span className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8b9a]/25 to-transparent" />

      {/* BOTTOM EDGE */}

      <span className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#5f1723]/55 to-transparent" />

      {/* MOVING SHEEN */}

      <span className="pointer-events-none absolute left-[-55%] top-[-35%] h-[175%] w-[32%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/[0.055] to-transparent blur-[2px] transition-all duration-700 ease-out group-hover:left-[120%]" />

      {/* INNER GLASS BORDER */}

      <span className="pointer-events-none absolute inset-[4px] rounded-full border border-white/[0.025]" />

      <div className="relative z-[3] flex w-full items-center">
        {/* ACCESS ICON */}

        <span className="
          flex
          h-[34px]
          w-[34px]
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-[#802b37]/80
          bg-gradient-to-br
          from-[#210b10]
          via-[#130609]
          to-[#080304]
          text-[#df4b5f]
          shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_6px_18px_rgba(0,0,0,.30)]
          transition-all
          duration-300
          group-hover:scale-[1.07]
          group-hover:border-[#b43c4c]
          group-hover:text-[#ff6579]
          group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,.09),0_8px_22px_rgba(0,0,0,.36),0_0_18px_rgba(199,42,64,.12)]
        ">
          <AccessIcon />
        </span>

        {/* SIGN IN TEXT */}

        <span className="ml-[14px] text-[13px] font-semibold tracking-[-0.015em] text-[#f3efef]">
          Sign In
        </span>

        {/* ARROW CAPSULE */}

        <span className="
          ml-auto
          mr-[7px]
          flex
          h-[25px]
          w-[25px]
          translate-x-[-3px]
          items-center
          justify-center
          rounded-full
          text-[#79303b]
          opacity-50
          transition-all
          duration-300
          group-hover:translate-x-0
          group-hover:bg-[#250b10]
          group-hover:text-[#e34b60]
          group-hover:opacity-100
        ">
          <ArrowIcon />
        </span>
      </div>
    </Link>
  )
}