"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { Button } from "@/components/ui/Button";
import { FinalCtaScene } from "@/components/scenes/FinalCtaScene";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-blueprint py-28 text-white sm:py-36">
      <GridBackground />
      <Container className="relative z-10">
        <div className="grid items-center gap-16 md:grid-cols-12">
          <div className="md:col-span-7 flex flex-col gap-6">
            <TechLabel>SECTION_05 — NEXT</TechLabel>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-6xl md:text-7xl"
            >
              Have something to build?
            </motion.h2>
            <p className="max-w-xl text-lg text-white/80">
              Tell us what you want to ship. We&rsquo;ll come back within a working
              day with whether we&rsquo;re the right studio for it.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild variant="solid" size="lg">
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="mailto:sudosapient@gmail.com">
                  sudosapient@gmail.com →
                </Link>
              </Button>
            </div>
          </div>

          <div className="md:col-span-5">
            <FinalCtaScene />
          </div>
        </div>
      </Container>
    </section>
  );
}
