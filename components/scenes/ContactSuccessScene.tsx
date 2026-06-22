"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FigureWaving, FigurePointing, BreathingFigure } from "@/components/figures";
import { TechLabel } from "@/components/blueprint/TechLabel";

/**
 * Contact-form success state. Replaces the form on submit:
 *   FigureWaving (greeting) + FigurePointing forward.
 */
export function ContactSuccessScene() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-start gap-6 border border-white/30 p-8 sm:p-10"
    >
      <div className="flex items-end gap-6 text-white">
        <BreathingFigure index={0}>
          <FigureWaving className="h-24 w-auto" />
        </BreathingFigure>
        <BreathingFigure index={1}>
          <FigurePointing className="h-28 w-auto" />
        </BreathingFigure>
      </div>
      <TechLabel>{"// CONSTRUCTION SCHEDULED"}</TechLabel>
      <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight-2 text-white sm:text-4xl">
        We&rsquo;ll be in touch within 48 hours.
      </h2>
      <p className="text-white/80">
        In the meantime, anything urgent — sudosapient@gmail.com.
      </p>
    </motion.div>
  );
}
