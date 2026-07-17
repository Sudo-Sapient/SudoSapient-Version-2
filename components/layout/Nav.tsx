"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { withBasePath } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/#testimonials", label: "Testimonials" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 8);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
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

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusable = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    const timer = window.setTimeout(() => focusable()[0]?.focus(), 40);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
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
        {/* Deliberate hard navigation: guarantees a fresh Next manifest and
            tears down route-bound GSAP instances after long-lived inner pages. */}
        <a
          href={withBasePath("/")}
          className="flex items-baseline text-white"
          aria-label="Sudo Sapient home"
        >
          <span
            className={cn(
              "font-display font-semibold leading-none tracking-tight-2 transition-all duration-300",
              scrolled ? "text-lg" : "text-xl"
            )}
          >
            Sudo Sapient
          </span>
          <span className="ml-0.5 text-warn">.</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-9 md:flex">
          {links.map((link) => {
            const active = link.href.startsWith("/#")
              ? false
              : pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <MinimalLink key={link.href} href={link.href} label={link.label} active={!!active} />
            );
          })}
          <Button asChild variant="primary" size="sm">
            <Link href="/contact">Start a Project</Link>
          </Button>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
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

      <div aria-hidden className="relative h-[3px] w-full overflow-hidden bg-white/5">
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
            id="mobile-navigation"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.65, 0.3, 0.9] }}
            className="overflow-hidden border-t border-white/15 bg-blueprint md:hidden"
          >
            <Container className="flex flex-col py-4">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center gap-3 border-b border-white/10 py-3 font-mono text-sm uppercase tracking-[0.16em] text-white/85"
                >
                  <span className="text-white/35">{String(index + 1).padStart(2, "0")}</span>
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="primary" size="default" className="mt-5 self-start">
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

const RULER_TICKS: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(to right, rgba(255,255,255,0.3) 0 1px, transparent 1px 14px)",
};

function MinimalLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
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
