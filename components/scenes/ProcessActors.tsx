"use client";

import * as React from "react";
import { gsap } from "gsap";

type ActorKind = "discover" | "prototype" | "build" | "ship";

type Props = {
  kind: ActorKind;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Simple, solid, always-connected process figures. Each is a single authored
 * stickman standing on the baseline with ONE clear action prop. The only motion
 * is a small, safe transform on a self-contained group (a tool/prop or the whole
 * upper body) — no path morphing, no detached limbs, no drawSVG on the figure,
 * so nothing can break apart or drift off its feet.
 *
 * 46×70 viewBox, 2.35 stroke, feet planted near y=68 to sit on the ground line.
 */
export function ProcessActor({ kind, className, style }: Props) {
  const root = React.useRef<SVGSVGElement>(null);

  React.useLayoutEffect(() => {
    const svg = root.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const move = svg.querySelector<SVGGElement>("[data-move]");
      if (!move) return;
      gsap.set(move, { transformBox: "fill-box", transformOrigin: "50% 100%" });

      if (kind === "discover") {
        // The clipboard tilts up as the surveyor checks the reading.
        gsap.to(move, { rotation: -8, duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });
      } else if (kind === "prototype") {
        // The pen nib slides along the board.
        gsap.to(move, { x: 3, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      } else if (kind === "build") {
        // The raised tool taps down in a steady work rhythm.
        gsap.to(move, {
          y: 3,
          rotation: 6,
          duration: 0.5,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      } else if (kind === "ship") {
        // The parcel is lifted and set down for handoff.
        gsap.to(move, { y: -4, duration: 0.9, ease: "power1.inOut", yoyo: true, repeat: -1 });
      }
    }, root);

    return () => ctx.revert();
  }, [kind]);

  return (
    <svg
      ref={root}
      viewBox="0 0 46 70"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`overflow-visible ${className ?? ""}`}
      style={style}
      aria-hidden
    >
      {kind === "discover" && <Discover />}
      {kind === "prototype" && <Prototype />}
      {kind === "build" && <Build />}
      {kind === "ship" && <Ship />}
    </svg>
  );
}

/** Discover — surveyor reading a clipboard. */
function Discover() {
  return (
    <g transform="translate(4 0)">
      <circle cx="20" cy="9" r="5" />
      <path d="M20 14v25" />
      {/* far arm holds the clipboard steady */}
      <path d="M20 20 13 27 13 35" />
      {/* legs planted */}
      <path d="M20 39 14 53 12 68M20 39l6 14 2 15" />
      {/* near arm + tilting clipboard */}
      <path d="M20 20 27 25 30 31" />
      <g data-move>
        <path d="M27 27h12v14H27z" fill="#1E40AF" />
        <path d="M30 31h6M30 35h5M30 38h6" stroke="#fff" strokeWidth="1.3" />
      </g>
    </g>
  );
}

/** Prototype — drafter sketching on an angled board. */
function Prototype() {
  return (
    <g transform="translate(3 0)">
      <circle cx="18" cy="12" r="5" />
      <path d="M18 17 21 40" />
      {/* far arm braces the board */}
      <path d="M19 22 10 30 9 40" />
      {/* legs */}
      <path d="M21 40 15 54 13 68M21 40l6 14 2 14" />
      {/* drafting board */}
      <path d="M24 46 40 34" />
      <path d="M22 50 38 38" opacity=".4" strokeWidth="1.4" />
      {/* drawing arm + sliding pen */}
      <path d="M19 22 27 27 32 33" />
      <g data-move>
        <path d="M31 32l4 3" stroke="#FBBF24" strokeWidth="2.6" />
      </g>
    </g>
  );
}

/** Build — assembler tapping a panel with a raised tool. */
function Build() {
  return (
    <g transform="translate(3 0)">
      <circle cx="18" cy="10" r="5" />
      <path d="M18 15 20 40" />
      {/* far arm steadies the panel */}
      <path d="M19 20 11 27 9 34" />
      {/* legs */}
      <path d="M20 40 14 54 12 68M20 40l6 14 2 14" />
      {/* panel on a stand */}
      <path d="M28 44h14v6H28zM33 50v18M30 68h6" />
      {/* working arm + raised mallet */}
      <path d="M19 21 27 24 32 21" />
      <g data-move>
        <path d="M31 22 36 15" />
        <path d="M33 12h8v6h-8z" fill="#1E40AF" />
      </g>
    </g>
  );
}

/** Ship — figure lifting a parcel for handoff. */
function Ship() {
  return (
    <g transform="translate(4 0)">
      <circle cx="16" cy="10" r="5" />
      <path d="M16 15 18 40" />
      {/* legs */}
      <path d="M18 40 12 54 10 68M18 40l6 14 2 14" />
      {/* both arms reach forward to carry */}
      <path d="M17 20 26 24 31 27" />
      <path d="M17 22 26 27 31 30" />
      {/* parcel being lifted */}
      <g data-move>
        <path d="M30 22h13v14H30z" fill="#1E40AF" />
        <path d="M36 22v14M30 29h13" stroke="#fff" strokeWidth="1.3" />
      </g>
    </g>
  );
}
