export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public asset or hard-navigation URL for sub-path hosts. */
export function withBasePath(path: string) {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

/** One primary action, worded the same everywhere. */
export const CTA_LABEL = "Start your transformation";

/** The transformation journey (Audit, Pilot, Scale, Embed), shown on the Services page. */
export const STAGES = [
  { n: "01", title: "Audit", time: "2 weeks", body: "We walk your workflow before we touch it." },
  { n: "02", title: "Pilot", time: "2 weeks", body: "One fix, live, proven with your team." },
  {
    n: "03",
    title: "Scale",
    time: "3 to 6 weeks",
    body: "We roll out what works, one workflow at a time.",
  },
  {
    n: "04",
    title: "Embed",
    time: "Ongoing",
    body: "Your team learns to run it and it stays yours.",
  },
] as const;
