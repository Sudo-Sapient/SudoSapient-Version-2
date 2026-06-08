import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

export function FigurePulling({
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
      {/* Head — leaning back */}
      <circle cx={27} cy={10} r={HEAD_R} />
      {/* Spine — angled backward ~30° */}
      <line x1={25} y1={16} x2={18} y2={34} />
      {/* Both arms extended forward gripping */}
      <line x1={23} y1={20} x2={13} y2={17} />
      <line x1={13} y1={17} x2={5}  y2={19} />
      <line x1={22} y1={24} x2={12} y2={22} />
      <line x1={12} y1={22} x2={5}  y2={24} />
      {/* Rope extends left — dashed */}
      <line
        x1={5} y1={21} x2={0} y2={22}
        strokeDasharray="2 1.5"
      />
      {/* Left leg — front leg planted firmly */}
      <line x1={18} y1={34} x2={10} y2={50} />
      <line x1={10} y1={50} x2={6}  y2={64} />
      {/* Right leg — back leg bracing */}
      <line x1={18} y1={34} x2={26} y2={48} />
      <line x1={26} y1={48} x2={30} y2={62} />
    </svg>
  );
}
