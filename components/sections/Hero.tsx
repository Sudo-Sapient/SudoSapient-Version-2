"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { Button } from "@/components/ui/Button";
import { HeroScene } from "@/components/scenes/HeroScene";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-blueprint text-white">
      <GridBackground />
      <Container className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col py-16 sm:py-20">
        {/* Top blueprint metadata strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 items-start gap-y-2 border-y border-white/30 py-3 sm:grid-cols-4"
        >
          <Metadatum label="SUBJECT" value="SUDOSAPIENT.DEV" />
          <Metadatum label="TYPE" value="AI STUDIO" />
          <Metadatum label="VERSION" value="V2.0" />
          <Metadatum label="DRAWN" value="2026.05" />
        </motion.div>

        {/* Top-right blueprint note */}
        <div className="mt-3 flex justify-end">
          <TechLabel>{"// ALL DIMENSIONS RELATIVE · NOT TO SCALE"}</TechLabel>
        </div>

        {/* The composed scene: focal ModuleStack + active figures */}
        <div className="relative mt-10 grid items-center gap-10 md:mt-12 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-7 relative">
            <HeroScene />
          </div>

          <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-6">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.5 }}
              className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-5xl lg:text-6xl"
            >
              We build AI systems that automate, create, and scale.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3, duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              <TechLabel>{"// AI PRODUCTS · AUTOMATION · MEDIA"}</TechLabel>
              <p className="max-w-md text-lg text-white/80">
                An AI studio for founders and product teams who want to ship AI
                products without hiring a full AI team.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.5 }}
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
          transition={{ delay: 2.6, duration: 0.5 }}
          className="mt-10 flex items-center justify-between border-t border-white/30 pt-3"
        >
          <TechLabel>FIG. 01 — HOMEPAGE HERO</TechLabel>
          <TechLabel>SCALE 1:1</TechLabel>
          <TechLabel className="hidden sm:inline-block">SHEET 01 / 05</TechLabel>
        </motion.div>
      </Container>
    </section>
  );
}

function Metadatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-1">
      <TechLabel>{label}</TechLabel>
      <span className="font-mono text-[13px] text-white">{value}</span>
    </div>
  );
}
