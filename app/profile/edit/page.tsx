'use client'

import Link from 'next/link'
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
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
}

type LoadState =
  | 'loading'
  | 'ready'
  | 'error'

/* =========================================================
   CURSOR
========================================================= */

const provnCursorSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 25 29">
  <defs>
    <linearGradient id="cursorBody" x1="3" y1="2" x2="18" y2="26">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#eeeeee"/>
      <stop offset="70%" stop-color="#cbc8ca"/>
      <stop offset="100%" stop-color="#969296"/>
    </linearGradient>

    <linearGradient id="cursorEdge" x1="2" y1="2" x2="18" y2="26">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="52%" stop-color="#777377"/>
      <stop offset="80%" stop-color="#aa293c"/>
      <stop offset="100%" stop-color="#64111d"/>
    </linearGradient>
  </defs>

  <path
    d="M2.7 2.2V22.3L7.45 18.1L11.85 26.55L15.55 24.65L11.45 16.55H19.55L2.7 2.2Z"
    fill="url(#cursorBody)"
    stroke="url(#cursorEdge)"
    stroke-width="1.35"
    stroke-linejoin="round"
  />
</svg>
`

const PROVN_CURSOR =
  `url("data:image/svg+xml,${encodeURIComponent(
    provnCursorSvg
  )}") 1 1, auto`

/* =========================================================
   ICONS
========================================================= */

function ArrowLeftIcon() {
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
      <path d="M16 10H5" />
      <path d="m9 6-4 4 4 4" />
    </svg>
  )
}

function ArrowRightIcon() {
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
      aria-hidden="true"
    >
      <path d="m4 10 3.5 3.5L16 5.5" />
    </svg>
  )
}

