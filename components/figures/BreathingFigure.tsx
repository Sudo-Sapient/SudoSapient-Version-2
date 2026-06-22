import * as React from "react";
import { Shootable } from "@/components/interactive/Shootable";

type Props = {
  children: React.ReactNode;
  /** Kept for call-site compatibility; no longer used. */
  index?: number;
  startDelay?: number;
  className?: string;
};

/**
 * Wrapper around a figure. Figures animate themselves now (flipbook/walk), so
 * this no longer "breathes" — instead it makes the figure a shootable target
 * for the cursor easter egg (see Shootable). Kept under this name to preserve
 * the wrapper/className the scenes already rely on for sizing.
 */
export function BreathingFigure({ children, className }: Props) {
  return <Shootable className={className}>{children}</Shootable>;
}
