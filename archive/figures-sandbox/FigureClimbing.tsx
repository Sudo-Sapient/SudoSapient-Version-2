import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

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
      strokeWidth={SW}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Ladder rails — left side */}
      <line x1={8} y1={0}  x2={8}  y2={68} />
      {/* Ladder rungs */}
      <line x1={6} y1={12} x2={10} y2={12} />
      <line x1={6} y1={24} x2={10} y2={24} />
      <line x1={6} y1={36} x2={10} y2={36} />
      <line x1={6} y1={48} x2={10} y2={48} />
      <line x1={6} y1={60} x2={10} y2={60} />

      {/* Head — looking up */}
      <circle cx={24} cy={8} r={HEAD_R} />
      {/* Spine — slight lean toward ladder */}
      <line x1={23} y1={14} x2={20} y2={34} />
      {/* Left arm — reaching HIGH up to grip */}
      <line x1={23} y1={17} x2={16} y2={9} />
      <line x1={16} y1={9}  x2={8}  y2={6} />
      {/* Right arm — lower grip */}
      <line x1={22} y1={22} x2={16} y2={25} />
      <line x1={16} y1={25} x2={8}  y2={24} />
      {/* Left leg — high step */}
      <line x1={20} y1={34} x2={14} y2={42} />
      <line x1={14} y1={42} x2={8}  y2={36} />
      {/* Right leg — lower, pushing up */}
      <line x1={20} y1={34} x2={26} y2={48} />
      <line x1={26} y1={48} x2={28} y2={62} />
    </svg>
  );
}
