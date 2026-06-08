"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type PipelineNode = {
  code: string; // "N.01"
  label: string; // "DISCOVER"
  caption?: string; // "1 wk"
};

type Props = {
  nodes: PipelineNode[];
  tone?: "light" | "dark";
  className?: string;
  startDelay?: number;
  /** Show "x.x" labels between nodes. */
  segmentLabels?: string[];
};

/**
 * Horizontal sequence of nodes connected by a single line with tick caps and labels.
 * Lines draw in left → right, then nodes fade in, then labels.
 */
export function Pipeline({
  nodes,
  tone = "light",
  className,
  startDelay = 0,
  segmentLabels,
}: Props) {
  const stroke = tone === "light" ? "#FFFFFF" : "#0F172A";
  const textColor = tone === "light" ? "fill-white" : "fill-ink";

  const W = 900;
  const H = 160;
  const padX = 60;
  const baseY = 80;

  // Distribute nodes evenly
  const xs = nodes.map((_, i) =>
    nodes.length === 1
      ? W / 2
      : padX + ((W - padX * 2) * i) / (nodes.length - 1)
  );

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Pipeline of process nodes"
      >
        {/* Spine */}
        <motion.line
          x1={xs[0]}
          y1={baseY}
          x2={xs[xs.length - 1]}
          y2={baseY}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: startDelay }}
        />

        {/* Tick caps at each node along the spine */}
        {xs.map((x, i) => (
          <motion.line
            key={`tick-${i}`}
            x1={x}
            y1={baseY - 8}
            x2={x}
            y2={baseY + 8}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.3,
              delay: startDelay + 0.4 + i * 0.1,
            }}
          />
        ))}

        {/* Nodes (circles) */}
        {nodes.map((n, i) => (
          <motion.g
            key={n.code}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.4,
              delay: startDelay + 0.8 + i * 0.12,
              ease: "easeOut",
            }}
            style={{ transformOrigin: `${xs[i]}px ${baseY}px` }}
          >
            <circle cx={xs[i]} cy={baseY} r="14" fill={stroke === "#FFFFFF" ? "#1E40AF" : "#FAFAFA"} />
            <circle cx={xs[i]} cy={baseY} r="14" />
            <text
              x={xs[i]}
              y={baseY + 4}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="11"
              fontWeight="600"
              className={textColor}
              stroke="none"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </motion.g>
        ))}

        {/* Labels above each node */}
        {nodes.map((n, i) => (
          <motion.g
            key={`label-${n.code}`}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.4,
              delay: startDelay + 1.0 + i * 0.1,
            }}
          >
            <text
              x={xs[i]}
              y={36}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              letterSpacing="2"
              opacity="0.7"
              className={textColor}
              stroke="none"
            >
              {n.code}
            </text>
            <text
              x={xs[i]}
              y={56}
              textAnchor="middle"
              fontFamily="Inter Display, Inter, sans-serif"
              fontSize="18"
              fontWeight="700"
              letterSpacing="-0.3"
              className={textColor}
              stroke="none"
            >
              {n.label}
            </text>
            {n.caption && (
              <text
                x={xs[i]}
                y={baseY + 36}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="10"
                letterSpacing="2"
                opacity="0.7"
                className={textColor}
                stroke="none"
              >
                {n.caption}
              </text>
            )}
          </motion.g>
        ))}

        {/* Segment dimension labels between nodes */}
        {segmentLabels &&
          segmentLabels.map((label, i) => {
            if (i >= xs.length - 1) return null;
            const cx = (xs[i] + xs[i + 1]) / 2;
            return (
              <motion.g
                key={`seg-${i}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.4,
                  delay: startDelay + 1.2 + i * 0.1,
                }}
              >
                <text
                  x={cx}
                  y={baseY - 16}
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
                  letterSpacing="2"
                  className={textColor}
                  stroke="none"
                >
                  {label}
                </text>
              </motion.g>
            );
          })}
      </svg>
    </div>
  );
}
