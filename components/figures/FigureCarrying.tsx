import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigureCarrying({
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
      {/* Block overhead */}
      <rect x={11} y={1} width={18} height={10} />

      {/* Head */}
      <circle cx={20} cy={18} r={HEAD_R} />
      {/* Spine */}
      <line x1={20} y1={24} x2={20} y2={44} />
      {/* Left arm — raised to carry block */}
      <line x1={20} y1={27} x2={15} y2={18} />
      <line x1={15} y1={18} x2={13} y2={11} />
      {/* Right arm — raised to carry block */}
      <line x1={20} y1={27} x2={25} y2={18} />
      <line x1={25} y1={18} x2={27} y2={11} />
      {/* Left leg — stride */}
      <line x1={20} y1={44} x2={15} y2={57} />
      <line x1={15} y1={57} x2={12} y2={68} />
      {/* Right leg — stride */}
      <line x1={20} y1={44} x2={25} y2={57} />
      <line x1={25} y1={57} x2={28} y2={68} />
    </svg>
  );
}
