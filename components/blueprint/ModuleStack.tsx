"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Module = {
  code: string; // "M.01"
  label: string; // "PRODUCT"
  meta?: string; // "agents · copilots · RAG"
  width?: number; // 0-1 fraction of container width, default 1
};

type Props = {
  modules: Module[];
  tone?: "light" | "dark";
  className?: string;
  startDelay?: number;
  /** Show dimension caps + total-height label on the side. */
  showDimensions?: boolean;
};

/**
 * Vertical stack of labeled blocks. Modules stack from top → bottom.
 * Each block has an internal divider, code label on the left, name in the center,
 * and an optional meta line in mono on the right. The whole stack draws in via
 * staggered stroke animation.
 *
 * The hero homepage uses three modules: PRODUCT / AUTOMATION / MEDIA.
 */
export function ModuleStack({
  modules,
  tone = "light",
  className,
  startDelay = 0,
  showDimensions = true,
}: Props) {
  const stroke = tone === "light" ? "#FFFFFF" : "#0F172A";
  const textColor = tone === "light" ? "fill-white" : "fill-ink";

  // Layout: 600x420 viewBox, 60px x-padding for dimension caps on left
  const W = 600;
  const H = 420;
  const left = showDimensions ? 60 : 20;
  const right = W - 20;
  const innerW = right - left;
  const top = 20;
  const bottom = H - 20;
  const rowH = (bottom - top) / modules.length;

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
        aria-label="Stack of system modules"
      >
        {/* outer frame */}
        <motion.rect
          x={left}
          y={top}
          width={innerW}
          height={bottom - top}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: startDelay }}
        />

        {/* internal dividers */}
        {modules.slice(1).map((_, i) => (
          <motion.line
            key={i}
            x1={left}
            y1={top + rowH * (i + 1)}
            x2={right}
            y2={top + rowH * (i + 1)}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: startDelay + 0.4 + i * 0.15,
            }}
          />
        ))}

        {/* corner brackets on each row */}
        {modules.map((_, i) => {
          const y = top + rowH * i;
          return (
            <motion.g
              key={`brackets-${i}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.4,
                delay: startDelay + 0.9 + i * 0.1,
              }}
            >
              <polyline points={`${left + 4},${y + 14} ${left + 4},${y + 4} ${left + 14},${y + 4}`} />
              <polyline points={`${right - 14},${y + 4} ${right - 4},${y + 4} ${right - 4},${y + 14}`} />
            </motion.g>
          );
        })}

        {/* row content: code label, name, meta */}
        {modules.map((m, i) => {
          const cy = top + rowH * i + rowH / 2;
          return (
            <motion.g
              key={m.code}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: startDelay + 1.0 + i * 0.12,
              }}
            >
              <text
                x={left + 16}
                y={cy - 18}
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                letterSpacing="2"
                className={textColor}
                stroke="none"
              >
                {m.code}
              </text>
              <text
                x={left + 16}
                y={cy + 8}
                fontFamily="Inter Display, Inter, sans-serif"
                fontSize="32"
                fontWeight="800"
                letterSpacing="-0.5"
                className={textColor}
                stroke="none"
              >
                {m.label}
              </text>
            </motion.g>
          );
        })}

        {/* left dimension caps + label */}
        {showDimensions && (
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: startDelay + 1.4 }}
          >
            <line x1={36} y1={top} x2={36} y2={bottom} />
            <line x1={28} y1={top} x2={44} y2={top} />
            <line x1={28} y1={bottom} x2={44} y2={bottom} />
            <text
              x={26}
              y={(top + bottom) / 2}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              letterSpacing="2"
              className={textColor}
              stroke="none"
              transform={`rotate(-90, 26, ${(top + bottom) / 2})`}
            >
              {modules.length}.0x
            </text>
          </motion.g>
        )}

        {/* baseline tick row */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: startDelay + 1.5 }}
        >
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((p) => (
            <line
              key={p}
              x1={left + innerW * p}
              y1={bottom + 8}
              x2={left + innerW * p}
              y2={bottom + 14}
            />
          ))}
          <line x1={left} y1={bottom + 8} x2={right} y2={bottom + 8} />
        </motion.g>
      </svg>
    </div>
  );
}
