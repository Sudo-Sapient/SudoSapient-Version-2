import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  as?: "span" | "div" | "p";
  underline?: boolean;
  tone?: "light" | "dark" | "warn";
  children: React.ReactNode;
};

export function TechLabel({
  as: Tag = "span",
  underline = false,
  tone = "light",
  className,
  children,
  ...props
}: Props) {
  const toneClass =
    tone === "light" ? "text-white/80" : tone === "warn" ? "text-warn" : "text-blueprint";
  return (
    <Tag
      className={cn(
        "text-sm font-semibold",
        toneClass,
        underline && "tick-underline inline-block",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
