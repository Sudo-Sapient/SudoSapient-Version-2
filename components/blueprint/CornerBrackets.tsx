import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "light" | "dark";
  size?: number;
  children: React.ReactNode;
};

export function CornerBrackets({
  tone = "light",
  size = 14,
  className,
  children,
  ...props
}: Props) {
  const stroke = tone === "light" ? "stroke-white" : "stroke-ink";
  return (
    <div className={cn("relative", className)} {...props}>
      {/* TL */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        className={cn("absolute -left-1 -top-1", stroke)}
        aria-hidden
      >
        <polyline
          points="0,14 0,0 14,0"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
        />
      </svg>
      {/* TR */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        className={cn("absolute -right-1 -top-1", stroke)}
        aria-hidden
      >
        <polyline
          points="0,0 14,0 14,14"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
        />
      </svg>
      {/* BL */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        className={cn("absolute -bottom-1 -left-1", stroke)}
        aria-hidden
      >
        <polyline
          points="0,0 0,14 14,14"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
        />
      </svg>
      {/* BR */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        className={cn("absolute -bottom-1 -right-1", stroke)}
        aria-hidden
      >
        <polyline
          points="0,14 14,14 14,0"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
        />
      </svg>
      {children}
    </div>
  );
}
