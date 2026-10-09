'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Cormorant_Garamond,
} from 'next/font/google';

import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from 'react';

const founderFont =
  Cormorant_Garamond({
    subsets: ['latin'],
    weight: [
      '400',
      '500',
      '600',
    ],
    style: ['italic'],
  });

type MainIcon =
  | 'discover'
  | 'connect'
  | 'learn'
  | 'earn'
  | 'compete'
  | 'profile'
  | 'recruiter';

type CustomProofIcon =
  | 'student-review'
  | 'team-opportunity';

type ProofFeatureType = {
  image?: string;
  customIcon?: CustomProofIcon;
  line1: string;
  line2?: string;
  href: string;
};

type TournamentIconType =
  | 'shield'
  | 'coins'
  | 'bars';

const gameCards = [
  {
    name: 'Valorant',
    position: '9.4% 71.3%',
    href: '#how',
  },
  {
    name: 'BGMI',
    position: '36.5% 71.3%',
    href: '#how',
  },
  {
    name: 'Free Fire',
    position: '62.7% 71.3%',
    href: '#how',
  },
  {
    name: 'EA FC',
    position: '89.3% 71.3%',
    href: '#how',
  },
];

function MainIconSvg({
  type,
}: {
  type: MainIcon;
}) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'profile') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 lg:h-8 lg:w-8"
        {...common}
      >
        <circle
          cx="12"
          cy="8"
          r="4"
        />

        <path d="M4.5 21c.7-5.2 3-7.5 7.5-7.5s6.8 2.3 7.5 7.5" />
      </svg>
    );
  }

  if (type === 'recruiter') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 lg:h-8 lg:w-8"
        {...common}
      >
        <circle
          cx="8.5"
          cy="7.2"
          r="3.1"
        />

        <path d="M3.3 17.2c.5-3.3 2.2-5.1 5.2-5.1 1.4 0 2.5.4 3.4 1.1" />

        <circle
          cx="16.5"
          cy="15.5"
          r="3.2"
        />

        <path d="m18.9 17.9 2.3 2.3" />
        <path d="M14 5.5h6" />
        <path d="M17 3v5" />
      </svg>
    );
  }

  if (type === 'discover') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 lg:h-8 lg:w-8"
        {...common}
      >
        <path d="M7.5 9.5h-2A3.5 3.5 0 0 0 2 13v2a3 3 0 0 0 5.4 1.8L9 15h6l1.6 1.8A3 3 0 0 0 22 15v-2a3.5 3.5 0 0 0-3.5-3.5h-2" />

        <path d="M8 12h4" />
        <path d="M10 10v4" />

        <circle
          cx="17"
          cy="12"
          r=".8"
        />

        <circle
          cx="19"
          cy="14"
          r=".8"
        />
      </svg>
    );
  }

  if (type === 'connect') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 lg:h-8 lg:w-8"
        {...common}
      >
        <circle
          cx="12"
          cy="7"
          r="3"
        />

        <circle
          cx="5.5"
          cy="9.5"
          r="2.2"
        />

        <circle
          cx="18.5"
          cy="9.5"
          r="2.2"
        />

        <path d="M7 20c.5-4 2.2-6 5-6s4.5 2 5 6" />
        <path d="M2 19c.4-2.8 1.7-4.2 4-4.2" />
        <path d="M22 19c-.4-2.8-1.7-4.2-4-4.2" />
      </svg>
    );
  }

  if (type === 'learn') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 lg:h-8 lg:w-8"
        {...common}
      >
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12.5V17c3 2 7 2 10 0v-4.5" />
        <path d="M21 9v5" />
      </svg>
    );
  }

  if (type === 'earn') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 lg:h-8 lg:w-8"
        {...common}
      >
        <ellipse
          cx="12"
          cy="6"
          rx="6.5"
          ry="3"
        />

        <path d="M5.5 6v5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V6" />

        <path d="M5.5 11v5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 lg:h-8 lg:w-8"
      {...common}
    >
      <path d="M8 4h8v5c0 3-1.7 5-4 5S8 12 8 9V4Z" />
      <path d="M8 6H4c0 4 1.5 6 4.5 6" />
      <path d="M16 6h4c0 4-1.5 6-4.5 6" />
      <path d="M12 14v4" />
      <path d="M8 20h8" />
    </svg>
  );
}

function StudentReviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[25px] w-[25px] text-[#df6572]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5.5h16v10H9.2L4.5 19v-3.5H4Z" />

      <path d="m12 8.1 1.05 2.05 2.25.32-1.63 1.58.39 2.23L12 13.22l-2.06 1.06.39-2.23-1.63-1.58 2.25-.32Z" />
    </svg>
  );
}

function TeamOpportunityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[27px] w-[27px] text-[#e26572]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="11.2"
        cy="11.7"
        r="2.15"
      />

      <circle
        cx="11.2"
        cy="11.7"
        r="5.2"
        strokeOpacity=".72"
        strokeDasharray="3.2 2.2"
      />

      <circle
        cx="5"
        cy="17.7"
        r="1.35"
      />

      <circle
        cx="18.2"
        cy="16.6"
        r="1.35"
      />

      <circle
        cx="5.3"
        cy="6"
        r="1.25"
      />

      <path d="M6 16.7 8.1 14.7" />
      <path d="m15.2 14.6 1.9 1.4" />
      <path d="m6.4 6.9 1.7 1.7" />

      <path d="M9 3.2h4.5" />
      <path d="M19.9 9v4.2" />
      <path d="M13.3 20.6H9" />

      <path
        d="m18.4 3.1.72 1.55 1.65.35-1.25 1.18.2 1.7-1.32-.76-1.45.76.27-1.7L16.1 5l1.62-.35Z"
        fill="currentColor"
        stroke="none"
      />

      <path d="M11.2 8.8v1.05" />
      <path d="M11.2 13.6v1.05" />
      <path d="M8.3 11.7h1.05" />
      <path d="M13.05 11.7h1.05" />
    </svg>
  );
}

