"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/#testimonials", label: "Testimonials" },
];

/**
 * Minimalist nav. A clean blueprint bar with a Fraunces wordmark; the only
 * motion is a quiet compaction on scroll and an amber tick-ruler at the foot
 * that fills with page-scroll progress (the "rail"). Links get a single amber
 * underline that wipes in on hover / stays on the active route. No WebGL here —
 * the heavier GPU/GSAP work lives in the footer.
 */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const progressRef = React.useRef<HTMLDivElement>(null);

  // Scroll → compaction state + amber progress ruler (rAF-throttled).
  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 8);
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${p})`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Lock body scroll while the mobile panel is open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-blueprint/95 backdrop-blur-sm">
      <Container
        className={cn(
          "flex items-center justify-between transition-[height] duration-300 ease-out",
          scrolled ? "h-[3.25rem]" : "h-16"
        )}
      >
        <Link href="/" className="flex items-baseline text-white">
          <span
            className={cn(
              "font-display font-semibold leading-none tracking-tight-2 transition-all duration-300",
              scrolled ? "text-lg" : "text-xl"
            )}
          >
            Sudo Sapient
          </span>
          <span className="ml-0.5 text-warn">.</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => {
            const active =
              pathname === l.href || pathname?.startsWith(`${l.href}/`);
            return (
              <MinimalLink
                key={l.href}
                href={l.href}
                label={l.label}
                active={!!active}
              />
            );
          })}
          <Button asChild variant="primary" size="sm">
            <Link href="/contact">Start a Project</Link>
          </Button>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-[14px] w-[22px]">
            <span
              className={cn(
                "absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300",
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current transition-opacity duration-200",
                open ? "opacity-0" : "opacity-100"
              )}
            />
            <span
              className={cn(
                "absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300",
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              )}
            />
          </span>
        </button>
      </Container>

      {/* The amber rail — page-scroll progress over faint CAD ticks. */}
      <div
        aria-hidden
        className="relative h-[3px] w-full overflow-hidden bg-white/5"
      >
        <div
          ref={progressRef}
          className="absolute inset-y-0 left-0 w-full origin-left bg-warn"
          style={{ transform: "scaleX(0)" }}
        />
        <div className="absolute inset-0" style={RULER_TICKS} />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 0.65, 0.3, 0.9] }}
            className="overflow-hidden border-t border-white/15 bg-blueprint md:hidden"
          >
            <Container className="flex flex-col py-3">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.25 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-3 font-mono text-sm uppercase tracking-[0.18em] text-white/85"
                  >
                    <span className="text-white/35">{`0${i + 1}`}</span>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Button
                asChild
                variant="primary"
                size="sm"
                className="mt-3 self-start"
              >
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Start a Project
                </Link>
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Faint CAD tick marks laid over the amber progress fill.
const RULER_TICKS: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(to right, rgba(255,255,255,0.3) 0 1px, transparent 1px 14px)",
};

function MinimalLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative font-mono text-[12px] uppercase tracking-[0.18em] transition-colors",
        active ? "text-white" : "text-white/70 hover:text-white"
      )}
    >
      {label}
      <span
        className={cn(
          "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-warn transition-transform duration-300 ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}
