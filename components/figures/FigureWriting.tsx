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
      style={{ ...style, ["--flip-dur"]: "0.55s" } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Shared — head, spine, board-holding arm, board, writing upper arm, legs */}
      <circle cx={17} cy={9} r={HEAD_R} />
      <line x1={17} y1={14} x2={19} y2={35} />
      <line x1={18} y1={18} x2={12} y2={25} />
      <line x1={12} y1={25} x2={20} y2={29} />
      <polyline points="19,28 30,25 31,30 20,33 19,28" />
      <line x1={18} y1={18} x2={25} y2={24} />
      <line x1={19} y1={35} x2={15} y2={49} />
      <line x1={15} y1={49} x2={13} y2={63} />
      <line x1={19} y1={35} x2={24} y2={49} />
      <line x1={24} y1={49} x2={26} y2={63} />

      {/* Writing hand — Frame A: pen at the left of the board */}
      <g className="flip-a">
        <line x1={25} y1={24} x2={28} y2={28} />
        <line x1={28} y1={28} x2={29} y2={31} />
      </g>
      {/* Writing hand — Frame B: pen at the right of the board */}
      <g className="flip-b">
        <line x1={25} y1={24} x2={30} y2={27} />
        <line x1={30} y1={27} x2={32} y2={29} />
      </g>
    </svg>
  );
}
