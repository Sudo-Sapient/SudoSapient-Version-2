import * as React from "react";
import type { FigureProps } from "./rig";
import { ClimberPoseFigure } from "./ClimberStylePoses";

export function FigureSitting({
  size = 80,
  color = "currentColor",
  className,
  style,
}: FigureProps) {
  return (
    <ClimberPoseFigure pose="sit" size={size} color={color} className={className} style={style} />
  );
}
