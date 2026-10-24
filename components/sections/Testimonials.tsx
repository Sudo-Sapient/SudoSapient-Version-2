"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";

const testimonials = [
  {
    quote:
      "We were running logistics on calls, spreadsheets and endless follow ups. Sudo Sapient sat with our ops team, learned how a shipment really moves, and automated the busywork around it. Our people now spend the day on exceptions, not data entry.",
    name: "Kishen",
    company: "Shipzy",
    discipline: "Logistics",
  },
  {
    quote:
      "They automated our credit engine, so decisions that took days of manual checks now run on their own with a clear trail. Then they did the same for hiring and built us an ATS that screens and moves candidates without the back and forth.",
    name: "Bhoopal",
    company: "Taamul",
    discipline: "Finance",
  },
  {
    quote:
      "We wanted our go to market work to run itself. Sudo Sapient automated Jgsaw from research to outreach, and it now does in minutes what used to eat our whole week.",
    name: "Puneet",
    company: "Jgsaw",
    discipline: "Go to market",
  },
  {
    quote:
      "They installed an AI music curator that picks and sequences tracks the way our team would. What used to be hours of listening and sorting now happens on its own, and it still sounds like us.",
    name: "Yatin",
    company: "Fabplay",
    discipline: "Music",
  },
  {
    quote:
      "Sudo Sapient automated the way my media agency runs, from briefs to edits to delivery. We take on more clients with the same team, and nobody is stuck doing the repetitive parts anymore.",
    name: "Venkateshwaran",
    company: "Vencuts",
    discipline: "Media",
  },
  {
    quote:
      "We have done several projects together and every one took real work off our plate. They did not just automate tasks, they changed how our whole AI agency runs day to day.",
    name: "Yogi",
    company: "AI agency",
    discipline: "Multiple projects",
  },
] as const;

const motionTransition = { duration: 0.34, ease: [0.16, 1, 0.3, 1] } as const;
const TURN_MS = 9500; // one speaker's turn in testimonials.riv

