import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigureWriting({
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
      {/* Head — bent forward looking at work */}
      <circle cx={14} cy={12} r={HEAD_R} />
      {/* Spine — bent forward */}
      <line x1={16} y1={18} x2={22} y2={36} />
      {/* Right arm — extended writing on ground */}
      <line x1={19} y1={24} x2={28} y2={34} />
      <line x1={28} y1={34} x2={34} y2={46} />
      {/* Pen tip */}
      <line x1={34} y1={46} x2={37} y2={49} />
      {/* Left arm — propping body */}
      <line x1={17} y1={22} x2={12} y2={34} />
      <line x1={12} y1={34} x2={14} y2={46} />
      {/* Left leg — kneeling */}
      <line x1={22} y1={36} x2={14} y2={50} />
      <line x1={14} y1={50} x2={14} y2={60} />
      {/* Right leg — kneeling, knee on ground */}
      <line x1={22} y1={36} x2={30} y2={46} />
      <line x1={30} y1={46} x2={28} y2={58} />
      {/* Pen marks on ground */}
      <line x1={30} y1={52} x2={38} y2={52} />
      <line x1={28} y1={56} x2={36} y2={56} />
      {/* Ground line */}
      <line
        x1={6}  y1={61} x2={38} y2={61}
        strokeDasharray="1.5 1.5"
        strokeWidth={0.8}
        opacity={0.45}
      />
    </svg>
  );
}
