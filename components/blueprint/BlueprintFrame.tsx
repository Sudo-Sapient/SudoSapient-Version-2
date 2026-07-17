import * as React from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "./TechLabel";
import { CornerBrackets } from "./CornerBrackets";

type Props = {
  subject: string;
  type?: string;
  version?: string;
  date?: string;
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
};

/**
 * Architectural title block: SUBJECT / TYPE / VERSION / DATE in a header strip,
 * with corner brackets wrapping the content. Mirrors the metadata block on a real blueprint.
 */
export function BlueprintFrame({
  subject,
  type = "STUDIO",
  version = "V2.0",
  date = "2026",
  tone = "light",
  className,
  children,
}: Props) {
  const border = tone === "light" ? "border-white/40" : "border-ink/30";
  return (
    <div className={cn("relative", className)}>
      <div className={cn("grid grid-cols-2 border-b sm:grid-cols-4", border)}>
        <Field label="SUBJECT" value={subject} tone={tone} span={2} />
        <Field label="TYPE" value={type} tone={tone} />
        <Field label="VERSION" value={`${version} · ${date}`} tone={tone} />
      </div>
      <CornerBrackets tone={tone} className={cn("px-6 py-8 sm:px-10 sm:py-12")}>
        {children}
      </CornerBrackets>
    </div>
  );
}

function Field({
  label,
  value,
  tone,
  span = 1,
}: {
  label: string;
  value: string;
  tone: "light" | "dark";
  span?: 1 | 2;
}) {
  const border = tone === "light" ? "border-white/40" : "border-ink/30";
  const text = tone === "light" ? "text-white" : "text-ink";
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-r px-3 py-2 last:border-r-0",
        border,
        span === 2 && "col-span-2",
        "min-w-0"
      )}
    >
      <TechLabel tone={tone === "light" ? "light" : "dark"}>{label}</TechLabel>
      <span className={cn("break-words font-mono text-[11px] sm:text-[13px]", text)}>{value}</span>
    </div>
  );
}
