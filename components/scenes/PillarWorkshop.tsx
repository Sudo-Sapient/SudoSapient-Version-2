"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClimberPoseStack, type ClimberPose } from "@/components/figures/ClimberStylePoses";

gsap.registerPlugin(ScrollTrigger);
type Kind = "product" | "automation" | "media";

export function PillarWorkshop({ kind }: { kind: Kind; featured?: boolean }) {
  const root = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const worker = el.querySelector("[data-workshop-worker]");
      const frames = el.querySelectorAll("[data-pose-owner='workshop']");
      const pose = (name: ClimberPose) =>
        el.querySelector(`[data-pose-owner='workshop'][data-pose='${name}']`);
      const show = (tl: gsap.core.Timeline, name: ClimberPose) =>
        tl.set(frames, { autoAlpha: 0 }).set(pose(name), { autoAlpha: 1 });
      gsap.set(frames, { autoAlpha: 0 });
      gsap.set(pose("stand"), { autoAlpha: 1 });
      gsap.from("[data-scene]", {
        autoAlpha: 0,
        y: 12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });
      if (kind === "product") productSequence(el, worker, show);
      if (kind === "automation") automationSequence(el, worker, show);
      if (kind === "media") mediaSequence(el, worker, show);
    }, root);
    return () => ctx.revert();
  }, [kind]);

  return (
    <div
      ref={root}
      className="border-ink/12 relative h-60 overflow-hidden border-y bg-[#e7ebf0] sm:h-64"
    >
      <div data-scene className="absolute inset-0">
        {kind === "product" ? (
          <ProductStation />
        ) : kind === "automation" ? (
          <AutomationStation />
        ) : (
          <MediaStation />
        )}
      </div>
      <div className="absolute bottom-2 right-3 font-mono text-[8px] uppercase tracking-[0.18em] text-ink/35">
        {kind === "product"
          ? "Install · close · boot · verify"
          : kind === "automation"
            ? "Load · route · divert · confirm"
            : "Frame · focus · record · review"}
      </div>
    </div>
  );
}

type Show = (tl: gsap.core.Timeline, pose: ClimberPose) => gsap.core.Timeline;

function productSequence(el: HTMLElement, worker: Element | null, show: Show) {
  const productModule = el.querySelector("[data-module]");
  const panel = el.querySelector("[data-panel]");
  const screen = el.querySelector("[data-product-screen]");
  const status = el.querySelector("[data-product-status]");
  gsap.set(panel, { svgOrigin: "380 137" });
  gsap.set(screen, { opacity: 0.12 });
  gsap.set(status, { autoAlpha: 0 });
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
  show(tl, "walkA").to(worker, { x: 33, duration: 0.28, ease: "none" });
  show(tl, "walkB").to(worker, { x: 67, duration: 0.28, ease: "none" });
  show(tl, "crouch")
    .to(panel, { rotation: -78, duration: 0.42, ease: "power2.inOut" })
    .to({}, { duration: 0.2 });
  show(tl, "carry")
    .to(worker, { x: 127, y: -14, duration: 0.62, ease: "power2.inOut" })
    .to(productModule, { x: 120, y: -34, duration: 0.62, ease: "power2.inOut" }, "<");
  show(tl, "plug").to(productModule, { x: 145, y: -23, duration: 0.32, ease: "power3.in" });
  show(tl, "press")
    .to(panel, { rotation: 0, duration: 0.4 })
    .to(screen, { opacity: 1, duration: 0.3 })
    .to(status, { autoAlpha: 1, duration: 0.25 }, "<");
  show(tl, "inspect").to({}, { duration: 1 });
  tl.to([screen, status], { opacity: 0.12, duration: 0.2 }).to(panel, {
    rotation: -78,
    duration: 0.35,
  });
  show(tl, "plug").to(productModule, { x: 120, y: -34, duration: 0.32 });
  show(tl, "carry")
    .to(worker, { x: 67, y: 0, duration: 0.6 })
    .to(productModule, { x: 0, y: 0, duration: 0.6 }, "<");
  show(tl, "walkB").to(worker, { x: 0, duration: 0.5 });
  show(tl, "stand").to(panel, { rotation: 0, duration: 0.3 });
}

function automationSequence(el: HTMLElement, worker: Element | null, show: Show) {
  const payload = el.querySelector("[data-payload]");
  const lever = el.querySelector("[data-lever]");
  const wheel = el.querySelector("[data-diverter]");
  const verified = el.querySelector("[data-verified]");
  gsap.set(lever, { svgOrigin: "186 109" });
  gsap.set(wheel, { svgOrigin: "306 121" });
  gsap.set(verified, { autoAlpha: 0 });
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.15 });
  show(tl, "walkA").to(worker, { x: 28, duration: 0.26 });
  show(tl, "walkB").to(worker, { x: 57, duration: 0.26 });
  show(tl, "pullA").to(lever, { rotation: 38, duration: 0.4, ease: "power2.inOut" });
  show(tl, "pullB").to(payload, { x: 116, duration: 0.75, ease: "power1.inOut" });
  show(tl, "reach").to(wheel, { rotation: 92, duration: 0.48, ease: "power2.inOut" });
  show(tl, "inspect")
    .to(payload, { x: 224, y: 28, duration: 0.85, ease: "power2.inOut" })
    .to(verified, { autoAlpha: 1, duration: 0.25 }, "<0.55")
    .to({}, { duration: 0.7 });
  tl.to(verified, { autoAlpha: 0, duration: 0.2 })
    .set(payload, { x: 0, y: 0 })
    .to([lever, wheel], { rotation: 0, duration: 0.4 });
  show(tl, "walkB").to(worker, { x: 0, duration: 0.5 });
  show(tl, "stand");
}

