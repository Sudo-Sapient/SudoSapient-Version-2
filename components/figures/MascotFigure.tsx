import * as React from "react";
import { HEAD_R, SW, VW, VH } from "./rig";

type Mode = "idle" | "walk" | "reach";

type Props = {
  size?: number;
  color?: string;
  mode?: Mode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * The team "doorman" — a roaming stick figure that walks the team row and pulls
 * a card open. Shares the 40×70 rig and the existing walk-* cycle classes.
 *   idle  — standing, arms down
 *   walk  — legs scissor + arms swing (driven by .walk-* keyframes)
 *   reach — both arms up, pulling the lid open
 */
export function MascotFigure({
  size = 42,
  color = "currentColor",
  mode = "idle",
  className,
  style,
}: Props) {
  const h = size * (VH / VW);
  const shoulderY = 16;
  const hipY = 38;
  const kneeY = 52;
  const footY = 66;

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
      <circle cx={20} cy={8} r={HEAD_R} />
      <line x1={20} y1={13} x2={20} y2={hipY} />

      {/* Arms */}
      {mode === "walk" ? (
        <>
          <g className="walk-arm-a" style={{ transformOrigin: `20px ${shoulderY}px` }}>
            <line x1={20} y1={shoulderY} x2={17} y2={27} />
            <line x1={17} y1={27} x2={16} y2={37} />
          </g>
          <g className="walk-arm-b" style={{ transformOrigin: `20px ${shoulderY}px` }}>
            <line x1={20} y1={shoulderY} x2={23} y2={27} />
            <line x1={23} y1={27} x2={24} y2={37} />
          </g>
        </>
      ) : mode === "reach" ? (
        <>
          <line x1={20} y1={shoulderY} x2={15} y2={9} />
          <line x1={15} y1={9} x2={12} y2={3} />
          <line x1={20} y1={shoulderY} x2={25} y2={9} />
          <line x1={25} y1={9} x2={28} y2={3} />
        </>
      ) : (
        <>
          <line x1={20} y1={shoulderY} x2={17} y2={27} />
          <line x1={17} y1={27} x2={16} y2={36} />
          <line x1={20} y1={shoulderY} x2={23} y2={27} />
          <line x1={23} y1={27} x2={24} y2={36} />
        </>
      )}

      {/* Legs */}
      {mode === "walk" ? (
        <>
          <g className="walk-leg-a" style={{ transformOrigin: `20px ${hipY}px` }}>
            <line x1={20} y1={hipY} x2={18} y2={kneeY} />
            <line x1={18} y1={kneeY} x2={17} y2={footY} />
          </g>
          <g className="walk-leg-b" style={{ transformOrigin: `20px ${hipY}px` }}>
            <line x1={20} y1={hipY} x2={22} y2={kneeY} />
            <line x1={22} y1={kneeY} x2={23} y2={footY} />
          </g>
        </>
      ) : (
        <>
          <line x1={20} y1={hipY} x2={18} y2={kneeY} />
          <line x1={18} y1={kneeY} x2={17} y2={footY} />
          <line x1={20} y1={hipY} x2={22} y2={kneeY} />
          <line x1={22} y1={kneeY} x2={23} y2={footY} />
        </>
      )}
    </svg>
  );
}
