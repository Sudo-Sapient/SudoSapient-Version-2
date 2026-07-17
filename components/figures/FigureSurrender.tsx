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
      {/* Head + spine */}
      <circle cx={20} cy={8} r={HEAD_R} />
      <path d="M20 13v27" />
      {/* Both arms thrown up, elbows bent (hands open above the head). */}
      <path d="M20 17 13 13 11 5" />
      <path d="M20 17 27 13 29 5" />
      {/* Legs with a knee bend and small foot bases. */}
      <path d="M20 40 16 52 14 65M12 65h4" />
      <path d="M20 40 24 52 26 65M24 65h4" />
    </svg>
  );
}
