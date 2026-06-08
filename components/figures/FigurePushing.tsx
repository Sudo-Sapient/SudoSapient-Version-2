import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigurePushing({
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
      {/* Head — forward lean, lower than neutral */}
      <circle cx={12} cy={10} r={HEAD_R} />
      {/* Spine — angled forward ~35° */}
      <line x1={14} y1={16} x2={22} y2={34} />
      {/* Left arm — both arms extended forward, pushing */}
      <line x1={16} y1={21} x2={28} y2={18} />
      <line x1={28} y1={18} x2={36} y2={20} />
      {/* Right arm */}
      <line x1={17} y1={25} x2={29} y2={23} />
      <line x1={29} y1={23} x2={36} y2={25} />
      {/* Push contact — hands meet wall */}
      <line x1={36} y1={20} x2={36} y2={25} />
      {/* Left leg — back leg extended for leverage */}
      <line x1={22} y1={34} x2={13} y2={50} />
      <line x1={13} y1={50} x2={8}  y2={64} />
      {/* Right leg — front leg, bent forward */}
      <line x1={22} y1={34} x2={26} y2={48} />
      <line x1={26} y1={48} x2={30} y2={62} />
    </svg>
  );
}
