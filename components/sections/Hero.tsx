"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { BlueprintCanvas } from "@/components/blueprint/BlueprintCanvas";
import { Button } from "@/components/ui/Button";
import { HeroScene } from "@/components/scenes/HeroScene";
import { RiveScene } from "@/components/motion/RiveScene";
import { CTA_LABEL } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-blueprint text-white">
      <GridBackground />
      <BlueprintCanvas reveal={false} />
      <Container className="relative z-10 flex flex-col justify-center py-14 sm:py-20 md:py-24 lg:min-h-[calc(100dvh-4rem)]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Static on purpose: the main line must show without waiting on JavaScript,
                for slow phones, crawlers and link previews alike. */}
            <h1 className="max-w-4xl text-balance font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-8xl">
              Make your company AI-native.
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              We sit with your team, see where the hours go, and build AI agents that handle the
              repetitive work. Then we hand it over for your people to run.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild variant="solid" size="lg">
                <Link href="/contact">{CTA_LABEL}</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="#how-we-transform">See how we work</Link>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-xl lg:col-span-5 [@media(max-height:500px)]:hidden lg:[@media(max-height:500px)]:block"
          >
            <RiveScene
              src="/rive/hero.riv"
              animation="loop"
              frameClassName="aspect-[4/3] w-full"
              ariaLabel="A worker pushes a boulder of paperwork up a hill until AI turns the hill into an escalator and he rides up with a coffee"
              fallback={<HeroScene />}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