function LockIcon() {
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

/* =========================================================
   PAGE
========================================================= */

export default function EditProfilePage() {
  const supabase =
    useMemo(
      () => createClient(),
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
    displayName,
    setDisplayName,
  ] =
    useState('')

  const [
    bio,
    setBio,
  ] =
    useState('')

  const [
    originalDisplayName,
    setOriginalDisplayName,
  ] =
    useState('')

  const [
    originalBio,
    setOriginalBio,
  ] =
    useState('')

  const [
    emailVerified,
    setEmailVerified,
  ] =
    useState(false)

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    saved,
    setSaved,
  ] =
    useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(
      null
    )

  /* =======================================================
     LOAD CURRENT USER + PROFILE
  ======================================================== */

  useEffect(() => {
    let active = true

    async function loadProfile() {
      const {
        data: userResult,
        error: userError,
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
        window.location.replace(
          '/login'
        )

        return
      }

      const user =
        userResult.user

      const {
        data: profileResult,
        error: profileError,
      } =
        await supabase
          .from('profiles')
          .select(
            'id, username, display_name, avatar_url, bio'
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
          'Could not load ProVN profile:',
          profileError
        )

        setLoadState(
          'error'
        )

        return
      }

      const metadataName =
        typeof user
          .user_metadata
          ?.full_name ===
        'string'
          ? user
              .user_metadata
              .full_name
              .trim()
          : ''

      const initialName =
        profileResult
          .display_name
          ?.trim() ||
        metadataName ||
        profileResult.username

      const initialBio =
        profileResult
          .bio
          ?.trim() ||
        ''

      setProfile(
        profileResult
      )

      setDisplayName(
        initialName
      )

      setOriginalDisplayName(
        initialName
      )

      setBio(
        initialBio
      )

      setOriginalBio(
        initialBio
      )

      setEmailVerified(
        Boolean(
          user.email_confirmed_at
        )
      )

      setLoadState(
        'ready'
      )
    }

    void loadProfile()

    return () => {
      active = false
    }
  }, [
    supabase,
  ])

  /* =======================================================
     DERIVED STATE
  ======================================================== */

  const cleanDisplayName =
    displayName.trim()

  const cleanBio =
    bio.trim()

  const dirty =
    cleanDisplayName !==
      originalDisplayName.trim() ||
    cleanBio !==
      originalBio.trim()

  const initials =
    (
      cleanDisplayName ||
      profile?.username ||
      'P'
    )
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        part =>
          part[0]
            ?.toUpperCase()
      )
      .join('') ||
    'P'

  const completion =
    [
      Boolean(
        profile?.username
      ),
      emailVerified,
      Boolean(
        cleanDisplayName
      ),
      Boolean(
        cleanBio
      ),
    ].filter(Boolean).length *
    25

  const profileHref =
    profile?.username
      ? `/profiles/${encodeURIComponent(
          profile.username
        )}`
      : '/'

  /* =======================================================
     SAVE
  ======================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (
      saving ||
      !profile
    ) {
      return
    }

    setErrorMessage(
      null
    )

    setSaved(
      false
    )

    if (
      cleanDisplayName &&
      cleanDisplayName.length <
        2
    ) {
      setErrorMessage(
        'Display name must be at least 2 characters.'
      )

      return
    }

    if (
      cleanDisplayName.length >
      50
    ) {
      setErrorMessage(
        'Display name cannot exceed 50 characters.'
      )

      return
    }

    if (
      cleanBio.length >
      240
    ) {
      setErrorMessage(
        'Bio cannot exceed 240 characters.'
      )

      return
    }

    setSaving(
      true
    )

    try {
      const response =
        await fetch(
          '/api/profile/update',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                displayName:
                  cleanDisplayName,

                bio:
                  cleanBio,
              }),
          }
        )

      const result =
        await response.json()

      if (
        !response.ok ||
        !result.ok
      ) {
        throw new Error(
          result.error ||
            'Could not save profile.'
        )
      }

      const updatedProfile =
        result.profile as Profile

      setProfile(
        current =>
          current
            ? {
                ...current,
                ...updatedProfile,
              }
            : updatedProfile
      )

      setOriginalDisplayName(
        updatedProfile
          .display_name ??
          ''
      )

      setOriginalBio(
        updatedProfile
          .bio ??
          ''
      )

      setDisplayName(
        updatedProfile
          .display_name ??
          ''
      )

      setBio(
        updatedProfile
          .bio ??
          ''
      )

      setSaved(
        true
      )

      window.setTimeout(
        () => {
          setSaved(
            false
          )
        },
        2500
      )
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not save profile.'
      )
    } finally {
      setSaving(
        false
      )
    }
  }

  /* =======================================================
     LOADING
  ======================================================== */

  if (
    loadState === 'loading'
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
          <div className="mx-auto h-[38px] w-[38px] animate-spin rounded-full border border-[#54202a] border-t-[#df4055]" />

          <p className="mt-5 text-[8px] uppercase tracking-[0.28em] text-zinc-700">
            Loading Identity
          </p>
        </div>
      </main>
    )
  }

  /* =======================================================
     ERROR
  ======================================================== */

  if (
    loadState === 'error' ||
    !profile
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020203] px-6 text-white">
        <div className="max-w-[520px] text-center">
          <p className="text-[8px] uppercase tracking-[0.3em] text-[#a63a49]">
            ProVN Identity
          </p>

          <h1 className="mt-4 text-[38px] font-black tracking-[-0.05em]">
            We couldn&apos;t load your profile.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-flex h-[46px] items-center rounded-full border border-[#752633] bg-[#12070a] px-7 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-300"
          >
            Return Home
          </Link>
        </div>
      </main>
    )
  }

  /* =======================================================
     EDITOR
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

            input,
            textarea {
              cursor: text !important;
            }
          }

          .provn-editor-field {
            transition:
              border-color 220ms ease,
              background-color 220ms ease,
              box-shadow 220ms ease;
          }

          .provn-editor-field:focus {
            border-color:
              rgba(180,52,70,.78);

            background:
              rgba(18,7,10,.88);

            box-shadow:
              0 0 0 3px
                rgba(154,28,47,.07),
              0 0 32px
                rgba(132,19,38,.07);
          }

          @keyframes editEntry {
            from {
              opacity: 0;
              transform:
                translateY(12px)
                scale(.995);
            }

            to {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
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
              'radial-gradient(circle at 12% 8%,rgba(120,10,31,.13),transparent 29%),radial-gradient(circle at 88% 14%,rgba(95,8,26,.08),transparent 28%),radial-gradient(circle at 50% 110%,rgba(76,5,20,.08),transparent 43%),#020203',
          }}
        />

        <div
          className="pointer-events-none fixed inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)',

            backgroundSize:
              '78px 78px',
          }}
        />

        {/* FIXED HEADER */}

        <header className="fixed inset-x-0 top-0 z-50 border-b border-[#42131c]/55 bg-[#020203]/95 shadow-[0_14px_45px_rgba(0,0,0,.30)] backdrop-blur-2xl">

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#86293a]/35 to-transparent" />

          <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-7 lg:px-10">

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#ab3d4c]">
                ProVN
              </p>

              <p className="mt-1 text-[9px] text-zinc-600">
                Identity Editor
              </p>
            </div>

            <Link
              href={
                profileHref
              }
              className="group inline-flex h-[42px] items-center gap-3 rounded-full border border-[#762734]/85 bg-[#12070a] px-5 text-[8px] font-semibold uppercase tracking-[0.14em] text-zinc-300 shadow-[0_0_20px_rgba(155,29,47,.10)] transition-all hover:-translate-y-[1px] hover:border-[#ba3b4d] hover:bg-[#19090d] hover:text-white"
            >
              <span className="text-[#ce4053] transition-transform group-hover:-translate-x-1">
                <ArrowLeftIcon />
              </span>

              Back to Profile
            </Link>
          </div>
        </header>

        <div className="h-[72px]" />

        {/* CONTENT */}

        <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-20 pt-10 sm:px-7 lg:px-10 lg:pt-14">

          <div className="animate-[editEntry_.55s_cubic-bezier(.16,1,.3,1)_both]">

            {/* TITLE */}

            <div className="mb-8">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#8f3140]" />

                <p className="text-[7px] font-semibold uppercase tracking-[0.31em] text-[#973744]">
                  Identity Configuration
                </p>
              </div>

              <h1 className="mt-5 max-w-[760px] text-[46px] font-black leading-[.94] tracking-[-0.055em] text-[#f4f0f1] sm:text-[58px]">
                Make your profile yours.
              </h1>

              <p className="mt-5 max-w-[650px] text-[12px] leading-6 text-zinc-600">
                Shape how your ProVN identity appears publicly. Verification and reputation remain separate from profile customization.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">

              {/* ============================================
                  LEFT — LIVE IDENTITY PREVIEW
              ============================================= */}

              <div className="space-y-6">

                <section className="relative overflow-hidden rounded-[26px] border border-[#59202a]/70 bg-[#070708]/95 p-7 shadow-[0_35px_90px_rgba(0,0,0,.34)]">

                  <div className="pointer-events-none absolute -left-[70px] -top-[80px] h-[230px] w-[230px] rounded-full bg-[#98172e]/[0.08] blur-[75px]" />

                  <p className="relative text-[7px] uppercase tracking-[0.27em] text-[#9e3947]">
                    Live Preview
                  </p>

                  <div className="relative mt-7 flex items-center gap-5">

                    <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[27px] border border-[#792b38]/80 bg-gradient-to-br from-[#42121c] via-[#18090d] to-[#070708] shadow-[0_20px_48px_rgba(0,0,0,.35)]">

                      <div className="pointer-events-none absolute inset-[7px] rounded-[21px] border border-white/[0.035]" />

                      {profile.avatar_url ? (
                        <img
                          src={
                            profile.avatar_url
                          }
                          alt={
                            cleanDisplayName ||
                            profile.username
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="relative text-[30px] font-black tracking-[-0.055em] text-[#e15163]">
                          {initials}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">

                      <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-[#913541]">
                        ProVN Identity
                      </p>

                      <h2 className="mt-3 truncate text-[27px] font-black tracking-[-0.045em] text-[#f1eeee]">
                        {cleanDisplayName ||
                          profile.username}
                      </h2>

                      <p className="mt-2 text-[11px] font-semibold text-[#d54256]">
                        @{profile.username}
                      </p>
                    </div>
                  </div>

                  <p className="relative mt-7 min-h-[48px] text-[10px] leading-5 text-zinc-600">
                    {cleanBio ||
                      'Your bio will appear here.'}
                  </p>

                  <div className="relative mt-7 border-t border-white/[0.05] pt-5">

                    <div className="flex items-center justify-between">

                      <span className="text-[7px] uppercase tracking-[0.18em] text-zinc-700">
                        Public Identity
                      </span>

                      <span className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#b64050]">
                        Active
                      </span>
                    </div>
                  </div>
                </section>

                {/* COMPLETION */}

                <section className="rounded-[22px] border border-white/[0.05] bg-[#070708]/85 p-6">

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-[7px] uppercase tracking-[0.25em] text-[#903440]">
                        Profile Setup
                      </p>

                      <p className="mt-3 text-[26px] font-black tracking-[-0.045em] text-[#efebec]">
                        {completion}%
                      </p>
                    </div>

                    <span className="rounded-full border border-[#68232e] bg-[#12080a] px-3 py-[6px] text-[7px] uppercase tracking-[0.14em] text-[#aa3e4d]">
                      Setup
                    </span>
                  </div>

                  <div className="mt-5 h-[4px] overflow-hidden rounded-full bg-white/[0.055]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#891426] via-[#bc2239] to-[#df4559] transition-all duration-500"
                      style={{
                        width:
                          `${completion}%`,
                      }}
                    />
                  </div>

                  <p className="mt-4 text-[8px] leading-4 text-zinc-700">
                    Profile setup does not represent identity, game or performance verification.
                  </p>
                </section>

                {/* AVATAR */}

                <section className="rounded-[22px] border border-white/[0.05] bg-[#070708]/85 p-6">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[7px] uppercase tracking-[0.24em] text-[#933541]">
                        Profile Image
                      </p>

                      <p className="mt-3 text-[12px] font-semibold text-zinc-300">
                        Avatar controls
                      </p>
                    </div>

                    <span className="rounded-full border border-white/[0.05] bg-black/20 px-3 py-[6px] text-[7px] uppercase tracking-[0.13em] text-zinc-700">
                      Next Step
                    </span>
                  </div>

                  <p className="mt-4 text-[9px] leading-5 text-zinc-700">
                    Image uploads will use secure Supabase Storage. We&apos;ll enable this after the profile editor is saving correctly.
                  </p>
                </section>
              </div>

              {/* ============================================
                  RIGHT — EDIT FORM
              ============================================= */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="relative overflow-hidden rounded-[28px] border border-[#5d202b]/65 bg-[#070708]/95 p-6 shadow-[0_40px_110px_rgba(0,0,0,.38)] sm:p-8 lg:p-9"
              >

                <div className="pointer-events-none absolute -right-[100px] -top-[100px] h-[300px] w-[300px] rounded-full bg-[#8c1429]/[0.07] blur-[95px]" />

                <div className="relative">

                  <div className="flex flex-col gap-3 border-b border-white/[0.05] pb-7 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                      <p className="text-[7px] uppercase tracking-[0.27em] text-[#963744]">
                        Public Profile
                      </p>

                      <h2 className="mt-3 text-[30px] font-black tracking-[-0.045em] text-[#f1eeee]">
                        Profile details.
                      </h2>
                    </div>

                    <p className="text-[8px] text-zinc-700">
                      Changes appear publicly after saving.
                    </p>
                  </div>

                  {/* USERNAME */}

                  <div className="mt-8">

                    <div className="flex items-center justify-between">

                      <label className="text-[8px] font-semibold uppercase tracking-[0.17em] text-zinc-500">
                        Username
                      </label>

                      <span className="flex items-center gap-2 text-[7px] uppercase tracking-[0.13em] text-zinc-700">
                        <LockIcon />

                        Locked
                      </span>
                    </div>

                    <div className="mt-3 flex h-[52px] items-center rounded-[14px] border border-white/[0.05] bg-black/25 px-4">

                      <span className="text-[13px] text-[#a33a49]">
                        @
                      </span>

                      <span className="ml-1 text-[12px] font-medium text-zinc-500">
                        {profile.username}
                      </span>
                    </div>

                    <p className="mt-2 text-[8px] text-zinc-700">
                      Username changes are disabled during the initial identity system.
                    </p>
                  </div>

                  {/* DISPLAY NAME */}

                  <div className="mt-7">

                    <div className="flex items-center justify-between">

                      <label
                        htmlFor="displayName"
                        className="text-[8px] font-semibold uppercase tracking-[0.17em] text-zinc-500"
                      >
                        Display Name
                      </label>

                      <span className="text-[7px] text-zinc-700">
                        {displayName.length}/50
                      </span>
                    </div>

                    <input
                      id="displayName"
                      type="text"
                      maxLength={50}
                      value={
                        displayName
                      }
                      onChange={
                        event =>
                          setDisplayName(
                            event.target.value
                          )
                      }
                      placeholder="Your public name"
                      className="provn-editor-field mt-3 h-[54px] w-full rounded-[14px] border border-white/[0.065] bg-black/25 px-4 text-[12px] text-zinc-200 outline-none placeholder:text-zinc-800"
                    />
                  </div>

                  {/* BIO */}

                  <div className="mt-7">

                    <div className="flex items-center justify-between">

                      <label
                        htmlFor="bio"
                        className="text-[8px] font-semibold uppercase tracking-[0.17em] text-zinc-500"
                      >
                        Bio
                      </label>

                      <span
                        className={`text-[7px] ${
                          bio.length >
                          220
                            ? 'text-[#d34154]'
                            : 'text-zinc-700'
                        }`}
                      >
                        {bio.length}/240
                      </span>
                    </div>

                    <textarea
                      id="bio"
                      rows={6}
                      maxLength={240}
                      value={
                        bio
                      }
                      onChange={
                        event =>
                          setBio(
                            event.target.value
                          )
                      }
                      placeholder="Tell players, teammates and recruiters what defines your gaming identity."
                      className="provn-editor-field mt-3 min-h-[155px] w-full resize-none rounded-[14px] border border-white/[0.065] bg-black/25 p-4 text-[12px] leading-6 text-zinc-200 outline-none placeholder:text-zinc-800"
                    />
                  </div>

                  {/* TRUST INFO */}

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-[15px] border border-white/[0.05] bg-black/20 p-4">

                      <p className="text-[7px] uppercase tracking-[0.15em] text-zinc-700">
                        Email Ownership
                      </p>

                      <div className="mt-3 flex items-center gap-2">

                        {emailVerified && (
                          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-emerald-700/35 bg-emerald-950/15 text-emerald-400">
                            <CheckIcon />
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-semibold ${
                            emailVerified
                              ? 'text-emerald-500'
                              : 'text-zinc-600'
                          }`}
                        >
                          {emailVerified
                            ? 'Verified'
                            : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-[15px] border border-white/[0.05] bg-black/20 p-4">

                      <p className="text-[7px] uppercase tracking-[0.15em] text-zinc-700">
                        Game Verification
                      </p>

                      <p className="mt-3 text-[10px] font-semibold text-zinc-600">
                        Not connected
                      </p>
                    </div>
                  </div>

                  {/* ERROR */}

                  {errorMessage && (
                    <div className="mt-6 rounded-[14px] border border-red-900/40 bg-red-950/10 px-4 py-3 text-[9px] leading-5 text-[#d85b6b]">
                      {errorMessage}
                    </div>
                  )}

                  {/* SAVED */}

                  {saved && (
                    <div className="mt-6 flex items-center gap-3 rounded-[14px] border border-emerald-900/30 bg-emerald-950/[0.07] px-4 py-3 text-[9px] text-emerald-500">

                      <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-emerald-700/35">
                        <CheckIcon />
                      </span>

                      Profile changes saved.
                    </div>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.05] pt-7 sm:flex-row sm:items-center">

                    <button
                      type="submit"
                      disabled={
                        saving ||
                        !dirty
                      }
                      className="group inline-flex h-[50px] min-w-[190px] items-center justify-center gap-5 rounded-[13px] border border-[#c33348] bg-gradient-to-r from-[#801020] via-[#a9192e] to-[#c9283e] px-7 text-[8px] font-bold uppercase tracking-[0.17em] text-white shadow-[0_16px_42px_rgba(109,11,28,.24)] transition-all hover:-translate-y-[2px] hover:border-[#ec5266] hover:shadow-[0_22px_52px_rgba(139,15,37,.30)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-white/[0.05] disabled:bg-none disabled:bg-[#101011] disabled:text-zinc-700 disabled:shadow-none"
                    >
                      {saving
                        ? 'Saving...'
                        : saved
                          ? 'Saved'
                          : 'Save Changes'}

                      {!saving &&
                        dirty && (
                          <span className="transition-transform duration-200 group-hover:translate-x-1">
                            <ArrowRightIcon />
                          </span>
                        )}
                    </button>

                    <Link
                      href={
                        profileHref
                      }
                      className="inline-flex h-[50px] items-center justify-center rounded-[13px] border border-white/[0.055] bg-black/20 px-7 text-[8px] font-semibold uppercase tracking-[0.15em] text-zinc-600 transition-all hover:border-[#64232d] hover:bg-[#10070a] hover:text-zinc-300"
                    >
                      Cancel
                    </Link>

                    <span className="sm:ml-auto text-[8px] text-zinc-800">
                      {dirty
                        ? 'Unsaved changes'
                        : 'No unsaved changes'}
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}