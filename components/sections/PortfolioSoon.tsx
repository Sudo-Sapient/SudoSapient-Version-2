"use client";

import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";

/**
 * The portfolio is being framed: a painter and his buddy hang the sign. Section 2 on
 * the home page, and the whole Work page (as its h1) until case studies are public.
 */
export function PortfolioSoon({ as: Heading = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section className="bg-offwhite py-16 text-ink sm:py-24">
      <Container className="flex flex-col items-center text-center">
        <TechLabel tone="dark">Our work</TechLabel>
        <Heading className="mt-4 max-w-2xl font-heading text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-6xl">
          Case studies are on the way.
        </Heading>
        <RiveScene
          className="mt-8 w-full max-w-[560px]"
          src="/rive/portfolio.riv"
          animation="loop"
          frameClassName="aspect-[520/200] w-full"
          ariaLabel="A stickman with a long paint roller paints COMING SOON onto a frame, runs out of paint, gets a bucket from his friend, finishes it; the frame tilts and they straighten it and high-five."
          fallback={<p className="text-sm font-medium text-ink/60">Coming soon</p>}
        />
        <p className="mt-4 max-w-md text-lg text-ink/70">
          We&rsquo;re writing up our client projects now. Until then, ask and we&rsquo;ll walk you
          through them.
        </p>
        <Link href="/contact" className={buttonVariants({ className: "mt-5" })}>
          Ask about our work
        </Link>
      </Container>
    </section>
  );
}
