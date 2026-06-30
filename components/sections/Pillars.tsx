"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { ModuleStack } from "@/components/blueprint/ModuleStack";
import { Pipeline } from "@/components/blueprint/Pipeline";
import { CornerBrackets } from "@/components/blueprint/CornerBrackets";
import {
  FigureCarrying,
  FigurePointing,
  FigureStanding,
  BreathingFigure,
} from "@/components/figures";

export function Pillars() {
  return (
    <section className="relative bg-offwhite py-16 sm:py-24 md:py-32">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="WHAT WE BUILD"
          title="Three disciplines. One studio."
          description="We don't sell hours. We build working systems and hand you the keys."
          tone="dark"
        />

        <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {/* P.01 — AI PRODUCTS: ModuleStack focal, FigureCarrying placing a module */}
          <PillarCard
            code="P.01"
            title="AI Products"
            body="Customer-facing AI features and full products. Agents, copilots, generative UX, retrieval over your own data."
            bullets={[
              "In-product agents",
              "Copilots & assistants",
              "Generative UX",
              "RAG over private data",
            ]}
          >
            <CornerBrackets tone="dark" className="px-6 py-8">
              <ModuleStack
                tone="dark"
                showDimensions={false}
                modules={[
                  { code: "S.01", label: "INTERFACE" },
                  { code: "S.02", label: "PLANNER" },
                  { code: "S.03", label: "RETRIEVAL" },
                ]}
              />
            </CornerBrackets>
            <FigureOverlay align="bottom-right" width="22%" index={0}>
              <FigureCarrying className="w-full" />
            </FigureOverlay>
          </PillarCard>

          {/* P.02 — AI AUTOMATION: Pipeline focal, FigurePointing at a node */}
          <PillarCard
            code="P.02"
            title="AI Automation"
            body="Internal workflows that used to need humans. Typed pipelines, deterministic where it matters, LLM-routed where it pays."
            bullets={[
              "Ops & back-office",
              "Email/ticket/CRM routing",
              "Document pipelines",
              "Vendor & data plumbing",
            ]}
          >
            <CornerBrackets tone="dark" className="px-6 py-8">
              <Pipeline
                tone="dark"
                nodes={[
                  { code: "A.01", label: "IN" },
                  { code: "A.02", label: "RULE" },
                  { code: "A.03", label: "LLM" },
                  { code: "A.04", label: "OUT" },
                ]}
              />
            </CornerBrackets>
            <FigureOverlay align="bottom-right" width="20%" index={1}>
              <FigurePointing className="w-full" />
            </FigureOverlay>
          </PillarCard>

          {/* P.03 — AI MEDIA: camera-outline focal, FigureStanding behind it */}
          <PillarCard
            code="P.03"
            title="AI Media"
            body="Films, shows, and editorial systems that produce on a cadence. We build the pipeline; you ship the work."
            bullets={[
              "Short-form video",
              "Podcast → multichannel",
              "Editorial pipelines",
              "Image & motion systems",
            ]}
          >
            <CornerBrackets tone="dark" className="px-6 py-8">
              <CameraDiagram />
            </CornerBrackets>
            <FigureOverlay align="bottom-right" width="22%" index={2}>
              <FigureStanding className="w-full" />
            </FigureOverlay>
          </PillarCard>
        </div>
      </Container>
    </section>
  );
}

function PillarCard({
  code,
  title,
  body,
  bullets,
  children,
}: {
  code: string;
  title: string;
  body: string;
  bullets: string[];
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 bg-offwhite p-6 sm:p-8 md:p-10"
    >
      <div className="flex items-center justify-between">
        <TechLabel tone="dark">{code}</TechLabel>
        <TechLabel tone="dark">FIG · DIAGRAM</TechLabel>
      </div>

      <div className="relative">{children}</div>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-2xl font-bold tracking-tight-2 text-ink">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-ink/75">{body}</p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-ink/80"
          >
            <span className="h-px w-3 bg-ink/40" />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function FigureOverlay({
  children,
  width,
  align,
  index = 0,
}: {
  children: React.ReactNode;
  width: string;
  align: "bottom-right" | "bottom-left";
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: 1.4, duration: 0.4 }}
      className={`pointer-events-none absolute text-ink ${
        align === "bottom-right" ? "right-4 bottom-2" : "left-4 bottom-2"
      }`}
      style={{ width }}
    >
      <BreathingFigure index={index} className="block w-full">
        {children}
      </BreathingFigure>
    </motion.div>
  );
}

function CameraDiagram() {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      stroke="#0F172A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-auto w-full"
      aria-hidden
    >
      {/* Camera body */}
      <motion.rect
        x="60"
        y="60"
        width="220"
        height="110"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* Lens */}
      <circle cx="170" cy="115" r="34" />
      <circle cx="170" cy="115" r="22" />
      <circle cx="170" cy="115" r="10" />
      {/* Viewfinder bump */}
      <rect x="140" y="48" width="40" height="14" />
      {/* Side module */}
      <rect x="288" y="78" width="50" height="50" />
      <line x1="288" y1="100" x2="338" y2="100" />
      <line x1="313" y1="78" x2="313" y2="128" />
      {/* Top callouts */}
      <line x1="60" y1="40" x2="60" y2="22" />
      <line x1="280" y1="40" x2="280" y2="22" />
      <line x1="60" y1="30" x2="280" y2="30" />
      <text
        x="170"
        y="24"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
        fontSize="10"
        letterSpacing="2"
        fill="#0F172A"
        stroke="none"
      >
        CAPTURE
      </text>
      {/* Baseline */}
      <line x1="20" y1="190" x2="380" y2="190" />
      <line x1="20" y1="196" x2="380" y2="196" opacity="0.5" />
    </svg>
  );
}
