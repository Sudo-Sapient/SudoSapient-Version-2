"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { RiveScene } from "@/components/motion/RiveScene";
import { withBasePath } from "@/lib/site";
import { cn } from "@/lib/utils";

export type Floor = {
  name: string;
  role: string;
  /** Real photo, faded in after the gag. Leave it out to keep them a mystery. */
  img?: string;
  /** Artboard in public/rive/about.riv showing them mid task. */
  artboard: string;
  /** How long their `caught` gag runs in about.riv, so the photo lands right after it. */
  gagMs: number;
  /** A spy: no photo. This many ms after the doors open he shoots the lift. */
  shotMs?: number;
  caught: string;
  bio: string;
};

/**
 * The team as an elevator. Press a floor: the doors shut, the counter ticks over,
 * ding, and the doors open on that person's stickman caught slacking; they scramble
 * back to coding (state machine SM in about.riv), then turn into their real photo.
 * Tap the cab to flip back. The lift tours on by itself until the visitor presses a
 * floor. Reduced motion: no gags and no tour, just the photo on arrival. The spy
 * floor shoots the lift instead: the glass cracks, the whole lift drops out of frame,
 * and a fresh one lands to start the tour again.
 */
export function TeamElevator({ floors }: { floors: Floor[] }) {
  const root = React.useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<number | null>(null);
  const [display, setDisplay] = React.useState(0); // 0 is the lobby
  const [ding, setDing] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);
  const [cracked, setCracked] = React.useState(false);
  const [falling, setFalling] = React.useState(false);
  const [lift, setLift] = React.useState(0); // bumps when a new lift arrives
  const busy = React.useRef(false);
  const started = React.useRef(false);
  const at = React.useRef<number | null>(null);
  const shown = React.useRef(0);
  const timers = React.useRef<number[]>([]);
  const queued = React.useRef<number | null>(null); // a floor pressed mid ride
  const touring = React.useRef(true); // auto tour; a visitor's own press stops it

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  React.useEffect(() => clearTimers, []);

  const go = (i: number) => {
    if (busy.current) {
      queued.current = i;
      return;
    }
    if (i === at.current) return;
    // A new ride cancels whatever the last floor still had scheduled.
    clearTimers();
    setCracked(false);
    setFalling(false);
    busy.current = true;
    at.current = i;
    const later = (ms: number, fn: () => void) =>
      timers.current.push(window.setTimeout(fn, reduce ? 0 : ms));
    setOpen(false);
    setPhoto(false);
    setDing(false);
    let t = 550; // doors shut first
    for (let f = shown.current; f !== i + 1;) {
      f += f < i + 1 ? 1 : -1;
      const floor = f;
      later(t, () => {
        shown.current = floor;
        setDisplay(floor);
      });
      t += 280;
    }
    later(t, () => {
      setDing(true);
      setCurrent(i);
    });
    later(t + 350, () => {
      setOpen(true);
      busy.current = false;
      const next = queued.current;
      queued.current = null;
      if (next !== null && next !== i) go(next);
    });
    later(t + 1400, () => setDing(false));
    const { gagMs, shotMs } = floors[i];
    if (reduce) {
      // No gags, no tour: arrive, show who it is, wait for the next press.
      later(t, () => setPhoto(true));
      return;
    }
    if (shotMs !== undefined) {
      // Bang. Crack the glass, drop this lift, land a new one, start over from floor 1.
      later(t + shotMs, () => at.current === i && setCracked(true));
      later(t + shotMs + 900, () => {
        if (at.current !== i) return;
        busy.current = true;
        setFalling(true);
      });
      later(t + shotMs + 1600, () => {
        if (at.current !== i) return;
        at.current = null;
        shown.current = 0;
        setDisplay(0);
        setCurrent(null);
        setOpen(false);
        setCracked(false);
        setFalling(false);
        setLift((n) => n + 1);
      });
      later(t + shotMs + 2600, () => {
        busy.current = false;
        queued.current = null;
        touring.current = true; // a fresh lift starts the tour again
        go(0);
      });
      return;
    }
    // Photo right after the gag, then on to the next floor (6 wraps back to 1).
    later(t + gagMs + 300, () => at.current === i && setPhoto(true));
    later(t + gagMs + 3300, () => {
      if (touring.current && at.current === i) go((i + 1) % floors.length);
    });
  };

  React.useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      go(0);
    }
  });

  const m = current === null ? null : floors[current];

  return (
    <div ref={root} className="grid items-start gap-6 md:grid-cols-12 md:gap-10">
      {/* the elevator; clipped so a dropped lift falls out of frame */}
      <div className="mx-auto -mt-10 w-full max-w-[230px] overflow-hidden pt-10 sm:max-w-[280px] md:sticky md:top-16 md:col-span-5 lg:max-w-[340px] [@media(max-height:500px)]:max-w-[150px]">
        <motion.div
          key={lift}
          initial={lift === 0 ? false : { y: "-120%" }}
          animate={{ y: falling ? "130%" : 0, x: cracked && !falling ? [0, -7, 6, -4, 3, 0] : 0 }}
          transition={
            falling
              ? { y: { duration: 0.6, ease: [0.55, 0, 1, 0.45] } }
              : { y: { type: "spring", stiffness: 110, damping: 14 }, x: { duration: 0.35 } }
          }
        >
          <div className="relative mx-auto mb-3 flex w-32 items-center justify-center rounded-sm border border-white/30 bg-[#0E1424] py-1.5 font-mono text-sm tracking-[0.2em] text-warn">
            <span aria-hidden>{display === 0 ? "G" : display}</span>
            <AnimatePresence>
              {ding && (
                <motion.span
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={{ opacity: 1, y: -22, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -right-14 top-0 rounded-full bg-warn px-2 py-0.5 text-[13px] font-medium text-ink"
                >
                  Ding!
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-sm border-[6px] border-white/80 bg-white/10 p-1.5">
            <button
              type="button"
              onClick={() => open && setPhoto((p) => !p)}
              aria-label={m ? `${m.name}. Tap to swap between photo and stickman.` : "Elevator"}
              className="relative block aspect-[120/150] w-full overflow-hidden bg-[#eef1f5]"
            >
              {m && (
                <>
                  <RiveScene
                    key={m.artboard}
                    className="absolute inset-0"
                    src="/rive/about.riv"
                    artboard={m.artboard}
                    stateMachine="SM"
                    frameClassName="h-full w-full"
                    ariaLabel={`${m.name} as a stickman: ${m.caught}`}
                    fallback={
                      m.img ? null : (
                        <p className="flex h-full items-center justify-center bg-[#0E1424] font-mono text-sm uppercase tracking-[0.3em] text-warn">
                          Classified
                        </p>
                      )
                    }
                  />
                  {m.img && (
                    <motion.div
                      className="absolute inset-0"
                      initial={false}
                      animate={{ opacity: photo ? 1 : 0, scale: photo ? 1 : 1.06 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={withBasePath(m.img)}
                        alt={`${m.name}, ${m.role} at Sudo Sapient`}
                        fill
                        sizes="340px"
                        className="object-cover object-top"
                      />
                    </motion.div>
                  )}
                </>
              )}
              {/* the doors */}
              {[-1, 1].map((side) => (
                <motion.span
                  key={side}
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 w-1/2 bg-[#c9d1de]",
                    side < 0
                      ? "left-0 border-r border-[#9aa6b8]"
                      : "right-0 border-l border-[#9aa6b8]"
                  )}
                  initial={false}
                  animate={{ x: open ? `${side * 100}%` : "0%" }}
                  transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                >
                  <span
                    className={cn(
                      "absolute top-1/2 h-10 w-1 -translate-y-1/2 rounded-full bg-[#9aa6b8]",
                      side < 0 ? "right-2" : "left-2"
                    )}
                  />
                </motion.span>
              ))}
              {/* the bullet hole in the glass (static wrapper: motion owns the svg's transform) */}
              <span className="pointer-events-none absolute left-1/2 top-[61%] w-[70%] -translate-x-1/2 -translate-y-1/2">
                <AnimatePresence>
                  {cracked && (
                    <motion.svg
                      aria-hidden
                      viewBox="-50 -50 100 100"
                      className="block w-full"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeLinecap="round"
                    >
                      <circle r="4" fill="#0E1424" strokeWidth="1.5" />
                      <circle r="9" strokeWidth="0.8" opacity="0.7" />
                      {[0, 47, 95, 140, 188, 230, 280, 322].map((a, n) => (
                        <path
                          key={a}
                          d={`M${Math.cos((a * Math.PI) / 180) * 5} ${Math.sin((a * Math.PI) / 180) * 5} L${Math.cos(((a + 6) * Math.PI) / 180) * (22 + (n % 3) * 9)} ${Math.sin(((a + 6) * Math.PI) / 180) * (22 + (n % 3) * 9)} L${Math.cos(((a - 4) * Math.PI) / 180) * (34 + (n % 2) * 12)} ${Math.sin(((a - 4) * Math.PI) / 180) * (34 + (n % 2) * 12)}`}
                          strokeWidth="1.1"
                          opacity="0.85"
                        />
                      ))}
                    </motion.svg>
                  )}
                </AnimatePresence>
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* the panel */}
      <div className="md:col-span-7">
        <p className="text-[13px] font-medium text-white/60">Press a floor</p>
        {/* phones: a compact row of six numbers under the cab; names show from md up */}
        <ol className="mt-4 grid grid-cols-6 gap-2 md:grid-cols-2">
          {floors.map((f, i) => (
            <li key={f.name}>
              <button
                type="button"
                onClick={() => {
                  touring.current = false;
                  go(i);
                }}
                aria-pressed={current === i}
                aria-label={`Floor ${i + 1}: ${f.name}, ${f.role}`}
                className={cn(
                  "flex w-full items-center justify-center gap-3 rounded-sm border p-1.5 text-left transition-colors md:justify-start md:px-3 md:py-2.5",
                  current === i
                    ? "border-warn bg-white/10"
                    : "border-white/20 hover:border-white/60"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 font-mono text-sm",
                    current === i
                      ? "border-warn bg-warn text-ink shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                      : "border-white/60 text-white"
                  )}
                >
                  {i + 1}
                </span>
                <span className="hidden md:block">
                  <span className="block font-medium">{f.name}</span>
                  <span className="block text-sm text-white/60">{f.role}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div aria-live="polite" className="mt-8 min-h-[9rem] border-t border-white/20 pt-6">
          {m && current !== null && open && (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-[13px] font-medium text-warn">
                Floor {current + 1}. {m.caught}
              </p>
              <h3 className="mt-3 font-heading text-4xl font-semibold leading-none">{m.name}</h3>
              <p className="mt-1 text-white/60">{m.role}</p>
              <p className="mt-4 max-w-md leading-relaxed text-white/85">{m.bio}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
