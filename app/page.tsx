'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/* =========================================================
   TYPES
========================================================= */

type MainIcon =
  | 'discover'
  | 'connect'
  | 'learn'
  | 'earn'
  | 'compete'
  | 'profile'
  | 'recruiter';

type ProofFeatureType = {
  image: string;
  line1: string;
  line2?: string;
  href: string;
};

type TournamentIconType = 'shield' | 'coins' | 'bars';

/* =========================================================
   DATA
========================================================= */

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

/* =========================================================
   ICONS
========================================================= */

function MainIconSvg({ type }: { type: MainIcon }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'profile') {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 lg:h-8 lg:w-8" {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21c.7-5.2 3-7.5 7.5-7.5s6.8 2.3 7.5 7.5" />
      </svg>
    );
  }

  if (type === 'recruiter') {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" {...common}>
        <circle cx="8.5" cy="7.2" r="3.1" />
        <path d="M3.3 17.2c.5-3.3 2.2-5.1 5.2-5.1 1.4 0 2.5.4 3.4 1.1" />

        <circle cx="16.5" cy="15.5" r="3.2" />
        <path d="m18.9 17.9 2.3 2.3" />

        <path d="M14 5.5h6" />
        <path d="M17 3v5" />
      </svg>
    );
  }

  if (type === 'discover') {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 lg:h-8 lg:w-8" {...common}>
        <path d="M7.5 9.5h-2A3.5 3.5 0 0 0 2 13v2a3 3 0 0 0 5.4 1.8L9 15h6l1.6 1.8A3 3 0 0 0 22 15v-2a3.5 3.5 0 0 0-3.5-3.5h-2" />
        <path d="M8 12h4" />
        <path d="M10 10v4" />
        <circle cx="17" cy="12" r=".8" />
        <circle cx="19" cy="14" r=".8" />
      </svg>
    );
  }

  if (type === 'connect') {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 lg:h-8 lg:w-8" {...common}>
        <circle cx="12" cy="7" r="3" />
        <circle cx="5.5" cy="9.5" r="2.2" />
        <circle cx="18.5" cy="9.5" r="2.2" />

        <path d="M7 20c.5-4 2.2-6 5-6s4.5 2 5 6" />
        <path d="M2 19c.4-2.8 1.7-4.2 4-4.2" />
        <path d="M22 19c-.4-2.8-1.7-4.2-4-4.2" />
      </svg>
    );
  }

  if (type === 'learn') {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 lg:h-8 lg:w-8" {...common}>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12.5V17c3 2 7 2 10 0v-4.5" />
        <path d="M21 9v5" />
      </svg>
    );
  }

  if (type === 'earn') {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7 lg:h-8 lg:w-8" {...common}>
        <ellipse cx="12" cy="6" rx="6.5" ry="3" />
        <path d="M5.5 6v5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V6" />
        <path d="M5.5 11v5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 lg:h-8 lg:w-8" {...common}>
      <path d="M8 4h8v5c0 3-1.7 5-4 5S8 12 8 9V4Z" />
      <path d="M8 6H4c0 4 1.5 6 4.5 6" />
      <path d="M16 6h4c0 4-1.5 6-4.5 6" />
      <path d="M12 14v4" />
      <path d="M8 20h8" />
    </svg>
  );
}

/* =========================================================
   CURSOR EFFECT
========================================================= */

function CursorWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rawCtx = canvas.getContext('2d', {
      alpha: true,
    });

    if (!rawCtx) return;

    const ctx: CanvasRenderingContext2D = rawCtx;

    type Ripple = {
      x: number;
      y: number;
      start: number;
      size: number;
      rotation: number;
    };

    const ripples: Ripple[] = [];

    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      1.1
    );

    let lastX = -1000;
    let lastY = -1000;
    let lastSpawn = 0;

    let frame = 0;
    let running = false;

    const sprite = document.createElement('canvas');

    sprite.width = 360;
    sprite.height = 280;

    const rawSpriteContext =
      sprite.getContext('2d');

    if (!rawSpriteContext) return;

    const sctx: CanvasRenderingContext2D =
      rawSpriteContext;

    const cx = 180;
    const cy = 140;

    const body = sctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      170
    );

    body.addColorStop(
      0,
      'rgba(105,0,23,.56)'
    );

    body.addColorStop(
      0.2,
      'rgba(72,0,17,.46)'
    );

    body.addColorStop(
      0.46,
      'rgba(40,0,10,.33)'
    );

    body.addColorStop(
      0.72,
      'rgba(19,0,5,.17)'
    );

    body.addColorStop(
      1,
      'rgba(0,0,0,0)'
    );

    sctx.fillStyle = body;

    sctx.fillRect(
      0,
      0,
      sprite.width,
      sprite.height
    );

    const centerGlow =
      sctx.createRadialGradient(
        cx - 18,
        cy - 16,
        0,
        cx,
        cy,
        92
      );

    centerGlow.addColorStop(
      0,
      'rgba(255,25,55,.16)'
    );

    centerGlow.addColorStop(
      0.42,
      'rgba(145,0,31,.07)'
    );

    centerGlow.addColorStop(
      1,
      'rgba(0,0,0,0)'
    );

    sctx.fillStyle = centerGlow;

    sctx.fillRect(
      0,
      0,
      sprite.width,
      sprite.height
    );

    for (
      let i = 0;
      i < 3;
      i += 1
    ) {
      sctx.beginPath();

      sctx.ellipse(
        cx,
        cy,
        58 + i * 38,
        25 + i * 18,
        0,
        0,
        Math.PI * 2
      );

      sctx.lineWidth = 1.2;

      sctx.strokeStyle = `rgba(
        255,
        25,
        55,
        ${0.075 - i * 0.017}
      )`;

      sctx.stroke();
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width =
        Math.floor(
          width * dpr
        );

      canvas.height =
        Math.floor(
          height * dpr
        );

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    function animate(
      now: number
    ) {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      for (
        let i =
          ripples.length - 1;
        i >= 0;
        i -= 1
      ) {
        const ripple =
          ripples[i];

        const progress =
          (
            now -
            ripple.start
          ) / 1050;

        if (
          progress >= 1
        ) {
          ripples.splice(
            i,
            1
          );

          continue;
        }

        const ease =
          1 -
          Math.pow(
            1 - progress,
            3
          );

        const alpha =
          Math.pow(
            1 - progress,
            1.75
          );

        const size =
          ripple.size *
          (
            0.74 +
            ease * 0.48
          );

        ctx.save();

        ctx.globalAlpha =
          alpha * 0.68;

        ctx.translate(
          ripple.x,
          ripple.y
        );

        ctx.rotate(
          ripple.rotation
        );

        ctx.drawImage(
          sprite,
          -size,
          -size * 0.77,
          size * 2,
          size * 1.54
        );

        ctx.restore();
      }

      if (
        ripples.length >
        0
      ) {
        frame =
          requestAnimationFrame(
            animate
          );
      } else {
        running = false;
      }
    }

    const startAnimation =
      () => {
        if (running) return;

        running = true;

        frame =
          requestAnimationFrame(
            animate
          );
      };

    const pointerMove = (
      event: PointerEvent
    ) => {
      const target =
        event.target;

      if (
        !(
          target instanceof
          Element
        )
      ) {
        return;
      }

      const x =
        event.clientX;

      const y =
        event.clientY;

      const blocked =
        target.closest(`
          a,
          button,
          img,
          svg,
          video,
          input,
          textarea,
          select,
          header,
          nav,
          footer,
          [data-cursor-block]
        `);

      if (blocked) {
        lastX = x;
        lastY = y;

        return;
      }

      const dx =
        x - lastX;

      const dy =
        y - lastY;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      const now =
        performance.now();

      if (
        distance < 46 ||
        now -
          lastSpawn <
          76
      ) {
        return;
      }

      ripples.push({
        x,
        y,
        start: now,

        size:
          155 +
          Math.random() *
            22,

        rotation:
          (
            Math.random() -
            0.5
          ) * 0.07,
      });

      if (
        ripples.length >
        4
      ) {
        ripples.shift();
      }

      lastX = x;
      lastY = y;

      lastSpawn = now;

      startAnimation();
    };

    resize();

    window.addEventListener(
      'pointermove',
      pointerMove,
      {
        passive: true,
      }
    );

    window.addEventListener(
      'resize',
      resize
    );

    return () => {
      cancelAnimationFrame(
        frame
      );

      window.removeEventListener(
        'pointermove',
        pointerMove
      );

      window.removeEventListener(
        'resize',
        resize
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        z-[40]
        hidden
        md:block
      "
    />
  );
}

/* =========================================================
   SECTION TRANSITION
========================================================= */

function SectionTransition({
  large = false,
}: {
  large?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`
        pointer-events-none
        relative
        bg-[#050506]

        ${
          large
            ? 'h-[44px] lg:h-[125px]'
            : 'h-[24px] sm:h-[32px] lg:h-[66px]'
        }
      `}
    >
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-px
          w-[64%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-red-950/25
          to-transparent
        "
      />
    </div>
  );
}

/* =========================================================
   HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  normal,
  red,
  description,
}: {
  eyebrow: string;
  normal: string;
  red: string;
  description: string;
}) {
  return (
    <div
      data-cursor-block
      className="
        relative
        z-20
      "
    >
      <div
        className="
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
          lg:tracking-[0.35em]
        "
      >
        <span
          className="
            h-px
            w-7
            bg-red-600

            lg:w-9
          "
        />

        {eyebrow}
      </div>

      <h2
        className="
          text-[42px]
          font-black
          leading-[0.98]
          tracking-[-0.045em]

          sm:text-5xl
          lg:text-6xl
        "
      >
        {normal}{' '}

        <span className="text-red-600">
          {red}
        </span>
      </h2>

      <p
        className="
          mt-5
          max-w-2xl
          text-[15px]
          leading-7
          text-zinc-400

          sm:text-base
        "
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   ECOSYSTEM CARD
========================================================= */

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
      data-cursor-block
      className="
        group
        relative
        flex
        min-h-[205px]
        cursor-pointer
        overflow-hidden
        rounded-[20px]
        border
        border-red-500/45
        p-5

        transition-all
        duration-300
        ease-out

        hover:z-20
        hover:scale-[1.02]
        hover:border-red-400/90
        hover:shadow-[0_18px_48px_rgba(200,0,35,.18)]

        active:scale-[.99]

        sm:min-h-[220px]
        sm:p-6

        lg:min-h-[322px]
        lg:rounded-[25px]
        lg:border-red-500/55
        lg:p-7

        lg:hover:scale-[1.035]
        lg:hover:shadow-[0_22px_60px_rgba(200,0,35,.20)]
      "
      style={{
        background:
          'linear-gradient(145deg,rgba(30,19,22,.96),rgba(14,10,12,.98))',

        boxShadow:
          `
            inset 0 0 36px rgba(124,11,27,.13),
            0 16px 45px rgba(0,0,0,.42)
          `,
      }}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
        style={{
          background:
            `
              radial-gradient(
                circle at 28% 22%,
                rgba(195,0,32,.22),
                transparent 44%
              ),
              linear-gradient(
                145deg,
                rgba(74,0,14,.24),
                transparent 64%
              )
            `,
        }}
      />

      <div
        className="
          relative
          z-10
          flex
          h-full
          w-full
          flex-col
        "
      >
        <div
          className="
            flex
            h-[52px]
            w-[52px]
            items-center
            justify-center
            rounded-[13px]
            text-white

            transition-all
            duration-300

            group-hover:scale-110
            group-hover:shadow-[0_0_30px_rgba(235,15,48,.34)]

            lg:h-[60px]
            lg:w-[60px]
            lg:rounded-[15px]
          "
          style={{
            border:
              '1px solid rgba(237,69,81,.62)',

            background:
              `
                radial-gradient(
                  circle at 40% 30%,
                  rgba(126,31,40,.82),
                  rgba(35,10,15,.96)
                )
              `,
          }}
        >
          <MainIconSvg
            type={icon}
          />
        </div>

        <h3
          className="
            mt-5
            text-[15px]
            font-bold
            uppercase
            tracking-[0.08em]

            lg:mt-8
            lg:text-[16px]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-3
            max-w-[240px]
            text-[14px]
            leading-6
            text-zinc-400

            lg:mt-4
            lg:max-w-[185px]
          "
        >
          {text}
        </p>

        <span
          className="
            mt-auto
            flex
            h-[38px]
            w-[38px]
            items-center
            justify-center
            rounded-full
            border
            border-red-500/65
            text-lg

            transition-all
            duration-300

            group-hover:translate-x-1
            group-hover:scale-110
            group-hover:border-red-400
            group-hover:bg-red-600

            lg:h-[42px]
            lg:w-[42px]
            lg:text-xl
          "
        >
          →
        </span>
      </div>
    </a>
  );
}

