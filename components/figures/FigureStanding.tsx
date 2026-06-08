import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigureStanding({
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
      {/* Left arm */}
      <line x1={20} y1={15} x2={14} y2={24} />
      <line x1={14} y1={24} x2={12} y2={33} />
      {/* Right arm */}
      <line x1={20} y1={15} x2={26} y2={24} />
      <line x1={26} y1={24} x2={28} y2={33} />
      {/* Left leg */}
      <line x1={20} y1={32} x2={16} y2={48} />
      <line x1={16} y1={48} x2={14} y2={63} />
      {/* Right leg */}
      <line x1={20} y1={32} x2={24} y2={48} />
      <line x1={24} y1={48} x2={26} y2={63} />
    </svg>
  );
}
