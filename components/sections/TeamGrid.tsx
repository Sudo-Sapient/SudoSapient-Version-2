"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CornerBrackets } from "@/components/blueprint/CornerBrackets";
import { TechLabel } from "@/components/blueprint/TechLabel";

gsap.registerPlugin(ScrollTrigger);

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export type TeamMember = {
  name: string;
  role: string;
  img: string;
};

export function TeamGrid({ members }: { members: TeamMember[] }) {
  const root = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-card", {
        y: 48,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5"
    >
      {members.map((m) => (
        <figure key={m.name} className="team-card flex flex-col gap-4">
          <CornerBrackets tone="light" className="aspect-square">
            <div className="group relative h-full w-full overflow-hidden border border-white/30 bg-white/5">
              <Image
                src={m.img}
                alt={`${m.name}, ${m.role} at Sudo Sapient`}
                fill
                sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </CornerBrackets>
          <figcaption className="flex flex-col gap-1">
            <h3 className="font-display text-lg font-bold leading-tight tracking-tight-2 text-white">
              {m.name}
            </h3>
            <TechLabel tone="light">{m.role}</TechLabel>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
