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
      <Container className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-14 sm:py-20 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <TechLabel>
              <AnimatedText
                as="span"
                variant="typewriter"
                trigger="load"
                delay={0.25}
                text="// AI PRODUCTS · AUTOMATION · MEDIA"
              />
            </TechLabel>

            <AnimatedText
              as="h1"
              variant="scramble"
              trigger="load"
              delay={0.4}
              speed={0.018}
              text="Production AI systems, shipped in weeks."
              className="max-w-4xl text-balance font-display text-4xl font-extrabold leading-[0.92] tracking-tight-3 sm:text-5xl md:text-6xl lg:text-7xl"
            />

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl"
            >
              We design and build AI products, operational automation, and media systems for
              founders and product teams—without the time and cost of hiring a full AI team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button asChild variant="solid" size="lg">
                <Link href="/contact">Discuss a build</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/work">See shipped work →</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-xl lg:col-span-5"
          >
            <HeroScene />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
