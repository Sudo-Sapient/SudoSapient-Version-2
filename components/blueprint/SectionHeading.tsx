import * as React from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "./TechLabel";
import { DimensionLine } from "./DimensionLine";

type Props = {
  index: string; // "01", "02", ...
  eyebrow: string; // "WHAT WE BUILD"
  title: string;
  description?: string;
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  tone = "light",
  className,
}: Props) {
  const titleColor = tone === "light" ? "text-white" : "text-ink";
  const descColor = tone === "light" ? "text-white/70" : "text-ink/70";
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center gap-4">
        <TechLabel tone={tone}>SECTION_{index}</TechLabel>
        <div className="hidden flex-1 sm:block">
          <DimensionLine label={eyebrow} tone={tone} />
        </div>
        <TechLabel tone={tone} className="sm:hidden">
          {eyebrow}
        </TechLabel>
      </div>
      <h2
        className={cn(
          "max-w-4xl font-display text-4xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-5xl md:text-6xl",
          titleColor
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("max-w-2xl text-lg leading-relaxed", descColor)}>
          {description}
        </p>
      )}
    </div>
  );
}
