import Link from "next/link";
import { Container } from "./Container";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { FooterWordmark } from "./FooterWordmark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-white/15 bg-blueprint-deep text-white">
      <Container className="relative z-10 pb-8 pt-16 sm:pt-20">
        {/* Eyebrow row */}
        <div className="flex items-center justify-between">
          <TechLabel>{"// AI PRODUCTS · AUTOMATION · MEDIA"}</TechLabel>
          <Link
            href="/contact"
            className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white"
          >
            Start a Project →
          </Link>
        </div>

        {/* The kinetic wordmark — the studio signature */}
        <div className="mt-8 sm:mt-10">
          <FooterWordmark />
        </div>

        {/* Slim contact row */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
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
        </div>

        {/* Legal microrow */}
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <TechLabel>© {year} · SUDO SAPIENT · ALL RIGHTS RESERVED</TechLabel>
          <TechLabel>BUILT BY HUMANS + MACHINES</TechLabel>
        </div>
      </Container>
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
      <ul className="flex flex-wrap gap-x-6 gap-y-2 sm:flex-col sm:gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-white/85 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