function mediaSequence(el: HTMLElement, worker: Element | null, show: Show) {
  const camera = el.querySelector("[data-camera]");
  const focus = el.querySelector("[data-focus]");
  const record = el.querySelector("[data-record]");
  const guides = el.querySelector("[data-guides]");
  const counter = el.querySelector("[data-counter]");
  gsap.set(camera, { svgOrigin: "293 126" });
  gsap.set(focus, { svgOrigin: "266 111" });
  gsap.set(record, { autoAlpha: 0 });
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });
  show(tl, "walkA").to(worker, { x: 45, duration: 0.28 });
  show(tl, "walkB").to(worker, { x: 90, duration: 0.28 });
  show(tl, "camera").to(worker, { x: 114, duration: 0.25 });
  tl.to(focus, { rotation: 110, duration: 0.55 }).to(record, { autoAlpha: 1, duration: 0.2 });
  show(tl, "panLeft")
    .to(camera, { rotation: -8, duration: 1, ease: "sine.inOut" })
    .to(guides, { x: 18, duration: 1 }, "<")
    .set(counter, { textContent: "00:03" });
  show(tl, "panRight")
    .to(camera, { rotation: 5, duration: 1, ease: "sine.inOut" })
    .to(guides, { x: -10, duration: 1 }, "<")
    .set(counter, { textContent: "00:06" });
  show(tl, "inspect").to(record, { autoAlpha: 0, duration: 0.2 }).to({}, { duration: 0.75 });
  tl.to([camera, guides], { x: 0, rotation: 0, duration: 0.45 }).set(counter, {
    textContent: "00:00",
  });
  show(tl, "walkB").to(worker, { x: 0, duration: 0.6 });
  show(tl, "stand");
}

function Worker() {
  return (
    <g data-workshop-worker transform="translate(48 126) scale(1.42)">
      <ClimberPoseStack initial="stand" prefix="workshop" />
    </g>
  );
}
function ProductStation() {
  return (
    <svg
      viewBox="0 0 520 235"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink/78 h-full w-full"
    >
      <path d="M24 211h472" opacity=".2" />
      <Worker />
      <g>
        <path d="M252 51h187v144H252z" />
        <path d="M278 74h88v52h-88z" fill="#dce3eb" />
        <g data-product-screen opacity=".12">
          <path d="M289 88h56M289 100h42M289 112h64" stroke="#1E40AF" />
          <circle cx="349" cy="111" r="4" fill="#F59E0B" stroke="none" />
        </g>
        <path d="M278 145h102v31H278z" />
        <g data-panel>
          <path d="M380 137h58v47h-58z" fill="#e7ebf0" />
        </g>
        <g data-product-status opacity="0">
          <text
            x="391"
            y="168"
            fill="#1E40AF"
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="9"
          >
            ONLINE
          </text>
        </g>
      </g>
      <g data-module>
        <rect x="141" y="153" width="44" height="32" fill="#e7ebf0" />
        <path d="M151 163h24M151 172h17" stroke="#1E40AF" />
        <path d="M185 160h9M185 169h9M185 178h9" />
      </g>
    </svg>
  );
}
function AutomationStation() {
  return (
    <svg
      viewBox="0 0 520 235"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink/78 h-full w-full"
    >
      <path d="M24 211h472" opacity=".2" />
      <Worker />
      <g>
        <path d="M144 89h318v92H144z" />
        <path d="M165 121h252" strokeWidth="4" />
        <rect x="151" y="103" width="48" height="36" />
        <circle cx="245" cy="121" r="20" />
        <circle cx="340" cy="121" r="20" />
        <path d="M360 121h58v42h42" />
        <rect x="412" y="151" width="55" height="31" />
        <g data-lever>
          <path d="M186 109v-33M178 76h16" strokeWidth="3" />
        </g>
        <g data-diverter>
          <circle cx="306" cy="121" r="14" />
          <path d="M306 107v28M292 121h28" />
        </g>
        <rect data-payload x="159" y="113" width="16" height="16" fill="#F59E0B" stroke="none" />
        <g data-verified opacity="0">
          <path d="m429 166 5 5 11-13" stroke="#1E40AF" strokeWidth="2.5" />
        </g>
      </g>
    </svg>
  );
}
function MediaStation() {
  return (
    <svg
      viewBox="0 0 520 235"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink/78 h-full w-full"
    >
      <path d="M24 211h472" opacity=".2" />
      <Worker />
      <g data-camera>
        <path d="M218 73h148v91H218z" fill="#e2e7ed" />
        <path d="M366 91l67-31v117l-67-31z" />
        <circle cx="266" cy="111" r="34" />
        <g data-focus>
          <circle cx="266" cy="111" r="25" />
          <path d="M266 86v50M241 111h50" opacity=".4" />
        </g>
        <path d="M293 164v19M245 211h96M267 183l-22 28M319 183l22 28" />
        <path d="M239 68h58v-15h-58zM221 87h-33v23h33" />
        <g data-record opacity="0">
          <circle cx="345" cy="87" r="5" fill="#F59E0B" stroke="none" />
          <text
            x="354"
            y="91"
            fill="#F59E0B"
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="9"
          >
            REC
          </text>
        </g>
        <text
          data-counter
          x="310"
          y="151"
          fill="#1E40AF"
          stroke="none"
          fontFamily="var(--font-mono)"
          fontSize="9"
        >
          00:00
        </text>
        <g data-guides opacity=".4">
          <path d="M385 92h15v12M415 92h-15v12M385 145h15v-12M415 145h-15v-12" stroke="#1E40AF" />
        </g>
      </g>
    </svg>
  );
}
