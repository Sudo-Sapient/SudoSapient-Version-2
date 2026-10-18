export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public asset or hard-navigation URL for sub-path hosts. */
export function withBasePath(path: string) {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

/** One primary action, worded the same everywhere. */
export const CTA_LABEL = "Start your transformation";

/** The transformation journey. Process cards and ProcessScene both render from this. */
export const STAGES = [
  {
    n: "01",
    title: "Audit",
    time: "1 week",
    body: "We sit with your teams, map how work actually flows, and find where AI pays back first.",
  },
  {
    n: "02",
    title: "Pilot",
    time: "2 weeks",
    body: "One working system on your real data, in front of real users—not a clickable theatre demo.",
  },
  {
    n: "03",
    title: "Scale",
    time: "3–6 weeks",
    body: "We roll it across operations, product, and content with evals, guardrails, and telemetry.",
  },
  {
    n: "04",
    title: "Embed",
    time: "Ongoing",
    body: "Your people learn to run, extend, and own it. AI becomes how the company works, not a project.",
  },
] as const;
