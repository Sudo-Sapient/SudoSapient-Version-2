"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UnifiedBlueprintFooter } from "@/components/figures/UnifiedBlueprintFooter";
import type { ClimberPose } from "@/components/figures/ClimberStylePoses";

gsap.registerPlugin(ScrollTrigger);

export function FooterScene() {
  const root = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = root.current;
    if (
      !el ||
      window.matchMedia("(max-width: 639px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const ctx = gsap.context(() => {
      const q = (selector: string) => el.querySelector(selector);
      const qa = (selector: string) => el.querySelectorAll(selector);
      const callout = q("[data-callout]");
      const deskLeft = q("[data-desk-left]");
      const deskRight = q("[data-desk-right]");
      const deskCrack = q("[data-desk-crack]");
      const rocketPlan = q("[data-rocket-plan]");
      const body = q("[data-rocket-body]");
      const nose = q("[data-rocket-nose]");
      const leftFin = q("[data-left-fin]");
      const rightFin = q("[data-right-fin]");
      const engine = q("[data-engine]");
      const rocket = q("[data-rocket]");
      const flame = q("[data-flame]");
      const groundSmoke = q("[data-ground-smoke]");
      const groundPuffs = qa("[data-ground-puff]");
      const flightSmoke = q("[data-flight-smoke]");
      const flightPuffs = qa("[data-flight-puff]");
      const flameLayers = qa(
        "[data-flame-glow], [data-flame-outer], [data-flame-mid], [data-flame-core]"
      );
      const bottle = q("[data-bottle]");
      const fatSilhouette = q("[data-fat-silhouette]");
      const fatArms = q("[data-fat-arms]");
      const fatLegs = q("[data-fat-legs]");
      const fatDrinkArm = q("[data-fat-drink-arm]");
      const fatDuck = q("[data-fat-duck]");
      const laptop = q("[data-laptop]");
      const laptopLine = q("[data-laptop-line]");
      const laptopLight = q("[data-laptop-light]");
      const launchButton = q("[data-launch-button]");
      const launchStatus = q("[data-launch-status]");
      const actor = {
        one: q("[data-builder-one]"),
        fat: q("[data-builder-fat]"),
        glasses: q("[data-builder-glasses]"),
        console: q("[data-builder-console]"),
      };

      const owners = ["architect", "builder-one", "builder-glasses", "builder-console"] as const;
      type Owner = (typeof owners)[number];
      const frames = Object.fromEntries(
        owners.map((owner) => [owner, qa(`[data-pose-owner='${owner}']`)])
      ) as Record<Owner, NodeListOf<Element>>;
      const pose = (owner: Owner, name: ClimberPose) =>
        q(`[data-pose-owner='${owner}'][data-pose='${name}']`);
      const show = (timeline: gsap.core.Timeline, owner: Owner, name: ClimberPose) =>
        timeline.set(frames[owner], { autoAlpha: 0 }).set(pose(owner, name), { autoAlpha: 1 });

      owners.forEach((owner) => gsap.set(frames[owner], { autoAlpha: 0 }));
      gsap.set(
        [
          pose("architect", "draft"),
          pose("builder-one", "stand"),
          pose("builder-glasses", "stand"),
          pose("builder-console", "stand"),
        ],
        { autoAlpha: 1 }
      );
      gsap.set(
        [
          callout,
          deskCrack,
          fatDrinkArm,
          fatDuck,
          body,
          nose,
          leftFin,
          rightFin,
          engine,
          flame,
          groundSmoke,
          flightSmoke,
          launchStatus,
        ],
        { autoAlpha: 0 }
      );
      gsap.set(rocket, { x: 0, y: 0, transformOrigin: "586px 368px" });
      gsap.set(deskLeft, { transformOrigin: "197px 306px" });
      gsap.set(deskRight, { transformOrigin: "217px 306px" });
      gsap.set(rocketPlan, { transformOrigin: "207px 273px" });
      gsap.set(bottle, { transformOrigin: "3px 15px" });
      gsap.set(laptop, { transformOrigin: "8px 12px" });

      const loop = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.2,
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play pause resume pause" },
      });

      // Architect studies the small plan, then gestures from the plan toward the crew.
      show(loop, "architect", "draft").to({}, { duration: 0.8 });
      show(loop, "architect", "inspect").to({}, { duration: 0.55 });
      show(loop, "architect", "point")
        .to(callout, { autoAlpha: 1, duration: 0.35 })
        .to({}, { duration: 0.42 });

      // Crew visibly closes in around the much larger rocket.
      show(loop, "builder-one", "walkA").to(actor.one, {
        x: 34,
        duration: 0.5,
        ease: "power1.inOut",
      });
      show(loop, "builder-glasses", "walkA").to(
        actor.glasses,
        { x: -34, duration: 0.5, ease: "power1.inOut" },
        "<"
      );
      show(loop, "builder-console", "walkB").to(
        actor.console,
        { x: -28, duration: 0.5, ease: "power1.inOut" },
        "<"
      );
      loop.to(actor.fat, { x: 18, duration: 0.5, ease: "power1.inOut" }, "<");
      show(loop, "builder-one", "stand");
      show(loop, "builder-console", "stand");

      // Body first, then nose cone (reach, not carry), then fins fitted (press), then engine.
      loop
        .to(actor.fat, { x: 22, duration: 0.24, ease: "power1.inOut" })
        .to(body, { autoAlpha: 1, y: -8, duration: 0.55, ease: "back.out(1.5)" });
      show(loop, "builder-glasses", "reach").to(nose, {
        autoAlpha: 1,
        y: -8,
        duration: 0.5,
        ease: "back.out(1.5)",
      });
      show(loop, "builder-one", "press").to(leftFin, {
        autoAlpha: 1,
        x: 7,
        duration: 0.4,
        ease: "power3.out",
      });
      show(loop, "builder-console", "press").to(rightFin, {
        autoAlpha: 1,
        x: -7,
        duration: 0.4,
        ease: "power3.out",
      });
      loop.to(engine, { autoAlpha: 1, y: -4, duration: 0.4, ease: "power3.out" });

      // Broad builder leans in slightly and takes a drink; the bottle is anchored to the drink arm.
      loop
        .to(fatArms, { autoAlpha: 0, duration: 0.1 })
        .to(fatDrinkArm, { autoAlpha: 1, duration: 0.1 }, "<")
        .to(
          fatSilhouette,
          { x: 1.5, transformOrigin: "center bottom", duration: 0.22, ease: "power2.out" },
          "<"
        )
        .to(bottle, { rotation: -70, x: -22, y: -24, duration: 0.34, ease: "power2.out" }, "<")
        .to(bottle, { rotation: -64, duration: 0.16, repeat: 1, yoyo: true })
        .to(bottle, { rotation: 0, x: 0, y: 0, duration: 0.4, ease: "power2.inOut" })
        .to(fatSilhouette, { x: 0, duration: 0.3, ease: "power2.inOut" }, "<")
        .to(fatDrinkArm, { autoAlpha: 0, duration: 0.1 }, "<0.28")
        .to(fatArms, { autoAlpha: 1, duration: 0.1 }, "<");
      show(loop, "builder-glasses", "inspect")
        .to(laptop, { rotation: -4, duration: 0.28 })
        .to(laptopLight, {
          scale: 1.9,
          transformOrigin: "center",
          duration: 0.18,
          repeat: 3,
          yoyo: true,
        })
        .to(laptopLine, { strokeDashoffset: -12, duration: 0.6, ease: "none" });

      show(loop, "builder-one", "inspect");
      show(loop, "architect", "inspect");
      loop
        .to(callout, { autoAlpha: 0, duration: 0.25 })
        .to(launchStatus, { autoAlpha: 1, duration: 0.3 })
        .to({}, { duration: 0.6 });

      // Shared reaction beat: everyone glances up at the ignition before reacting.
      show(loop, "builder-console", "press").to(launchButton, {
        scale: 0.7,
        transformOrigin: "center",
        duration: 0.16,
        yoyo: true,
        repeat: 1,
      });
      loop
        .to(flame, { autoAlpha: 1, duration: 0.12 })
        .to(groundSmoke, { autoAlpha: 1, duration: 0.16 }, "<")
        .to(flightSmoke, { autoAlpha: 1, duration: 0.16 }, "<");
      show(loop, "architect", "point");
      show(loop, "builder-one", "reach");
      loop.to({}, { duration: 0.22 });

      // Everyone except the laptop engineer ducks; the console operator recoils into the duck as one motion.
      show(loop, "architect", "duck");
      show(loop, "builder-one", "duck");
      loop
        .to([fatSilhouette, fatArms, fatLegs], { autoAlpha: 0, duration: 0.12 })
        .to(fatDuck, { autoAlpha: 1, duration: 0.12 }, "<");
      show(loop, "builder-console", "duck").to(
        actor.console,
        { x: -22, duration: 0.4, ease: "power2.out" },
        "<"
      );
      show(loop, "builder-glasses", "inspect");
      loop
        .to(flameLayers, {
          scaleY: 1.18,
          scaleX: 0.94,
          transformOrigin: "586px 365px",
          duration: 0.09,
          repeat: 7,
          yoyo: true,
          stagger: 0.015,
          ease: "sine.inOut",
        })
        .to(
          groundPuffs,
          {
            scale: 1.9,
            x: (index) => (index < 2 ? -38 - index * 12 : index > 2 ? 25 + index * 9 : 0),
            autoAlpha: 0.16,
            transformOrigin: "center",
            duration: 0.65,
            stagger: 0.035,
            ease: "power2.out",
          },
          "<0.08"
        );
      loop
        .to(rocket, { y: -520, duration: 1.75, ease: "power2.in" })
        .to(
          flightPuffs,
          { y: 42, scale: 1.55, opacity: 0.18, duration: 0.9, stagger: 0.06, ease: "power1.out" },
          "<"
        )
        .to(flameLayers, { scaleY: 1.55, duration: 0.55, ease: "power2.in" }, "<")
        .to(groundSmoke, { autoAlpha: 0, duration: 1.05 }, "<0.25")
        .to(launchStatus, { autoAlpha: 0, duration: 0.3 }, "<0.9");

      // The delayed shockwave reaches the architect's table after the rocket clears the pad.
      loop
        .to([deskLeft, deskRight, rocketPlan], {
          x: -3,
          duration: 0.06,
          repeat: 5,
          yoyo: true,
          ease: "none",
        })
        .to(deskCrack, { autoAlpha: 1, duration: 0.12 })
        .to(deskLeft, { x: -21, y: 13, rotation: -11, duration: 0.52, ease: "power3.in" })
        .to(deskRight, { x: 24, y: 17, rotation: 13, duration: 0.52, ease: "power3.in" }, "<")
        .to(rocketPlan, { x: 12, y: -54, rotation: 17, duration: 0.46, ease: "power2.out" }, "<")
        .to(rocketPlan, { x: 34, y: 18, rotation: 31, duration: 0.72, ease: "power2.in" })
        .to({}, { duration: 0.65 });

      // Reset during the empty-sky beat, never by reversing the build.
      loop
        .set(rocket, { y: 0 })
        .set([body, nose, leftFin, rightFin, engine, flame, groundSmoke, flightSmoke], {
          autoAlpha: 0,
        })
        .set([...groundPuffs, ...flightPuffs, ...flameLayers], { clearProps: "transform,opacity" })
        .set([deskLeft, deskRight, rocketPlan], { clearProps: "transform" })
        .set(deskCrack, { autoAlpha: 0 });
      Object.values(actor).forEach((item) => loop.set(item, { x: 0 }));
      show(loop, "architect", "draft");
      loop
        .set([fatSilhouette, fatArms, fatLegs], { autoAlpha: 1, clearProps: "transform" })
        .set([fatDuck, fatDrinkArm], { autoAlpha: 0 })
        .set(bottle, { clearProps: "transform" });
      show(loop, "builder-one", "stand");
      show(loop, "builder-glasses", "stand");
      show(loop, "builder-console", "stand");

      // ---- Crosshair shoot reaction for the whole build crew. ----
      // Reuses the existing pose frames + fat duck so the launch choreography is
      // never structurally altered; we just pause the loop and override poses.
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        let state: "live" | "surrender" | "down" = "live";
        const showNow = (owner: Owner, name: ClimberPose) => {
          gsap.set(frames[owner], { autoAlpha: 0 });
          gsap.set(pose(owner, name), { autoAlpha: 1 });
        };
        const fatUp = () => {
          gsap.set([fatSilhouette, fatArms, fatLegs], { autoAlpha: 1 });
          gsap.set(fatDuck, { autoAlpha: 0 });
        };
        const fatDown = () => {
          gsap.set([fatSilhouette, fatArms, fatLegs], { autoAlpha: 0 });
          gsap.set(fatDuck, { autoAlpha: 1 });
        };

        const surrender = () => {
          if (state !== "live") return;
          state = "surrender";
          loop.pause();
          owners.forEach((o) => showNow(o, "surrender"));
          fatUp();
        };
        const relax = () => {
          if (state !== "surrender") return;
          state = "live";
          loop.play();
        };
        const shoot = () => {
          if (state === "down") return;
          state = "down";
          loop.pause();
          owners.forEach((o) => showNow(o, "duck"));
          fatDown();
          gsap.delayedCall(2.3, () => {
            state = "live";
            loop.play();
          });
        };

        const targets = el.querySelectorAll<SVGGElement>(
          "[data-builder-one],[data-builder-fat],[data-builder-glasses],[data-builder-console],[data-architect]"
        );
        const onEnter = () => surrender();
        const onLeave = () => relax();
        const onClick = () => shoot();
        targets.forEach((t) => {
          t.style.pointerEvents = "auto";
          t.style.cursor = "crosshair";
          t.setAttribute("data-cursor", "target");
          t.addEventListener("pointerenter", onEnter);
          t.addEventListener("pointerleave", onLeave);
          t.addEventListener("click", onClick);
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative mx-auto min-h-[24rem] w-full max-w-6xl overflow-hidden sm:min-h-[29rem]"
      aria-label="An architect and four builders assemble and launch a large rocket"
    >
      <div className="absolute inset-x-0 bottom-3 aspect-[960/440] min-w-[54rem] -translate-x-[17%] sm:min-w-0 sm:translate-x-0">
        <UnifiedBlueprintFooter className="text-white/82 h-full w-full" />
      </div>
      <p className="absolute inset-x-0 bottom-1 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        Plan it clearly. Build it properly. Send it.
      </p>
    </div>
  );
}
