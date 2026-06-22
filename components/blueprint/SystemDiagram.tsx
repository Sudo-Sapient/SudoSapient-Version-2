"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type DiagramNode = {
  id: string;
  x: number; // 0–100 (% of width)
  y: number; // 0–100 (% of height)
  label: string; // "DATA"
  shape?: "rect" | "circle";
  width?: number; // for rect, in viewbox units
  height?: number;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

type Props = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  tone?: "light" | "dark";
  className?: string;
  startDelay?: number;
  viewBoxW?: number;
  viewBoxH?: number;
  /** Optional title rendered top-left, mono. */
  title?: string;
};

/**
 * Generic node-and-edge system diagram. Use to show architecture in case studies,
 * service pages, and project thumbnails. Lines draw first, then nodes fade in.
 */
export function SystemDiagram({
  nodes,
  edges,
  tone = "light",
  className,
  startDelay = 0,
  viewBoxW = 400,
  viewBoxH = 240,
  title,
}: Props) {
  const stroke = tone === "light" ? "#FFFFFF" : "#0F172A";
  const textColor = tone === "light" ? "fill-white" : "fill-ink";

  const nodeMap = React.useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
        className="h-auto w-full"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="System diagram"
      >
        {/* faint outer frame */}
        <rect
          x="0.5"
          y="0.5"
          width={viewBoxW - 1}
          height={viewBoxH - 1}
          opacity="0.25"
        />

        {title && (
          <text
            x={12}
            y={20}
            style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
            fontSize="10"
            letterSpacing="2"
            className={textColor}
            stroke="none"
          >
            {title}
          </text>
        )}

        {/* Edges */}
        {edges.map((e, i) => {
          const a = nodeMap[e.from];
          const b = nodeMap[e.to];
          if (!a || !b) return null;
          const x1 = (a.x * viewBoxW) / 100;
          const y1 = (a.y * viewBoxH) / 100;
          const x2 = (b.x * viewBoxW) / 100;
          const y2 = (b.y * viewBoxH) / 100;
          const cx = (x1 + x2) / 2;
          const cy = (y1 + y2) / 2;
          return (
            <motion.g
              key={`e-${i}`}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: startDelay + i * 0.06,
              }}
            >
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
              {e.label && (
                <text
                  x={cx}
                  y={cy - 4}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
                  fontSize="9"
                  letterSpacing="1.5"
                  className={textColor}
                  stroke="none"
                  opacity="0.75"
                >
                  {e.label}
                </text>
              )}
            </motion.g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const cx = (n.x * viewBoxW) / 100;
          const cy = (n.y * viewBoxH) / 100;
          const w = n.width ?? 80;
          const h = n.height ?? 32;
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.4,
                delay: startDelay + 0.6 + i * 0.08,
              }}
            >
              {n.shape === "circle" ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={20}
                  fill={tone === "light" ? "#1E40AF" : "#FAFAFA"}
                />
              ) : (
                <rect
                  x={cx - w / 2}
                  y={cy - h / 2}
                  width={w}
                  height={h}
                  fill={tone === "light" ? "#1E40AF" : "#FAFAFA"}
                />
              )}
              {n.shape === "circle" ? (
                <circle cx={cx} cy={cy} r={20} />
              ) : (
                <rect
                  x={cx - w / 2}
                  y={cy - h / 2}
                  width={w}
                  height={h}
                />
              )}
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
                fontSize="10"
                fontWeight="600"
                letterSpacing="1.5"
                className={textColor}
                stroke="none"
              >
                {n.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
