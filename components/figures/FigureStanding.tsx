import * as React from "react";
import type { FigureProps } from "./rig";
import { ClimberPoseFigure } from "./ClimberStylePoses";

export function FigureStanding({
  size = 80,
  color = "currentColor",
  className,
  style,
}: FigureProps) {
  return (
    <ClimberPoseFigure pose="stand" size={size} color={color} className={className} style={style} />
  );
}
