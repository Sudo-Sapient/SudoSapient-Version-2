import * as React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { FigureWaving, BreathingFigure } from "@/components/figures";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/20 bg-blueprint-deep text-white">
      <GridBackground variant="deep" />
      <Container className="relative z-10 grid gap-12 py-16 sm:grid-cols-4">
        <div className="sm:col-span-2 flex flex-col gap-4">
          <span className="font-display text-2xl font-extrabold tracking-tight-2">
            Sudo Sapient
          </span>
        </div>

        <FooterCol
          label="STUDIO"
          links={[
            { href: "/work", label: "Work" },
            { href: "/services", label: "Services" },
            { href: "/about", label: "About" },
          ]}
        />

        <FooterCol
          label="CONTACT"
          links={[
            { href: "mailto:sudosapient@gmail.com", label: "sudosapient@gmail.com" },
            { href: "mailto:hi@sudosapient.dev", label: "hi@sudosapient.dev" },
            { href: "tel:+918050029848", label: "+91 80500 29848" },
          ]}
        />
      </Container>

      <div className="relative z-10 border-t border-white/15">
        <Container className="flex flex-col items-start justify-between gap-2 py-5 sm:flex-row sm:items-center">
          <TechLabel>© {new Date().getFullYear()} · SUDO SAPIENT · ALL RIGHTS RESERVED</TechLabel>
          <TechLabel>BUILT BY HUMANS + MACHINES</TechLabel>
        </Container>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-4 text-white/80 sm:right-10">
        <BreathingFigure>
          <FigureWaving size={80} />
        </BreathingFigure>
      </div>
    </footer>
  );
}

function FooterCol({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <TechLabel>{label}</TechLabel>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-white/85 hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
