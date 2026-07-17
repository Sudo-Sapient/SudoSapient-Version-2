"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
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
            <TechLabel>SECTION_05 — SOCIALS</TechLabel>
            <AnimatedText
              as="h2"
              variant="rise"
              trigger="inView"
              text="Find us online."
              className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-5xl md:text-6xl lg:text-7xl"
            />
            <p className="max-w-xl text-lg text-white/80">
              Follow the studio, see what we are making, or reach us directly.
            </p>
            <div className="border-white/18 bg-white/18 grid max-w-2xl gap-px border sm:grid-cols-2">
              <Link
                href="https://www.instagram.com/sudo.sapient/?hl=en"
                target="_blank"
                rel="noreferrer"
                {...wave}
                className="group flex min-h-20 items-center justify-between bg-blueprint px-5 py-4 transition-colors hover:bg-white hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn"
              >
                <span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] opacity-50">
                    01 / Instagram
                  </span>
                  <span className="mt-1 block font-display text-xl tracking-[-0.035em]">
                    @sudo.sapient
                  </span>
                </span>
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/sabari8956/"
                target="_blank"
                rel="noreferrer"
                {...wave}
                className="group flex min-h-20 items-center justify-between bg-blueprint px-5 py-4 transition-colors hover:bg-white hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn"
              >
                <span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] opacity-50">
                    02 / LinkedIn
                  </span>
                  <span className="mt-1 block font-display text-xl tracking-[-0.035em]">
                    Sudo Sapient
                  </span>
                </span>
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </Link>
              <Link
                href="mailto:sudosapient@gmail.com"
                {...wave}
                className="group flex min-h-20 items-center justify-between bg-blueprint px-5 py-4 transition-colors hover:bg-white hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn"
              >
                <span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] opacity-50">
                    03 / Email
                  </span>
                  <span className="mt-1 block text-sm sm:text-base">sudosapient@gmail.com</span>
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="tel:+918050029848"
                {...wave}
                className="group flex min-h-20 items-center justify-between bg-blueprint px-5 py-4 transition-colors hover:bg-white hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn"
              >
                <span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] opacity-50">
                    04 / Phone
                  </span>
                  <span className="mt-1 block font-display text-xl tracking-[-0.035em]">
                    80500 29848
                  </span>
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
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
