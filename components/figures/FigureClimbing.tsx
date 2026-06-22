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
      style={{ ...style, ["--flip-dur"]: "0.85s" } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Ladder + shared head/spine */}
      <line x1={8} y1={0} x2={8} y2={68} />
      <line x1={6} y1={12} x2={10} y2={12} />
      <line x1={6} y1={24} x2={10} y2={24} />
      <line x1={6} y1={36} x2={10} y2={36} />
      <line x1={6} y1={48} x2={10} y2={48} />
      <line x1={6} y1={60} x2={10} y2={60} />
      <circle cx={24} cy={8} r={HEAD_R} />
      <line x1={23} y1={14} x2={20} y2={34} />

      {/* Frame A — left hand & right foot high */}
      <g className="flip-a">
        <line x1={23} y1={17} x2={16} y2={9} />
        <line x1={16} y1={9} x2={8} y2={6} />
        <line x1={22} y1={22} x2={16} y2={25} />
        <line x1={16} y1={25} x2={8} y2={24} />
        <line x1={20} y1={34} x2={24} y2={42} />
        <line x1={24} y1={42} x2={26} y2={52} />
        <line x1={20} y1={34} x2={13} y2={44} />
        <line x1={13} y1={44} x2={9} y2={36} />
      </g>
      {/* Frame B — right hand & left foot high (next pull) */}
      <g className="flip-b">
        <line x1={23} y1={18} x2={16} y2={22} />
        <line x1={16} y1={22} x2={8} y2={22} />
        <line x1={22} y1={16} x2={16} y2={9} />
        <line x1={16} y1={9} x2={8} y2={7} />
        <line x1={20} y1={34} x2={14} y2={42} />
        <line x1={14} y1={42} x2={9} y2={34} />
        <line x1={20} y1={34} x2={25} y2={46} />
        <line x1={25} y1={46} x2={27} y2={58} />
      </g>
    </svg>
  );
}
