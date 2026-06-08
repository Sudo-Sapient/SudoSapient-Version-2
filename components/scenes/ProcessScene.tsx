"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Pipeline } from "@/components/blueprint/Pipeline";
import {
  FigureSitting,
  FigureWriting,
  FigurePushing,
  FigurePointing,
} from "@/components/figures";

/**
 * How We Work: horizontal pipeline of four nodes (Discover, Prototype, Build, Ship).
 * One figure per node, doing that step's action:
 *   Discover  → FigureSitting (listening)
 *   Prototype → FigureWriting (drafting)
 *   Build     → FigurePushing (constructing)
 *   Ship      → FigurePointing (forward, "out")
 */
export function ProcessScene() {
  const nodes = [
    { code: "N.01", label: "DISCOVER", caption: "1 wk" },
    { code: "N.02", label: "PROTOTYPE", caption: "2 wk" },
    { code: "N.03", label: "BUILD", caption: "3–6 wk" },
    { code: "N.04", label: "SHIP", caption: "ongoing" },
  ];
  const figures = [FigureSitting, FigureWriting, FigurePushing, FigurePointing];

  return (
    <div className="relative w-full">
      <Pipeline
        nodes={nodes}
        tone="light"
        startDelay={0.2}
        segmentLabels={["1.0x", "2.0x", "3.0x"]}
      />

      {/* Figures positioned at each node — fade in after the pipeline draws */}
      <div className="absolute inset-0 hidden md:block">
        {figures.map((F, i) => {
          // The Pipeline viewBox is 900 wide with padX=60; node centers at 60, 340, 620, 840.
          const nodeCenters = [60, 340, 620, 840];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 1.5 + i * 0.12, duration: 0.5 }}
              className="absolute text-white"
              style={{
                left: `${(nodeCenters[i] / 900) * 100}%`,
                top: "65%",
                transform: "translateX(-50%)",
                width: "10%",
                minWidth: 56,
                maxWidth: 84,
              }}
            >
              <F className="w-full" />
            </motion.div>
          );
        })}
      </div>

      {/* On mobile, render figures in a row below the pipeline */}
      <div className="mt-6 grid grid-cols-4 gap-3 md:hidden">
        {figures.map((F, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="flex justify-center text-white"
          >
            <F className="h-16 w-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
