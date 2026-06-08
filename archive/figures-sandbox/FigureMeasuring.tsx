import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigureMeasuring({
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
      {/* Ruler — vertical, left side */}
      <line x1={8} y1={2} x2={8} y2={52} />
      {/* Ruler ticks */}
      <line x1={6} y1={8}  x2={10} y2={8}  />
      <line x1={6} y1={16} x2={10} y2={16} />
      <line x1={6} y1={24} x2={10} y2={24} />
      <line x1={6} y1={32} x2={10} y2={32} />
      <line x1={6} y1={40} x2={10} y2={40} />
      <line x1={6} y1={48} x2={10} y2={48} />

      {/* Head — looking up-left toward ruler */}
      <circle cx={22} cy={8} r={HEAD_R} />
      {/* Spine */}
      <line x1={22} y1={14} x2={22} y2={34} />
      {/* Left arm — raised, hand gripping ruler top */}
      <line x1={22} y1={17} x2={16} y2={10} />
      <line x1={16} y1={10} x2={8}  y2={5}  />
      {/* Right arm — relaxed down */}
      <line x1={22} y1={17} x2={28} y2={26} />
      <line x1={28} y1={26} x2={30} y2={34} />
      {/* Left leg */}
      <line x1={22} y1={34} x2={18} y2={50} />
      <line x1={18} y1={50} x2={16} y2={64} />
      {/* Right leg */}
      <line x1={22} y1={34} x2={26} y2={50} />
      <line x1={26} y1={50} x2={28} y2={64} />
    </svg>
  );
}
