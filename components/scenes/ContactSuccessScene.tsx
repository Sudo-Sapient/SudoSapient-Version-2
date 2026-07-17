"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ClimberPosePlayer } from "@/components/figures/ClimberPosePlayer";
import { TechLabel } from "@/components/blueprint/TechLabel";

/** The submitted brief is physically received, checked, and scheduled. */
export function ContactSuccessScene() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      tabIndex={-1}
      ref={(node) => node?.focus()}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-start gap-6 border border-white/30 p-8 outline-none sm:p-10"
    >
      <div className="relative h-32 w-full max-w-sm overflow-hidden border-b border-white/25 text-white">
        <div className="absolute bottom-0 left-2 w-16">
          <ClimberPosePlayer
            poses={["carry", "reach", "wave"]}
            durations={[0.6, 0.35, 0.7]}
            className="w-full"
          />
        </div>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 112 }}
          transition={{ delay: 0.55, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-[4.7rem] left-14 h-7 w-10 border-2 border-warn bg-blueprint"
        >
          <span className="absolute left-2 top-2 h-px w-5 bg-white/55" />
          <span className="bg-white/4 absolute left-2 top-4 h-px w-4" />
        </motion.div>
        <div className="absolute bottom-0 right-2 w-16 -scale-x-100">
          <ClimberPosePlayer
            poses={["reach", "inspect", "press"]}
            durations={[0.55, 0.7, 0.35]}
            delay={0.25}
            className="w-full"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.15, type: "spring" }}
          className="absolute right-20 top-3 border border-warn px-2 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-warn"
        >
          Scheduled
        </motion.div>
      </div>
      <TechLabel>{"// CONSTRUCTION SCHEDULED"}</TechLabel>
      <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight-2 text-white sm:text-4xl">
        We&rsquo;ll reply within one working day.
      </h2>
      <p className="text-white/80">In the meantime, anything urgent — sudosapient@gmail.com.</p>
    </motion.div>
  );
}
