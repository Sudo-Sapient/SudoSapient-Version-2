import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigureWaving({
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
      strokeWidth={SW}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx={20} cy={6} r={HEAD_R} />
      {/* Spine */}
      <line x1={20} y1={12} x2={20} y2={32} />
      {/* Right arm — raised high, waving. The whole raised arm sways idly
          (pivot at the shoulder); the forearm is isolated in its own group so
          it can pivot about the elbow (28,8) for the interactive CTA wave. */}
      <g
        className="fig-anim anim-wave"
        style={{ transformBox: "view-box", transformOrigin: "20px 16px" }}
      >
        <line x1={20} y1={16} x2={28} y2={8} />
        <g data-wave-forearm>
          <line x1={28} y1={8} x2={32} y2={1} />
        </g>
      </g>
      {/* Left arm — relaxed at side */}
      <line x1={20} y1={16} x2={13} y2={25} />
      <line x1={13} y1={25} x2={11} y2={34} />
      {/* Left leg */}
      <line x1={20} y1={32} x2={16} y2={48} />
      <line x1={16} y1={48} x2={14} y2={63} />
      {/* Right leg */}
      <line x1={20} y1={32} x2={24} y2={48} />
      <line x1={24} y1={48} x2={26} y2={63} />
    </svg>
  );
}
