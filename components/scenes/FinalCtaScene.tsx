"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FigureWaving,
  FigureStanding,
  FigureCarrying,
} from "@/components/figures";

/**
 * Final-CTA scene: a partially-built crate labeled "YOUR PROJECT" with
 * FigureWaving on the left and FigureStanding on the right, flanking the headline.
 * FigureCarrying enters from below as the "next builder arriving."
 */
export function FinalCtaScene() {
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
        {/* Title block */}
        <text
          x="240"
          y="36"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          letterSpacing="2"
          fill="#FFFFFF"
          stroke="none"
          opacity="0.7"
        >
          FIG. NEXT — YOUR PROJECT
        </text>

        {/* Crate */}
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

        {/* Corner brackets on the crate */}
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

        {/* Labels inside */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <text x="180" y="116" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill="#FFFFFF" stroke="none">SPEC: TBD</text>
          <text x="300" y="116" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill="#FFFFFF" stroke="none">SCOPE: TBD</text>
          <text x="180" y="190" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill="#FFFFFF" stroke="none">TEAM: SUDO</text>
          <text x="300" y="190" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill="#FFFFFF" stroke="none">START: WK 1</text>
        </motion.g>

        {/* Baseline */}
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

      {/* FigureWaving — left side, larger, foreground */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="absolute left-[2%] bottom-[6%] text-white"
        style={{ width: "20%", minWidth: 80 }}
      >
        <FigureWaving className="w-full" />
      </motion.div>

      {/* FigureStanding — right side, smaller (depth) */}
      <motion.div
        initial={{ opacity: 0, x: 6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1.15, duration: 0.5 }}
        className="absolute right-[3%] bottom-[12%] text-white"
        style={{ width: "16%", minWidth: 72 }}
      >
        <FigureStanding className="w-full" />
      </motion.div>

      {/* FigureCarrying — arriving from below-center, small */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute left-1/2 bottom-[-3%] text-white"
        style={{ width: "14%", minWidth: 64, transform: "translateX(-50%)" }}
      >
        <FigureCarrying className="w-full" />
      </motion.div>
    </div>
  );
}
