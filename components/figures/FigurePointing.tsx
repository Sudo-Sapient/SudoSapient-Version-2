import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigurePointing({
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
      style={{ ...style, ["--flip-dur"]: "2.6s" } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Shared body */}
      <circle cx={18} cy={6} r={HEAD_R} />
      <line x1={18} y1={12} x2={19} y2={32} />
      {/* Left arm at side */}
      <line x1={18} y1={16} x2={12} y2={24} />
      <line x1={12} y1={24} x2={10} y2={33} />
      {/* Legs */}
      <line x1={19} y1={32} x2={14} y2={48} />
      <line x1={14} y1={48} x2={12} y2={63} />
      <line x1={19} y1={32} x2={23} y2={47} />
      <line x1={23} y1={47} x2={25} y2={62} />

      {/* Right arm — Frame A: resting at side */}
      <g className="flip-a">
        <line x1={18} y1={16} x2={23} y2={26} />
        <line x1={23} y1={26} x2={25} y2={35} />
      </g>
      {/* Right arm — Frame B: snapped out, pointing forward */}
      <g className="flip-b">
        <line x1={18} y1={16} x2={27} y2={12} />
        <line x1={27} y1={12} x2={37} y2={8} />
      </g>
    </svg>
  );
}
