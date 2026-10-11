'use client'

import Link from 'next/link'

import {
  useEffect,
  useState,
} from 'react'

import {
  createClient,
} from '@/lib/supabase/client'

export default function HomeAuthButton() {
  const [
    signedIn,
    setSignedIn,
  ] =
    useState<
      boolean | null
    >(
      null
    )

  useEffect(() => {
    const supabase =
      createClient()

    let active =
      true

    async function checkUser() {
      const {
        data,
      } =
        await supabase
          .auth
          .getUser()

      if (
        active
      ) {
        setSignedIn(
          Boolean(
            data.user
          )
        )
      }
    }

    void checkUser()

    const {
      data:
        authListener,
    } =
      supabase
        .auth
        .onAuthStateChange(
          (
            _event,
            session
          ) => {
            if (
              !active
            ) {
              return
            }

            setSignedIn(
              Boolean(
                session
                  ?.user
              )
            )
          }
        )

    return () => {
      active =
        false

      authListener
        .subscription
        .unsubscribe()
    }
  }, [])

  /*
    Do not flash "Sign In"
    for a split second while
    we are checking the session.
  */

  if (
    signedIn ===
    null
  ) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-[42px] min-w-[125px] rounded-full border border-transparent"
      />
    )
  }

  /* =======================================================
     SIGNED IN
  ======================================================= */

  if (
    signedIn
  ) {
    return (
      <Link
        href="#join"
        className="group inline-flex h-[42px] min-w-[125px] items-center justify-center gap-2 rounded-full border border-[#732431]/70 bg-[#12070a]/55 px-6 text-[11px] font-semibold text-zinc-200 transition-all duration-200 hover:-translate-y-[1px] hover:border-[#b43749] hover:bg-[#19090d] hover:shadow-[0_0_28px_rgba(161,28,48,.16)]"
      >

        <span className="text-[#d4495c]">
          ♛
        </span>

        Level Up
      </Link>
    )
  }

  /* =======================================================
     LOGGED OUT
  ======================================================= */

  return (
    <Link
      href="/login"
      className="group inline-flex h-[42px] min-w-[125px] items-center justify-center rounded-full border border-[#732431]/70 bg-[#12070a]/55 px-6 text-[11px] font-semibold text-zinc-200 transition-all duration-200 hover:-translate-y-[1px] hover:border-[#b43749] hover:bg-[#19090d] hover:shadow-[0_0_28px_rgba(161,28,48,.16)]"
    >
      Sign In
    </Link>
  )
}