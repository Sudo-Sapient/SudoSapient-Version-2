import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigureThinking({
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
      {/* Thought bubbles */}
      <circle cx={30} cy={3}  r={1.2} fill={color} stroke="none" />
      <circle cx={33} cy={7}  r={1.8} fill={color} stroke="none" />
      <circle cx={35} cy={13} r={2.5} />

      {/* Head — slight right tilt */}
      <circle cx={20} cy={10} r={HEAD_R} />
      {/* Spine */}
      <line x1={20} y1={16} x2={20} y2={36} />
      {/* Right arm — elbow up, hand to chin */}
      <line x1={20} y1={19} x2={27} y2={15} />
      <line x1={27} y1={15} x2={24} y2={10} />
      {/* Left arm — supporting right elbow */}
      <line x1={20} y1={20} x2={14} y2={26} />
      <line x1={14} y1={26} x2={25} y2={18} />
      {/* Left leg */}
      <line x1={20} y1={36} x2={16} y2={50} />
      <line x1={16} y1={50} x2={14} y2={64} />
      {/* Right leg */}
      <line x1={20} y1={36} x2={24} y2={50} />
      <line x1={24} y1={50} x2={26} y2={64} />
    </svg>
  );
}
