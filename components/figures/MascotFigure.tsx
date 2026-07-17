"use client";

import * as React from "react";
import { ClimberPosePlayer } from "./ClimberPosePlayer";

type Mode = "idle" | "walk" | "reach";
type Props = {
  size?: number;
  color?: string;
  mode?: Mode;
  className?: string;
  style?: React.CSSProperties;
};

/** Team-card doorman rebuilt from the same bold poses as the ladder climber. */
export function MascotFigure({
  size = 42,
  color = "currentColor",
  mode = "idle",
  className,
  style,
}: Props) {
  const poses =
    mode === "walk"
      ? (["walkA", "walkB"] as const)
      : mode === "reach"
        ? (["reach", "pullA", "reach"] as const)
        : (["stand"] as const);
  return (
    <span className={className} style={{ width: size, color, ...style }}>
      <ClimberPosePlayer
        poses={[...poses]}
        durations={mode === "walk" ? [0.32, 0.32] : [0.38, 0.3, 0.38]}
        className="w-full"
      />
    </span>
  );
}
