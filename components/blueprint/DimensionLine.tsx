import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  orientation?: "horizontal" | "vertical";
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Blueprint dimension notation: end caps with tick marks, a center label.
 * Inline, scales to its container. Use inside a flex row/column.
 */
export function DimensionLine({
  label = "1.0x",
  orientation = "horizontal",
  tone = "light",
  className,
}: Props) {
  const stroke = tone === "light" ? "#FFFFFF" : "#0F172A";
  const text = tone === "light" ? "text-white/85" : "text-ink/80";

  if (orientation === "vertical") {
    return (
      <div className={cn("flex h-full flex-col items-center", className)}>
        <svg
          viewBox="0 0 12 8"
          width="12"
          height="8"
          aria-hidden
          className="shrink-0"
        >
          <line x1="0" y1="4" x2="12" y2="4" stroke={stroke} strokeWidth="1" />
          <line x1="6" y1="0" x2="6" y2="8" stroke={stroke} strokeWidth="1" />
        </svg>
        <div className="relative flex flex-1 items-center">
          <div
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
            style={{ background: stroke }}
          />
          <span
            className={cn(
              "relative z-10 -rotate-90 font-mono text-[10px] uppercase tracking-[0.18em]",
              text
            )}
          >
            {label}
          </span>
        </div>
        <svg
          viewBox="0 0 12 8"
          width="12"
          height="8"
          aria-hidden
          className="shrink-0"
        >
          <line x1="0" y1="4" x2="12" y2="4" stroke={stroke} strokeWidth="1" />
          <line x1="6" y1="0" x2="6" y2="8" stroke={stroke} strokeWidth="1" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      <svg
        viewBox="0 0 8 12"
        width="8"
        height="12"
        aria-hidden
        className="shrink-0"
      >
        <line x1="4" y1="0" x2="4" y2="12" stroke={stroke} strokeWidth="1" />
        <line x1="0" y1="6" x2="8" y2="6" stroke={stroke} strokeWidth="1" />
      </svg>
      <div className="relative flex flex-1 items-center">
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{ background: stroke }}
        />
      </div>
      <span
        className={cn(
          "relative z-10 shrink-0 bg-current px-2 font-mono text-[10px] uppercase tracking-[0.18em]",
          text
        )}
        style={{
          backgroundColor: "transparent",
        }}
      >
        {label}
      </span>
      <div className="relative flex flex-1 items-center">
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{ background: stroke }}
        />
      </div>
      <svg
        viewBox="0 0 8 12"
        width="8"
        height="12"
        aria-hidden
        className="shrink-0"
      >
        <line x1="4" y1="0" x2="4" y2="12" stroke={stroke} strokeWidth="1" />
        <line x1="0" y1="6" x2="8" y2="6" stroke={stroke} strokeWidth="1" />
      </svg>
    </div>
  );
}
