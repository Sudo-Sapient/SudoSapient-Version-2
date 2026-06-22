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
      style={{ ...style, ["--flip-dur"]: "0.8s" } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Shared — block, head, spine, arms holding it up */}
      <rect x={11} y={1} width={18} height={10} />
      <circle cx={20} cy={18} r={HEAD_R} />
      <line x1={20} y1={24} x2={20} y2={44} />
      <line x1={20} y1={27} x2={15} y2={18} />
      <line x1={15} y1={18} x2={13} y2={11} />
      <line x1={20} y1={27} x2={25} y2={18} />
      <line x1={25} y1={18} x2={27} y2={11} />

      {/* Legs — Frame A: left leg forward */}
      <g className="flip-a">
        <line x1={20} y1={44} x2={24} y2={56} />
        <line x1={24} y1={56} x2={26} y2={67} />
        <line x1={20} y1={44} x2={16} y2={56} />
        <line x1={16} y1={56} x2={13} y2={67} />
      </g>
      {/* Legs — Frame B: right leg forward */}
      <g className="flip-b">
        <line x1={20} y1={44} x2={16} y2={56} />
        <line x1={16} y1={56} x2={13} y2={67} />
        <line x1={20} y1={44} x2={24} y2={56} />
        <line x1={24} y1={56} x2={26} y2={67} />
      </g>
    </svg>
  );
}
