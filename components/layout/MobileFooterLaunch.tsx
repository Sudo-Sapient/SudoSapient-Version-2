"use client";

import * as React from "react";
import { gsap } from "gsap";

/** Compact phone-only footer scene. It is authored for a 320px canvas instead
 * of cropping the 960px five-person desktop workshop. */
export function MobileFooterLaunch() {
  const root = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = root.current;
    if (
      !el ||
      window.matchMedia("(min-width: 640px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const ctx = gsap.context(() => {
      const rocket = el.querySelector("[data-mobile-rocket]");
      const flame = el.querySelector("[data-mobile-flame]");
      const smoke = el.querySelectorAll("[data-mobile-smoke]");
      const button = el.querySelector("[data-mobile-button]");
      const operator = el.querySelector("[data-mobile-operator]");
      const builderStand = el.querySelector("[data-mobile-builder-stand]");
      const builderDuck = el.querySelector("[data-mobile-builder-duck]");
      const status = el.querySelector("[data-mobile-status]");

      gsap.set([flame, smoke, builderDuck, status], { autoAlpha: 0 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
      tl.to(operator, { x: 5, duration: 0.35, ease: "power2.inOut" })
        .to(button, {
          scale: 0.7,
          transformOrigin: "50% 50%",
          duration: 0.14,
          yoyo: true,
          repeat: 1,
        })
        .to(status, { autoAlpha: 1, duration: 0.2 }, "<")
        .to([flame, smoke], { autoAlpha: 1, duration: 0.15 })
        .to(builderStand, { autoAlpha: 0, duration: 0.1 }, "<")
        .to(builderDuck, { autoAlpha: 1, duration: 0.1 }, "<")
        .to(
          flame,
          {
            scaleY: 1.28,
            transformOrigin: "50% 0%",
            duration: 0.1,
            repeat: 5,
            yoyo: true,
          },
          "<"
        )
        .to(
          smoke,
          {
            scale: 1.55,
            x: (index) => (index === 0 ? -16 : index === 2 ? 16 : 0),
            opacity: 0.18,
            transformOrigin: "50% 50%",
            stagger: 0.04,
            duration: 0.55,
          },
          "<"
        )
        .to(rocket, { y: -215, duration: 1.25, ease: "power2.in" })
        .to([flame, status], { autoAlpha: 0, duration: 0.25 }, "<0.85")
        .to(smoke, { autoAlpha: 0, duration: 0.45 }, "<")
        .to({}, { duration: 0.55 })
        .set(rocket, { y: 0 })
        .set(smoke, { clearProps: "transform,opacity" })
        .set(builderDuck, { autoAlpha: 0 })
        .set(builderStand, { autoAlpha: 1 })
        .to(operator, { x: 0, duration: 0.25 });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative h-[13rem] w-full overflow-hidden"
      aria-label="Two builders launch a compact rocket"
    >
      <svg
        viewBox="0 0 320 210"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full text-white/80"
      >
        <path d="M20 184h280" opacity=".18" />
        <path d="M26 193h268" opacity=".08" />

        {/* Compact launch tower provides structure without tiny labels. */}
        <path d="M131 38v139M189 38v139M131 56h58M131 88h58M131 120h58M131 152h58" opacity=".38" />
        <path d="M131 56l58 32M189 56l-58 32M131 120l58 32M189 120l-58 32" opacity=".24" />

        <g data-mobile-rocket transform="translate(160 41)">
          <path d="M0 0C-17 16-23 38-21 76v55h42V76C23 38 17 16 0 0Z" fill="#0a1020" />
          <path d="M-21 80-38 111v20h17M21 80l17 31v20H21" fill="#0a1020" />
          <circle cx="0" cy="53" r="10" fill="#FBBF24" fillOpacity=".15" stroke="#FBBF24" />
          <path d="M-13 20h26M-21 91h42" opacity=".45" />
          <path d="M-10 131h20" strokeWidth="3" />
          <g data-mobile-flame transform="translate(0 132)" stroke="none">
            <path d="M-10 0C-12 22-5 35 0 43 5 35 12 22 10 0Z" fill="#F59E0B" opacity=".75" />
            <path d="M-5 0C-6 14-2 25 0 30 2 25 6 14 5 0Z" fill="#FFF7D6" />
          </g>
        </g>

        {/* Ground smoke stays wholly inside the phone canvas. */}
        <g fill="#D9E5F4" stroke="none">
          <circle data-mobile-smoke cx="140" cy="179" r="13" opacity=".32" />
          <circle data-mobile-smoke cx="160" cy="175" r="17" opacity=".4" />
          <circle data-mobile-smoke cx="182" cy="180" r="13" opacity=".32" />
        </g>

        {/* Left operator at a real console. */}
        <g data-mobile-operator transform="translate(48 115)">
          <circle cx="18" cy="8" r="6" />
          <path d="M18 15v35M18 25 36 34 49 28M18 50 8 69 4 88M18 50l15 18 6 20" />
          <path d="M-3 88h14M32 88h14" />
          <path d="M47 22h34v26H47zM53 29h22M53 36h14" />
          <circle data-mobile-button cx="72" cy="43" r="4" fill="#FBBF24" stroke="#FBBF24" />
          <text
            data-mobile-status
            x="64"
            y="17"
            textAnchor="middle"
            fill="#FBBF24"
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="8"
            fontWeight="700"
            letterSpacing="1"
          >
            GO
          </text>
        </g>

        {/* Right builder has complete stand and duck poses. */}
        <g transform="translate(246 121)">
          <g data-mobile-builder-stand>
            <circle cx="18" cy="8" r="6" />
            <path d="M18 15v34M18 24 4 38 0 52M18 24l13 14 5 14M18 49 8 66 5 82M18 49l13 17 4 16" />
            <path d="M-2 82h14M29 82h14" />
          </g>
          <g data-mobile-builder-duck>
            <circle cx="18" cy="35" r="6" />
            <path d="M18 42 8 54M8 54 2 67M8 54l18 1 12 12M12 45 3 37M23 45l10-8" />
            <path d="M-4 67H8M32 67h12" />
          </g>
        </g>
      </svg>
      <p className="absolute inset-x-0 bottom-1 text-center font-mono text-[8px] uppercase tracking-[0.15em] text-white/35">
        Build carefully. Launch confidently.
      </p>
    </div>
  );
}
