import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "blue" | "deep" | "paper";
};

export function GridBackground({ className, variant = "blue", ...props }: Props) {
  const variantClass =
    variant === "deep" ? "blueprint-paper-deep" : variant === "paper" ? "" : "blueprint-paper";
  const overlayPaper =
    variant === "paper"
      ? "[background-image:radial-gradient(circle,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:24px_24px]"
      : "";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-0",
        variantClass,
        overlayPaper,
        className
      )}
      {...props}
    />
  );
}
