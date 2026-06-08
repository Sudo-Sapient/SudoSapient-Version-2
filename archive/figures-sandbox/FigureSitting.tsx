import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigureSitting({
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
      <circle cx={20} cy={14} r={HEAD_R} />
      {/* Spine — seated upright */}
      <line x1={20} y1={20} x2={20} y2={40} />
      {/* Left arm — elbow on knee, hand near chin */}
      <line x1={20} y1={24} x2={14} y2={32} />
      <line x1={14} y1={32} x2={18} y2={20} />
      {/* Right arm — resting on right knee */}
      <line x1={20} y1={24} x2={27} y2={33} />
      <line x1={27} y1={33} x2={30} y2={42} />
      {/* Hip — seated */}
      <line x1={14} y1={40} x2={26} y2={40} />
      {/* Left leg — folded cross */}
      <line x1={14} y1={40} x2={7}  y2={52} />
      <line x1={7}  y1={52} x2={24} y2={58} />
      {/* Right leg — folded over */}
      <line x1={26} y1={40} x2={33} y2={52} />
      <line x1={33} y1={52} x2={16} y2={58} />
      {/* Ground line */}
      <line
        x1={5} y1={60} x2={35} y2={60}
        strokeDasharray="2 2"
        strokeWidth={0.8}
        opacity={0.5}
      />
    </svg>
  );
}
