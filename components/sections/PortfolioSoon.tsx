"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";

/** Section 2: the portfolio is being framed. A painter and his buddy hang the sign. */
export function PortfolioSoon() {
  return (
    <section className="bg-offwhite py-16 text-ink sm:py-24">
      <Container className="flex flex-col items-center text-center">
        <TechLabel tone="dark">Company portfolio</TechLabel>
        <h2 className="mt-4 max-w-2xl font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl">
          We&rsquo;re framing our best work.
        </h2>
        <RiveScene
          className="mt-8 w-full max-w-[560px]"
          src="/rive/portfolio.riv"
          animation="loop"
          frameClassName="aspect-[520/200] w-full"
          ariaLabel="A stickman with a long paint roller paints COMING SOON onto a frame, runs out of paint, gets a bucket from his friend, finishes it; the frame tilts and they straighten it and high-five."
          fallback={
            <p className="font-mono text-sm uppercase tracking-[0.16em] text-ink/60">Coming soon</p>
          }
        />
        <p className="mt-4 max-w-md text-lg text-ink/70">Case studies land soon.</p>
        <Link
          href="/contact"
          className="mt-5 inline-flex items-center gap-3 border-b border-ink/40 pb-1 font-mono text-[12px] uppercase tracking-[0.16em] transition-colors hover:border-blueprint hover:text-blueprint"
        >
          Talk to us meanwhile
        </Link>
      </Container>
    </section>
  );
}
