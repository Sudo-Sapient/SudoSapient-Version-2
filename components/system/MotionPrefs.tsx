"use client";

import { MotionConfig } from "framer-motion";

/** Makes every framer-motion animation honour the OS reduced-motion setting. */
export function MotionPrefs({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
