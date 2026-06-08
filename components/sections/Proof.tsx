"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { CornerBrackets } from "@/components/blueprint/CornerBrackets";
import { TechLabel } from "@/components/blueprint/TechLabel";

export function Proof() {
  return (
    <section className="relative bg-offwhite pb-24 sm:pb-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <CornerBrackets tone="dark" className="bg-offwhite px-8 py-12 sm:px-16 sm:py-20">
            <div className="flex flex-col items-center gap-6 text-center">
              <TechLabel tone="dark">{"// PROOF · PLACEHOLDER"}</TechLabel>
              {/* TODO: replace with a real quote or stat from a client */}
              <p className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight-2 text-ink sm:text-4xl md:text-5xl">
                &ldquo;They shipped in six weeks what our last vendor couldn&rsquo;t in six months.&rdquo;
              </p>
              <TechLabel tone="dark">— ATTRIBUTION PENDING APPROVAL</TechLabel>
            </div>
          </CornerBrackets>
        </motion.div>
      </Container>
    </section>
  );
}
