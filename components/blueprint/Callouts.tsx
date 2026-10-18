"use client";

import * as React from "react";
import { motion } from "framer-motion";

export type Callout = {
  /** Point on the image the leader line starts from, in % of width/height. */
  at: [number, number];
  /** Where the label sits, in % of width/height. */
  label: [number, number];
  text: string;
};

/**
 * Drafting-style annotations over a screenshot: an amber dot on the real part of
 * the product, a leader line, and a label. Each callout fades in, in turn, when scrolled into view.
 */
export function Callouts({ items }: { items: Callout[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {items.map((c, i) => (
          <motion.path
            key={c.text}
            d={`M${c.at[0]} ${c.at[1]} L${c.label[0]} ${c.label[1]}`}
            stroke="#FBBF24"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            fill="none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
      {items.map((c, i) => (
        // Positioning wrappers stay static: framer-motion owns `transform` on its spans.
        <React.Fragment key={c.text}>
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.at[0]}%`, top: `${c.at[1]}%` }}
          >
            <motion.span
              className="block h-2.5 w-2.5 rounded-full border-2 border-white bg-warn"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.25 }}
            />
          </span>
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.label[0]}%`, top: `${c.label[1]}%` }}
          >
            <motion.span
              className="block whitespace-nowrap border border-warn bg-ink/90 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white"
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: 0.75 + i * 0.25 }}
            >
              {c.text}
            </motion.span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
