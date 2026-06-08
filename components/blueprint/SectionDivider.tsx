import * as React from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "./TechLabel";

type Props = {
  index: string;
  label: string;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Thin horizontal blueprint divider with a centered mono label and tick caps.
 * Visual: |─── SECTION_02 — WHAT WE BUILD ───|
 */
export function SectionDivider({
  index,
  label,
  tone = "light",
  className,
}: Props) {
  const lineColor = tone === "light" ? "bg-white/30" : "bg-ink/30";
  const tickColor = tone === "light" ? "bg-white/60" : "bg-ink/60";
  return (
    <div className={cn("flex w-full items-center gap-4", className)}>
      <span className={cn("h-3 w-px", tickColor)} />
      <div className={cn("h-px flex-1", lineColor)} />
      <TechLabel tone={tone} className="shrink-0">
        SECTION_{index} — {label}
      </TechLabel>
      <div className={cn("h-px flex-1", lineColor)} />
      <span className={cn("h-3 w-px", tickColor)} />
    </div>
  );
}
