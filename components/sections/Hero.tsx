"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { BlueprintCanvas } from "@/components/blueprint/BlueprintCanvas";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { Button } from "@/components/ui/Button";
import { HeroScene } from "@/components/scenes/HeroScene";
import { AnimatedText } from "@/components/motion/AnimatedText";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-blueprint text-white">
      <GridBackground />
      <BlueprintCanvas reveal={false} />
      <Container className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col py-12 sm:py-16 md:py-20">
        {/* The composed scene: focal ModuleStack + active figures */}
        <div className="relative grid items-center gap-8 sm:gap-10 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <HeroScene />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <AnimatedText
              as="h1"
              variant="scramble"
              trigger="load"
              delay={0.5}
              speed={0.018}
              text="We build AI systems that automate, create, and scale."
              className="font-display text-3xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-4xl md:text-5xl lg:text-6xl"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              <TechLabel>
                <AnimatedText
                  as="span"
                  variant="typewriter"
                  trigger="load"
                  delay={1.0}
                  text="// AI PRODUCTS · AUTOMATION · MEDIA"
                />
              </TechLabel>
              <p className="max-w-md text-lg text-white/80">
                An AI studio for founders and product teams who want to ship AI
                products without hiring a full AI team.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button asChild variant="solid" size="lg">
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/work">See the work →</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Bottom dimension callouts along the base */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-10 flex items-center justify-between border-t border-white/30 pt-3"
        >
          <TechLabel>
            <AnimatedText
              as="span"
              variant="typewriter"
              trigger="load"
              delay={1.3}
              text="FIG. 01 — HOMEPAGE HERO"
            />
          </TechLabel>
          <TechLabel>SCALE 1:1</TechLabel>
          <TechLabel className="hidden sm:inline-block">SHEET 01 / 05</TechLabel>
        </motion.div>
      </Container>
    </section>
  );
}
