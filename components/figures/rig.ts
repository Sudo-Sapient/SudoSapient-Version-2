export interface FigureProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface Joint {
  x: number;
  y: number;
}

// All figures are drawn on a 40×70 viewBox (width × height).
// CX = 20 is the horizontal centerline.
// HEAD_R = 5px, STROKE = 2.35px — matches the bold ladder-climber language.
// Body segment lengths (in viewBox units):
//   head radius : 5.5
//   neck→hip    : ~17
//   upper arm   : ~9
//   forearm     : ~8
//   upper leg   : ~13
//   lower leg   : ~14
// Poses are defined by placing joints; lines are drawn between them.

export const HEAD_R = 5;
export const SW = 2.35;
export const VW = 40; // viewBox width
export const VH = 70; // viewBox height
