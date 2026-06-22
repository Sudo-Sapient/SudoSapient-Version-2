import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

/**
 * Hands-up surrender pose — shown by any <Shootable> figure when the crosshair
 * locks onto it. Same 40×70 rig as every other figure, so it overlays them 1:1.
 */
export function FigureSurrender({
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
      {/* Head */}
      <circle cx={20} cy={8} r={HEAD_R} />
      {/* Spine */}
      <line x1={20} y1={13} x2={20} y2={40} />
      {/* Both arms thrown up */}
      <line x1={20} y1={16} x2={14} y2={8} />
      <line x1={14} y1={8} x2={13} y2={1} />
      <line x1={20} y1={16} x2={26} y2={8} />
      <line x1={26} y1={8} x2={27} y2={1} />
      {/* Legs */}
      <line x1={20} y1={40} x2={16} y2={54} />
      <line x1={16} y1={54} x2={14} y2={66} />
      <line x1={20} y1={40} x2={24} y2={54} />
      <line x1={24} y1={54} x2={26} y2={66} />
    </svg>
  );
}
