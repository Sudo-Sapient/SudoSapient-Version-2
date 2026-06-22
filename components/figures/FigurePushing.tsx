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
      style={{ ...style, ["--flip-dur"]: "1.1s" } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Shared body — forward lean, planted legs */}
      <circle cx={12} cy={10} r={HEAD_R} />
      <line x1={14} y1={16} x2={22} y2={34} />
      <line x1={22} y1={34} x2={13} y2={50} />
      <line x1={13} y1={50} x2={8} y2={64} />
      <line x1={22} y1={34} x2={26} y2={48} />
      <line x1={26} y1={48} x2={30} y2={62} />

      {/* Arms — Frame A: wound up, hands drawn back */}
      <g className="flip-a">
        <line x1={16} y1={21} x2={24} y2={20} />
        <line x1={24} y1={20} x2={30} y2={22} />
        <line x1={17} y1={25} x2={25} y2={24} />
        <line x1={25} y1={24} x2={30} y2={26} />
        <line x1={30} y1={22} x2={30} y2={26} />
      </g>
      {/* Arms — Frame B: shove, hands extended to the wall */}
      <g className="flip-b">
        <line x1={16} y1={21} x2={28} y2={18} />
        <line x1={28} y1={18} x2={36} y2={20} />
        <line x1={17} y1={25} x2={29} y2={23} />
        <line x1={29} y1={23} x2={36} y2={25} />
        <line x1={36} y1={20} x2={36} y2={25} />
      </g>
    </svg>
  );
}
