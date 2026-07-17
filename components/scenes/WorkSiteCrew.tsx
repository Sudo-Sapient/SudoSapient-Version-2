"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ClimberPosePlayer } from "@/components/figures/ClimberPosePlayer";

type Props = {
  variant?: "featured" | "compact";
  label: string;
};

/** A compact crew using the same thick, crisp pose language as the ladder climber. */
export function WorkSiteCrew({ variant = "compact", label }: Props) {
  const featured = variant === "featured";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 overflow-hidden text-white sm:h-28"
      aria-hidden
    >
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/75 to-transparent" />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-3 left-4 right-4 h-px origin-left bg-white/45"
      />

      <div className="absolute bottom-3 left-[8%] w-10 transition-transform duration-700 group-hover:translate-x-3 sm:w-12">
        <ClimberPosePlayer
          poses={["inspect", "reach", "inspect"]}
          durations={[0.8, 0.35, 0.8]}
          className="w-full"
        />
      </div>

      <div className="absolute bottom-3 left-[25%] w-10 transition-transform duration-700 group-hover:translate-x-8 sm:w-12">
        <ClimberPosePlayer
          poses={["walkA", "walkB"]}
          durations={[0.34, 0.34]}
          delay={0.15}
          className="w-full"
        />
      </div>

      {/* Kept deliberately small and above the hands so the carrier's head remains visible. */}
      <div className="absolute bottom-[4.35rem] left-[28%] h-3.5 w-8 border-2 border-white/65 bg-ink/65 backdrop-blur-sm transition-transform duration-700 group-hover:translate-x-8 sm:bottom-[5rem] sm:h-4 sm:w-9">
        <span className="absolute left-1 top-1 h-px w-4 bg-white/50" />
      </div>

      {featured && (
        <div className="absolute bottom-3 right-[24%] w-10 transition-transform duration-700 group-hover:-translate-x-2 sm:w-12">
          <ClimberPosePlayer
            poses={["draft", "inspect"]}
            durations={[0.75, 0.65]}
            delay={0.3}
            className="w-full"
          />
        </div>
      )}

      <div className="absolute bottom-5 right-5 border border-white/35 bg-ink/45 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/65 backdrop-blur-sm">
        {label} · verified
      </div>
    </div>
  );
}
