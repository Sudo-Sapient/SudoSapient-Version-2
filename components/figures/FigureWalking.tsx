import * as React from "react";
import type { FigureProps } from "./rig";
import { HEAD_R, SW, VW, VH } from "./rig";

type Props = FigureProps & {
  /** Carry a beam overhead (arms raised, no arm swing) while walking. */
  carrying?: boolean;
};

/**
 * A stick figure mid-stride: legs scissor about the hips and arms swing about
 * the shoulders (opposite phase) via the walk-* CSS classes. Pair it with a
 * `.walk-pace` parent to make it actually travel across the scene. With
 * `carrying`, the arms hold a beam overhead instead of swinging.
 */
export function FigureWalking({
  size = 80,
  color = "currentColor",
  className,
  style,
  carrying = false,
}: Props) {
  const h = size * (VH / VW);
  const headCy = carrying ? 18 : 8;
  const neckTop = carrying ? 23 : 13;
  const shoulderY = carrying ? 27 : 16;
  const hipY = carrying ? 46 : 38;
  const footY = 66;
  const kneeY = (hipY + footY) / 2;

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
      {/* Beam carried overhead */}
      {carrying && <rect x={11} y={1} width={18} height={10} />}

      {/* Head + spine */}
      <circle cx={20} cy={headCy} r={HEAD_R} />
      <line x1={20} y1={neckTop} x2={20} y2={hipY} />

      {/* Arms */}
      {carrying ? (
        <>
          <line x1={20} y1={shoulderY} x2={15} y2={18} />
          <line x1={15} y1={18} x2={13} y2={11} />
          <line x1={20} y1={shoulderY} x2={25} y2={18} />
          <line x1={25} y1={18} x2={27} y2={11} />
        </>
      ) : (
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
      )}

      {/* Legs — scissor about the hip */}
      <g className="walk-leg-a" style={{ transformOrigin: `20px ${hipY}px` }}>
        <line x1={20} y1={hipY} x2={18} y2={kneeY} />
        <line x1={18} y1={kneeY} x2={17} y2={footY} />
      </g>
      <g className="walk-leg-b" style={{ transformOrigin: `20px ${hipY}px` }}>
        <line x1={20} y1={hipY} x2={22} y2={kneeY} />
        <line x1={22} y1={kneeY} x2={23} y2={footY} />
      </g>
    </svg>
  );
}
