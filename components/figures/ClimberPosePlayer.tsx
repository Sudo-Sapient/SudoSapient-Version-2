"use client";

import * as React from "react";
import { gsap } from "gsap";
import { Shootable } from "@/components/interactive/Shootable";
import { ClimberPoseStack, type ClimberPose } from "./ClimberStylePoses";
import { cn } from "@/lib/utils";

type Props = {
  poses: ClimberPose[];
  durations?: number[];
  className?: string;
  delay?: number;
  shootable?: boolean;
};

export function ClimberPosePlayer({
  poses,
  durations = [],
  className,
  delay = 0,
  shootable = true,
}: Props) {
  const root = React.useRef<HTMLSpanElement>(null);
  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el || poses.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const ctx = gsap.context(() => {
      const frames = new Map<ClimberPose, SVGGElement>();
      el.querySelectorAll<SVGGElement>("[data-pose]").forEach((frame) =>
        frames.set(frame.dataset.pose as ClimberPose, frame)
      );
      const all = Array.from(frames.values());
      // Bob the dedicated wrapper only, so it can never compound with the
      // translate/scale of the pose frames and lift the figure off its baseline.
      const bob = el.querySelector<SVGGElement>("[data-bob]");
      if (bob) gsap.to(bob, { y: -1, duration: 1.15, ease: "sine.inOut", yoyo: true, repeat: -1 });

      gsap.set(all, { autoAlpha: 0 });
      gsap.set(frames.get(poses[0]) ?? null, { autoAlpha: 1 });
      const tl = gsap.timeline({ repeat: -1, delay });
      poses.forEach((pose, i) => {
        const next = frames.get(pose) ?? null;
        const prev = frames.get(poses[(i - 1 + poses.length) % poses.length]) ?? null;
        // Cross-fade between poses (no scale, which was pivoting figures off-
        // origin and making them drift upward).
        tl.to(prev, { autoAlpha: 0, duration: 0.16, ease: "power1.inOut" })
          .fromTo(
            next,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.2, ease: "power1.inOut" },
            "<0.04"
          )
          .to({}, { duration: durations[i] ?? 0.42 });
      });
    }, root);
    return () => ctx.revert();
  }, [poses, durations, delay]);

  const figure = (
    <span ref={root} className="block h-full w-full">
      <svg
        viewBox="0 0 46 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full overflow-visible"
        aria-hidden
      >
        <g data-bob>
          <g transform="translate(2 0)">
            <ClimberPoseStack initial={poses[0] ?? "stand"} prefix="player" />
          </g>
        </g>
      </svg>
    </span>
  );
  return shootable ? (
    <Shootable className={cn("block", className)}>{figure}</Shootable>
  ) : (
    <span className={cn("block", className)}>{figure}</span>
  );
}
