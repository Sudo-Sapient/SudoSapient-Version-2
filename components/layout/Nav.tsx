"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { TechLabel } from "@/components/blueprint/TechLabel";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/#testimonials", label: "Testimonials" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  // Marketing pages with blue hero: home, services, contact use blue nav by default.
  // The work index + about + case studies live on paper. We keep nav blue everywhere
  // for brand consistency, paper sections sit below.
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-blueprint">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white">
          {/* TODO: replace with real logotype asset */}
          <span className="font-display text-lg font-extrabold tracking-tight-2">
            Sudo Sapient
          </span>
          <TechLabel className="hidden sm:inline-block">{"// STUDIO"}</TechLabel>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "font-mono text-[12px] uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-white",
                  active && "text-white"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Button asChild variant="primary" size="sm">
            <Link href="/contact">
              <span className="font-mono text-white/60">[</span> Start a Project{" "}
              <span className="font-mono text-white/60">]</span>
            </Link>
          </Button>
        </nav>

        <button
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
            <line x1="2" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </Container>

      {open && (
        <div className="border-t border-white/20 md:hidden">
          <Container className="flex flex-col gap-4 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.18em] text-white/85"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="primary" size="sm" className="self-start">
              <Link href="/contact" onClick={() => setOpen(false)}>
                Start a Project
              </Link>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
