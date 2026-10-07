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
      <svg viewBox="0 0 24 24" className="h-8 w-8" {...common}>
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
      <svg viewBox="0 0 24 24" className="h-8 w-8" {...common}>
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
      <svg viewBox="0 0 24 24" className="h-8 w-8" {...common}>
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
      <svg viewBox="0 0 24 24" className="h-8 w-8" {...common}>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12.5V17c3 2 7 2 10 0v-4.5" />
        <path d="M21 9v5" />
      </svg>
    );
  }

  if (type === 'earn') {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" {...common}>
        <ellipse cx="12" cy="6" rx="6.5" ry="3" />
        <path d="M5.5 6v5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3V6" />
        <path d="M5.5 11v5c0 1.7 2.9 3 6.5 3s6.5-1.3 6.5-3v-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" {...common}>
      <path d="M8 4h8v5c0 3-1.7 5-4 5S8 12 8 9V4Z" />
      <path d="M8 6H4c0 4 1.5 6 4.5 6" />
      <path d="M16 6h4c0 4-1.5 6-4.5 6" />
      <path d="M12 14v4" />
      <path d="M8 20h8" />
    </svg>
  );
}

/* =========================================================
   CURSOR WATER EFFECT
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

    const dpr = Math.min(window.devicePixelRatio || 1, 1.1);

    let lastX = -1000;
    let lastY = -1000;
    let lastSpawn = 0;

    let frame = 0;
    let running = false;

    const sprite = document.createElement('canvas');

    sprite.width = 360;
    sprite.height = 280;

    const rawSpriteContext = sprite.getContext('2d');

    if (!rawSpriteContext) return;

    const sctx: CanvasRenderingContext2D = rawSpriteContext;

    const cx = 180;
    const cy = 140;

    const body = sctx.createRadialGradient(cx, cy, 0, cx, cy, 170);

    body.addColorStop(0, 'rgba(105,0,23,.56)');
    body.addColorStop(0.2, 'rgba(72,0,17,.46)');
    body.addColorStop(0.46, 'rgba(40,0,10,.33)');
    body.addColorStop(0.72, 'rgba(19,0,5,.17)');
    body.addColorStop(1, 'rgba(0,0,0,0)');

    sctx.fillStyle = body;
    sctx.fillRect(0, 0, sprite.width, sprite.height);

    const centerGlow = sctx.createRadialGradient(
      cx - 18,
      cy - 16,
      0,
      cx,
      cy,
      92
    );

    centerGlow.addColorStop(0, 'rgba(255,25,55,.16)');
    centerGlow.addColorStop(0.42, 'rgba(145,0,31,.07)');
    centerGlow.addColorStop(1, 'rgba(0,0,0,0)');

    sctx.fillStyle = centerGlow;
    sctx.fillRect(0, 0, sprite.width, sprite.height);

    for (let i = 0; i < 3; i += 1) {
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

      sctx.strokeStyle = `rgba(255,25,55,${
        0.075 - i * 0.017
      })`;

      sctx.stroke();
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    function animate(now: number) {
      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];

        const progress = (now - ripple.start) / 1050;

        if (progress >= 1) {
          ripples.splice(i, 1);
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

        ctx.globalAlpha = alpha * 0.68;

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

      if (ripples.length > 0) {
        frame =
          requestAnimationFrame(
            animate
          );
      } else {
        running = false;
      }
    }

    const startAnimation = () => {
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
      const target = event.target;

      if (!(target instanceof Element)) return;

      const x = event.clientX;
      const y = event.clientY;

      const blocked = target.closest(`
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

      const dx = x - lastX;
      const dy = y - lastY;

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );

      const now =
        performance.now();

      if (
        distance < 46 ||
        now - lastSpawn < 76
      ) {
        return;
      }

      ripples.push({
        x,
        y,
        start: now,

        size:
          155 +
          Math.random() * 22,

        rotation:
          (
            Math.random() -
            0.5
          ) * 0.07,
      });

      if (ripples.length > 4) {
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
      { passive: true }
    );

    window.addEventListener(
      'resize',
      resize
    );

    return () => {
      cancelAnimationFrame(frame);

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
   SECTION DIVIDER
========================================================= */

