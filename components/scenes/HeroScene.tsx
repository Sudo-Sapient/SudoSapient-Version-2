"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ModuleStack } from "@/components/blueprint/ModuleStack";
import {
  FigurePushing,
  FigureClimbing,
  FigureStanding,
  FigureSitting,
} from "@/components/figures";

/**
 * The homepage hero composition.
 * Focal structure: the three-module stack (PRODUCT / AUTOMATION / MEDIA),
 * built in plain view by:
 *   - FigurePushing (foreground left, large): pushing the bottom MEDIA module into place
 *   - FigureClimbing (right side, medium): scaling the AUTOMATION module
 *   - FigureStanding (top right, small): smaller observer, depth cue
 *   - FigureSitting (foreground right, large): cross-legged on the baseline, watching
 *
 * Figures fade in after the structure draws.
 */
export function HeroScene() {
  return (
    <div className="relative isolate w-full">
      {/* Focal structure */}
      <ModuleStack
        modules={[
          { code: "M.01", label: "PRODUCT", meta: "agents · copilots · RAG" },
          { code: "M.02", label: "AUTOMATION", meta: "pipelines · routing" },
          { code: "M.03", label: "MEDIA", meta: "shows · clips · essays" },
        ]}
        tone="light"
        startDelay={0.6}
      />

      {/* Background observer — top right, small scale (depth) */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 2.4, duration: 0.5 }}
        className="pointer-events-none absolute right-[3%] top-[-2%] text-white/85"
        style={{ width: "8%", minWidth: 36 }}
      >
        <FigureStanding className="w-full" />
      </motion.div>

      {/* Foreground left — pushing the bottom module right-to-left into the stack */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className="pointer-events-none absolute left-[-1%] bottom-[8%] text-white"
        style={{ width: "16%", minWidth: 72 }}
      >
        <FigurePushing className="w-full" />
      </motion.div>

      {/* Right side — climbing the middle module (medium scale) */}
      <motion.div
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.3, duration: 0.5 }}
        className="pointer-events-none absolute right-[6%] top-[26%] text-white"
        style={{ width: "12%", minWidth: 60 }}
      >
        <FigureClimbing className="w-full" />
      </motion.div>

      {/* Foreground right — sitting on the baseline, watching */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="pointer-events-none absolute right-[2%] bottom-[-2%] text-white"
        style={{ width: "14%", minWidth: 64 }}
      >
        <FigureSitting className="w-full" />
        {/* tiny notebook line beside the seated figure */}
        <svg
          viewBox="0 0 60 40"
          className="absolute -bottom-2 -right-6 w-12"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.25"
          aria-hidden
        >
          <rect x="4" y="6" width="48" height="28" />
          <line x1="12" y1="14" x2="44" y2="14" />
          <line x1="12" y1="20" x2="38" y2="20" />
          <line x1="12" y1="26" x2="42" y2="26" />
        </svg>
      </motion.div>
    </div>
  );
}
