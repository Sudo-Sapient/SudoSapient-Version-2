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
      {/* Head — gently ponders side to side */}
      <g
        className="fig-anim anim-tilt"
        style={{ transformBox: "view-box", transformOrigin: "20px 19px" }}
      >
        <circle cx={20} cy={14} r={HEAD_R} />
      </g>
      {/* Spine — seated upright */}
      <line x1={20} y1={19} x2={20} y2={38} />
      {/* Arms — hands resting on knees */}
      <line x1={20} y1={23} x2={13} y2={31} />
      <line x1={13} y1={31} x2={16} y2={40} />
      <line x1={20} y1={23} x2={27} y2={31} />
      <line x1={27} y1={31} x2={24} y2={40} />
      {/* Cross-legged — clean "W", shins meet at centre (no skirt) */}
      <line x1={20} y1={40} x2={10} y2={48} />
      <line x1={10} y1={48} x2={20} y2={50} />
      <line x1={20} y1={40} x2={30} y2={48} />
      <line x1={30} y1={48} x2={20} y2={50} />
      {/* Ground line */}
      <line
        x1={6} y1={52} x2={34} y2={52}
        strokeDasharray="2 2"
        strokeWidth={0.8}
        opacity={0.5}
      />
    </svg>
  );
}