/* =========================================================
   HOW STEP
========================================================= */

function HowStep({
  number,
  icon,
  title,
  text,
  href,
  last = false,
}: {
  number: string;
  icon: MainIcon;
  title: string;
  text: string;
  href: string;
  last?: boolean;
}) {
  return (
    <a
      href={href}
      data-cursor-block
      className={`
        group
        relative
        block
        cursor-pointer
        transition-all
        duration-300

        lg:hover:translate-x-[5px]

        ${
          last
            ? ''
            : 'mb-3 lg:mb-4'
        }
      `}
    >
      <div
        className="
          absolute
          left-[-46px]
          top-[25px]
          flex
          h-[34px]
          w-[34px]
          items-center
          justify-center
          rounded-full
          border
          border-red-500/75
          bg-[#100b0d]
          text-[12px]
          font-bold

          transition-all
          duration-300

          group-hover:scale-110
          group-hover:bg-red-950/70

          lg:left-[-56px]
          lg:top-[27px]
          lg:h-[38px]
          lg:w-[38px]
          lg:text-sm
        "
      >
        {number}
      </div>

      <div
        className="
          flex
          min-h-[92px]
          items-center
          gap-4
          rounded-[15px]
          border
          border-red-500/45
          bg-[#130d0f]/90
          px-4
          py-4

          transition-all
          duration-300

          group-hover:border-red-400/80
          group-hover:bg-[#1b0d11]

          lg:gap-5
          lg:rounded-[17px]
          lg:py-3

          lg:group-hover:scale-[1.015]
        "
      >
        <div
          className="
            flex
            h-[54px]
            w-[54px]
            shrink-0
            items-center
            justify-center
            rounded-[12px]
            border
            border-red-500/40
            bg-red-950/35

            transition-all
            duration-300

            group-hover:scale-105
            group-hover:border-red-400

            lg:h-[60px]
            lg:w-[60px]
            lg:rounded-[13px]

            lg:group-hover:scale-110
          "
        >
          <MainIconSvg
            type={icon}
          />
        </div>

        <div>
          <h3
            className="
              text-[15px]
              font-bold

              sm:text-base
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1.5
              text-[12px]
              leading-5
              text-zinc-400

              sm:text-[13px]
              lg:mt-2
            "
          >
            {text}
          </p>
        </div>
      </div>
    </a>
  );
}

/* =========================================================
   PROOF FEATURE
========================================================= */

function ProofFeature({
  image,
  line1,
  line2,
  href,
}: ProofFeatureType) {
  return (
    <a
      href={href}
      data-cursor-block
      className="
        group
        block
        cursor-pointer

        transition-all
        duration-300

        hover:-translate-y-[3px]
      "
    >
      <img
        src={image}
        alt=""
        draggable={false}
        className="
          h-[40px]
          w-[40px]
          select-none
          object-contain

          transition-all
          duration-300

          group-hover:scale-110
          group-hover:brightness-125

          lg:h-[44px]
          lg:w-[44px]
        "
      />

      <p
        className="
          mt-2
          text-[11px]
          leading-[1.05rem]
          text-[#e7e3e4]

          transition-colors
          duration-300

          group-hover:text-white

          sm:text-[12px]
          sm:leading-[1.12rem]
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

/* =========================================================
   PROOF CARD
========================================================= */

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
      data-cursor-block
      className="
        group/proof
        relative
        min-h-[455px]
        overflow-hidden
        rounded-[20px]
        border
        border-[rgba(255,76,91,.55)]

        transition-all
        duration-300

        hover:border-red-400/75

        lg:h-[405px]
        lg:min-h-0
        lg:rounded-[25px]

        lg:hover:-translate-y-[4px]
        lg:hover:shadow-[0_20px_55px_rgba(140,0,25,.17)]
      "
      style={{
        background:
          `
            linear-gradient(
              145deg,
              rgba(24,25,29,.98),
              rgba(14,14,17,.99) 56%,
              rgba(19,10,13,.99)
            )
          `,
      }}
    >
      <div
        className="
          relative
          h-[330px]
          overflow-hidden

          lg:h-[282px]
        "
      >
        <div
          className="
            pointer-events-none
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
              absolute
              bottom-0
              right-[-10%]
              h-[88%]
              w-auto
              max-w-none
              select-none

              transition-all
              duration-500

              group-hover/proof:brightness-110

              lg:right-[-2%]
              lg:h-[97%]

              lg:group-hover/proof:scale-[1.025]
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
              `
                linear-gradient(
                  to right,
                  rgba(17,17,20,1),
                  rgba(17,17,20,.99) 70%,
                  rgba(17,17,20,.82) 88%,
                  transparent
                )
              `,
          }}
        />

        <div
          className="
            relative
            z-20
            w-[59%]
            p-6

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

              lg:text-[12px]
            "
          >
            {number}

            <span
              className="
                h-px
                w-5
                bg-zinc-600
              "
            />
          </div>

          <h3
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
            className="
              mt-4
              max-w-[185px]
              text-[12px]
              leading-[1.25rem]
              text-[#c1bcc0]

              lg:max-w-[195px]
              lg:text-[13px]
              lg:leading-[1.35rem]
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
          h-[125px]
          border-t
          border-white/[0.035]
          bg-[rgba(13,13,16,.99)]
          px-5
          py-[17px]

          sm:px-6

          lg:h-[123px]
          lg:px-7
          lg:py-[18px]
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
                image={
                  feature.image
                }
                line1={
                  feature.line1
                }
                line2={
                  feature.line2
                }
                href={
                  feature.href
                }
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ROLE CTA
========================================================= */

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
      data-cursor-block
      className="
        group
        relative
        flex
        min-h-[82px]
        flex-1
        items-center
        gap-4
        overflow-hidden
        rounded-[15px]
        border
        border-red-500/35
        bg-[#0b0809]
        px-4
        py-4

        transition-all
        duration-300
        ease-out

        hover:border-red-400/70
        hover:bg-[#15090d]

        active:scale-[.99]

        sm:px-5

        lg:min-h-[78px]
        lg:rounded-[16px]

        lg:hover:-translate-y-[3px]
        lg:hover:scale-[1.015]
        lg:hover:shadow-[0_15px_38px_rgba(170,0,30,.15)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
        style={{
          background:
            `
              radial-gradient(
                circle at 15% 50%,
                rgba(185,0,32,.17),
                transparent 37%
              )
            `,
        }}
      />

      <div
        className="
          relative
          z-10
          flex
          h-[48px]
          w-[48px]
          shrink-0
          items-center
          justify-center
          rounded-[12px]
          border
          border-red-500/45
          bg-red-950/25
          text-red-100

          transition-all
          duration-300

          group-hover:scale-105
          group-hover:border-red-400
          group-hover:bg-red-950/55

          lg:group-hover:scale-110
        "
      >
        <MainIconSvg
          type={icon}
        />
      </div>

      <div
        className="
          relative
          z-10
          min-w-0
        "
      >
        <p
          className="
            text-[8px]
            uppercase
            tracking-[0.22em]
            text-zinc-500

            sm:text-[9px]
            sm:tracking-[0.25em]
          "
        >
          {eyebrow}
        </p>

        <p
          className="
            mt-1
            text-[13px]
            font-semibold
            text-zinc-200

            transition-colors
            duration-300

            group-hover:text-white

            sm:text-[14px]
          "
        >
          {title}
        </p>
      </div>

      <span
        className="
          relative
          z-10
          ml-auto
          text-red-500

          transition-all
          duration-300

          group-hover:translate-x-1
        "
      >
        →
      </span>
    </a>
  );
}

/* =========================================================
   TOURNAMENT ICON
========================================================= */

function TournamentIcon({
  type,
}: {
  type:
    TournamentIconType;
}) {
  const imageMap: Record<
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
    <img
      src={
        imageMap[type]
      }
      alt=""
      draggable={false}
      width={74}
      height={74}
      className="
        h-[62px]
        w-[62px]
        shrink-0
        select-none
        object-contain

        transition-all
        duration-300

        group-hover/tcard:brightness-125

        lg:h-[74px]
        lg:w-[74px]

        lg:group-hover/tcard:scale-110
      "
    />
  );
}

/* =========================================================
   TOURNAMENT FEATURE CARD
========================================================= */

function TournamentFeatureCard({
  type,
  number,
  title,
  text,
  href,
}: {
  type:
    TournamentIconType;

  number: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      data-cursor-block
      className="
        group/tcard
        relative
        min-h-[132px]
        cursor-pointer
        overflow-hidden
        rounded-[14px]
        border
        border-red-500/55
        px-5
        py-5

        transition-all
        duration-300

        hover:border-red-400/80

        active:scale-[.99]

        lg:min-h-[150px]
        lg:px-6

        lg:hover:-translate-y-[4px]
        lg:hover:scale-[1.015]
        lg:hover:shadow-[0_18px_45px_rgba(170,0,30,.18)]
      "
      style={{
        background:
          `
            linear-gradient(
              145deg,
              rgba(27,24,29,.98),
              rgba(14,13,16,.99)
            )
          `,

        boxShadow:
          `
            inset 0 0 30px rgba(255,24,51,.07),
            0 15px 38px rgba(0,0,0,.28)
          `,
      }}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-300
          group-hover/tcard:opacity-100
        "
        style={{
          background:
            `
              radial-gradient(
                circle at 12% 50%,
                rgba(190,0,32,.18),
                transparent 36%
              )
            `,
        }}
      />

      <div
        className="
          relative
          z-10
          flex
          items-center
          gap-4

          lg:gap-6
        "
      >
        <TournamentIcon
          type={type}
        />

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >
            <h3
              className="
                text-[15px]
                font-semibold
                leading-5

                transition-colors
                duration-300

                group-hover/tcard:text-red-100

                sm:text-[16px]
                lg:text-[17px]
              "
            >
              {title}
            </h3>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                text-[11px]
                text-zinc-400

                lg:text-[12px]
              "
            >
              {number}

              <span
                className="
                  h-px
                  w-5
                  bg-zinc-500

                  lg:w-6
                "
              />
            </div>
          </div>

          <p
            className="
              mt-2
              max-w-[300px]
              text-[12px]
              leading-[1.45]
              text-zinc-400

              sm:text-[13px]
              lg:mt-3
            "
          >
            {text}
          </p>
        </div>
      </div>
    </a>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Home() {
  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#050506]
        text-white
      "
    >
      <CursorWave />

      {/* ===================================================
          NAVBAR
      ==================================================== */}

      <header
        data-cursor-block
        className="
          fixed
          left-0
          top-0
          z-50
          w-full
          border-b
          border-white/[0.04]
          bg-black/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[72px]
            max-w-[1450px]
            items-center
            justify-between
            px-5

            sm:h-[76px]
            sm:px-6

            lg:h-[82px]
            lg:px-10
          "
        >
          <a
            href="#home"
            className="
              text-[24px]
              font-black

              transition-transform
              duration-300

              hover:scale-105

              sm:text-[26px]
              lg:text-[28px]
            "
          >
            Pro

            <span
              className="
                text-red-600
              "
            >
              VN
            </span>
          </a>

          <nav
            className="
              hidden
              gap-10
              text-[15px]
              text-zinc-300
              md:flex
            "
          >
            {[
              [
                'Home',
                '#home',
              ],

              [
                'Games',
                '#games',
              ],

              [
                'Community',
                '#proof',
              ],

              [
                'About',
                '#how',
              ],
            ].map(
              (
                [
                  label,
                  href,
                ]
              ) => (
                <a
                  key={label}
                  href={href}
                  className="
                    group/nav
                    relative
                    py-2

                    transition-all
                    duration-300

                    hover:scale-105
                    hover:text-white
                  "
                >
                  {label}

                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2
                      h-[2px]
                      w-0
                      -translate-x-1/2
                      bg-red-500

                      transition-all
                      duration-300

                      group-hover/nav:w-full
                    "
                  />
                </a>
              )
            )}
          </nav>

          <a
            href="#join"
            className="
              rounded-full
              border
              border-red-600/75
              px-5
              py-2.5
              text-[14px]

              transition-all
              duration-300

              hover:border-red-400
              hover:bg-red-950/40

              active:scale-[.98]

              sm:px-6
              sm:py-3
              sm:text-[15px]

              lg:px-7
              lg:hover:scale-[1.06]
              lg:hover:shadow-[0_0_32px_rgba(255,0,45,.24)]
            "
          >
            ♛ Level Up
          </a>
        </div>
      </header>

      {/* ===================================================
          HERO
      ==================================================== */}

      <section
        id="home"
        className="
          relative
          overflow-hidden
          bg-[#050506]
          pt-[72px]

          sm:pt-[76px]

          lg:min-h-[850px]
          lg:pt-[82px]
        "
      >
        <div
          data-cursor-block
          className="
            absolute
            bottom-0
            right-0
            top-[82px]
            hidden
            w-[75%]
            overflow-hidden
            lg:block
          "
        >
          <div
            className="
              absolute
              -bottom-[6px]
              -top-[98px]
              left-0
              right-[-8px]
              bg-no-repeat
            "
            style={{
              backgroundImage:
                "url('/home/section1.png')",

              backgroundSize:
                'auto 102.5%',

              backgroundPosition:
                'right 56%',

              backgroundRepeat:
                'no-repeat',

              WebkitMaskImage: `
                linear-gradient(
                  to right,
                  transparent 0%,
                  transparent 24%,
                  rgba(0,0,0,.05) 26%,
                  rgba(0,0,0,.22) 28%,
                  rgba(0,0,0,.52) 30%,
                  rgba(0,0,0,.82) 32%,
                  black 35%,
                  black 100%
                )
              `,

              maskImage: `
                linear-gradient(
                  to right,
                  transparent 0%,
                  transparent 24%,
                  rgba(0,0,0,.05) 26%,
                  rgba(0,0,0,.22) 28%,
                  rgba(0,0,0,.52) 30%,
                  rgba(0,0,0,.82) 32%,
                  black 35%,
                  black 100%
                )
              `,
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              w-[34%]
            "
            style={{
              background: `
                linear-gradient(
                  to right,
                  #050506 0%,
                  #050506 42%,
                  rgba(5,5,6,.98) 54%,
                  rgba(5,5,6,.82) 68%,
                  rgba(5,5,6,.44) 83%,
                  transparent 100%
                )
              `,
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              bottom-[55px]
              left-[17%]
              z-[8]
              h-[122px]
              w-[17%]
            "
            style={{
              background: `
                radial-gradient(
                  ellipse at 22% 52%,
                  #050506 0%,
                  #050506 46%,
                  rgba(5,5,6,.98) 58%,
                  rgba(5,5,6,.82) 72%,
                  rgba(5,5,6,.38) 86%,
                  transparent 100%
                )
              `,
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-[22px]
            "
            style={{
              background: `
                linear-gradient(
                  to top,
                  #050506,
                  rgba(5,5,6,.10),
                  transparent
                )
              `,
            }}
          />
        </div>

        <div
          className="
            relative
            z-20
            mx-auto
            grid
            max-w-[1450px]
            items-center
            px-5
            pb-[70px]
            pt-[88px]

            sm:px-6
            sm:pb-[82px]
            sm:pt-[100px]

            lg:min-h-[768px]
            lg:grid-cols-[46%_54%]
            lg:px-10
            lg:py-0
          "
        >
          <div
            data-cursor-block
            className="
              max-w-[650px]
            "
          >
            <p
              className="
                mb-5
                text-[10px]
                uppercase
                tracking-[0.38em]
                text-zinc-400

                sm:text-xs
                sm:tracking-[0.42em]

                lg:mb-6
              "
            >
              More Than Just Games
            </p>

            <h1
              className="
                text-[46px]
                font-black
                leading-[0.94]
                tracking-[-0.045em]

                sm:text-[56px]

                lg:text-[67px]
              "
            >
              Play Better.

              <br />

              <span
                className="
                  text-red-600
                "
              >
                Connect Smarter.
              </span>

              <br />

              Win Together.
            </h1>

            <p
              className="
                mt-6
                max-w-[510px]
                text-[16px]
                leading-7
                text-zinc-400

                sm:text-[17px]
                sm:leading-8

                lg:mt-7
                lg:text-lg
              "
            >
              Find teammates,
              coaches, gaming
              services and
              tournaments — all in
              one place.
            </p>

            <div
              className="
                mt-8
                flex
                flex-col
                gap-3

                sm:flex-row
                sm:flex-wrap
                sm:gap-4

                lg:mt-9
              "
            >
              <a
                href="#ecosystem"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  bg-red-600
                  px-7
                  py-3.5
                  font-semibold

                  transition-all
                  duration-300

                  hover:bg-red-500

                  active:scale-[.98]

                  sm:w-auto
                  sm:px-8
                  sm:py-4

                  lg:hover:scale-[1.055]
                  lg:hover:shadow-[0_0_38px_rgba(255,0,45,.32)]
                "
              >
                Explore ProVN →
              </a>

              <a
                href="#proof"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-600/75
                  bg-black/25
                  px-7
                  py-3.5

                  transition-all
                  duration-300

                  hover:border-red-400
                  hover:bg-red-950/45

                  active:scale-[.98]

                  sm:w-auto
                  sm:px-8
                  sm:py-4

                  lg:hover:scale-[1.055]
                  lg:hover:shadow-[0_0_32px_rgba(255,0,45,.18)]
                "
              >
                Become a Provider
              </a>
            </div>
          </div>
        </div>
      </section>

      <SectionTransition />

      {/* ===================================================
          ECOSYSTEM
      ==================================================== */}

      <section
        id="ecosystem"
        className="
          relative
          overflow-hidden
          bg-[#050506]
          py-[68px]

          sm:py-[82px]

          lg:py-[116px]
        "
      >
        <div
          data-cursor-block
          className="
            absolute
            inset-[-45px]
            opacity-[0.18]
            blur-[32px]

            lg:opacity-[0.22]
          "
          style={{
            backgroundImage:
              "url('/home/section2.png')",

            backgroundSize:
              'cover',

            backgroundPosition:
              'right center',
          }}
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black/70

            lg:bg-black/65
          "
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
          <div
            data-cursor-block
          >
            <h2
              className="
                text-[45px]
                font-black
                leading-[0.94]
                tracking-[-0.04em]

                sm:text-5xl
                lg:text-6xl
              "
            >
              One Platform.

              <br />

              <span
                className="
                  text-red-600
                "
              >
                Every Side of Gaming.
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-xl
                text-[15px]
                leading-7
                text-zinc-400

                lg:mt-6
                lg:text-base
              "
            >
              Choose what you want
              to do and enter the
              part of ProVN built
              for you.
            </p>
          </div>

          <div
            className="
              mt-10
              grid
              gap-4

              sm:mt-12
              sm:grid-cols-2

              lg:mt-[68px]
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

      <SectionTransition />

      {/* ===================================================
          GAMES
      ==================================================== */}

      <section
        id="games"
        className="
          relative
          overflow-hidden
          bg-[#050506]
          py-[70px]

          sm:py-[82px]

          lg:py-[118px]
        "
      >
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
          <SectionHeading
            eyebrow="Choose · Play · Grow"
            normal="Choose Your"
            red="Game."
            description="Enter a dedicated ecosystem of players, coaches, services and tournaments built around your game."
          />

          <div
            className="
              mt-10
              grid
              gap-5

              sm:mt-12
              sm:grid-cols-2

              lg:mt-16
              lg:grid-cols-4
              lg:gap-7
            "
          >
            {gameCards.map(
              game => (
                <a
                  key={
                    game.name
                  }
                  href={
                    game.href
                  }
                  data-cursor-block
                  aria-label={`Explore ${game.name}`}
                  className="
                    group/game
                    relative
                    aspect-[337/238]
                    cursor-pointer
                    overflow-hidden
                    rounded-[14px]

                    transition-all
                    duration-300
                    ease-out

                    hover:z-20

                    active:scale-[.99]

                    lg:hover:scale-[1.045]
                    lg:hover:shadow-[0_22px_60px_rgba(185,0,30,.27)]
                  "
                  style={{
                    backgroundImage:
                      "url('/home/section3.png')",

                    backgroundSize:
                      '496% 395%',

                    backgroundPosition:
                      game.position,

                    backgroundRepeat:
                      'no-repeat',
                  }}
                >
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      opacity-0

                      transition-opacity
                      duration-300

                      group-hover/game:opacity-100
                    "
                    style={{
                      background:
                        `
                          linear-gradient(
                            135deg,
                            rgba(82,0,16,.33),
                            rgba(16,0,4,.06) 48%,
                            rgba(96,0,18,.25)
                          )
                        `,
                    }}
                  />

                  <span
                    className="
                      pointer-events-none
                      absolute
                      bottom-[-30%]
                      left-1/2
                      h-[58%]
                      w-[80%]
                      -translate-x-1/2
                      rounded-full
                      bg-red-600/20
                      opacity-0
                      blur-[44px]

                      transition-opacity
                      duration-300

                      group-hover/game:opacity-100
                    "
                  />

                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      opacity-0

                      transition-opacity
                      duration-300

                      group-hover/game:opacity-100
                    "
                    style={{
                      boxShadow:
                        'inset 0 0 32px rgba(230,20,45,.12)',
                    }}
                  />
                </a>
              )
            )}
          </div>
        </div>
      </section>

      <SectionTransition />

      {/* ===================================================
          HOW PROVN WORKS
      ==================================================== */}

      <section
        id="how"
        className="
          relative
          overflow-hidden
          bg-[#050506]

          lg:min-h-[900px]
        "
      >
        <div
          data-cursor-block
          className="
            absolute
            bottom-0
            right-0
            top-0
            hidden
            w-[52%]
            overflow-hidden
            lg:block
          "
        >
          <div
            className="
              absolute
              inset-0
            "
            style={{
              backgroundImage:
                "url('/home/section4.png')",

              backgroundSize:
                'auto 94%',

              backgroundPosition:
                'right center',

              backgroundRepeat:
                'no-repeat',
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              w-[18%]
              bg-[#050506]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-[16%]
              w-[19%]
            "
            style={{
              background:
                `
                  linear-gradient(
                    to right,
                    #050506,
                    rgba(5,5,6,.97) 18%,
                    rgba(5,5,6,.70) 52%,
                    rgba(5,5,6,.25) 80%,
                    transparent
                  )
                `,
            }}
          />
        </div>

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-[1450px]
            px-5
            py-[70px]

            sm:px-6
            sm:py-[82px]

            lg:px-10
            lg:py-[124px]
          "
        >
          <div
            data-cursor-block
            className="
              lg:w-[48%]
            "
          >
            <p
              className="
                mb-4
                text-[9px]
                uppercase
                tracking-[0.30em]
                text-zinc-400

                sm:text-[10px]

                lg:text-[11px]
                lg:tracking-[0.33em]
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
              How ProVN{' '}

              <span
                className="
                  text-red-600
                "
              >
                Works.
              </span>
            </h2>

            <p
              className="
                mt-4
                max-w-xl
                text-[15px]
                leading-7
                text-zinc-400

                lg:text-base
              "
            >
              Join, connect and grow
              in a dedicated ecosystem
              built for gamers,
              coaches and providers.
            </p>

            <div
              className="
                relative
                mt-8
                pl-[46px]

                sm:mt-9

                lg:mt-11
                lg:pl-[56px]
              "
            >
              <div
                className="
                  absolute
                  bottom-9
                  left-[16px]
                  top-9
                  w-px
                  bg-red-600

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
                last
              />
            </div>
          </div>
        </div>
      </section>

      <SectionTransition />

      {/* ===================================================
          PROOF
      ==================================================== */}

      <section
        id="proof"
        className="
          relative
          overflow-hidden
          bg-[#050506]
          py-[74px]

          sm:py-[88px]

          lg:py-[128px]
        "
      >
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
          <div
            data-cursor-block
            className="
              text-center
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                text-[9px]
                uppercase
                tracking-[0.30em]
                text-zinc-400

                sm:text-[10px]

                lg:gap-4
                lg:text-[11px]
                lg:tracking-[0.35em]
              "
            >
              <span
                className="
                  h-px
                  w-7
                  bg-red-600

                  lg:w-8
                "
              />

              Verified Talent Ecosystem

              <span
                className="
                  h-px
                  w-7
                  bg-red-600

                  lg:w-8
                "
              />
            </div>

            <h2
              className="
                mt-5
                text-[44px]
                font-black
                leading-[0.95]
                tracking-[-0.04em]

                sm:text-5xl
                lg:text-6xl
              "
            >
              Skill Deserves{' '}

              <span
                className="
                  text-[#f0082f]
                "
              >
                Proof.
              </span>
            </h2>

            <p
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

              sm:mt-14

              lg:mt-[70px]
              lg:grid-cols-3
              lg:gap-6
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
              description={
                <>
                  Performance-backed
                  profiles,
                  <br />
                  not claimed ranks.
                </>
              }
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
              description={
                <>
                  Coaching credibility
                  earned
                  <br />
                  through real student
                  <br />
                  improvement.
                </>
              }
              art="/home/proof-coach.png"
              features={[
                {
                  image:
                    '/home/proof-reviews.png',

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
              description={
                <>
                  Get found by teams,
                  <br />
                  tournaments and scouts
                  <br />
                  based on verified performance.
                </>
              }
              art="/home/proof-talent.png"
              features={[
                {
                  image:
                    '/home/proof-team.png',

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

          {/* CTA */}

          <div
            id="join"
            data-cursor-block
            className="
              mt-12
              flex
              flex-col
              items-center

              sm:mt-14

              lg:mt-[78px]
            "
          >
            <a
              href="#home"
              className="
                group
                flex
                w-full
                max-w-[430px]
                items-center
                justify-between
                rounded-[14px]
                border
                border-red-500/70
                bg-gradient-to-r
                from-[#560b17]
                via-[#6c111f]
                to-[#39070f]
                px-6
                py-[15px]
                text-[16px]
                font-semibold

                transition-all
                duration-300

                hover:border-red-400
                hover:from-[#761020]
                hover:via-[#8a1427]
                hover:to-[#520a16]

                active:scale-[.98]

                sm:px-8
                sm:py-[17px]
                sm:text-lg

                lg:hover:scale-[1.045]
                lg:hover:shadow-[0_0_42px_rgba(220,0,40,.24)]
              "
            >
              Join Early Access

              <span
                className="
                  transition-transform
                  duration-300

                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </a>

            <div
              id="recruiter"
              className="
                mt-4
                grid
                w-full
                max-w-[620px]
                gap-3

                sm:mt-6
                sm:grid-cols-2
                sm:gap-4
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

      <SectionTransition />

      {/* ===================================================
          TOURNAMENTS
      ==================================================== */}

      <section
        id="tournaments"
        className="
          relative
          overflow-hidden
          bg-[#050506]
          pb-[78px]
          pt-[66px]

          sm:pb-[90px]
          sm:pt-[78px]

          lg:pb-[135px]
          lg:pt-[105px]
        "
      >
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
            <div
              data-cursor-block
              className="
                relative
                z-20
                max-w-[525px]
              "
            >
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-3
                  text-[9px]
                  uppercase
                  tracking-[0.30em]
                  text-zinc-400

                  sm:text-[10px]

                  lg:mb-5
                  lg:gap-4
                  lg:text-[11px]
                  lg:tracking-[0.34em]
                "
              >
                <span
                  className="
                    h-px
                    w-7
                    bg-red-600

                    lg:w-9
                  "
                />

                Competitions & Tournaments
              </div>

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
                Compete With

                <br />

                <span
                  className="
                    text-red-600
                  "
                >
                  Confidence.
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-[500px]
                  text-[15px]
                  leading-7
                  text-zinc-400

                  lg:mt-6
                  lg:text-base
                "
              >
                From casual scrims to
                high-stakes tournaments,
                play in a safe, verified
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
                  sm:flex-wrap
                  sm:gap-4

                  lg:mt-8
                "
              >
                <a
                  href="#tournaments"
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-[10px]
                    bg-gradient-to-r
                    from-[#ff143c]
                    to-[#d70027]
                    px-6
                    py-4
                    font-semibold

                    transition-all
                    duration-300

                    hover:from-[#ff3154]
                    hover:to-[#ed002d]

                    active:scale-[.98]

                    sm:w-auto
                    sm:min-w-[220px]
                    sm:px-7

                    lg:hover:scale-[1.055]
                    lg:hover:shadow-[0_0_36px_rgba(255,0,45,.28)]
                  "
                >
                  Explore Tournaments

                  <span>
                    →
                  </span>
                </a>

                <a
                  href="#join"
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-[10px]
                    border
                    border-red-600/55
                    bg-[#080709]
                    px-6
                    py-4
                    text-sm
                    font-semibold

                    transition-all
                    duration-300

                    hover:border-red-400
                    hover:bg-red-950/40

                    active:scale-[.98]

                    sm:w-auto
                    sm:min-w-[195px]

                    lg:hover:scale-[1.055]
                    lg:hover:shadow-[0_0_28px_rgba(210,0,35,.18)]
                  "
                >
                  Host a Tournament

                  <span
                    className="
                      text-red-500
                    "
                  >
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* DESKTOP IMAGE */}

            <div
              data-cursor-block
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
                className="
                  pointer-events-none
                  absolute
                  right-[8%]
                  top-1/2
                  h-[360px]
                  w-[620px]
                  -translate-y-1/2
                  rounded-full
                  bg-red-950/[0.09]
                  blur-[130px]
                "
              />

              <div
                className="
                  relative
                  z-10
                  w-full
                  max-w-[852px]
                  overflow-hidden
                  rounded-[14px]
                "
                style={{
                  aspectRatio:
                    '852 / 596',
                }}
              >
                <img
                  src="/home/section6-right.png"
                  alt="ProVN Tournament Trophy"
                  draggable={false}
                  width={852}
                  height={596}
                  decoding="async"
                  loading="eager"
                  className="
                    block
                    h-auto
                    w-full
                    max-w-[852px]
                    select-none
                  "
                />
              </div>
            </div>
          </div>

          <div
            className="
              h-[44px]

              sm:h-[52px]

              lg:h-[90px]
            "
          />

          <div
            className="
              grid
              gap-4

              md:grid-cols-3

              lg:gap-[24px]
            "
          >
            <TournamentFeatureCard
              type="shield"
              number="01"
              title="Verified Organizers"
              text="Only trusted hosts and communities can run tournaments."
              href="#join"
            />

            <TournamentFeatureCard
              type="coins"
              number="02"
              title="Protected Prize Pools"
              text="Secure payments and milestone based disbursal."
              href="#join"
            />

            <TournamentFeatureCard
              type="bars"
              number="03"
              title="Fair Match & Payout Verification"
              text="Results, match history and payouts are transparently tracked."
              href="#join"
            />
          </div>
        </div>
      </section>

      <SectionTransition
        large
      />

      {/* ===================================================
          FOUNDERS
      ==================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#050506]
          px-5
          pb-[80px]
          pt-[68px]

          sm:px-6
          sm:pb-[95px]
          sm:pt-[80px]

          lg:px-10
          lg:pb-[120px]
          lg:pt-[95px]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[260px]
            w-[90%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-red-950/15
            blur-[120px]

            lg:h-[330px]
            lg:w-[720px]
            lg:bg-red-950/20
            lg:blur-[140px]
          "
        />

        <div
          data-cursor-block
          className="
            relative
            z-10
            mx-auto
            max-w-[1150px]
            text-center
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              text-[9px]
              uppercase
              tracking-[0.32em]
              text-zinc-500

              sm:text-[10px]

              lg:gap-4
              lg:text-[11px]
              lg:tracking-[0.38em]
            "
          >
            <span
              className="
                h-px
                w-7
                bg-red-600

                lg:w-10
              "
            />

            The People Behind ProVN

            <span
              className="
                h-px
                w-7
                bg-red-600

                lg:w-10
              "
            />
          </div>

          <h2
            className="
              mx-auto
              mt-6
              max-w-[700px]
              text-[40px]
              font-black
              leading-[0.98]
              tracking-[-0.04em]

              sm:text-5xl

              lg:mt-7
              lg:max-w-none
              lg:text-[60px]
            "
          >
            Built for the

            <span
              className="
                text-red-600
              "
            >
              {' '}
              Next Generation of Gaming.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-[620px]
              text-[15px]
              leading-7
              text-zinc-400

              sm:text-base
              sm:leading-8

              lg:mt-7
              lg:max-w-[760px]
              lg:text-lg
            "
          >
            ProVN is being built
            around one simple idea:
            gaming talent should be
            easier to discover,
            easier to trust and
            easier to turn into
            opportunity.
          </p>

          <div
            className="
              mx-auto
              mt-10
              grid
              max-w-[760px]
              gap-4

              sm:mt-12
              sm:grid-cols-2
              sm:gap-5

              lg:mt-14
            "
          >
            <div
              className="
                rounded-[20px]
                border
                border-red-500/30
                bg-gradient-to-br
                from-[#170e11]
                via-[#0d090a]
                to-[#070708]
                px-6
                py-7

                lg:rounded-[24px]
                lg:px-8
                lg:py-8
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-[54px]
                  w-[54px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-500/50
                  bg-red-950/30
                  text-lg
                  font-black
                  text-red-500

                  lg:h-[58px]
                  lg:w-[58px]
                  lg:text-xl
                "
              >
                K
              </div>

              <p
                className="
                  mt-5
                  text-[9px]
                  uppercase
                  tracking-[0.28em]
                  text-zinc-500

                  lg:text-[11px]
                  lg:tracking-[0.30em]
                "
              >
                Co-Founder
              </p>

              <h3
                className="
                  mt-2
                  text-[22px]
                  font-bold

                  lg:text-2xl
                "
              >
                Mr. Kanav
              </h3>
            </div>

            <div
              className="
                rounded-[20px]
                border
                border-red-500/30
                bg-gradient-to-br
                from-[#170e11]
                via-[#0d090a]
                to-[#070708]
                px-6
                py-7

                lg:rounded-[24px]
                lg:px-8
                lg:py-8
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-[54px]
                  w-[54px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-500/50
                  bg-red-950/30
                  text-lg
                  font-black
                  text-red-500

                  lg:h-[58px]
                  lg:w-[58px]
                  lg:text-xl
                "
              >
                A
              </div>

              <p
                className="
                  mt-5
                  text-[9px]
                  uppercase
                  tracking-[0.28em]
                  text-zinc-500

                  lg:text-[11px]
                  lg:tracking-[0.30em]
                "
              >
                Co-Founder
              </p>

              <h3
                className="
                  mt-2
                  text-[22px]
                  font-bold

                  lg:text-2xl
                "
              >
                Mr. Anmol
              </h3>
            </div>
          </div>

          <div
            className="
              mx-auto
              mt-10
              max-w-[860px]
              border-t
              border-white/[0.06]
              pt-8

              lg:mt-14
              lg:pt-10
            "
          >
            <p
              className="
                text-[18px]
                font-semibold
                leading-7
                tracking-[-0.02em]
                text-zinc-200

                sm:text-xl
                sm:leading-8

                lg:text-2xl
              "
            >
              “Play with purpose.

              <span
                className="
                  text-red-500
                "
              >
                {' '}
                Build your proof.
                Own your game.
              </span>
              ”
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          FOOTER
      ==================================================== */}

      <footer
        data-cursor-block
        className="
          border-t
          border-white/[0.06]
          bg-[#030304]
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
                inline-block
                text-[24px]
                font-black

                transition-transform
                duration-300

                hover:scale-105

                lg:text-2xl
              "
            >
              Pro

              <span
                className="
                  text-red-600
                "
              >
                VN
              </span>
            </a>

            <p
              className="
                mt-2
                max-w-[360px]
                text-[12px]
                leading-5
                text-zinc-600

                lg:text-sm
              "
            >
              Where real performance
              becomes real recognition.
            </p>
          </div>

          <div
            className="
              text-left
              sm:text-right
            "
          >
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-zinc-600

                lg:text-xs
              "
            >
              Founded by
            </p>

            <p
              className="
                mt-2
                text-[13px]
                text-zinc-400

                lg:text-sm
              "
            >
              Mr. Kanav &amp; Mr. Anmol
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}