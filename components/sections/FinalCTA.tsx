"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { Button } from "@/components/ui/Button";
import { FinalCtaScene } from "@/components/scenes/FinalCtaScene";
import { AnimatedText } from "@/components/motion/AnimatedText";

export function FinalCTA() {
  const [waving, setWaving] = React.useState(false);
  const wave = {
    onMouseEnter: () => setWaving(true),
    onMouseLeave: () => setWaving(false),
    onFocus: () => setWaving(true),
    onBlur: () => setWaving(false),
  };

  return (
    <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24 md:py-32 lg:py-36">
      <GridBackground />
      <Container className="relative z-10">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <TechLabel>SECTION_05 — NEXT</TechLabel>
            <AnimatedText
              as="h2"
              variant="rise"
              trigger="inView"
              text="Have something to build?"
              className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-5xl md:text-6xl lg:text-7xl"
            />
            <p className="max-w-xl text-lg text-white/80">
              Tell us what you want to ship. We&rsquo;ll come back within a working
              day with whether we&rsquo;re the right studio for it.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild variant="solid" size="lg">
                <Link href="/contact" {...wave}>
                  Start a Project
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="mailto:sudosapient@gmail.com">
                  sudosapient@gmail.com →
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <FinalCtaScene waving={waving} />
          </div>
        </div>
      </Container>
    </section>
  );
}
