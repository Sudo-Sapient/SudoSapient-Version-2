"use client";

import * as React from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { FigureWaving, FigureWalking } from "@/components/figures";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type Props = {
  /** Driven by hover/focus of the "Start a Project" CTA — triggers a wave. */
  waving?: boolean;
};

/**
 * Final-CTA scene: a partially-built crate labeled "YOUR PROJECT" with
 * FigureWaving on the left, FigureStanding on the right, and FigureCarrying
 * arriving from below.
 *
 * The waving figure acknowledges the CTA: it waves its forearm (pivoting about
 * the elbow — the one joint the pose is drawn around, so it never "breaks") and
 * leans a touch toward the button on hover/focus, plus one wave when it first
 * scrolls into view. Reduced motion: it just stays in its authored pose.
 */
export function FinalCtaScene({ waving = false }: Props) {
  const figure = React.useRef<HTMLDivElement>(null);
  const lean = React.useRef<HTMLDivElement>(null);
  const reduced = React.useRef(false);

  // Plays a single, self-resolving wave on the forearm group (ends at 0°).
  const playWave = React.useCallback(() => {
    const arm = figure.current?.querySelector<SVGGElement>("[data-wave-forearm]");
    if (!arm || reduced.current) return;
    gsap.killTweensOf(arm);
    gsap
      .timeline()
      .to(arm, { rotation: -16, svgOrigin: "28 8", duration: 0.18, ease: "power1.out" })
      .to(arm, { rotation: 4, svgOrigin: "28 8", duration: 0.22, ease: "power1.inOut" })
      .to(arm, { rotation: -12, svgOrigin: "28 8", duration: 0.2, ease: "power1.inOut" })
      .to(arm, { rotation: 0, svgOrigin: "28 8", duration: 0.26, ease: "power1.inOut" });
  }, []);

  // One greeting wave shortly after the scene mounts/settles.
  useIsomorphicLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;
    const ctx = gsap.context(() => {
      const hello = gsap.delayedCall(1.2, playWave);
      return () => hello.kill();
    });
    return () => ctx.revert();
  }, [playWave]);

  // React to the CTA hover/focus state.
  React.useEffect(() => {
    if (reduced.current) return;
    const el = lean.current;
    if (el) gsap.to(el, { x: waving ? -3 : 0, duration: 0.25, ease: "power2.out" });
    if (waving) playWave();
  }, [waving, playWave]);

  return (
    <div className="relative h-72 w-full sm:h-80 md:h-96">
      {/* The crate / focal structure */}
      <svg
        viewBox="0 0 480 320"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.25"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <text
          x="240"
          y="36"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
          fontSize="11"
          letterSpacing="2"
          fill="#FFFFFF"
          stroke="none"
          opacity="0.7"
        >
          FIG. NEXT — YOUR PROJECT
        </text>

        <motion.g
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <rect x="120" y="80" width="240" height="160" />
          <line x1="120" y1="140" x2="360" y2="140" />
          <line x1="240" y1="80" x2="240" y2="240" />
        </motion.g>

        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <polyline points="116,96 116,80 132,80" />
          <polyline points="348,80 364,80 364,96" />
          <polyline points="116,224 116,240 132,240" />
          <polyline points="348,240 364,240 364,224" />
        </motion.g>

        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <text x="180" y="116" textAnchor="middle" style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }} fontSize="11" fill="#FFFFFF" stroke="none">SPEC: TBD</text>
          <text x="300" y="116" textAnchor="middle" style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }} fontSize="11" fill="#FFFFFF" stroke="none">SCOPE: TBD</text>
          <text x="180" y="190" textAnchor="middle" style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }} fontSize="11" fill="#FFFFFF" stroke="none">TEAM: SUDO</text>
          <text x="300" y="190" textAnchor="middle" style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }} fontSize="11" fill="#FFFFFF" stroke="none">START: WK 1</text>
        </motion.g>

        <motion.line
          x1="20"
          y1="280"
          x2="460"
          y2="280"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        />
        <line x1="20" y1="286" x2="460" y2="286" opacity="0.5" />
      </svg>

      {/* Waver — greets by the crate (sways idly, full wave on CTA hover) */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="absolute left-[1%] bottom-[8%] text-white"
        style={{ width: "18%", minWidth: 72 }}
      >
        <div ref={lean}>
          <div ref={figure}>
            <FigureWaving className="w-full" />
          </div>
        </div>
      </motion.div>

      {/* Carrying walker — paces the site delivering a beam */}
      <div
        className="walk-pace pointer-events-none absolute bottom-[3%] left-[6%] text-white"
        style={
          {
            width: "15%",
            minWidth: 60,
            "--walk-dist": "150px",
            "--pace-dur": "9s",
          } as React.CSSProperties
        }
      >
        <span className="walk-bob block w-full">
          <FigureWalking carrying className="w-full" />
        </span>
      </div>

      {/* Supervisor walker — paces the other stretch, out of step */}
      <div
        className="walk-pace pointer-events-none absolute bottom-[1%] left-[52%] text-white"
        style={
          {
            width: "13%",
            minWidth: 52,
            animationDelay: "-3.5s",
            "--walk-dist": "120px",
            "--pace-dur": "7.5s",
          } as React.CSSProperties
        }
      >
        <span className="walk-bob block w-full">
          <FigureWalking className="w-full" />
        </span>
      </div>
    </div>
  );
}