export function Testimonials() {
  const [active, setActive] = React.useState(0);
  const current = testimonials[active];
  const reduceMotion = useReducedMotion();
  const mobileTabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const desktopTabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  // Speakers rotate on their own until the visitor picks one; then it's theirs.
  const [auto, setAuto] = React.useState(true);
  const stopAuto = () => setAuto(false);
  const speaker = React.useMemo(() => ({ speaker: active }), [active]);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.5,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!auto || reduceMotion || !inView) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % testimonials.length), TURN_MS);
    return () => window.clearTimeout(t);
  }, [active, auto, reduceMotion, inView]);

  const selectRelative = (direction: number, focus = false) => {
    setActive((value) => {
      const next = (value + direction + testimonials.length) % testimonials.length;
      if (focus) {
        window.requestAnimationFrame(() => {
          const visibleTabs = window.matchMedia("(min-width: 1024px)").matches
            ? desktopTabRefs.current
            : mobileTabRefs.current;
          visibleTabs[next]?.focus();
          visibleTabs[next]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        });
      }
      return next;
    });
  };

  const focusTab = (index: number) => {
    const visibleTabs = window.matchMedia("(min-width: 1024px)").matches
      ? desktopTabRefs.current
      : mobileTabRefs.current;
    visibleTabs[index]?.focus();
    visibleTabs[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const handleTabKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectRelative(1, true);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectRelative(-1, true);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
      window.requestAnimationFrame(() => focusTab(0));
    }
    if (event.key === "End") {
      event.preventDefault();
      const last = testimonials.length - 1;
      setActive(last);
      window.requestAnimationFrame(() => focusTab(last));
    }
  };

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 overflow-hidden bg-offwhite pb-16 pt-4 sm:pb-24 md:pb-20"
    >
      <Container>
        <TechLabel tone="dark">Testimonials</TechLabel>
        <h2 className="mt-4 max-w-2xl font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl">
          Real outcomes. Built together.
        </h2>
        <p className="mt-4 max-w-xl text-lg text-ink/70">
          Six teams who let us into how their business really runs, and what changed once we
          automated it.
        </p>

        <div className="border-ink/18 mt-10 border-y sm:mt-16 lg:grid lg:grid-cols-12">
          <div
            id="active-testimonial"
            role="tabpanel"
            aria-live="polite"
            aria-label={`Testimonial from ${current.name} at ${current.company}`}
            className="border-ink/18 relative overflow-hidden border-b bg-white px-5 py-6 sm:px-10 sm:py-10 lg:col-span-7 lg:min-h-[510px] lg:border-b-0 lg:border-r lg:px-12 lg:py-12 lg:pb-36"
          >
            <div className="flex items-center justify-between gap-4">
              <TechLabel tone="dark">FEATURED TESTIMONIAL</TechLabel>
              <TechLabel tone="dark">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(2, "0")}
              </TechLabel>
            </div>

            <div className="mt-7 max-w-2xl sm:mt-12 lg:mt-14">
              <span aria-hidden className="block h-10 font-display text-6xl leading-none text-warn">
                “
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.blockquote
                  key={current.name}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={reduceMotion ? { duration: 0 } : motionTransition}
                  className="text-pretty text-xl font-medium leading-[1.4] tracking-[-0.015em] text-ink sm:text-2xl"
                >
                  {current.quote}
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* The podium: the selected client walks up and speaks; the others clap. */}
            <div ref={stageRef} className="mt-8 sm:mt-10">
              <RiveScene
                className="hidden md:block"
                src="/rive/testimonials.riv"
                artboard="Desktop"
                stateMachine="Podium"
                inputs={speaker}
                frameClassName="aspect-[680/170] w-full"
                ariaLabel={`${current.name} from ${current.company} speaking at the podium`}
                fallback={null}
              />
              <RiveScene
                className="md:hidden"
                src="/rive/testimonials.riv"
                artboard="Mobile"
                stateMachine="Podium"
                inputs={speaker}
                frameClassName="aspect-[340/112] w-full"
                ariaLabel={`${current.name} from ${current.company} speaking at the podium`}
                fallback={null}
              />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${current.name}-credit`}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.24 }}
                className="border-ink/12 mt-7 border-t pt-5 lg:absolute lg:bottom-12 lg:left-12 lg:mt-0 lg:border-0 lg:pt-0"
              >
                <p className="font-display text-lg font-bold tracking-[-0.03em] text-ink sm:text-xl">
                  {current.name}
                </p>
                <TechLabel tone="dark">
                  {current.company} · {current.discipline}
                </TechLabel>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="relative bg-[#eef1f5] px-5 py-5 sm:p-8 lg:col-span-5 lg:p-10"
            onPointerDownCapture={stopAuto}
            onKeyDownCapture={stopAuto}
          >
            <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-4">
              <div>
                <TechLabel tone="dark">SELECT A VOICE</TechLabel>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/50 lg:hidden">
                  Tap a client to change the story.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => selectRelative(-1)}
                  className="flex h-11 w-11 items-center justify-center border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-px"
                  aria-label="Previous testimonial"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 3 5 8l5 5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => selectRelative(1)}
                  className="flex h-11 w-11 items-center justify-center border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-px"
                  aria-label="Next testimonial"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 3 5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              role="tablist"
              aria-label="Testimonials"
              className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 pt-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden [&::-webkit-scrollbar]:hidden"
            >
              {testimonials.map((testimonial, index) => {
                const selected = index === active;
                return (
                  <button
                    key={testimonial.name}
                    ref={(node) => {
                      mobileTabRefs.current[index] = node;
                    }}
                    id={`testimonial-tab-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="active-testimonial"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onKeyDown={handleTabKey}
                    className={`min-h-[5.25rem] w-[8.5rem] shrink-0 snap-center border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      selected
                        ? "border-ink bg-ink text-white"
                        : "border-ink/15 bg-white/55 text-ink"
                    }`}
                  >
                    <span
                      className={`block font-mono text-[11px] tracking-[0.15em] ${selected ? "text-warn" : "text-ink/60"}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block text-pretty font-display text-[0.95rem] font-bold leading-[1.05] tracking-[-0.025em]">
                      {testimonial.name}
                    </span>
                    <span
                      className={`mt-1.5 block font-mono text-[11px] uppercase tracking-[0.11em] ${selected ? "text-white/75" : "text-ink/65"}`}
                    >
                      {testimonial.company}
                    </span>
                  </button>
                );
              })}
            </div>

            <div role="tablist" aria-label="Testimonials" className="mt-3 hidden lg:block">
              {testimonials.map((testimonial, index) => {
                const selected = index === active;
                return (
                  <button
                    key={testimonial.name}
                    ref={(node) => {
                      desktopTabRefs.current[index] = node;
                    }}
                    id={`testimonial-tab-desktop-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="active-testimonial"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onKeyDown={handleTabKey}
                    className="border-ink/12 group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                  >
                    <span
                      className={`font-mono text-[11px] tracking-[0.16em] transition-colors ${selected ? "text-warn" : "text-ink/60"}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span
                        className={`block font-display text-xl font-bold tracking-[-0.035em] transition-transform duration-300 ${selected ? "translate-x-1 text-ink" : "text-ink/60 group-hover:translate-x-1 group-hover:text-ink"}`}
                      >
                        {testimonial.name}
                      </span>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.13em] text-ink/65">
                        {testimonial.company} · {testimonial.discipline}
                      </span>
                    </span>
                    <span
                      className={`h-2 w-2 border border-ink/35 transition-colors ${selected ? "bg-warn" : "bg-transparent"}`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 hidden border-l-2 border-warn/60 pl-4 lg:block">
              <p className="max-w-[20rem] font-mono text-[11px] uppercase leading-relaxed tracking-[0.13em] text-ink/65">
                Choose a client to read their full testimonial and project context.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