function SectionTransition({
  height = 66,
}: {
  height?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        relative
        bg-[#050506]
      "
      style={{
        height: `${height}px`,
      }}
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
   SECTION HEADING
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
    <div data-cursor-block className="relative z-20">
      <div className="mb-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-zinc-500">
        <span className="h-px w-9 bg-red-600" />
        {eyebrow}
      </div>

      <h2 className="text-5xl font-black tracking-[-0.045em] lg:text-6xl">
        {normal}{' '}

        <span className="text-red-600">
          {red}
        </span>
      </h2>

      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION 2 CARD
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
        min-h-[322px]
        cursor-pointer
        overflow-hidden
        rounded-[25px]
        border
        border-red-500/55
        p-7

        transition-all
        duration-300
        ease-out

        hover:z-20
        hover:scale-[1.035]
        hover:border-red-400/90
        hover:shadow-[0_22px_60px_rgba(200,0,35,.20)]

        active:scale-[1.01]
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

      <div className="relative z-10 flex h-full flex-col">
        <div
          className="
            flex
            h-[60px]
            w-[60px]
            items-center
            justify-center
            rounded-[15px]
            text-white

            transition-all
            duration-300

            group-hover:scale-110
            group-hover:shadow-[0_0_30px_rgba(235,15,48,.34)]
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
          <MainIconSvg type={icon} />
        </div>

        <h3 className="mt-8 text-[16px] font-bold uppercase tracking-[0.08em]">
          {title}
        </h3>

        <p className="mt-4 max-w-[185px] text-sm leading-6 text-zinc-400">
          {text}
        </p>

        <span
          className="
            mt-auto
            flex
            h-[42px]
            w-[42px]
            items-center
            justify-center
            rounded-full
            border
            border-red-500/65
            text-xl

            transition-all
            duration-300

            group-hover:translate-x-1
            group-hover:scale-110
            group-hover:border-red-400
            group-hover:bg-red-600
          "
        >
          →
        </span>
      </div>
    </a>
  );
}

/* =========================================================
   SECTION 4 STEP
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

        hover:translate-x-[5px]

        ${last ? '' : 'mb-4'}
      `}
    >
      <div
        className="
          absolute
          left-[-56px]
          top-[27px]
          flex
          h-[38px]
          w-[38px]
          items-center
          justify-center
          rounded-full
          border
          border-red-500/75
          bg-[#100b0d]
          text-sm
          font-bold

          transition-all
          duration-300

          group-hover:scale-110
          group-hover:bg-red-950/70
          group-hover:shadow-[0_0_20px_rgba(235,0,40,.25)]
        "
      >
        {number}
      </div>

      <div
        className="
          flex
          min-h-[92px]
          items-center
          gap-5
          rounded-[17px]
          border
          border-red-500/45
          bg-[#130d0f]/90
          px-4
          py-3

          transition-all
          duration-300

          group-hover:scale-[1.015]
          group-hover:border-red-400/80
          group-hover:bg-[#1b0d11]
          group-hover:shadow-[0_14px_38px_rgba(150,0,25,.16)]
        "
      >
        <div
          className="
            flex
            h-[60px]
            w-[60px]
            shrink-0
            items-center
            justify-center
            rounded-[13px]
            border
            border-red-500/40
            bg-red-950/35

            transition-all
            duration-300

            group-hover:scale-110
            group-hover:border-red-400
            group-hover:bg-red-950/60
          "
        >
          <MainIconSvg type={icon} />
        </div>

        <div>
          <h3 className="font-bold">
            {title}
          </h3>

          <p className="mt-2 text-[13px] leading-5 text-zinc-400">
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
          h-[44px]
          w-[44px]
          select-none
          object-contain

          transition-all
          duration-300

          group-hover:scale-110
          group-hover:brightness-125
          group-hover:drop-shadow-[0_0_11px_rgba(255,22,53,.6)]
        "
      />

      <p className="mt-2 text-[12px] leading-[1.12rem] text-[#e7e3e4] transition-colors duration-300 group-hover:text-white">
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
        h-[405px]
        overflow-hidden
        rounded-[25px]
        border
        border-[rgba(255,76,91,.55)]

        transition-all
        duration-300

        hover:-translate-y-[4px]
        hover:border-red-400/75
        hover:shadow-[0_20px_55px_rgba(140,0,25,.17)]
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
      <div className="relative h-[282px] overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[53%] overflow-hidden">
          <img
            src={art}
            alt=""
            draggable={false}
            className="
              absolute
              bottom-0
              right-[-2%]
              h-[97%]
              w-auto
              max-w-none
              select-none

              transition-all
              duration-500

              group-hover/proof:scale-[1.025]
              group-hover/proof:brightness-110
            "
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[56%]"
          style={{
            background:
              `
                linear-gradient(
                  to right,
                  rgba(17,17,20,1),
                  rgba(17,17,20,.99) 74%,
                  rgba(17,17,20,.91) 87%,
                  transparent
                )
              `,
          }}
        />

        <div className="relative z-20 w-[54%] p-7">
          <div className="flex items-center gap-2 text-[12px] text-zinc-400">
            {number}
            <span className="h-px w-5 bg-zinc-600" />
          </div>

          <h3 className="mt-6 text-[27px] font-bold leading-[1.03]">
            {title}
          </h3>

          <p className="mt-4 max-w-[195px] text-[13px] leading-[1.35rem] text-[#c1bcc0]">
            {description}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[123px] border-t border-white/[0.035] bg-[rgba(13,13,16,.99)] px-7 py-[18px]">
        <div className="grid grid-cols-3 gap-5">
          {features.map(
            (
              feature,
              index
            ) => (
              <ProofFeature
                key={`${feature.line1}-${index}`}
                image={feature.image}
                line1={feature.line1}
                line2={feature.line2}
                href={feature.href}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   NEW PREMIUM ROLE CTA
========================================================= */

function RoleCTA({
  icon,
  eyebrow,
  title,
  href,
}: {
  icon: 'learn' | 'recruiter';
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
        min-h-[78px]
        flex-1
        items-center
        gap-4
        overflow-hidden
        rounded-[16px]
        border
        border-red-500/35
        bg-[#0b0809]
        px-5
        py-4

        transition-all
        duration-300
        ease-out

        hover:-translate-y-[3px]
        hover:scale-[1.015]
        hover:border-red-400/70
        hover:bg-[#15090d]
        hover:shadow-[0_15px_38px_rgba(170,0,30,.15)]

        active:scale-[.99]
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

          group-hover:scale-110
          group-hover:border-red-400
          group-hover:bg-red-950/55
          group-hover:text-white
          group-hover:shadow-[0_0_25px_rgba(230,0,40,.25)]
        "
      >
        <MainIconSvg type={icon} />
      </div>

      <div className="relative z-10 min-w-0">
        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.25em]
            text-zinc-500
          "
        >
          {eyebrow}
        </p>

        <p
          className="
            mt-1
            text-[14px]
            font-semibold
            text-zinc-200

            transition-colors
            duration-300

            group-hover:text-white
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
          group-hover:text-red-300
        "
      >
        →
      </span>
    </a>
  );
}

/* =========================================================
   SECTION 6 ICON
========================================================= */

function TournamentIcon({
  type,
}: {
  type: TournamentIconType;
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
      src={imageMap[type]}
      alt=""
      draggable={false}
      width={74}
      height={74}
      className="
        h-[74px]
        w-[74px]
        shrink-0
        select-none
        object-contain

        transition-all
        duration-300

        group-hover/tcard:scale-110
        group-hover/tcard:brightness-125
        group-hover/tcard:drop-shadow-[0_0_12px_rgba(255,20,50,.55)]
      "
    />
  );
}

/* =========================================================
   SECTION 6 FEATURE CARD
========================================================= */

function TournamentFeatureCard({
  type,
  number,
  title,
  text,
  href,
}: {
  type: TournamentIconType;
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
        min-h-[150px]
        cursor-pointer
        overflow-hidden
        rounded-[14px]
        border
        border-red-500/55
        px-6
        py-5

        transition-all
        duration-300

        hover:-translate-y-[4px]
        hover:scale-[1.015]
        hover:border-red-400/80
        hover:shadow-[0_18px_45px_rgba(170,0,30,.18)]

        active:scale-[.99]
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

      <div className="relative z-10 flex items-center gap-6">
        <TournamentIcon type={type} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[17px] font-semibold transition-colors duration-300 group-hover/tcard:text-red-100">
              {title}
            </h3>

            <div className="flex shrink-0 items-center gap-2 text-[12px] text-zinc-400">
              {number}

              <span className="h-px w-6 bg-zinc-500" />
            </div>
          </div>

          <p className="mt-3 max-w-[300px] text-[13px] leading-[1.5] text-zinc-400">
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
    <main className="min-h-screen overflow-x-hidden bg-[#050506] text-white">
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
          bg-black/90
          backdrop-blur-xl
        "
      >
        <div className="mx-auto flex h-[82px] max-w-[1450px] items-center justify-between px-6 lg:px-10">
          <a
            href="#home"
            className="text-[28px] font-black transition-transform duration-300 hover:scale-105"
          >
            Pro
            <span className="text-red-600">
              VN
            </span>
          </a>

          <nav className="hidden gap-10 text-[15px] text-zinc-300 md:flex">
            {[
              ['Home', '#home'],
              ['Games', '#games'],
              ['Community', '#proof'],
              ['About', '#how'],
            ].map(([label, href]) => (
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
            ))}
          </nav>

          <a
            href="#join"
            className="
              rounded-full
              border
              border-red-600/75
              px-7
              py-3
              transition-all
              duration-300
              hover:scale-[1.06]
              hover:border-red-400
              hover:bg-red-950/40
              hover:shadow-[0_0_32px_rgba(255,0,45,.24)]
              active:scale-[.98]
            "
          >
            ♛ Level Up
          </a>
        </div>
      </header>

      {/* ===================================================
          SECTION 1
      ==================================================== */}

      <section
        id="home"
        className="
          relative
          min-h-[850px]
          overflow-hidden
          bg-[#050506]
          pt-[82px]
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
            className="pointer-events-none absolute inset-y-0 left-0 w-[34%]"
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
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[22px]"
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

        <div className="relative z-20 mx-auto grid min-h-[768px] max-w-[1450px] items-center px-6 lg:grid-cols-[46%_54%] lg:px-10">
          <div data-cursor-block className="max-w-[650px]">
            <p className="mb-6 text-xs uppercase tracking-[0.42em] text-zinc-400">
              More Than Just Games
            </p>

            <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-[67px]">
              Play Better.

              <br />

              <span className="text-red-600">
                Connect Smarter.
              </span>

              <br />

              Win Together.
            </h1>

            <p className="mt-7 max-w-[510px] text-lg leading-8 text-zinc-400">
              Find teammates, coaches, gaming services and tournaments —
              all in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#ecosystem"
                className="
                  rounded-full
                  bg-red-600
                  px-8
                  py-4
                  font-semibold
                  transition-all
                  duration-300
                  hover:scale-[1.055]
                  hover:bg-red-500
                  hover:shadow-[0_0_38px_rgba(255,0,45,.32)]
                  active:scale-[.98]
                "
              >
                Explore ProVN →
              </a>

              <a
                href="#proof"
                className="
                  rounded-full
                  border
                  border-red-600/75
                  bg-black/25
                  px-8
                  py-4
                  transition-all
                  duration-300
                  hover:scale-[1.055]
                  hover:border-red-400
                  hover:bg-red-950/45
                  hover:shadow-[0_0_32px_rgba(255,0,45,.18)]
                  active:scale-[.98]
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
          SECTION 2
      ==================================================== */}

      <section
        id="ecosystem"
        className="relative overflow-hidden bg-[#050506] py-[116px]"
      >
        <div
          data-cursor-block
          className="absolute inset-[-45px] opacity-[0.22] blur-[32px]"
          style={{
            backgroundImage:
              "url('/home/section2.png')",

            backgroundSize:
              'cover',

            backgroundPosition:
              'right center',
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-black/65" />

        <div className="relative z-10 mx-auto max-w-[1500px] px-6 lg:px-10">
          <div data-cursor-block>
            <h2 className="text-5xl font-black leading-[0.95] lg:text-6xl">
              One Platform.

              <br />

              <span className="text-red-600">
                Every Side of Gaming.
              </span>
            </h2>

            <p className="mt-6 text-zinc-400">
              Choose what you want to do and enter the part of ProVN built for you.
            </p>
          </div>

          <div className="mt-[68px] grid gap-[18px] lg:grid-cols-5">
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
          SECTION 3
      ==================================================== */}

      <section
        id="games"
        className="relative overflow-hidden bg-[#050506] py-[118px]"
      >
        <div className="relative z-10 mx-auto max-w-[1450px] px-6 lg:px-10">
          <SectionHeading
            eyebrow="Choose · Play · Grow"
            normal="Choose Your"
            red="Game."
            description="Enter a dedicated ecosystem of players, coaches, services and tournaments built around your game."
          />

          <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {gameCards.map(game => (
              <a
                key={game.name}
                href={game.href}
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
                  hover:scale-[1.045]
                  hover:shadow-[0_22px_60px_rgba(185,0,30,.27)]

                  active:scale-[1.015]
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
            ))}
          </div>
        </div>
      </section>

      <SectionTransition />

      {/* ===================================================
          SECTION 4
      ==================================================== */}

      <section
        id="how"
        className="relative min-h-[900px] overflow-hidden bg-[#050506]"
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
            className="absolute inset-0"
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

          <div className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-[#050506]" />

          <div
            className="pointer-events-none absolute inset-y-0 left-[16%] w-[19%]"
            style={{
              background:
                'linear-gradient(to right,#050506,rgba(5,5,6,.97) 18%,rgba(5,5,6,.70) 52%,rgba(5,5,6,.25) 80%,transparent)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1450px] px-6 py-[124px] lg:px-10">
          <div data-cursor-block className="lg:w-[48%]">
            <p className="mb-4 text-[11px] uppercase tracking-[0.33em] text-zinc-400">
              Simple Steps. Bigger Opportunities.
            </p>

            <h2 className="text-5xl font-black">
              How ProVN{' '}

              <span className="text-red-600">
                Works.
              </span>
            </h2>

            <p className="mt-4 text-zinc-400">
              Join, connect and grow in a dedicated ecosystem built for gamers,
              coaches and providers.
            </p>

            <div className="relative mt-11 pl-[56px]">
              <div className="absolute bottom-10 left-[17px] top-10 w-px bg-red-600" />

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
          SECTION 5
      ==================================================== */}

      <section
        id="proof"
        className="relative overflow-hidden bg-[#050506] py-[128px]"
      >
        <div className="relative z-10 mx-auto max-w-[1450px] px-6 lg:px-10">
          <div data-cursor-block className="text-center">
            <div className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.35em] text-zinc-400">
              <span className="h-px w-8 bg-red-600" />

              Verified Talent Ecosystem

              <span className="h-px w-8 bg-red-600" />
            </div>

            <h2 className="mt-5 text-5xl font-black lg:text-6xl">
              Skill Deserves{' '}

              <span className="text-[#f0082f]">
                Proof.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[650px] text-zinc-400">
              A trusted space where players, coaches and teams connect through
              real performance, not just claims.
            </p>
          </div>

          <div className="mt-[70px] grid gap-6 lg:grid-cols-3">
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
                  Performance-backed profiles,
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
                  Coaching credibility earned
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

          {/* =================================================
              MAIN CTA
          ================================================= */}

          <div
            id="join"
            data-cursor-block
            className="
              mt-[78px]
              flex
              flex-col
              items-center
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
                px-8
                py-[17px]
                text-lg
                font-semibold

                transition-all
                duration-300

                hover:scale-[1.045]
                hover:border-red-400
                hover:from-[#761020]
                hover:via-[#8a1427]
                hover:to-[#520a16]
                hover:shadow-[0_0_42px_rgba(220,0,40,.24)]

                active:scale-[.98]
              "
            >
              Join Early Access

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            {/* =================================================
                COACH + RECRUITER

                deliberately smaller than Join Early Access
                so the main CTA remains dominant.
            ================================================= */}

            <div
              id="recruiter"
              className="
                mt-6
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

      <SectionTransition />

      {/* ===================================================
          SECTION 6
      ==================================================== */}

      <section
        id="tournaments"
        className="relative overflow-hidden bg-[#050506] pb-[135px] pt-[105px]"
      >
        <div className="relative z-10 mx-auto max-w-[1540px] px-6 lg:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[36%_64%]">
            <div data-cursor-block className="relative z-20 max-w-[525px]">
              <div className="mb-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.34em] text-zinc-400">
                <span className="h-px w-9 bg-red-600" />

                Competitions & Tournaments
              </div>

              <h2 className="text-5xl font-black leading-[0.96] tracking-[-0.045em] lg:text-[61px]">
                Compete With

                <br />

                <span className="text-red-600">
                  Confidence.
                </span>
              </h2>

              <p className="mt-6 max-w-[500px] text-base leading-7 text-zinc-400">
                From casual scrims to high-stakes tournaments,
                play in a safe, verified and transparent environment.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#tournaments"
                  className="
                    flex
                    min-w-[220px]
                    items-center
                    justify-between
                    rounded-[10px]
                    bg-gradient-to-r
                    from-[#ff143c]
                    to-[#d70027]
                    px-7
                    py-4
                    font-semibold

                    transition-all
                    duration-300

                    hover:scale-[1.055]
                    hover:from-[#ff3154]
                    hover:to-[#ed002d]
                    hover:shadow-[0_0_36px_rgba(255,0,45,.28)]

                    active:scale-[.98]
                  "
                >
                  Explore Tournaments
                  <span>→</span>
                </a>

                <a
                  href="#join"
                  className="
                    flex
                    min-w-[195px]
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

                    hover:scale-[1.055]
                    hover:border-red-400
                    hover:bg-red-950/40
                    hover:shadow-[0_0_28px_rgba(210,0,35,.18)]

                    active:scale-[.98]
                  "
                >
                  Host a Tournament
                  <span className="text-red-500">→</span>
                </a>
              </div>
            </div>

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

          <div className="h-[64px] lg:h-[90px]" />

          <div className="grid gap-[24px] md:grid-cols-3">
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

      <SectionTransition height={125} />

      {/* ===================================================
          FOUNDERS
      ==================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-[#050506]
          px-6
          pb-[120px]
          pt-[95px]
          lg:px-10
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[330px]
            w-[720px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-red-950/20
            blur-[140px]
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
          <div className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.38em] text-zinc-500">
            <span className="h-px w-10 bg-red-600" />

            The People Behind ProVN

            <span className="h-px w-10 bg-red-600" />
          </div>

          <h2 className="mt-7 text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-[60px]">
            Built for the

            <span className="text-red-600">
              {' '}Next Generation of Gaming.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-[760px] text-base leading-8 text-zinc-400 sm:text-lg">
            ProVN is being built around one simple idea:
            gaming talent should be easier to discover,
            easier to trust and easier to turn into opportunity.
          </p>

          <div className="mx-auto mt-14 grid max-w-[760px] gap-5 sm:grid-cols-2">
            <div
              className="
                rounded-[24px]
                border
                border-red-500/30
                bg-gradient-to-br
                from-[#170e11]
                via-[#0d090a]
                to-[#070708]
                px-8
                py-8
              "
            >
              <div className="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-full border border-red-500/50 bg-red-950/30 text-xl font-black text-red-500">
                K
              </div>

              <p className="mt-5 text-[11px] uppercase tracking-[0.30em] text-zinc-500">
                Co-Founder
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Mr. Kanav
              </h3>
            </div>

            <div
              className="
                rounded-[24px]
                border
                border-red-500/30
                bg-gradient-to-br
                from-[#170e11]
                via-[#0d090a]
                to-[#070708]
                px-8
                py-8
              "
            >
              <div className="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-full border border-red-500/50 bg-red-950/30 text-xl font-black text-red-500">
                A
              </div>

              <p className="mt-5 text-[11px] uppercase tracking-[0.30em] text-zinc-500">
                Co-Founder
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Mr. Anmol
              </h3>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-[860px] border-t border-white/[0.06] pt-10">
            <p className="text-xl font-semibold tracking-[-0.02em] text-zinc-200 sm:text-2xl">
              “Play with purpose.

              <span className="text-red-500">
                {' '}Build your proof. Own your game.
              </span>”
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
          py-10
        "
      >
        <div className="mx-auto flex max-w-[1450px] flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <a
              href="#home"
              className="
                inline-block
                text-2xl
                font-black
                transition-transform
                duration-300
                hover:scale-105
              "
            >
              Pro

              <span className="text-red-600">
                VN
              </span>
            </a>

            <p className="mt-2 text-sm text-zinc-600">
              Where real performance becomes real recognition.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
              Founded by
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Mr. Kanav &amp; Mr. Anmol
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}