"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { Button } from "@/components/ui/Button";
import { CTA_LABEL, withBasePath } from "@/lib/site";
import { RiveScene } from "@/components/motion/RiveScene";
import { useReducedMotion } from "framer-motion";

const contacts = [
  {
    label: "Instagram",
    value: "@sudo.sapient",
    href: "https://www.instagram.com/sudo.sapient/?hl=en",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "Sudo Sapient",
    href: "https://www.linkedin.com/in/sabari8956/",
    external: true,
  },
  { label: "Email", value: "sudosapient@gmail.com", href: "mailto:sudosapient@gmail.com" },
  {
    label: "WhatsApp",
    value: "+91 80500 29848",
    href: "https://wa.me/918050029848",
    external: true,
  },
];

/** The closing call to action: one conversation, acted out on a napkin. */
export function FinalCTA() {
  // Hovering the main button pulls up a chair for the visitor in the scene.
  const [seat, setSeat] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const reduce = useReducedMotion();
  // Video mounts after hydration (reduced motion is only known on the client) and only
  // plays while the scene is on screen; preload="none" keeps 8.7 MB off first load.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const video = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      {
        threshold: 0.25,
      }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [mounted, reduce]);
  const inputs = React.useMemo(() => ({ seat }), [seat]);
  const pullUp = {
    onMouseEnter: () => setSeat(true),
    onMouseLeave: () => setSeat(false),
    onFocus: () => setSeat(true),
    onBlur: () => setSeat(false),
  };

  return (
    <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24 md:py-28">
      <GridBackground />
      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <h2 className="font-serif text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              Start with one conversation.
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-white/80">
              Thirty minutes on how your team works today. You leave with the first three things
              worth automating, whether or not we work together.
            </p>
            <div>
              <Button asChild variant="solid" size="lg">
                <Link href="/contact" {...pullUp}>
                  {CTA_LABEL}
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <RiveScene
              src="/rive/cta.riv"
              stateMachine="SM"
              inputs={inputs}
              frameClassName="aspect-[300/170] w-full"
              ariaLabel="A client and our developer at a café table. The client scribbles a tangled mess on a napkin, our developer draws three neat boxes beside it, ticks appear on all three, and they shake hands."
              fallback={
                <p className="border border-white/20 p-6 font-serif text-2xl leading-snug text-white/85">
                  Thirty minutes, one napkin, three things worth automating.
                </p>
              }
            />
            {mounted && !reduce && (
              // Sits exactly over the TV screen drawn in cta.riv (x 220 to 286, y 68 to 106 of 300x170).
              // The whole screen is the sound toggle: a far bigger target than a label on a tiny TV.
              <button
                type="button"
                aria-pressed={!muted}
                aria-label={muted ? "Play the reel with sound" : "Mute the reel"}
                onClick={() => setMuted((m) => !m)}
                className="group absolute left-[73.33%] top-[40%] h-[22.35%] w-[22%] overflow-hidden rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-warn"
              >
                <video
                  ref={video}
                  src={withBasePath("/media/studio-reel.mp4")}
                  preload="none"
                  loop
                  muted={muted}
                  playsInline
                  aria-hidden
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-0.5 top-0.5 bg-[#0E1424]/80 px-1 font-mono text-[8px] uppercase leading-4 tracking-[0.1em] text-white group-hover:text-warn sm:text-[9px]">
                  {muted ? "Sound" : "Mute"}
                </span>
              </button>
            )}
          </div>
        </div>

        <ul
          aria-label="Other ways to reach us"
          className="mt-12 grid gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contacts.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="block h-full bg-blueprint px-5 py-4 transition-colors hover:bg-white hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn"
              >
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] opacity-75">
                  {c.label}
                </span>
                <span className="mt-1 block break-words font-display text-lg tracking-[-0.03em]">
                  {c.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
