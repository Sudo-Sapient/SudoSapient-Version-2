import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, VW, VH } from "./rig";

export function FigureClimbing({
  size = 80,
  color = "currentColor",
  className,
  style,
}: FigureProps) {
  const h = size * (VH / VW);
  return (
    <svg
      width={size}
      height={h}
      viewBox={`0 0 ${VW} ${VH}`}
      fill="none"
      stroke={color}
      strokeWidth={2.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ ...style, ["--flip-dur"]: "0.85s" } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Ladder */}
      <line x1={7} y1={0} x2={7} y2={68} />
      <line x1={13} y1={0} x2={13} y2={68} />
      <line x1={7} y1={11} x2={13} y2={11} />
      <line x1={7} y1={23} x2={13} y2={23} />
      <line x1={7} y1={35} x2={13} y2={35} />
      <line x1={7} y1={47} x2={13} y2={47} />
      <line x1={7} y1={59} x2={13} y2={59} />

      {/* Frame A — left hand high on a rung, right leg driving up (bent joints). */}
      <g className="flip-a">
        <circle cx={24} cy={9} r={HEAD_R} />
        <path d="M24 14 22 35" />
        <path d="M23 18 16 12 10 12" />
        <path d="M23 20 27 27 22 32" />
        <path d="M22 35 25 45 20 47" />
        <path d="M22 35 16 42 18 54" />
      </g>
      {/* Frame B — right hand reaches the next rung, left leg drives up. */}
      <g className="flip-b">
        <circle cx={23} cy={8} r={HEAD_R} />
        <path d="M23 13 22 34" />
        <path d="M23 17 27 11 32 11" />
        <path d="M22 19 15 25 20 30" />
        <path d="M22 34 27 44 20 46" />
        <path d="M22 34 15 41 17 53" />
      </g>
    </svg>
  );
}
