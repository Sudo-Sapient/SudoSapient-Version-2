// Monoline glyphs for the footer's "Sudo Sapient." finale, drawn in the same stroke
// style as the stick figures. Each glyph is a list of strokes:
//   { pts }  open polyline; a vertex with `cubic` is smooth
//            (rotation = direction of travel in degrees, distance = handle length)
//   { ell }  [cx, cy, width, height] stroked ellipse
//   { dot }  [cx, cy, size, color] filled dot
// Baseline at y=0, x-height 20, cap height 30, each glyph centred on x=0.
import { AMBER, WHITE } from "./kit.mjs";

const c = (x, y, rotation, distance) => ({ x, y, cubic: { rotation, distance } });
export const GLYPHS = {
  S: [{ pts: [c(8.5, -25.5, -140, 9), c(0, -15, 35, 11), c(-8.5, -4.5, -140, 9)] }],
  u: [
    {
      pts: [{ x: -7, y: -20 }, c(-7, -7, 90, 4), c(0, 0, 0, 5), c(7, -7, -90, 4), { x: 7, y: -20 }],
    },
    {
      pts: [
        { x: 7, y: -20 },
        { x: 7, y: 0 },
      ],
    },
  ],
  d: [
    { ell: [-2.5, -10, 15, 20] },
    {
      pts: [
        { x: 5, y: -30 },
        { x: 5, y: 0 },
      ],
    },
  ],
  o: [{ ell: [0, -10, 18, 20] }],
  a: [
    { ell: [-2, -10, 15, 19] },
    {
      pts: [
        { x: 5.5, y: -20 },
        { x: 5.5, y: 0 },
      ],
    },
  ],
  p: [
    { ell: [2.5, -10, 15, 20] },
    {
      pts: [
        { x: -5, y: -20 },
        { x: -5, y: 10 },
      ],
    },
  ],
  i: [
    {
      pts: [
        { x: 0, y: -20 },
        { x: 0, y: 0 },
      ],
    },
    { dot: [0, -27, 5, WHITE] },
  ],
  e: [
    {
      pts: [
        { x: -8, y: -10 },
        { x: 8, y: -10 },
      ],
    },
    {
      pts: [
        c(8, -10, -90, 5),
        c(0, -20, 180, 5),
        c(-8, -10, 90, 5.5),
        c(0, 0, 0, 5),
        c(7, -3.5, -45, 2),
      ],
    },
  ],
  n: [
    {
      pts: [
        { x: -7, y: -20 },
        { x: -7, y: 0 },
      ],
    },
    { pts: [c(-7, -12, -80, 3), c(0, -20, 0, 5), c(7, -12, 90, 3), { x: 7, y: 0 }] },
  ],
  t: [
    { pts: [{ x: 0, y: -28 }, c(0, -5, 90, 3), { x: 5, y: 0 }] },
    {
      pts: [
        { x: -6, y: -19 },
        { x: 6, y: -19 },
      ],
    },
  ],
  ".": [{ dot: [0, -2.5, 6, AMBER] }],
};