function RoundArrow() {
  return (
    <span
      data-card-arrow
      data-cursor-block
      className="
        group/arrow
        relative
        flex
        h-[42px]
        w-[42px]
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-[#73303a]/85
        bg-[#10090b]
        text-[17px]
        text-zinc-300
        shadow-[inset_0_1px_0_rgba(255,255,255,.03)]
        transition-all
        duration-300
        ease-out
        hover:scale-[1.12]
        hover:border-[#d04b5a]
        hover:bg-[#65111e]
        hover:text-white
        hover:shadow-[0_0_0_1px_rgba(218,66,84,.10),0_0_24px_rgba(182,33,54,.38),0_10px_28px_rgba(0,0,0,.32)]
      "
    >
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-300
          group-hover/arrow:opacity-100
        "
        style={{
          background:
            'radial-gradient(circle at 50% 20%,rgba(255,130,145,.24),transparent 58%)',
        }}
      />

      <span
        className="
          relative
          z-10
          transition-transform
          duration-300
          group-hover/arrow:translate-x-[3px]
        "
      >
        →
      </span>
    </span>
  );
}

function Tilt3DIcon({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapperRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const plateRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const shineRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const auraRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const shadowRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const canTilt =
    () => {
      if (
        typeof window ===
        'undefined'
      ) {
        return false;
      }

      return (
        window.innerWidth >=
          768 &&
        window.matchMedia(
          '(pointer: fine)'
        ).matches
      );
    };

  const enter =
    () => {
      if (!canTilt()) {
        return;
      }

      if (
        wrapperRef.current
      ) {
        wrapperRef.current.style.zIndex =
          '40';
      }

      if (
        plateRef.current
      ) {
        plateRef.current.style.transition =
          'transform 180ms cubic-bezier(.16,1,.3,1), box-shadow 180ms ease, filter 180ms ease';

        plateRef.current.style.transform = `
          perspective(800px)
          translateY(-10px)
          translateZ(55px)
          scale(1.20)
          rotateX(0deg)
          rotateY(0deg)
        `;

        plateRef.current.style.boxShadow = `
          0 28px 48px rgba(0,0,0,.72),
          0 16px 34px rgba(151,28,48,.38),
          0 0 32px rgba(143,31,49,.17),
          inset 0 1px 0 rgba(255,229,232,.18),
          inset 0 -14px 25px rgba(0,0,0,.30)
        `;

        plateRef.current.style.filter =
          'brightness(1.12) saturate(1.14)';
      }

      if (
        auraRef.current
      ) {
        auraRef.current.style.opacity =
          '1';

        auraRef.current.style.transform =
          'scale(1.18)';
      }

      if (
        shadowRef.current
      ) {
        shadowRef.current.style.opacity =
          '.82';

        shadowRef.current.style.transform =
          'translateX(-50%) scaleX(1.12)';
      }
    };

  const move = (
    event:
      ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!canTilt()) {
      return;
    }

    const plate =
      plateRef.current;

    if (!plate) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (
        event.clientX -
        rect.left
      ) /
      rect.width;

    const y =
      (
        event.clientY -
        rect.top
      ) /
      rect.height;

    const rotateY =
      (
        x -
        0.5
      ) *
      28;

    const rotateX =
      (
        0.5 -
        y
      ) *
      24;

    plate.style.transition =
      'transform 55ms linear, box-shadow 80ms ease';

    plate.style.transform = `
      perspective(800px)
      translateY(-11px)
      translateZ(58px)
      scale(1.21)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;

    plate.style.boxShadow = `
      ${-rotateY * 0.55}px
      ${27 + rotateX * 0.25}px
      52px
      rgba(0,0,0,.70),

      ${-rotateY * 0.28}px
      ${15 + rotateX * 0.14}px
      30px
      rgba(142,25,44,.40),

      inset 0 1px 0
      rgba(255,225,230,.20),

      inset 0 -15px 28px
      rgba(0,0,0,.32)
    `;

    if (
      shineRef.current
    ) {
      shineRef.current.style.opacity =
        '1';

      shineRef.current.style.background = `
        radial-gradient(
          circle at
          ${x * 100}%
          ${y * 100}%,
          rgba(255,240,242,.34) 0%,
          rgba(241,142,154,.21) 15%,
          rgba(181,46,64,.10) 34%,
          transparent 64%
        )
      `;
    }

    if (
      auraRef.current
    ) {
      auraRef.current.style.transform = `
        translate(
          ${(x - 0.5) * 13}px,
          ${(y - 0.5) * 11}px
        )
        scale(1.2)
      `;
    }

    if (
      shadowRef.current
    ) {
      shadowRef.current.style.transform = `
        translateX(
          calc(
            -50% +
            ${(x - 0.5) * -11}px
          )
        )
        scaleX(
          ${
            1.08 +
            Math.abs(
              x - 0.5
            ) *
              0.18
          }
        )
      `;
    }
  };

  const leave =
    () => {
      if (
        wrapperRef.current
      ) {
        wrapperRef.current.style.zIndex =
          '1';
      }

      if (
        plateRef.current
      ) {
        plateRef.current.style.transition =
          'transform 470ms cubic-bezier(.16,1,.3,1), box-shadow 420ms ease, filter 350ms ease';

        plateRef.current.style.transform = `
          perspective(800px)
          translateY(0px)
          translateZ(0px)
          scale(1)
          rotateX(0deg)
          rotateY(0deg)
        `;

        plateRef.current.style.boxShadow =
          '';

        plateRef.current.style.filter =
          '';
      }

      if (
        shineRef.current
      ) {
        shineRef.current.style.opacity =
          '0';
      }

      if (
        auraRef.current
      ) {
        auraRef.current.style.opacity =
          '0';

        auraRef.current.style.transform =
          'scale(.88)';
      }

      if (
        shadowRef.current
      ) {
        shadowRef.current.style.opacity =
          '0';

        shadowRef.current.style.transform =
          'translateX(-50%) scaleX(.72)';
      }
    };

  return (
    <div
      ref={wrapperRef}
      data-card-icon
      data-cursor-block
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
      className="
        relative
        inline-flex
        shrink-0
        overflow-visible
        [perspective:800px]
      "
    >
      <div
        ref={auraRef}
        className="
          pointer-events-none
          absolute
          -inset-[19px]
          -z-10
          rounded-[28px]
          opacity-0
          blur-[26px]
          transition-all
          duration-300
        "
        style={{
          background:
            'radial-gradient(circle,rgba(183,39,61,.40) 0%,rgba(100,7,25,.19) 42%,transparent 73%)',

          transform:
            'scale(.88)',
        }}
      />

      <div
        ref={shadowRef}
        className="
          pointer-events-none
          absolute
          bottom-[-18px]
          left-1/2
          -z-10
          h-[16px]
          w-[82%]
          -translate-x-1/2
          rounded-full
          bg-black
          opacity-0
          blur-[10px]
          transition-all
          duration-300
        "
      />

      <div
        ref={plateRef}
        className={`
          relative
          overflow-hidden
          [transform-style:preserve-3d]
          will-change-transform
          ${className}
        `}
        style={{
          transform: `
            perspective(800px)
            translateY(0px)
            translateZ(0px)
            scale(1)
            rotateX(0deg)
            rotateY(0deg)
          `,
        }}
      >
        <div
          ref={shineRef}
          className="
            pointer-events-none
            absolute
            inset-0
            z-[5]
            opacity-0
            transition-opacity
            duration-150
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            left-[12%]
            right-[12%]
            top-0
            z-[6]
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/35
            to-transparent
          "
        />

        <div
          className="
            relative
            z-[7]
            flex
            h-full
            w-full
            items-center
            justify-center
            [transform:translateZ(42px)]
          "
        >
          {children}
        </div>

        <div
          className="
            pointer-events-none
            absolute
            inset-[1px]
            z-[4]
            rounded-[inherit]
            border
            border-white/[0.035]
            [transform:translateZ(7px)]
          "
        />
      </div>
    </div>
  );
}

function PremiumRedIcon({
  type,
  size = 'normal',
}: {
  type: MainIcon;
  size?: 'normal' | 'large';
}) {
  return (
    <Tilt3DIcon
      className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-[14px]
        border
        border-[#8e3943]/80
        bg-gradient-to-br
        from-[#4c1820]
        via-[#2c0e14]
        to-[#13080b]
        text-[#dc7079]
        shadow-[inset_0_1px_0_rgba(255,210,214,.10),0_10px_28px_rgba(45,0,10,.22)]

        ${
          size === 'large'
            ? 'h-[60px] w-[60px] lg:h-[64px] lg:w-[64px]'
            : 'h-[52px] w-[52px] lg:h-[58px] lg:w-[58px]'
        }
      `}
    >
      <MainIconSvg type={type} />
    </Tilt3DIcon>
  );
}

function Tilt3DPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const panelRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const glowRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const shineRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const shadowRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const canTilt =
    () => {
      if (
        typeof window ===
        'undefined'
      ) {
        return false;
      }

      return (
        window.innerWidth >=
          1024 &&
        window.matchMedia(
          '(pointer:fine)'
        ).matches
      );
    };

  const enter =
    () => {
      if (!canTilt()) {
        return;
      }

      if (
        panelRef.current
      ) {
        panelRef.current.style.transition =
          'transform 220ms cubic-bezier(.16,1,.3,1), box-shadow 220ms ease, border-color 220ms ease';

        panelRef.current.style.transform = `
          perspective(1250px)
          translateY(-8px)
          translateZ(20px)
          scale(1.025)
        `;

        panelRef.current.style.boxShadow = `
          0 35px 75px rgba(0,0,0,.58),
          0 17px 38px rgba(83,8,22,.22)
        `;

        panelRef.current.style.borderColor =
          'rgba(153,55,66,.88)';
      }

      if (
        shadowRef.current
      ) {
        shadowRef.current.style.opacity =
          '.75';

        shadowRef.current.style.transform =
          'translateX(-50%) scaleX(1)';
      }
    };

  const move = (
    event:
      ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!canTilt()) {
      return;
    }

    const panel =
      panelRef.current;

    if (!panel) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (
        event.clientX -
        rect.left
      ) /
      rect.width;

    const y =
      (
        event.clientY -
        rect.top
      ) /
      rect.height;

    const rotateY =
      (
        x -
        0.5
      ) *
      8.5;

    const rotateX =
      (
        0.5 -
        y
      ) *
      7;

    panel.style.transition =
      'transform 70ms linear, box-shadow 90ms linear';

    panel.style.transform = `
      perspective(1250px)
      translateY(-9px)
      translateZ(24px)
      scale(1.026)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;

    panel.style.boxShadow = `
      ${-rotateY * 1.4}px
      ${32 + rotateX}px
      78px
      rgba(0,0,0,.62),

      ${-rotateY * 0.45}px
      ${16 + rotateX * 0.4}px
      38px
      rgba(93,8,25,.22)
    `;

    if (
      shineRef.current
    ) {
      shineRef.current.style.opacity =
        '.9';

      shineRef.current.style.background = `
        radial-gradient(
          circle at
          ${x * 100}%
          ${y * 100}%,
          rgba(255,255,255,.075) 0%,
          rgba(206,71,88,.045) 20%,
          transparent 57%
        )
      `;
    }

    if (
      glowRef.current
    ) {
      glowRef.current.style.opacity =
        '.85';

      glowRef.current.style.transform = `
        translate(
          ${(x - 0.5) * 16}px,
          ${(y - 0.5) * 12}px
        )
      `;
    }

    if (
      shadowRef.current
    ) {
      shadowRef.current.style.transform = `
        translateX(
          calc(
            -50% +
            ${(x - 0.5) * -15}px
          )
        )
        scaleX(1.02)
      `;
    }
  };

  const leave =
    () => {
      if (
        panelRef.current
      ) {
        panelRef.current.style.transition =
          'transform 520ms cubic-bezier(.16,1,.3,1), box-shadow 450ms ease, border-color 350ms ease';

        panelRef.current.style.transform = `
          perspective(1250px)
          translateY(0px)
          translateZ(0px)
          scale(1)
          rotateX(0deg)
          rotateY(0deg)
        `;

        panelRef.current.style.boxShadow =
          '';

        panelRef.current.style.borderColor =
          '';
      }

      if (
        shineRef.current
      ) {
        shineRef.current.style.opacity =
          '0';
      }

      if (
        glowRef.current
      ) {
        glowRef.current.style.opacity =
          '0';

        glowRef.current.style.transform =
          'translate(0px,0px)';
      }

      if (
        shadowRef.current
      ) {
        shadowRef.current.style.opacity =
          '0';

        shadowRef.current.style.transform =
          'translateX(-50%) scaleX(.82)';
      }
    };

  return (
    <div
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={leave}
      data-cursor-block
      className="
        relative
        overflow-visible
        [perspective:1250px]
      "
    >
      <div
        ref={shadowRef}
        className="
          pointer-events-none
          absolute
          bottom-[-24px]
          left-1/2
          z-0
          h-[28px]
          w-[76%]
          -translate-x-1/2
          rounded-full
          bg-black
          opacity-0
          blur-[17px]
          transition-all
          duration-300
        "
      />

      <div
        ref={glowRef}
        className="
          pointer-events-none
          absolute
          -inset-[14px]
          z-0
          rounded-[32px]
          bg-red-950/[0.15]
          opacity-0
          blur-[30px]
          transition-all
          duration-300
        "
      />

      <div
        ref={panelRef}
        className={`
          relative
          z-10
          [transform-style:preserve-3d]
          will-change-transform
          ${className}
        `}
        style={{
          transform:
            'perspective(1250px) translateY(0px) translateZ(0px) scale(1)',
        }}
      >
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-30
            overflow-hidden
            rounded-[inherit]
          "
        >
          <div
            ref={shineRef}
            className="
              absolute
              inset-0
              opacity-0
              transition-opacity
              duration-200
            "
          />
        </div>

        {children}
      </div>
    </div>
  );
}

function ProVNWordmark() {
  return (
    <svg
      viewBox="0 0 1560 300"
      preserveAspectRatio="xMidYMid meet"
      className="
        block
        h-auto
        w-[96vw]
        max-w-[1600px]
        overflow-visible
      "
    >
      <defs>
        <linearGradient
          id="metalRed"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#d37a80"
          />

          <stop
            offset="13%"
            stopColor="#9d444a"
          />

          <stop
            offset="31%"
            stopColor="#6f252c"
          />

          <stop
            offset="54%"
            stopColor="#3e1016"
          />

          <stop
            offset="72%"
            stopColor="#6f1c25"
          />

          <stop
            offset="88%"
            stopColor="#441017"
          />

          <stop
            offset="100%"
            stopColor="#26090d"
          />
        </linearGradient>

        <linearGradient
          id="metalHighlight"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor="#ffffff"
            stopOpacity="0"
          />

          <stop
            offset="32%"
            stopColor="#ffd5d8"
            stopOpacity=".24"
          />

          <stop
            offset="50%"
            stopColor="#ffffff"
            stopOpacity=".46"
          />

          <stop
            offset="68%"
            stopColor="#ffd0d4"
            stopOpacity=".18"
          />

          <stop
            offset="100%"
            stopColor="#ffffff"
            stopOpacity="0"
          />
        </linearGradient>

        <filter
          id="metalGlow"
          x="-70%"
          y="-70%"
          width="240%"
          height="240%"
        >
          <feGaussianBlur
            stdDeviation="5"
            result="glow"
          />

          <feColorMatrix
            in="glow"
            type="matrix"
            values="
              1 0 0 0 0.40
              0 0.12 0 0 0
              0 0 0.15 0 0
              0 0 0 0.32 0
            "
            result="glowColor"
          />

          <feMerge>
            <feMergeNode in="glowColor" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        data-logo-letter
        filter="url(#metalGlow)"
      >
        <path
          d="M38 92 L96 92 L96 246 L38 246 Z"
          fill="url(#metalRed)"
        />

        <path
          d="M38 42 H184 L220 58 L184 77 H38 Z"
          fill="url(#metalRed)"
        />

        <path
          d="
            M116 93
            H191
            Q236 93 236 132
            Q236 173 190 173
            H116
            V134
            H181
            Q191 134 191 125
            Q191 117 181 117
            H116
            Z
          "
          fill="url(#metalRed)"
        />

        <path
          d="M42 47 H180"
          stroke="url(#metalHighlight)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g
        data-logo-letter
        filter="url(#metalGlow)"
      >
        <path
          d="M336 42 H394 V246 H336 Z"
          fill="url(#metalRed)"
        />

        <path
          d="M336 42 H483 L520 59 L486 78 H336 Z"
          fill="url(#metalRed)"
        />

        <path
          d="
            M414 94
            H484
            Q529 94 529 132
            Q529 161 503 173
            L555 246
            H486
            L445 182
            H414
            V142
            H478
            Q488 142 488 131
            Q488 120 478 120
            H414
            Z
          "
          fill="url(#metalRed)"
        />

        <path
          d="M340 47 H477"
          stroke="url(#metalHighlight)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g
        data-logo-letter
        filter="url(#metalGlow)"
      >
        <circle
          cx="775"
          cy="145"
          r="91"
          fill="none"
          stroke="url(#metalRed)"
          strokeWidth="57"
        />

        <polygon
          points="829,38 875,61 839,101 804,81"
          fill="#020203"
        />

        <polygon
          points="676,190 716,170 741,211 697,236"
          fill="#020203"
        />

        <path
          d="M711 88 A91 91 0 0 1 814 66"
          fill="none"
          stroke="#f9c3c7"
          strokeOpacity=".28"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g
        data-logo-letter
        filter="url(#metalGlow)"
      >
        <polygon
          points="
            1000,42
            1065,42
            1135,171
            1206,42
            1272,42
            1168,246
            1101,246
          "
          fill="url(#metalRed)"
        />

        <polygon
          points="1098,42 1136,42 1117,78"
          fill="#020203"
        />

        <path
          d="M1009 47 H1056"
          stroke="url(#metalHighlight)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g
        data-logo-letter
        filter="url(#metalGlow)"
      >
        <path
          d="M1342 42 H1401 V246 H1342 Z"
          fill="url(#metalRed)"
        />

        <path
          d="M1480 42 H1539 V246 H1480 Z"
          fill="url(#metalRed)"
        />

        <polygon
          points="
            1394,42
            1452,42
            1488,102
            1488,188
            1430,116
            1394,87
          "
          fill="url(#metalRed)"
        />

        <polygon
          points="
            1394,140
            1453,215
            1453,246
            1414,246
            1394,220
          "
          fill="url(#metalRed)"
        />

        <path
          d="M1347 47 H1395"
          stroke="url(#metalHighlight)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function ProVNNavMark() {
  return (
    <svg
      viewBox="0 0 58 58"
      aria-hidden="true"
      className="
        h-[46px]
        w-[46px]
        shrink-0
        overflow-visible
        drop-shadow-[0_0_10px_rgba(226,32,57,.35)]
        sm:h-[49px]
        sm:w-[49px]
        lg:h-[52px]
        lg:w-[52px]
      "
    >
      <defs>
        <linearGradient
          id="provnFinalMetal"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#ff8791"
          />

          <stop
            offset="11%"
            stopColor="#e95462"
          />

          <stop
            offset="28%"
            stopColor="#bc2639"
          />

          <stop
            offset="48%"
            stopColor="#851322"
          />

          <stop
            offset="69%"
            stopColor="#b11c30"
          />

          <stop
            offset="84%"
            stopColor="#64101c"
          />

          <stop
            offset="100%"
            stopColor="#250509"
          />
        </linearGradient>

        <linearGradient
          id="provnFinalTop"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor="#7f101e"
          />

          <stop
            offset="30%"
            stopColor="#e34859"
          />

          <stop
            offset="56%"
            stopColor="#ff98a1"
          />

          <stop
            offset="78%"
            stopColor="#cc2639"
          />

          <stop
            offset="100%"
            stopColor="#6e0b18"
          />
        </linearGradient>

        <linearGradient
          id="provnFinalEdge"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#ffbdc4"
          />

          <stop
            offset="32%"
            stopColor="#ff4d61"
          />

          <stop
            offset="68%"
            stopColor="#da1c36"
          />

          <stop
            offset="100%"
            stopColor="#6c0717"
          />
        </linearGradient>

        <filter
          id="provnFinalGlow"
          x="-70%"
          y="-70%"
          width="240%"
          height="240%"
        >
          <feGaussianBlur
            stdDeviation="1.1"
            result="blur"
          />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0.55
              0 0.05 0 0 0.02
              0 0 0.08 0 0.04
              0 0 0 .55 0
            "
            result="redGlow"
          />

          <feMerge>
            <feMergeNode in="redGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#provnFinalGlow)">
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
          fill="url(#provnFinalTop)"
          stroke="url(#provnFinalEdge)"
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
          fill="url(#provnFinalMetal)"
          stroke="url(#provnFinalEdge)"
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
            M23.7 28.6
            L30.4 35.8
            L26.4 36.9
            L23.7 34.4
            Z
          "
          fill="#29060c"
          opacity=".92"
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
          strokeWidth="1.05"
          strokeLinecap="round"
        />

        <path
          d="
            M43.8 22.7
            C49 24.8 51 28.2 51 32.8
            C51 38.8 46.4 43.3 38.6 43.7
          "
          fill="none"
          stroke="#ff334c"
          strokeOpacity=".72"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <path
          d="
            M13.6 51.4
            L21.6 43.4
          "
          fill="none"
          stroke="#ff5b6c"
          strokeOpacity=".55"
          strokeWidth=".9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function SectionPMark({
  gradientId,
}: {
  gradientId: string;
}) {
  return (
    <svg
      viewBox="0 0 260 330"
      className="h-full w-full overflow-visible"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#df858c"
          />

          <stop
            offset="17%"
            stopColor="#9d434c"
          />

          <stop
            offset="45%"
            stopColor="#5f1b26"
          />

          <stop
            offset="69%"
            stopColor="#320914"
          />

          <stop
            offset="100%"
            stopColor="#170309"
          />
        </linearGradient>
      </defs>

      <path
        d="M30 102 H92 V312 H30 Z"
        fill={`url(#${gradientId})`}
      />

      <path
        d="M30 36 H188 L232 58 L188 82 H30 Z"
        fill={`url(#${gradientId})`}
      />

      <path
        d="
          M112 103
          H188
          Q235 103 235 151
          Q235 201 186 201
          H112
          V153
          H180
          Q191 153 191 141
          Q191 129 180 129
          H112
          Z
        "
        fill={`url(#${gradientId})`}
      />

      <path
        d="M37 43 H185"
        fill="none"
        stroke="#ffbdc3"
        strokeOpacity=".28"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PremiumSectionBackdrop({
  id,
  label,
  side = 'left',
}: {
  id: string;
  label: string;
  side?: 'left' | 'right';
}) {
  const left =
    side === 'left';

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
    >
      <div className="absolute inset-0 bg-[#020203]" />

      <div
        className={`
          absolute
          top-[-10%]
          h-[120%]
          w-[56%]

          ${
            left
              ? 'left-[-18%]'
              : 'right-[-18%]'
          }
        `}
        style={{
          background:
            'radial-gradient(ellipse at center,rgba(142,28,44,.38) 0%,rgba(93,10,25,.26) 28%,rgba(47,3,13,.12) 54%,transparent 74%)',

          filter:
            'blur(22px)',
        }}
      />

      <div
        className="
          absolute
          inset-0
          opacity-[0.12]
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)
          `,

          backgroundSize:
            '78px 78px',

          WebkitMaskImage:
            'linear-gradient(to bottom,black,transparent 80%)',

          maskImage:
            'linear-gradient(to bottom,black,transparent 80%)',
        }}
      />

      <div
        className={`
          absolute
          top-[10%]
          h-[52%]
          w-[250px]
          opacity-[0.14]
          sm:w-[290px]
          lg:h-[58%]
          lg:w-[340px]

          ${
            left
              ? 'left-[2%]'
              : 'right-[2%]'
          }
        `}
      >
        <SectionPMark
          gradientId={`${id}-gradient`}
        />
      </div>

      <div
        className={`
          absolute
          top-[36%]
          h-[360px]
          w-[360px]
          rounded-full
          border
          border-[#9f3442]/20
          sm:h-[470px]
          sm:w-[470px]
          lg:h-[620px]
          lg:w-[620px]

          ${
            left
              ? 'right-[-250px] lg:right-[-300px]'
              : 'left-[-250px] lg:left-[-300px]'
          }
        `}
      />

      <div
        className={`
          absolute
          top-[42%]
          h-[280px]
          w-[280px]
          rounded-full
          border
          border-[#ca4655]/10
          sm:h-[380px]
          sm:w-[380px]
          lg:h-[500px]
          lg:w-[500px]

          ${
            left
              ? 'right-[-205px] lg:right-[-235px]'
              : 'left-[-205px] lg:left-[-235px]'
          }
        `}
      />

      <div
        className="
          absolute
          left-1/2
          top-[26px]
          w-[78%]
          max-w-[1280px]
          -translate-x-1/2
          text-[7px]
          uppercase
          tracking-[0.38em]
          text-[#833340]/65
          sm:text-[8px]
        "
      >
        PROVN / {label}
      </div>

      <div
        className="
          absolute
          left-1/2
          top-[47px]
          h-px
          w-[78%]
          max-w-[1280px]
          -translate-x-1/2
          bg-gradient-to-r
          from-[#72222e]/5
          via-[#7f2c37]/18
          to-[#72222e]/5
        "
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg,rgba(2,2,3,.40),rgba(2,2,3,.72) 48%,rgba(2,2,3,.78))',
        }}
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[160px]
          bg-gradient-to-t
          from-[#020203]
          to-transparent
        "
      />
    </div>
  );
}

/* =========================================================
   GSAP
========================================================= */

function usePremiumMotion(
  rootRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    let destroyed = false;

    let cleanup:
      | (() => void)
      | undefined;

    async function initialise() {
      const gsapModule =
        await import('gsap');

      const triggerModule =
        await import(
          'gsap/ScrollTrigger'
        );

      if (destroyed) {
        return;
      }

      const gsap =
        gsapModule.default;

      const ScrollTrigger =
        triggerModule.ScrollTrigger;

      gsap.registerPlugin(
        ScrollTrigger
      );

      const root =
        rootRef.current;

      if (!root) {
        return;
      }

      if (
        window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
      ) {
        return;
      }

      const context =
        gsap.context(
          () => {
            const hero =
              root.querySelector<HTMLElement>(
                '[data-provn-hero]'
              );

            if (hero) {
              const letters =
                hero.querySelectorAll(
                  '[data-logo-letter]'
                );

              const leftWave =
                hero.querySelector(
                  '[data-wave-left]'
                );

              const leftSoft =
                hero.querySelector(
                  '[data-wave-left-soft]'
                );

              const rightWave =
                hero.querySelector(
                  '[data-wave-right]'
                );

              const rightSoft =
                hero.querySelector(
                  '[data-wave-right-soft]'
                );

              const ringOne =
                hero.querySelector(
                  '[data-ring-one]'
                );

              const ringTwo =
                hero.querySelector(
                  '[data-ring-two]'
                );

              const ringGlow =
                hero.querySelector(
                  '[data-ring-glow]'
                );

              const horizon =
                hero.querySelector(
                  '[data-horizon]'
                );

              const centerGlow =
                hero.querySelector(
                  '[data-center-glow]'
                );

              const interfaceBar =
                hero.querySelector(
                  '[data-interface]'
                );

              const wordmark =
                hero.querySelector(
                  '[data-wordmark-wrap]'
                );

              const smallCopy =
                hero.querySelector(
                  '[data-small-copy]'
                );

              const smallKicker =
                hero.querySelector(
                  '[data-small-kicker]'
                );

              const smallTitle =
                hero.querySelector(
                  '[data-small-title]'
                );

              const smallDescription =
                hero.querySelector(
                  '[data-small-description]'
                );

              const buttons =
                hero.querySelectorAll(
                  '[data-small-button]'
                );

              const footer =
                hero.querySelector(
                  '[data-small-footer]'
                );

              const waves = [
                leftWave,
                leftSoft,
                rightWave,
                rightSoft,
              ].filter(
                Boolean
              ) as Element[];

              const rings = [
                ringOne,
                ringTwo,
                ringGlow,
              ].filter(
                Boolean
              ) as Element[];

              gsap.set(
                letters,
                {
                  opacity: 0,
                  y: 78,
                  scale: 0.72,
                  filter:
                    'blur(20px)',
                }
              );

              gsap.set(
                waves,
                {
                  opacity: 0,
                }
              );

              gsap.set(
                rings,
                {
                  opacity: 0,
                  scale: 0.72,
                  transformOrigin:
                    '50% 50%',
                }
              );

              if (horizon) {
                gsap.set(
                  horizon,
                  {
                    scaleX: 0,
                    transformOrigin:
                      'center',
                  }
                );
              }

              if (
                centerGlow
              ) {
                gsap.set(
                  centerGlow,
                  {
                    opacity: 0,
                    scale: 0.5,
                  }
                );
              }

              if (
                interfaceBar
              ) {
                gsap.set(
                  interfaceBar,
                  {
                    opacity: 0,
                    y: -10,
                  }
                );
              }

              if (
                smallKicker
              ) {
                gsap.set(
                  smallKicker,
                  {
                    opacity: 0,
                    y: 10,
                    filter:
                      'blur(6px)',
                  }
                );
              }

              if (
                smallTitle
              ) {
                gsap.set(
                  smallTitle,
                  {
                    opacity: 0,
                    y: 12,
                    filter:
                      'blur(8px)',
                  }
                );
              }

              if (
                smallDescription
              ) {
                gsap.set(
                  smallDescription,
                  {
                    opacity: 0,
                    y: 10,
                  }
                );
              }

              gsap.set(
                buttons,
                {
                  opacity: 0,
                  y: 10,
                  scale: 0.94,
                }
              );

              if (footer) {
                gsap.set(
                  footer,
                  {
                    opacity: 0,
                  }
                );
              }

              const intro =
                gsap.timeline({
                  defaults: {
                    ease:
                      'power4.out',
                  },
                });

              intro.to(
                waves,
                {
                  opacity: 1,
                  duration: 1.4,
                  stagger: 0.08,
                },
                0
              );

              intro.to(
                rings,
                {
                  opacity: 1,
                  scale: 1,
                  duration: 1.75,
                  stagger: 0.1,
                },
                0.08
              );

              if (
                centerGlow
              ) {
                intro.to(
                  centerGlow,
                  {
                    opacity: 1,
                    scale: 1,
                    duration: 1.6,
                  },
                  0.12
                );
              }

              if (horizon) {
                intro.to(
                  horizon,
                  {
                    scaleX: 1,
                    duration: 1.15,
                  },
                  0.18
                );
              }

              intro.to(
                letters,
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter:
                    'blur(0px)',
                  duration: 0.9,
                  stagger: 0.19,
                },
                0.38
              );

              if (
                interfaceBar
              ) {
                intro.to(
                  interfaceBar,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.68,
                  },
                  1.4
                );
              }

              if (
                smallKicker
              ) {
                intro.to(
                  smallKicker,
                  {
                    opacity: 1,
                    y: 0,
                    filter:
                      'blur(0px)',
                    duration: 0.52,
                  },
                  1.76
                );
              }

              if (
                smallTitle
              ) {
                intro.to(
                  smallTitle,
                  {
                    opacity: 1,
                    y: 0,
                    filter:
                      'blur(0px)',
                    duration: 0.65,
                  },
                  1.92
                );
              }

              if (
                smallDescription
              ) {
                intro.to(
                  smallDescription,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                  },
                  2.1
                );
              }

              intro.to(
                buttons,
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.5,
                  stagger: 0.1,
                },
                2.27
              );

              if (footer) {
                intro.to(
                  footer,
                  {
                    opacity: 1,
                    duration: 0.45,
                  },
                  2.5
                );
              }

              if (leftWave) {
                gsap.to(
                  leftWave,
                  {
                    xPercent: 13,
                    rotate: 12,
                    duration: 5.8,
                    ease:
                      'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                  }
                );
              }

              if (leftSoft) {
                gsap.to(
                  leftSoft,
                  {
                    xPercent: 17,
                    duration: 7.2,
                    ease:
                      'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                  }
                );
              }

              if (
                rightWave
              ) {
                gsap.to(
                  rightWave,
                  {
                    xPercent: -13,
                    rotate: -12,
                    duration: 6.2,
                    ease:
                      'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                  }
                );
              }

              if (rightSoft) {
                gsap.to(
                  rightSoft,
                  {
                    xPercent: -17,
                    duration: 7.6,
                    ease:
                      'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                  }
                );
              }

              if (ringOne) {
                gsap.to(
                  ringOne,
                  {
                    rotation: 360,
                    duration: 24,
                    ease: 'none',
                    repeat: -1,
                    transformOrigin:
                      '50% 50%',
                  }
                );
              }

              if (ringTwo) {
                gsap.to(
                  ringTwo,
                  {
                    rotation: -360,
                    duration: 30,
                    ease: 'none',
                    repeat: -1,
                    transformOrigin:
                      '50% 50%',
                  }
                );
              }

              if (ringGlow) {
                gsap.to(
                  ringGlow,
                  {
                    scale: 1.08,
                    duration: 4.2,
                    ease:
                      'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    transformOrigin:
                      '50% 50%',
                  }
                );
              }

              const createHeroScroll =
                () => {
                  const heroExit =
                    gsap.timeline({
                      paused: true,
                      defaults: {
                        ease: 'none',
                      },
                    });

                  if (wordmark) {
                    heroExit.to(
                      wordmark,
                      {
                        y: -82,
                        scale: 0.92,
                        opacity: 0.06,
                      },
                      0
                    );
                  }

                  if (smallCopy) {
                    heroExit.to(
                      smallCopy,
                      {
                        y: -28,
                        opacity: 0,
                      },
                      0
                    );
                  }

                  ScrollTrigger.create({
                    trigger: hero,
                    start:
                      'top top',
                    end:
                      'bottom top',
                    scrub: 0.75,
                    animation:
                      heroExit,
                    invalidateOnRefresh:
                      true,

                    onLeaveBack:
                      () => {
                        heroExit.progress(
                          0
                        );

                        if (
                          wordmark
                        ) {
                          gsap.set(
                            wordmark,
                            {
                              y: 0,
                              scale: 1,
                              opacity: 1,
                            }
                          );
                        }

                        if (
                          smallCopy
                        ) {
                          gsap.set(
                            smallCopy,
                            {
                              y: 0,
                              opacity: 1,
                            }
                          );
                        }
                      },

                    onUpdate:
                      self => {
                        if (
                          self.progress <
                          0.015
                        ) {
                          if (
                            wordmark
                          ) {
                            gsap.set(
                              wordmark,
                              {
                                y: 0,
                                scale: 1,
                                opacity: 1,
                              }
                            );
                          }

                          if (
                            smallCopy
                          ) {
                            gsap.set(
                              smallCopy,
                              {
                                y: 0,
                                opacity: 1,
                              }
                            );
                          }
                        }
                      },
                  });
                };

              intro.eventCallback(
                'onComplete',
                () => {
                  createHeroScroll();
                  ScrollTrigger.refresh();
                }
              );
            }

            const sections =
              Array.from(
                root.querySelectorAll<HTMLElement>(
                  '[data-cinematic-section]'
                )
              );

            sections.forEach(
              section => {
                if (
                  section.hasAttribute(
                    'data-special-how'
                  )
                ) {
                  return;
                }

                const eyebrowLines =
                  section.querySelectorAll(
                    '[data-anim-eyebrow-line]'
                  );

                const eyebrow =
                  section.querySelector(
                    '[data-anim-eyebrow]'
                  );

                const lines =
                  section.querySelectorAll(
                    '[data-anim-line]'
                  );

                const description =
                  section.querySelector(
                    '[data-anim-description]'
                  );

                const cards =
                  section.querySelectorAll(
                    '[data-anim-card]'
                  );

                const icons =
                  section.querySelectorAll(
                    '[data-card-icon]'
                  );

                const titles =
                  section.querySelectorAll(
                    '[data-card-title]'
                  );

                const cardDescriptions =
                  section.querySelectorAll(
                    '[data-card-description]'
                  );

                const arrows =
                  section.querySelectorAll(
                    '[data-card-arrow]'
                  );

                gsap.set(
                  eyebrowLines,
                  {
                    scaleX: 0,
                    transformOrigin:
                      'left center',
                  }
                );

                if (eyebrow) {
                  gsap.set(
                    eyebrow,
                    {
                      opacity: 0,
                      y: 10,
                    }
                  );
                }

                gsap.set(
                  lines,
                  {
                    opacity: 0,
                    yPercent: 105,
                    filter:
                      'blur(7px)',
                  }
                );

                if (
                  description
                ) {
                  gsap.set(
                    description,
                    {
                      opacity: 0,
                      y: 16,
                    }
                  );
                }

                gsap.set(
                  cards,
                  {
                    opacity: 0,
                    y: 28,
                    scale: 0.985,
                  }
                );

                gsap.set(
                  icons,
                  {
                    opacity: 0,
                    y: 8,
                    scale: 0.78,
                  }
                );

                gsap.set(
                  titles,
                  {
                    opacity: 0,
                    y: 8,
                  }
                );

                gsap.set(
                  cardDescriptions,
                  {
                    opacity: 0,
                    y: 7,
                  }
                );

                gsap.set(
                  arrows,
                  {
                    opacity: 0,
                    scale: 0.78,
                  }
                );

                const timeline =
                  gsap.timeline({
                    paused: true,
                    defaults: {
                      ease:
                        'power3.out',
                    },
                  });

                timeline.to(
                  eyebrowLines,
                  {
                    scaleX: 1,
                    duration: 0.32,
                    stagger: 0.05,
                  },
                  0
                );

                if (eyebrow) {
                  timeline.to(
                    eyebrow,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.38,
                    },
                    0.03
                  );
                }

                timeline.to(
                  lines,
                  {
                    opacity: 1,
                    yPercent: 0,
                    filter:
                      'blur(0px)',
                    duration: 0.62,
                    stagger: 0.12,
                  },
                  0.08
                );

                if (
                  description
                ) {
                  timeline.to(
                    description,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.46,
                    },
                    0.29
                  );
                }

                timeline.to(
                  cards,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.52,
                    stagger: 0.075,
                  },
                  0.40
                );

                timeline.to(
                  icons,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.34,
                    stagger: 0.035,
                  },
                  0.54
                );

                timeline.to(
                  titles,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.32,
                    stagger: 0.03,
                  },
                  0.59
                );

                timeline.to(
                  cardDescriptions,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.30,
                    stagger: 0.025,
                  },
                  0.64
                );

                timeline.to(
                  arrows,
                  {
                    opacity: 1,
                    scale: 1,
                    duration: 0.28,
                    stagger: 0.025,
                  },
                  0.68
                );

                ScrollTrigger.create({
                  trigger:
                    section,
                  start:
                    'top 86%',
                  animation:
                    timeline,
                  toggleActions:
                    'play none none reverse',
                  invalidateOnRefresh:
                    true,
                });
              }
            );

            const how =
              root.querySelector<HTMLElement>(
                '[data-special-how]'
              );

            if (how) {
              const eyebrow =
                how.querySelector(
                  '[data-anim-eyebrow]'
                );

              const lines =
                how.querySelectorAll(
                  '[data-anim-line]'
                );

              const description =
                how.querySelector(
                  '[data-anim-description]'
                );

              const redLine =
                how.querySelector(
                  '[data-how-line]'
                );

              const steps =
                Array.from(
                  how.querySelectorAll<HTMLElement>(
                    '[data-how-step]'
                  )
                );

              const stepIcons =
                Array.from(
                  how.querySelectorAll<HTMLElement>(
                    '[data-how-icon]'
                  )
                );

              const stepTitles =
                Array.from(
                  how.querySelectorAll<HTMLElement>(
                    '[data-how-title]'
                  )
                );

              const stepDescriptions =
                Array.from(
                  how.querySelectorAll<HTMLElement>(
                    '[data-how-description]'
                  )
                );

              if (eyebrow) {
                gsap.set(
                  eyebrow,
                  {
                    opacity: 0,
                    y: 9,
                  }
                );
              }

              gsap.set(
                lines,
                {
                  opacity: 0,
                  yPercent: 105,
                  filter:
                    'blur(7px)',
                }
              );

              if (
                description
              ) {
                gsap.set(
                  description,
                  {
                    opacity: 0,
                    y: 15,
                  }
                );
              }

              if (redLine) {
                gsap.set(
                  redLine,
                  {
                    scaleY: 0,
                    transformOrigin:
                      'top center',
                  }
                );
              }

              gsap.set(
                steps,
                {
                  opacity: 0,
                  x: -34,
                  scale: 0.985,
                }
              );

              gsap.set(
                stepIcons,
                {
                  opacity: 0,
                  x: -12,
                  scale: 0.72,
                }
              );

              gsap.set(
                stepTitles,
                {
                  opacity: 0,
                  x: -9,
                }
              );

              gsap.set(
                stepDescriptions,
                {
                  opacity: 0,
                  x: -7,
                }
              );

              const howTimeline =
                gsap.timeline({
                  paused: true,
                  defaults: {
                    ease:
                      'power3.out',
                  },
                });

              if (eyebrow) {
                howTimeline.to(
                  eyebrow,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.34,
                  },
                  0
                );
              }

              howTimeline.to(
                lines,
                {
                  opacity: 1,
                  yPercent: 0,
                  filter:
                    'blur(0px)',
                  duration: 0.58,
                  stagger: 0.11,
                },
                0.04
              );

              if (
                description
              ) {
                howTimeline.to(
                  description,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.42,
                  },
                  0.24
                );
              }

              if (redLine) {
                howTimeline.to(
                  redLine,
                  {
                    scaleY: 1,
                    duration: 1.22,
                    ease:
                      'power2.inOut',
                  },
                  0.33
                );
              }

              steps.forEach(
                (
                  step,
                  index
                ) => {
                  const start =
                    0.43 +
                    index *
                      0.19;

                  howTimeline.to(
                    step,
                    {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      duration: 0.58,
                      ease:
                        'power3.out',
                    },
                    start
                  );

                  if (
                    stepIcons[index]
                  ) {
                    howTimeline.to(
                      stepIcons[
                        index
                      ],
                      {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.40,
                        ease:
                          'back.out(1.5)',
                      },
                      start +
                        0.10
                    );
                  }

                  if (
                    stepTitles[index]
                  ) {
                    howTimeline.to(
                      stepTitles[
                        index
                      ],
                      {
                        opacity: 1,
                        x: 0,
                        duration: 0.32,
                      },
                      start +
                        0.16
                    );
                  }

                  if (
                    stepDescriptions[
                      index
                    ]
                  ) {
                    howTimeline.to(
                      stepDescriptions[
                        index
                      ],
                      {
                        opacity: 1,
                        x: 0,
                        duration: 0.32,
                      },
                      start +
                        0.21
                    );
                  }
                }
              );

              ScrollTrigger.create({
                trigger: how,
                start:
                  'top 88%',
                animation:
                  howTimeline,
                toggleActions:
                  'play none none reverse',
                invalidateOnRefresh:
                  true,
              });
            }

            const trophy =
              root.querySelector(
                '[data-trophy]'
              );

            const trophyFloat =
              root.querySelector(
                '[data-trophy-float]'
              );

            if (trophy) {
              gsap.fromTo(
                trophy,
                {
                  y: 22,
                },
                {
                  y: -22,
                  ease: 'none',
                  scrollTrigger: {
                    trigger:
                      trophy,
                    start:
                      'top bottom',
                    end:
                      'bottom top',
                    scrub: 1,
                  },
                }
              );
            }

            if (trophyFloat) {
              gsap.fromTo(
                trophyFloat,
                {
                  y: 14,
                  rotation: -0.18,
                  scale: 0.996,
                },
                {
                  y: -18,
                  rotation: 0.18,
                  scale: 1.008,
                  duration: 3.35,
                  ease:
                    'sine.inOut',
                  repeat: -1,
                  yoyo: true,
                  transformOrigin:
                    '50% 50%',
                }
              );
            }

            requestAnimationFrame(
              () => {
                ScrollTrigger.refresh();
              }
            );

            window.setTimeout(
              () => {
                ScrollTrigger.refresh();
              },
              400
            );
          },
          root
        );

      cleanup =
        () => {
          context.revert();
        };
    }

    initialise();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, [rootRef]);
}

/* =========================================================
   FAST PREMIUM CURSOR
========================================================= */

function PremiumCursor() {
  const ringRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const dotRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    const ring =
      ringRef.current;

    const dot =
      dotRef.current;

    if (
      !ring ||
      !dot
    ) {
      return;
    }

    const finePointer =
      window.matchMedia(
        '(pointer: fine)'
      );

    if (
      !finePointer.matches
    ) {
      return;
    }

    const style =
      document.createElement(
        'style'
      );

    style.setAttribute(
      'data-provn-cursor-style',
      'true'
    );

    style.textContent = `
      @media (pointer: fine) {
        html,
        body,
        body * {
          cursor: none !important;
        }
      }
    `;

    document.head.appendChild(
      style
    );

    let targetX = -100;
    let targetY = -100;

    let ringX = -100;
    let ringY = -100;

    let ringScale = 1;
    let targetScale = 1;

    let firstMove = true;

    let isInteractive = false;
    let isPressed = false;

    let raf = 0;

    let lastTime =
      performance.now();

    const interactiveSelector = `
      a,
      button,
      input,
      textarea,
      select,
      label,
      [role="button"],
      [data-cursor-block]
    `;

    const setInteractive = (
      next: boolean
    ) => {
      if (
        next ===
        isInteractive
      ) {
        return;
      }

      isInteractive =
        next;

      if (!isPressed) {
        targetScale =
          next
            ? 1.34
            : 1;
      }

      ring.style.borderColor =
        next
          ? 'rgba(255,60,82,.98)'
          : 'rgba(225,36,61,.78)';

      ring.style.backgroundColor =
        next
          ? 'rgba(5,4,5,.93)'
          : 'rgba(3,3,4,.86)';

      ring.style.boxShadow =
        next
          ? '0 0 15px rgba(229,31,59,.30)'
          : '0 0 9px rgba(229,31,59,.18)';

      dot.style.backgroundColor =
        next
          ? '#ff4058'
          : '#e51f3b';

      dot.style.boxShadow =
        next
          ? '0 0 10px rgba(255,64,88,.90)'
          : '0 0 7px rgba(229,31,59,.70)';
    };

    const updateInteractive = (
      target:
        EventTarget | null
    ) => {
      if (
        !(
          target instanceof
          Element
        )
      ) {
        setInteractive(
          false
        );

        return;
      }

      setInteractive(
        Boolean(
          target.closest(
            interactiveSelector
          )
        )
      );
    };

    const pointerMove = (
      event:
        PointerEvent
    ) => {
      targetX =
        event.clientX;

      targetY =
        event.clientY;

      /*
        IMPORTANT:
        The RED DOT moves instantly.
        No interpolation.
        This makes the cursor feel fast.
      */

      dot.style.transform =
        `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;

      updateInteractive(
        event.target
      );

      if (firstMove) {
        firstMove = false;

        ringX =
          targetX;

        ringY =
          targetY;

        ring.style.transform =
          `translate3d(${ringX - 15}px, ${ringY - 15}px, 0) scale(1)`;

        ring.style.opacity =
          '1';

        dot.style.opacity =
          '1';
      }
    };

    const pointerDown = () => {
      isPressed = true;

      targetScale =
        isInteractive
          ? 1.12
          : 0.84;

      dot.style.transform =
        `translate3d(${targetX - 3}px, ${targetY - 3}px, 0) scale(.78)`;
    };

    const pointerUp = (
      event:
        PointerEvent
    ) => {
      isPressed = false;

      updateInteractive(
        event.target
      );

      targetScale =
        isInteractive
          ? 1.34
          : 1;

      dot.style.transform =
        `translate3d(${targetX - 3}px, ${targetY - 3}px, 0) scale(1)`;
    };

    const pointerLeave = () => {
      ring.style.opacity =
        '0';

      dot.style.opacity =
        '0';
    };

    const pointerEnter = () => {
      if (!firstMove) {
        ring.style.opacity =
          '1';

        dot.style.opacity =
          '1';
      }
    };

    const render = (
      time: number
    ) => {
      const delta =
        Math.min(
          (
            time -
            lastTime
          ) /
            1000,
          0.032
        );

      lastTime =
        time;

      /*
        Fast frame-rate independent smoothing.

        46 = very quick follow.
        It remains fluid but no long lag.
      */

      const positionFollow =
        1 -
        Math.exp(
          -46 *
            delta
        );

      const scaleFollow =
        1 -
        Math.exp(
          -32 *
            delta
        );

      ringX +=
        (
          targetX -
          ringX
        ) *
        positionFollow;

      ringY +=
        (
          targetY -
          ringY
        ) *
        positionFollow;

      ringScale +=
        (
          targetScale -
          ringScale
        ) *
        scaleFollow;

      ring.style.transform =
        `translate3d(${ringX - 15}px, ${ringY - 15}px, 0) scale(${ringScale})`;

      raf =
        requestAnimationFrame(
          render
        );
    };

    window.addEventListener(
      'pointermove',
      pointerMove,
      {
        passive: true,
      }
    );

    window.addEventListener(
      'pointerdown',
      pointerDown,
      {
        passive: true,
      }
    );

    window.addEventListener(
      'pointerup',
      pointerUp,
      {
        passive: true,
      }
    );

    document.addEventListener(
      'mouseleave',
      pointerLeave
    );

    document.addEventListener(
      'mouseenter',
      pointerEnter
    );

    raf =
      requestAnimationFrame(
        render
      );

    return () => {
      cancelAnimationFrame(
        raf
      );

      window.removeEventListener(
        'pointermove',
        pointerMove
      );

      window.removeEventListener(
        'pointerdown',
        pointerDown
      );

      window.removeEventListener(
        'pointerup',
        pointerUp
      );

      document.removeEventListener(
        'mouseleave',
        pointerLeave
      );

      document.removeEventListener(
        'mouseenter',
        pointerEnter
      );

      style.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[9998]

          hidden

          h-[30px]
          w-[30px]

          rounded-full

          border
          border-[#e1243d]/80

          bg-[#030304]/90

          opacity-0

          transition-[opacity,border-color,background-color,box-shadow]
          duration-100

          md:block
        "
        style={{
          transform:
            'translate3d(-100px,-100px,0)',

          boxShadow:
            '0 0 9px rgba(229,31,59,.18)',

          willChange:
            'transform',

          contain:
            'layout paint style',
        }}
      />

      <div
        ref={dotRef}
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[9999]

          hidden

          h-[6px]
          w-[6px]

          rounded-full

          bg-[#e51f3b]

          opacity-0

          transition-[opacity,background-color,box-shadow]
          duration-75

          md:block
        "
        style={{
          transform:
            'translate3d(-100px,-100px,0)',

          boxShadow:
            '0 0 7px rgba(229,31,59,.70)',

          willChange:
            'transform',

          contain:
            'layout paint style',
        }}
      />
    </>
  );
}

function AnimatedLine({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden">
      <span
        data-anim-line
        className={`block will-change-transform ${className}`}
      >
        {children}
      </span>
    </span>
  );
}

function Eyebrow({
  children,
  centered = false,
}: {
  children: ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={`
        mb-4
        flex
        items-center
        gap-3
        text-[9px]
        uppercase
        tracking-[0.32em]
        text-zinc-500
        sm:text-[10px]
        lg:mb-5
        lg:gap-4
        lg:text-[11px]

        ${
          centered
            ? 'justify-center'
            : ''
        }
      `}
    >
      <span
        data-anim-eyebrow-line
        className="
          h-px
          w-8
          bg-[#9d444a]
          lg:w-10
        "
      />

      <span data-anim-eyebrow>
        {children}
      </span>

      {centered && (
        <span
          data-anim-eyebrow-line
          className="
            h-px
            w-8
            bg-[#9d444a]
            lg:w-10
          "
        />
      )}
    </div>
  );
}

function SectionDivider({
  large = false,
}: {
  large?: boolean;
}) {
  return (
    <div
      className={`
        relative
        bg-[#020203]

        ${
          large
            ? 'h-[58px] lg:h-[82px]'
            : 'h-[26px] lg:h-[42px]'
        }
      `}
    >
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-px
          w-[58%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-[#5e1d25]/20
          to-transparent
        "
      />
    </div>
  );
}

function EcosystemCard({
  icon,
  title,
  text,
  href,
}: {
  icon: MainIcon;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      data-anim-card
      data-cursor-block
      className="
        group
        relative
        flex
        min-h-[205px]
        overflow-visible
        rounded-[20px]
        border
        border-[#68222b]/70
        p-5
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-[#a0444e]/90
        hover:shadow-[0_24px_65px_rgba(74,7,20,.24)]
        sm:min-h-[220px]
        sm:p-6
        lg:min-h-[322px]
        lg:rounded-[25px]
        lg:p-7
      "
      style={{
        background:
          'linear-gradient(145deg,rgba(42,14,20,.94),rgba(23,9,13,.98) 52%,rgba(11,8,9,.99))',
      }}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-x-[12%]
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#c0646b]/35
          to-transparent
        "
      />

      <div className="relative z-10 flex h-full w-full flex-col">
        <PremiumRedIcon
          type={icon}
          size="large"
        />

        <h3
          data-card-title
          className="
            mt-5
            text-[15px]
            font-bold
            uppercase
            tracking-[0.09em]
            text-[#f4efef]
            lg:mt-8
            lg:text-[16px]
          "
        >
          {title}
        </h3>

        <p
          data-card-description
          className="
            mt-3
            max-w-[235px]
            text-[14px]
            leading-6
            text-zinc-400
            lg:mt-4
            lg:max-w-[185px]
          "
        >
          {text}
        </p>

        <div className="mt-auto pt-6">
          <RoundArrow />
        </div>
      </div>
    </a>
  );
}

function GameCard({
  name,
  position,
  href,
}: {
  name: string;
  position: string;
  href: string;
}) {
  const cardRef =
    useRef<HTMLAnchorElement | null>(
      null
    );

  const glowRef =
    useRef<HTMLSpanElement | null>(
      null
    );

  const move = (
    event:
      ReactPointerEvent<HTMLAnchorElement>
  ) => {
    if (
      window.innerWidth <
      1024
    ) {
      return;
    }

    const card =
      cardRef.current;

    if (!card) {
      return;
    }

    const rect =
      card.getBoundingClientRect();

    const x =
      (
        event.clientX -
        rect.left
      ) /
      rect.width;

    const y =
      (
        event.clientY -
        rect.top
      ) /
      rect.height;

    const rotateY =
      (
        x -
        0.5
      ) *
      7;

    const rotateX =
      (
        0.5 -
        y
      ) *
      5;

    card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.035)`;

    if (
      glowRef.current
    ) {
      glowRef.current.style.opacity =
        '1';

      glowRef.current.style.background =
        `radial-gradient(circle at ${x * 100}% ${y * 100}%,rgba(150,40,52,.20),transparent 60%)`;
    }
  };

  const leave =
    () => {
      if (
        cardRef.current
      ) {
        cardRef.current.style.transform =
          'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      }

      if (
        glowRef.current
      ) {
        glowRef.current.style.opacity =
          '0';
      }
    };

  return (
    <a
      ref={cardRef}
      href={href}
      data-anim-card
      data-cursor-block
      onPointerMove={move}
      onPointerLeave={leave}
      aria-label={`Explore ${name}`}
      className="
        group
        relative
        aspect-[337/238]
        overflow-hidden
        rounded-[14px]
        border
        border-[#70232d]/55
        transition-[transform,box-shadow,border-color]
        duration-200
        ease-out
        hover:border-[#a23b47]/80
        hover:shadow-[0_24px_60px_rgba(65,5,16,.22)]
      "
      style={{
        backgroundImage:
          "url('/home/section3.png')",

        backgroundSize:
          '496% 395%',

        backgroundPosition:
          position,

        backgroundRepeat:
          'no-repeat',

        transform:
          'perspective(900px)',
      }}
    >
      <span
        ref={glowRef}
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-300
        "
      />
    </a>
  );
}

function HowStep({
  number,
  icon,
  title,
  text,
  href,
}: {
  number: string;
  icon: MainIcon;
  title: string;
  text: string;
  href: string;
}) {
  const [
    cardHovered,
    setCardHovered,
  ] =
    useState(false);

  return (
    <a
      href={href}
      data-how-step
      className="
        group
        relative
        mb-3
        block
        lg:mb-4
      "
    >
      <div
        data-how-number
        className="
          absolute
          left-[-46px]
          top-[25px]
          z-30
          flex
          h-[34px]
          w-[34px]
          items-center
          justify-center
          rounded-full
          border
          text-[12px]
          font-bold
          transition-[background,border-color,box-shadow,color,transform]
          duration-300
          ease-out
          lg:left-[-56px]
          lg:top-[27px]
          lg:h-[38px]
          lg:w-[38px]
        "
        style={{
          background:
            cardHovered
              ? '#68101b'
              : '#100b0d',

          borderColor:
            cardHovered
              ? '#dc4d5e'
              : '#82313b',

          color:
            cardHovered
              ? '#ffffff'
              : '#f4f0f1',

          transform:
            cardHovered
              ? 'scale(1.08)'
              : 'scale(1)',

          boxShadow:
            cardHovered
              ? `
                0 0 0 3px rgba(138,18,37,.12),
                0 0 17px rgba(211,45,68,.46),
                0 0 34px rgba(121,12,31,.28),
                inset 0 0 12px rgba(255,92,110,.12)
              `
              : `
                0 0 8px rgba(82,10,24,.10)
              `,
        }}
      >
        {number}
      </div>

      <div
        onPointerEnter={() =>
          setCardHovered(
            true
          )
        }
        onPointerLeave={() =>
          setCardHovered(
            false
          )
        }
        className="
          relative
          flex
          min-h-[92px]
          items-center
          gap-4
          overflow-visible
          rounded-[15px]
          border
          border-[#5d2028]/65
          bg-[#100b0d]/95
          px-4
          py-4
          transition-all
          duration-300
          group-hover:border-[#91353f]/85
          group-hover:bg-[#160d10]
          group-hover:shadow-[0_16px_45px_rgba(66,6,17,.16)]
          lg:gap-5
          lg:rounded-[17px]
          lg:py-3
        "
      >
        <div
          data-how-icon
          className="relative z-20"
        >
          <PremiumRedIcon
            type={icon}
            size="large"
          />
        </div>

        <div className="relative z-10">
          <h3
            data-how-title
            className="
              text-[15px]
              font-bold
              sm:text-base
            "
          >
            {title}
          </h3>

          <p
            data-how-description
            className="
              mt-1.5
              text-[12px]
              leading-5
              text-zinc-400
              sm:text-[13px]
            "
          >
            {text}
          </p>
        </div>
      </div>
    </a>
  );
}

function ProofFeature({
  image,
  customIcon,
  line1,
  line2,
  href,
}: ProofFeatureType) {
  return (
    <a
      href={href}
      className="
        group
        relative
        z-10
        block
      "
    >
      <Tilt3DIcon
        className="
          flex
          h-[46px]
          w-[46px]
          items-center
          justify-center
          rounded-[11px]
          border
          border-[#6e2932]/80
          bg-gradient-to-br
          from-[#3e1119]
          via-[#220a0f]
          to-[#0d0709]
          shadow-[inset_0_1px_0_rgba(255,210,214,.08),0_8px_20px_rgba(0,0,0,.22)]
          sm:h-[48px]
          sm:w-[48px]
        "
      >
        {customIcon ===
        'student-review' ? (
          <StudentReviewIcon />
        ) : customIcon ===
          'team-opportunity' ? (
          <TeamOpportunityIcon />
        ) : (
          image && (
            <img
              src={image}
              alt=""
              draggable={false}
              className="
                pointer-events-none
                h-[42px]
                w-[42px]
                object-contain
                sm:h-[44px]
                sm:w-[44px]
              "
            />
          )
        )}
      </Tilt3DIcon>

      <p
        data-card-title
        className="
          mt-3
          text-[11px]
          leading-[1.05rem]
          text-[#e7e3e4]
          transition-colors
          duration-300
          group-hover:text-white
          sm:text-[12px]
        "
      >
        {line1}

        {line2 && (
          <>
            <br />
            {line2}
          </>
        )}
      </p>
    </a>
  );
}

function ProofCard({
  number,
  title,
  description,
  art,
  features,
}: {
  number: string;
  title: ReactNode;
  description: ReactNode;
  art: string;
  features: ProofFeatureType[];
}) {
  return (
    <div
      data-anim-card
      className="
        relative
        overflow-visible
      "
    >
      <Tilt3DPanel
        className="
          relative
          min-h-[455px]
          overflow-visible
          rounded-[20px]
          border
          border-[#64232c]/60
          bg-[#111114]
          transition-colors
          duration-300
          lg:h-[405px]
          lg:min-h-0
          lg:rounded-[25px]
        "
      >
        <div
          className="
            relative
            h-[330px]
            overflow-hidden
            rounded-t-[20px]
            lg:h-[282px]
            lg:rounded-t-[25px]
          "
        >
          <div
            className="
              absolute
              bottom-0
              right-0
              top-0
              w-[58%]
              overflow-hidden
              lg:w-[53%]
            "
          >
            <img
              src={art}
              alt=""
              draggable={false}
              className="
                pointer-events-none
                absolute
                bottom-0
                right-[-10%]
                h-[88%]
                max-w-none
                transition-all
                duration-700
                lg:right-[-2%]
                lg:h-[97%]
              "
            />
          </div>

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              w-[66%]
              lg:w-[56%]
            "
            style={{
              background:
                'linear-gradient(to right,rgba(17,17,20,1),rgba(17,17,20,.99) 70%,rgba(17,17,20,.82) 88%,transparent)',
            }}
          />

          <div
            className="
              relative
              z-10
              w-[59%]
              p-6
              [transform:translateZ(20px)]
              lg:w-[54%]
              lg:p-7
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-[11px]
                text-zinc-400
              "
            >
              {number}

              <span className="h-px w-5 bg-zinc-600" />
            </div>

            <h3
              data-card-title
              className="
                mt-5
                text-[26px]
                font-bold
                leading-[1.03]
                lg:mt-6
                lg:text-[27px]
              "
            >
              {title}
            </h3>

            <p
              data-card-description
              className="
                mt-4
                max-w-[190px]
                text-[12px]
                leading-[1.3rem]
                text-zinc-300
                lg:text-[13px]
              "
            >
              {description}
            </p>
          </div>
        </div>

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            z-20
            h-[125px]
            rounded-b-[20px]
            border-t
            border-white/[0.04]
            bg-[#0d0d10]
            px-5
            py-4
            [transform:translateZ(28px)]
            sm:px-6
            lg:rounded-b-[25px]
            lg:px-7
          "
        >
          <div
            className="
              grid
              grid-cols-3
              gap-3
              sm:gap-5
            "
          >
            {features.map(
              (
                feature,
                index
              ) => (
                <ProofFeature
                  key={`${feature.line1}-${index}`}
                  {...feature}
                />
              )
            )}
          </div>
        </div>
      </Tilt3DPanel>
    </div>
  );
}

function RoleCTA({
  icon,
  eyebrow,
  title,
  href,
}: {
  icon:
    | 'learn'
    | 'recruiter';

  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <a
      href={href}
      data-anim-card
      className="
        group
        relative
        flex
        min-h-[86px]
        items-center
        gap-4
        overflow-visible
        rounded-[15px]
        border
        border-[#61212a]/65
        bg-[#0b0809]
        px-4
        py-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#90343f]
        hover:bg-[#140a0d]
        hover:shadow-[0_18px_42px_rgba(60,4,15,.18)]
        sm:px-5
      "
    >
      <PremiumRedIcon
        type={icon}
      />

      <div className="relative z-10">
        <p
          data-card-description
          className="
            text-[8px]
            uppercase
            tracking-[0.22em]
            text-zinc-500
          "
        >
          {eyebrow}
        </p>

        <p
          data-card-title
          className="
            mt-1
            text-[13px]
            font-semibold
            sm:text-[14px]
          "
        >
          {title}
        </p>
      </div>

      <span
        data-card-arrow
        className="
          ml-auto
          text-[#bd515c]
          transition-all
          duration-300
          group-hover:translate-x-1
          group-hover:text-[#f16a78]
        "
      >
        →
      </span>
    </a>
  );
}

function TournamentCard({
  type,
  number,
  title,
  text,
}: {
  type:
    TournamentIconType;

  number: string;
  title: string;
  text: string;
}) {
  const imageMap:
    Record<
      TournamentIconType,
      string
    > = {
      shield:
        '/home/tournament-shield.png',

      coins:
        '/home/tournament-coins.png',

      bars:
        '/home/tournament-bars.png',
    };

  return (
    <a
      href="#join"
      data-anim-card
      className="
        group
        relative
        min-h-[132px]
        overflow-visible
        rounded-[14px]
        border
        border-[#65232c]/60
        px-5
        py-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#963640]/80
        hover:shadow-[0_18px_45px_rgba(55,4,14,.20)]
        lg:min-h-[150px]
        lg:px-6
      "
      style={{
        background:
          'linear-gradient(145deg,rgba(23,21,24,.98),rgba(12,11,13,.99))',
      }}
    >
      <div className="flex items-center gap-4 lg:gap-6">
        <Tilt3DIcon
          className="
            flex
            h-[70px]
            w-[70px]
            shrink-0
            items-center
            justify-center
            rounded-[14px]
            border
            border-[#742b35]/70
            bg-gradient-to-br
            from-[#391119]
            via-[#20090f]
            to-[#10080b]
          "
        >
          <img
            src={
              imageMap[type]
            }
            alt=""
            draggable={false}
            className="
              pointer-events-none
              h-[62px]
              w-[62px]
              object-contain
            "
          />
        </Tilt3DIcon>

        <div className="flex-1">
          <div className="flex justify-between gap-3">
            <h3
              data-card-title
              className="
                text-[15px]
                font-semibold
                leading-5
                sm:text-[16px]
                lg:text-[17px]
              "
            >
              {title}
            </h3>

            <span className="text-[11px] text-zinc-400">
              {number}
            </span>
          </div>

          <p
            data-card-description
            className="
              mt-2
              text-[12px]
              leading-[1.45]
              text-zinc-400
              sm:text-[13px]
            "
          >
            {text}
          </p>
        </div>
      </div>
    </a>
  );
}

function FounderCard({
  initial,
  name,
}: {
  initial: string;
  name: string;
}) {
  return (
    <div
      data-anim-card
      className="
        group
        relative
        overflow-visible
        rounded-[22px]
        border
        border-[#572029]/55
        bg-gradient-to-br
        from-[#140d0f]
        via-[#0c090a]
        to-[#070708]
        px-7
        py-8
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#87313c]/75
        hover:shadow-[0_22px_55px_rgba(61,5,15,.18)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-95px]
          h-[180px]
          w-[180px]
          -translate-x-1/2
          rounded-full
          bg-[#8a1b29]/[0.08]
          blur-[65px]
        "
      />

      <div className="flex justify-center">
        <Tilt3DIcon
          className="
            flex
            h-[68px]
            w-[68px]
            items-center
            justify-center
            rounded-full
            border
            border-[#963b46]/80
            bg-gradient-to-br
            from-[#501722]
            via-[#2d0d14]
            to-[#14080b]
            text-[21px]
            font-black
            text-[#e16c76]
          "
        >
          <span>
            {initial}
          </span>
        </Tilt3DIcon>
      </div>

      <p
        data-card-description
        className="
          mt-5
          text-[10px]
          uppercase
          tracking-[0.3em]
          text-zinc-500
        "
      >
        Founder
      </p>

      <h3
        data-card-title
        className={`
          ${founderFont.className}
          mt-2
          text-[38px]
          font-medium
          italic
          leading-none
          tracking-[-0.025em]
          text-[#f3eeee]
          transition-colors
          duration-500
          group-hover:text-white
          sm:text-[42px]
          lg:text-[45px]
        `}
      >
        {name}
      </h3>
    </div>
  );
}

export default function Home() {
  const rootRef =
    useRef<HTMLElement | null>(
      null
    );

  const [
    scrolled,
    setScrolled,
  ] =
    useState(false);

  usePremiumMotion(
    rootRef
  );

  useEffect(() => {
    const html =
      document.documentElement;

    const previousBehavior =
      html.style.scrollBehavior;

    const previousPadding =
      html.style.scrollPaddingTop;

    html.style.scrollBehavior =
      'smooth';

    html.style.scrollPaddingTop =
      '76px';

    return () => {
      html.style.scrollBehavior =
        previousBehavior;

      html.style.scrollPaddingTop =
        previousPadding;
    };
  }, []);

  useEffect(() => {
    const update =
      () =>
        setScrolled(
          window.scrollY >
            35
        );

    update();

    window.addEventListener(
      'scroll',
      update,
      {
        passive: true,
      }
    );

    return () =>
      window.removeEventListener(
        'scroll',
        update
      );
  }, []);

  return (
    <main
      ref={rootRef}
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#020203]
        text-white
      "
    >
      <PremiumCursor />

      <header
        data-cursor-block
        className={`
          fixed
          left-0
          top-0
          z-50
          w-full
          transition-all
          duration-500

          ${
            scrolled
              ? `
                border-b
                border-red-950/30
                bg-black/88
                shadow-[0_10px_36px_rgba(0,0,0,.38)]
                backdrop-blur-2xl
              `
              : `
                border-b
                border-white/[0.025]
                bg-black/52
                backdrop-blur-xl
              `
          }
        `}
      >
        <div
          className="
            mx-auto
            flex
            h-[62px]
            max-w-[1450px]
            items-center
            justify-between
            px-5
            sm:h-[64px]
            sm:px-6
            lg:h-[68px]
            lg:px-10
          "
        >
          <a
            href="#home"
            aria-label="ProVN Home"
            className="
              group/logo
              inline-flex
              items-center
              gap-[1px]
              transition-transform
              duration-300
              ease-out
              hover:scale-[1.025]
              sm:gap-[2px]
              lg:gap-[2px]
            "
          >
            <span
              className="
                relative
                flex
                items-center
                justify-center
                transition-all
                duration-500
                ease-out
                group-hover/logo:scale-[1.07]
                group-hover/logo:-rotate-[1.5deg]
                group-hover/logo:drop-shadow-[0_0_13px_rgba(232,38,61,.48)]
              "
            >
              <span
                className="
                  pointer-events-none
                  absolute
                  inset-[7px]
                  rounded-full
                  bg-[#be1d34]/25
                  opacity-0
                  blur-[14px]
                  transition-opacity
                  duration-500
                  group-hover/logo:opacity-100
                "
              />

              <span className="relative z-10">
                <ProVNNavMark />
              </span>
            </span>

            <span
              className="
                relative
                -ml-[2px]
                translate-y-[4px]
                flex
                items-baseline
                text-[22px]
                font-black
                leading-none
                tracking-[-0.055em]
                sm:text-[23px]
                lg:text-[24px]
              "
            >
              <span className="text-[#f5f2f2]">
                ro
              </span>

              <span
                className="
                  text-[#e51f3b]
                  drop-shadow-[0_0_9px_rgba(214,25,52,.16)]
                "
              >
                VN
              </span>
            </span>
          </a>

          <nav
            className="
              hidden
              items-center
              gap-9
              text-[14px]
              font-medium
              text-zinc-400
              md:flex
            "
          >
            <a
              href="#home"
              className="transition-colors hover:text-white"
            >
              Home
            </a>

            <a
              href="#games"
              className="transition-colors hover:text-white"
            >
              Games
            </a>

            <a
              href="#proof"
              className="transition-colors hover:text-white"
            >
              Community
            </a>

            <a
              href="#how"
              className="transition-colors hover:text-white"
            >
              About
            </a>
          </nav>

          <a
            href="#join"
            className="
              rounded-full
              border
              border-[#7b2731]/80
              px-[18px]
              py-[8px]
              text-[13px]
              font-medium
              transition-all
              duration-300
              hover:scale-[1.035]
              hover:border-[#ad414c]
              hover:bg-[#2c0c12]/45
              sm:px-5
              lg:px-[22px]
              lg:py-[9px]
              lg:text-[14px]
            "
          >
            ♛ Level Up
          </a>
        </div>
      </header>

      <section
        id="home"
        data-provn-hero
        className="
          relative
          min-h-[100svh]
          overflow-hidden
          bg-[#020203]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.15]
          "
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.026) 1px,transparent 1px),
              linear-gradient(90deg,rgba(255,255,255,.026) 1px,transparent 1px)
            `,

            backgroundSize:
              '70px 70px',

            WebkitMaskImage:
              'radial-gradient(circle at center,black 0%,rgba(0,0,0,.78) 47%,transparent 82%)',

            maskImage:
              'radial-gradient(circle at center,black 0%,rgba(0,0,0,.78) 47%,transparent 82%)',
          }}
        />

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[43%]
            h-[620px]
            w-[90%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-red-950/[0.12]
            blur-[155px]
            lg:w-[76%]
          "
        />

        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[44%]
            z-[2]
            h-[82%]
            w-[115%]
            -translate-x-1/2
            -translate-y-1/2
            sm:w-[108%]
            lg:h-[94%]
            lg:w-[100%]
          "
        >
          <defs>
            <linearGradient
              id="ringGradientA"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#ff8e99"
                stopOpacity="0"
              />

              <stop
                offset="25%"
                stopColor="#ff4558"
                stopOpacity=".25"
              />

              <stop
                offset="47%"
                stopColor="#ff1738"
                stopOpacity=".9"
              />

              <stop
                offset="63%"
                stopColor="#8d0018"
                stopOpacity=".45"
              />

              <stop
                offset="100%"
                stopColor="#ff1738"
                stopOpacity="0"
              />
            </linearGradient>

            <linearGradient
              id="ringGradientB"
              x1="1"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#ff1738"
                stopOpacity="0"
              />

              <stop
                offset="28%"
                stopColor="#7d0016"
                stopOpacity=".38"
              />

              <stop
                offset="52%"
                stopColor="#ff4c5e"
                stopOpacity=".72"
              />

              <stop
                offset="76%"
                stopColor="#ff1838"
                stopOpacity=".2"
              />

              <stop
                offset="100%"
                stopColor="#ff1738"
                stopOpacity="0"
              />
            </linearGradient>

            <filter
              id="ringBlur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="12"
              />
            </filter>

            <filter
              id="ringBlurStrong"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="28"
              />
            </filter>
          </defs>

          <g data-ring-one>
            <ellipse
              cx="800"
              cy="455"
              rx="700"
              ry="275"
              fill="none"
              stroke="url(#ringGradientA)"
              strokeWidth="11"
              transform="rotate(-8 800 455)"
              filter="url(#ringBlur)"
            />

            <ellipse
              cx="800"
              cy="455"
              rx="700"
              ry="275"
              fill="none"
              stroke="url(#ringGradientA)"
              strokeWidth="3"
              transform="rotate(-8 800 455)"
            />
          </g>

          <g data-ring-two>
            <ellipse
              cx="800"
              cy="440"
              rx="610"
              ry="335"
              fill="none"
              stroke="url(#ringGradientB)"
              strokeWidth="8"
              transform="rotate(15 800 440)"
              filter="url(#ringBlur)"
            />

            <ellipse
              cx="800"
              cy="440"
              rx="610"
              ry="335"
              fill="none"
              stroke="url(#ringGradientB)"
              strokeWidth="2.5"
              transform="rotate(15 800 440)"
            />
          </g>

          <g data-ring-glow>
            <ellipse
              cx="800"
              cy="450"
              rx="660"
              ry="300"
              fill="none"
              stroke="#a30020"
              strokeOpacity=".16"
              strokeWidth="50"
              transform="rotate(3 800 450)"
              filter="url(#ringBlurStrong)"
            />
          </g>
        </svg>

        <div
          data-wave-left
          className="
            pointer-events-none
            absolute
            -left-[20%]
            top-[-8%]
            z-[1]
            h-[116%]
            w-[48%]
            rotate-[8deg]
            rounded-[50%]
            opacity-0
            blur-[30px]
            mix-blend-screen
          "
          style={{
            background:
              'linear-gradient(90deg,transparent 0%,rgba(255,0,40,.02) 22%,rgba(255,12,44,.27) 43%,rgba(255,92,108,.82) 50%,rgba(255,10,40,.24) 58%,transparent 78%)',
          }}
        />

        <div
          data-wave-left-soft
          className="
            pointer-events-none
            absolute
            -left-[13%]
            top-[4%]
            z-[1]
            h-[104%]
            w-[39%]
            rotate-[7deg]
            rounded-[50%]
            opacity-0
            blur-[65px]
            mix-blend-screen
          "
          style={{
            background:
              'linear-gradient(90deg,transparent,rgba(200,0,36,.28),transparent)',
          }}
        />

        <div
          data-wave-right
          className="
            pointer-events-none
            absolute
            -right-[20%]
            top-[-8%]
            z-[1]
            h-[116%]
            w-[48%]
            -rotate-[8deg]
            rounded-[50%]
            opacity-0
            blur-[30px]
            mix-blend-screen
          "
          style={{
            background:
              'linear-gradient(90deg,transparent 0%,rgba(255,0,40,.02) 22%,rgba(255,12,44,.27) 43%,rgba(255,92,108,.82) 50%,rgba(255,10,40,.24) 58%,transparent 78%)',
          }}
        />

        <div
          data-wave-right-soft
          className="
            pointer-events-none
            absolute
            -right-[13%]
            top-[4%]
            z-[1]
            h-[104%]
            w-[39%]
            -rotate-[7deg]
            rounded-[50%]
            opacity-0
            blur-[65px]
            mix-blend-screen
          "
          style={{
            background:
              'linear-gradient(90deg,transparent,rgba(200,0,36,.28),transparent)',
          }}
        />

        <div
          data-center-glow
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[47%]
            z-[3]
            h-[180px]
            w-[58%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-red-600/[0.055]
            opacity-0
            blur-[90px]
          "
        />

        <div
          data-horizon
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[51%]
            z-[4]
            h-px
            w-[86%]
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-red-500/25
            to-transparent
            lg:w-[76%]
          "
        />

        <div
          data-interface
          className="
            absolute
            left-1/2
            top-[88px]
            z-20
            hidden
            w-[82%]
            max-w-[1320px]
            -translate-x-1/2
            lg:block
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-white/[0.045]
              pb-3
              text-[8px]
              uppercase
              tracking-[0.3em]
              text-zinc-600
            "
          >
            <span>
              PROVN / SYSTEM 001
            </span>

            <div className="flex gap-10">
              <span>PLAY</span>
              <span>CONNECT</span>
              <span>COMPETE</span>
            </div>

            <span>
              EST. 2026
            </span>
          </div>
        </div>

        <div
          data-wordmark-wrap
          className="
            absolute
            left-1/2
            top-[41%]
            z-20
            -translate-x-1/2
            -translate-y-1/2
            sm:top-[42%]
            lg:top-[41%]
          "
        >
          <ProVNWordmark />
        </div>

        <div
          data-small-copy
          className="
            absolute
            bottom-[4.5%]
            left-1/2
            z-30
            w-[92%]
            max-w-[700px]
            -translate-x-1/2
            text-center
            sm:bottom-[5.5%]
            lg:bottom-[4.8%]
          "
        >
          <p
            data-small-kicker
            className="
              text-[8px]
              uppercase
              tracking-[0.46em]
              text-zinc-600
              sm:text-[9px]
              lg:text-[10px]
            "
          >
            More Than Just Games
          </p>

          <h1
            data-small-title
            className="
              mt-2
              text-[17px]
              font-medium
              tracking-[-0.025em]
              text-zinc-100
              sm:text-[22px]
              lg:text-[25px]
            "
          >
            Play Better.

            <span className="text-[#a93640]">
              {' '}
              Connect Smarter.
            </span>

            {' '}
            Win Together.
          </h1>

          <p
            data-small-description
            className="
              mx-auto
              mt-2
              max-w-[570px]
              text-[10px]
              leading-5
              text-zinc-600
              sm:text-[12px]
              lg:text-[13px]
            "
          >
            Find teammates,
            coaches, gaming services
            and tournaments — all
            in one place.
          </p>

          <div
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-2
              sm:gap-3
            "
          >
            <a
              data-small-button
              href="#ecosystem"
              className="
                rounded-full
                bg-[#eee9e7]
                px-5
                py-2
                text-[10px]
                font-semibold
                text-black
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white
                sm:px-6
                sm:py-2.5
                sm:text-[11px]
              "
            >
              Explore ProVN
            </a>

            <a
              data-small-button
              href="#proof"
              className="
                rounded-full
                border
                border-[#7f2630]
                bg-[#2a0d12]/45
                px-5
                py-2
                text-[10px]
                font-medium
                text-zinc-300
                transition-all
                duration-300
                hover:scale-105
                hover:border-[#b5444f]
                hover:bg-[#42141c]
                hover:text-white
                sm:px-6
                sm:py-2.5
                sm:text-[11px]
              "
            >
              Level Up
            </a>
          </div>

          <p
            data-small-footer
            className="
              mt-3
              text-[7px]
              uppercase
              tracking-[0.32em]
              text-zinc-700
              sm:text-[8px]
            "
          >
            Performance · Proof · Opportunity
          </p>
        </div>
      </section>

      <SectionDivider />

      <section
        id="ecosystem"
        data-cinematic-section
        className="
          relative
          overflow-hidden
          py-[78px]
          sm:py-[92px]
          lg:py-[116px]
        "
      >
        <PremiumSectionBackdrop
          id="ecosystem"
          label="ECOSYSTEM 002"
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1500px]
            px-5
            sm:px-6
            lg:px-10
          "
        >
          <h2
            className="
              text-[44px]
              font-black
              leading-[0.94]
              tracking-[-0.04em]
              sm:text-5xl
              lg:text-6xl
            "
          >
            <AnimatedLine>
              One Platform.
            </AnimatedLine>

            <AnimatedLine className="text-[#c82c3c]">
              Every Side of Gaming.
            </AnimatedLine>
          </h2>

          <p
            data-anim-description
            className="
              mt-5
              max-w-xl
              text-[15px]
              leading-7
              text-zinc-400
              lg:text-base
            "
          >
            Choose what you want
            to do and enter the
            part of ProVN built
            for you.
          </p>

          <div
            className="
              mt-11
              grid
              gap-4
              sm:grid-cols-2
              lg:mt-[64px]
              lg:grid-cols-5
              lg:gap-[18px]
            "
          >
            <EcosystemCard
              icon="discover"
              title="Discover"
              text="Find games and communities."
              href="#games"
            />

            <EcosystemCard
              icon="connect"
              title="Connect"
              text="Meet players and build squads."
              href="#proof"
            />

            <EcosystemCard
              icon="learn"
              title="Learn"
              text="Get coached and improve faster."
              href="#how"
            />

            <EcosystemCard
              icon="earn"
              title="Earn"
              text="Offer services and get paid."
              href="#join"
            />

            <EcosystemCard
              icon="compete"
              title="Compete"
              text="Join tournaments and prove your skills."
              href="#tournaments"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      <section
        id="games"
        data-cinematic-section
        className="
          relative
          overflow-hidden
          py-[78px]
          sm:py-[92px]
          lg:py-[112px]
        "
      >
        <PremiumSectionBackdrop
          id="games"
          label="GAME NETWORK 003"
          side="right"
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1450px]
            px-5
            sm:px-6
            lg:px-10
          "
        >
          <Eyebrow>
            Choose · Play · Grow
          </Eyebrow>

          <h2
            className="
              text-[43px]
              font-black
              leading-[0.96]
              tracking-[-0.045em]
              sm:text-5xl
              lg:text-6xl
            "
          >
            <AnimatedLine>
              Choose Your
            </AnimatedLine>

            <AnimatedLine className="text-[#c82c3c]">
              Game.
            </AnimatedLine>
          </h2>

          <p
            data-anim-description
            className="
              mt-5
              max-w-2xl
              text-[15px]
              leading-7
              text-zinc-400
              sm:text-base
            "
          >
            Enter a dedicated
            ecosystem of players,
            coaches, services and
            tournaments built
            around your game.
          </p>

          <div
            className="
              mt-11
              grid
              gap-5
              sm:grid-cols-2
              lg:mt-16
              lg:grid-cols-4
              lg:gap-7
            "
          >
            {gameCards.map(
              game => (
                <GameCard
                  key={game.name}
                  {...game}
                />
              )
            )}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section
        id="how"
        data-cinematic-section
        data-special-how
        className="
          relative
          overflow-hidden
          py-[74px]
          sm:py-[88px]
          lg:min-h-[800px]
          lg:py-[105px]
        "
      >
        <PremiumSectionBackdrop
          id="how"
          label="JOURNEY 004"
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            top-0
            z-[2]
            hidden
            w-[52%]
            opacity-[0.62]
            lg:block
          "
          style={{
            backgroundImage:
              "url('/home/section4.png')",

            backgroundSize:
              'auto 90%',

            backgroundPosition:
              'right center',

            backgroundRepeat:
              'no-repeat',

            WebkitMaskImage:
              'linear-gradient(to right,transparent 0%,black 28%,black 100%)',

            maskImage:
              'linear-gradient(to right,transparent 0%,black 28%,black 100%)',
          }}
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1450px]
            px-5
            sm:px-6
            lg:px-10
          "
        >
          <div className="lg:w-[48%]">
            <p
              data-anim-eyebrow
              className="
                mb-4
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-zinc-400
                sm:text-[10px]
                lg:text-[11px]
              "
            >
              Simple Steps. Bigger Opportunities.
            </p>

            <h2
              className="
                text-[44px]
                font-black
                leading-[0.96]
                tracking-[-0.04em]
                sm:text-5xl
              "
            >
              <AnimatedLine>
                How ProVN
              </AnimatedLine>

              <AnimatedLine className="text-[#c82c3c]">
                Works.
              </AnimatedLine>
            </h2>

            <p
              data-anim-description
              className="
                mt-5
                max-w-xl
                text-[15px]
                leading-7
                text-zinc-400
                lg:text-base
              "
            >
              Join, connect and
              grow in a dedicated
              ecosystem built for
              gamers, coaches and
              providers.
            </p>

            <div
              className="
                relative
                mt-9
                pl-[46px]
                lg:mt-10
                lg:pl-[56px]
              "
            >
              <div
                data-how-line
                className="
                  absolute
                  bottom-9
                  left-[16px]
                  top-9
                  w-px
                  bg-gradient-to-b
                  from-[#d44d5e]
                  via-[#9b2636]
                  to-[#54111c]
                  shadow-[0_0_14px_rgba(166,42,57,.28)]
                  lg:bottom-10
                  lg:left-[17px]
                  lg:top-10
                "
              />

              <HowStep
                number="01"
                icon="profile"
                title="Create Your Profile"
                text="Tell us your games, role and skill level."
                href="#join"
              />

              <HowStep
                number="02"
                icon="connect"
                title="Connect & Explore"
                text="Find players, coaches, services and tournaments."
                href="#proof"
              />

              <HowStep
                number="03"
                icon="discover"
                title="Play & Grow"
                text="Join squads, get coached and improve your skills."
                href="#games"
              />

              <HowStep
                number="04"
                icon="compete"
                title="Compete & Earn"
                text="Participate in tournaments and earn rewards."
                href="#tournaments"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section
        id="proof"
        data-cinematic-section
        className="
          relative
          overflow-hidden
          py-[78px]
          sm:py-[92px]
          lg:py-[118px]
        "
      >
        <PremiumSectionBackdrop
          id="proof"
          label="VERIFICATION 005"
          side="right"
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1450px]
            px-5
            sm:px-6
            lg:px-10
          "
        >
          <Eyebrow centered>
            Verified Talent Ecosystem
          </Eyebrow>

          <div className="text-center">
            <h2
              className="
                text-[44px]
                font-black
                leading-[0.95]
                tracking-[-0.04em]
                sm:text-5xl
                lg:text-6xl
              "
            >
              <AnimatedLine>
                Skill Deserves
              </AnimatedLine>

              <AnimatedLine className="text-[#c82c3c]">
                Proof.
              </AnimatedLine>
            </h2>

            <p
              data-anim-description
              className="
                mx-auto
                mt-5
                max-w-[650px]
                text-[15px]
                leading-7
                text-zinc-400
                lg:text-base
              "
            >
              A trusted space where
              players, coaches and
              teams connect through
              real performance, not
              just claims.
            </p>
          </div>

          <div
            className="
              mt-12
              grid
              gap-5
              overflow-visible
              sm:mt-14
              lg:mt-[66px]
              lg:grid-cols-3
              lg:gap-7
            "
          >
            <ProofCard
              number="01"
              title={
                <>
                  Verified
                  <br />
                  Players
                </>
              }
              description="Performance-backed profiles, not claimed ranks."
              art="/home/proof-player.png"
              features={[
                {
                  image:
                    '/home/proof-rank.png',

                  line1:
                    'Rank',

                  line2:
                    'Verification',

                  href:
                    '#join',
                },

                {
                  image:
                    '/home/proof-history.png',

                  line1:
                    'Match',

                  line2:
                    'History',

                  href:
                    '#join',
                },

                {
                  image:
                    '/home/proof-stats.png',

                  line1:
                    'Real',

                  line2:
                    'Stats',

                  href:
                    '#join',
                },
              ]}
            />

            <ProofCard
              number="02"
              title={
                <>
                  Trusted
                  <br />
                  Coaches
                </>
              }
              description="Coaching credibility earned through real student improvement."
              art="/home/proof-coach.png"
              features={[
                {
                  customIcon:
                    'student-review',

                  line1:
                    'Student',

                  line2:
                    'Reviews',

                  href:
                    '#join',
                },

                {
                  image:
                    '/home/proof-improvement.png',

                  line1:
                    'Track',

                  line2:
                    'Improvement',

                  href:
                    '#join',
                },

                {
                  image:
                    '/home/proof-experience.png',

                  line1:
                    'Verified',

                  line2:
                    'Experience',

                  href:
                    '#join',
                },
              ]}
            />

            <ProofCard
              number="03"
              title={
                <>
                  Discoverable
                  <br />
                  Talent
                </>
              }
              description="Get found by teams, tournaments and scouts based on verified performance."
              art="/home/proof-talent.png"
              features={[
                {
                  customIcon:
                    'team-opportunity',

                  line1:
                    'Team',

                  line2:
                    'Opportunities',

                  href:
                    '#recruiter',
                },

                {
                  image:
                    '/home/proof-tournaments.png',

                  line1:
                    'Tournaments',

                  href:
                    '#tournaments',
                },

                {
                  image:
                    '/home/proof-scout.png',

                  line1:
                    'Scout',

                  line2:
                    'Visibility',

                  href:
                    '#recruiter',
                },
              ]}
            />
          </div>

          <div
            id="join"
            className="
              mt-12
              flex
              flex-col
              items-center
              lg:mt-[72px]
            "
          >
            <a
              data-anim-card
              href="#home"
              className="
                flex
                w-full
                max-w-[430px]
                items-center
                justify-between
                rounded-[14px]
                border
                border-[#8e3440]/80
                bg-gradient-to-r
                from-[#4b0f18]
                via-[#641520]
                to-[#350b11]
                px-6
                py-[16px]
                text-[16px]
                font-semibold
                transition-all
                duration-300
                hover:scale-[1.035]
                hover:border-[#b64b57]
                hover:shadow-[0_0_40px_rgba(120,18,34,.20)]
                sm:px-8
                sm:text-lg
              "
            >
              Join Early Access

              <span>→</span>
            </a>

            <div
              id="recruiter"
              className="
                mt-5
                grid
                w-full
                max-w-[620px]
                gap-4
                sm:grid-cols-2
              "
            >
              <RoleCTA
                icon="learn"
                eyebrow="Teach & Grow"
                title="Become a Founding Coach"
                href="#how"
              />

              <RoleCTA
                icon="recruiter"
                eyebrow="Discover Talent"
                title="Become a Recruiter"
                href="#proof"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section
        id="tournaments"
        data-cinematic-section
        className="
          relative
          overflow-hidden
          pb-[84px]
          pt-[76px]
          sm:pb-[96px]
          sm:pt-[88px]
          lg:pb-[120px]
          lg:pt-[108px]
        "
      >
        <PremiumSectionBackdrop
          id="tournaments"
          label="COMPETITION 006"
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1540px]
            px-5
            sm:px-6
            lg:px-10
          "
        >
          <div
            className="
              grid
              items-center
              gap-8
              lg:grid-cols-[36%_64%]
            "
          >
            <div>
              <Eyebrow>
                Competitions & Tournaments
              </Eyebrow>

              <h2
                className="
                  text-[45px]
                  font-black
                  leading-[0.95]
                  tracking-[-0.045em]
                  sm:text-5xl
                  lg:text-[61px]
                "
              >
                <AnimatedLine>
                  Compete With
                </AnimatedLine>

                <AnimatedLine className="text-[#c82c3c]">
                  Confidence.
                </AnimatedLine>
              </h2>

              <p
                data-anim-description
                className="
                  mt-5
                  max-w-[500px]
                  text-[15px]
                  leading-7
                  text-zinc-400
                  lg:text-base
                "
              >
                From casual scrims
                to high-stakes
                tournaments, play
                in a safe, verified
                and transparent
                environment.
              </p>

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <a
                  data-anim-card
                  href="#tournaments"
                  className="
                    rounded-[10px]
                    bg-[#c51f31]
                    px-7
                    py-4
                    font-semibold
                    transition-all
                    duration-300
                    hover:scale-[1.035]
                    hover:bg-[#dc263a]
                    hover:shadow-[0_0_34px_rgba(140,20,40,.23)]
                  "
                >
                  Explore Tournaments →
                </a>

                <a
                  data-anim-card
                  href="#join"
                  className="
                    rounded-[10px]
                    border
                    border-[#70252e]/75
                    px-7
                    py-4
                    font-semibold
                    transition-all
                    duration-300
                    hover:scale-[1.035]
                    hover:border-[#a33b46]
                    hover:bg-[#17090c]
                  "
                >
                  Host a Tournament →
                </a>
              </div>
            </div>

            <div
              className="
                relative
                hidden
                min-h-[500px]
                items-center
                justify-end
                lg:flex
              "
            >
              <div
                data-trophy
                className="
                  relative
                  z-10
                  w-full
                  max-w-[852px]
                  overflow-visible
                "
              >
                <div
                  data-trophy-float
                  data-cursor-block
                  className="
                    relative
                    overflow-hidden
                    rounded-[14px]
                    border
                    border-[#66242d]/40
                    shadow-[0_35px_100px_rgba(0,0,0,.46)]
                    will-change-transform
                  "
                >
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-[12%]
                      top-0
                      z-20
                      h-px
                      bg-gradient-to-r
                      from-transparent
                      via-[#d44255]/40
                      to-transparent
                    "
                  />

                  <img
                    src="/home/section6-right.png"
                    alt="ProVN Tournament"
                    draggable={false}
                    className="
                      block
                      h-auto
                      w-full
                    "
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="
              mt-14
              grid
              gap-4
              overflow-visible
              md:grid-cols-3
              lg:mt-[82px]
              lg:gap-6
            "
          >
            <TournamentCard
              type="shield"
              number="01"
              title="Verified Organizers"
              text="Only trusted hosts and communities can run tournaments."
            />

            <TournamentCard
              type="coins"
              number="02"
              title="Protected Prize Pools"
              text="Secure payments and milestone based disbursal."
            />

            <TournamentCard
              type="bars"
              number="03"
              title="Fair Match & Payout Verification"
              text="Results, match history and payouts are transparently tracked."
            />
          </div>
        </div>
      </section>

      <SectionDivider large />

      <section
        data-cinematic-section
        className="
          relative
          overflow-hidden
          px-5
          pb-[82px]
          pt-[78px]
          sm:px-6
          lg:px-10
          lg:pb-[112px]
          lg:pt-[96px]
        "
      >
        <PremiumSectionBackdrop
          id="founders"
          label="FOUNDERS 007"
          side="right"
        />

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1150px]
            text-center
          "
        >
          <Eyebrow centered>
            The People Behind ProVN
          </Eyebrow>

          <h2
            className="
              mx-auto
              max-w-[880px]
              text-[40px]
              font-black
              leading-[0.98]
              tracking-[-0.04em]
              sm:text-5xl
              lg:text-[60px]
            "
          >
            <AnimatedLine>
              Built for the
            </AnimatedLine>

            <AnimatedLine className="text-[#c82c3c]">
              Next Generation of Gaming.
            </AnimatedLine>
          </h2>

          <p
            data-anim-description
            className="
              mx-auto
              mt-6
              max-w-[760px]
              text-[15px]
              leading-7
              text-zinc-400
              sm:text-base
              lg:text-lg
            "
          >
            ProVN is being built
            around one simple
            idea: gaming talent
            should be easier to
            discover, easier to
            trust and easier to
            turn into opportunity.
          </p>

          <div
            className="
              mx-auto
              mt-12
              grid
              max-w-[760px]
              gap-5
              overflow-visible
              sm:grid-cols-2
            "
          >
            <FounderCard
              initial="K"
              name="Kanav"
            />

            <FounderCard
              initial="A"
              name="Anmol"
            />
          </div>

          <div
            className="
              mx-auto
              mt-14
              max-w-[900px]
              border-t
              border-white/[0.05]
              pt-10
            "
          >
            <p
              className="
                text-[19px]
                font-semibold
                leading-8
                sm:text-xl
                lg:text-2xl
              "
            >
              “Play with purpose.

              <span className="text-[#c84b56]">
                {' '}
                Build your proof.
                Own your game.
              </span>

              ”
            </p>
          </div>
        </div>
      </section>

      <footer
        data-cursor-block
        className="
          border-t
          border-white/[0.05]
          bg-[#020203]
          py-8
          lg:py-10
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[1450px]
            flex-col
            gap-5
            px-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
            lg:px-10
          "
        >
          <div>
            <a
              href="#home"
              className="
                text-[24px]
                font-black
              "
            >
              Pro

              <span className="text-red-600">
                VN
              </span>
            </a>

            <p
              className="
                mt-2
                text-sm
                text-zinc-600
              "
            >
              Where real
              performance becomes
              real recognition.
            </p>
          </div>

          <div className="sm:text-right">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-zinc-600
              "
            >
              Founded by
            </p>

            <p
              className="
                mt-2
                text-sm
                text-zinc-400
              "
            >
              Kanav &amp; Anmol
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}