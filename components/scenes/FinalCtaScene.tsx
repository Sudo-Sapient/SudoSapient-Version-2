"use client";

import * as React from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { FigureWaving, FigureWalking } from "@/components/figures";
import { withBasePath } from "@/lib/site";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const VIDEO_SOURCE = withBasePath("/media/studio-reel.mp4");

type Props = {
  /** Driven by hover/focus of the social links. */
  waving?: boolean;
};

export function FinalCtaScene({ waving = false }: Props) {
  const figure = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = React.useState(true);
  const lean = React.useRef<HTMLDivElement>(null);
  const reduced = React.useRef(false);

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

  useIsomorphicLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;
    const ctx = gsap.context(() => {
      const hello = gsap.delayedCall(1.2, playWave);
      return () => hello.kill();
    });
    return () => ctx.revert();
  }, [playWave]);

  React.useEffect(() => {
    if (reduced.current) return;
    const el = lean.current;
    if (el) gsap.to(el, { x: waving ? -3 : 0, duration: 0.25, ease: "power2.out" });
    if (waving) playWave();
  }, [waving, playWave]);

  const toggleSound = () => {
    const player = video.current;
    if (!player) return;
    player.muted = !player.muted;
    setMuted(player.muted);
    void player.play();
  };

  return (
    <div className="relative h-72 w-full sm:h-80 md:h-96">
      {/* Local, web-optimized playback starts immediately and stays framed by the monitor. */}
      <div className="absolute left-[18.75%] top-[20%] z-[1] h-[45%] w-[62.5%] overflow-hidden bg-[#07110d] shadow-[0_0_35px_rgba(70,255,150,0.08)]">
        <video
          ref={video}
          src={VIDEO_SOURCE}
          title="Sudo Sapient studio reel"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={(event) => void event.currentTarget.play()}
          className="h-full w-full bg-[#07110d] object-cover"
        />
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-2 right-2 z-10 border border-white/45 bg-[#07110d]/85 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-white transition-colors hover:border-warn hover:text-warn focus-visible:outline focus-visible:outline-2 focus-visible:outline-warn"
        >
          {muted ? "Sound on" : "Mute"}
        </button>
      </div>

      <svg
        viewBox="0 0 480 320"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.25"
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        aria-hidden
      >
        <text
          x="240"
          y="31"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
          fontSize="10"
          letterSpacing="2"
          fill="#FFFFFF"
          stroke="none"
          opacity="0.7"
        >
          FIG. SOCIAL — STUDIO SIGNAL
        </text>

        <motion.g
          initial={{ opacity: 0, pathLength: 0 }}
          whileInView={{ opacity: 1, pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <rect x="78" y="52" width="324" height="180" rx="5" strokeWidth="3" />
          {/* Four bezel rails frame the video without placing an opaque panel over it. */}
          <path
            d="M80 54h320v10H80zM80 208h320v22H80zM80 64h10v144H80zM390 64h10v144h-10z"
            fill="#09101c"
            stroke="none"
          />
          <rect
            x="90"
            y="64"
            width="300"
            height="144"
            rx="2"
            stroke="#FFFFFF"
            strokeOpacity=".5"
            strokeWidth="2"
          />
          <path
            d="M154 232h172M174 232l-14 31M306 232l14 31M142 263h40M298 263h40"
            strokeWidth="3"
          />
          <path d="M402 91h12v101h-12" opacity=".38" />
        </motion.g>

        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <circle cx="384" cy="220" r="3.5" fill="#FBBF24" stroke="#FBBF24" />
          <circle cx="370" cy="220" r="2.5" />
          <path d="M94 218h38M94 224h24" opacity=".42" />
          <text
            x="238"
            y="248"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
            fontSize="7"
            letterSpacing="1.4"
            fill="#FFFFFF"
            stroke="none"
            opacity=".52"
          >
            SUDO / BROADCAST MONITOR 01
          </text>
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

      <motion.div
        initial={{ opacity: 0, x: -6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="absolute bottom-[8%] left-[1%] z-[3] text-white"
        style={{ width: "18%", minWidth: 72 }}
      >
        <div ref={lean}>
          <div ref={figure}>
            <FigureWaving className="w-full" />
          </div>
        </div>
      </motion.div>

      <div
        className="walk-pace pointer-events-none absolute bottom-[3%] left-[6%] z-[3] text-white"
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
      <div
        className="walk-pace pointer-events-none absolute bottom-[1%] left-[52%] z-[3] text-white"
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
