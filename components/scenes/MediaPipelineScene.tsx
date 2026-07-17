"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

/**
 * One continuous media workstation rather than a node diagram.
 * A large operator feeds source footage, script, and style into an AI engine,
 * edits the generated sequence, approves it on the review monitor, then the
 * finished frame fans out to three publishing formats.
 */
export function MediaPipelineScene({ className }: { className?: string }) {
  const root = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.from("[data-scene]", {
        autoAlpha: 0,
        y: 16,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });

      if (reduce) return;

      const reel = el.querySelector("[data-reel]");
      const film = el.querySelector("[data-film]");
      const core = el.querySelector("[data-core]");
      const coreRing = el.querySelector("[data-core-ring]");
      const playhead = el.querySelector("[data-playhead]");
      const operatorArm = el.querySelector("[data-operator-arm]");
      const lever = el.querySelector("[data-lever]");
      const check = el.querySelector("[data-check]");
      const frameStrip = el.querySelector("[data-frame-strip]");
      const outputs = gsap.utils.toArray<SVGElement>(el.querySelectorAll("[data-output]"));
      const signal = el.querySelector("[data-signal]");
      const monitorImage = el.querySelector("[data-monitor-image]");

      gsap.to(reel, {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 6,
        repeat: -1,
        ease: "none",
      });
      gsap.to(film, { strokeDashoffset: -32, duration: 1.2, repeat: -1, ease: "none" });
      gsap.to(coreRing, {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 8,
        repeat: -1,
        ease: "none",
      });

      gsap.set(check, { drawSVG: "0%" });
      gsap.set(outputs, { autoAlpha: 0.22, scale: 0.92, transformOrigin: "50% 50%" });
      gsap.set(signal, { autoAlpha: 0 });

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.2,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play pause resume pause" },
      });

      // Source enters the engine; its core wakes up.
      tl.set(signal, { autoAlpha: 1, x: 0 })
        .to(signal, { x: 160, duration: 1, ease: "power2.inOut" })
        .to(
          core,
          { scale: 1.1, transformOrigin: "50% 50%", duration: 0.2, ease: "power2.out" },
          "<0.72"
        )
        .to(core, { scale: 1, duration: 0.35, ease: "power2.inOut" });

      // The operator performs a real edit: reaches, drags the playhead, pulls the lever.
      tl.to(operatorArm, {
        rotation: -7,
        transformBox: "fill-box",
        transformOrigin: "0% 0%",
        duration: 0.35,
        ease: "power2.out",
      })
        .to(playhead, { x: 110, duration: 1.1, ease: "power2.inOut" }, "<0.05")
        .to(operatorArm, { rotation: 0, duration: 0.3, ease: "power2.inOut" }, "<0.75")
        .to(lever, {
          rotation: 20,
          transformOrigin: "50% 100%",
          duration: 0.25,
          ease: "back.out(2)",
        })
        .to(lever, { rotation: 0, duration: 0.35, ease: "power2.inOut" });

      // Generated frames travel to the monitor; approval draws on.
      tl.to(frameStrip, { x: 46, duration: 0.75, ease: "power2.inOut" }, "<0.05")
        .to(monitorImage, { opacity: 1, duration: 0.35 }, "<0.25")
        .to(check, { drawSVG: "100%", duration: 0.5, ease: "power2.out" })
        .to(outputs, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.14,
          ease: "back.out(1.8)",
        });

      // Hold the completed system, then reset quietly.
      tl.to({}, { duration: 1.1 })
        .to([check, outputs], { autoAlpha: 0.22, duration: 0.35 })
        .set(check, { drawSVG: "0%", autoAlpha: 1 })
        .set(outputs, { scale: 0.92 })
        .set(playhead, { x: 0 })
        .set(frameStrip, { x: 0 })
        .set(signal, { autoAlpha: 0 });
    }, root);

    return () => ctx.revert();
  }, []);

  const amber = "#FBBF24";
  const navy = "#071226";

  return (
    <div ref={root} className={className}>
      <svg
        data-scene
        viewBox="0 0 720 340"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full text-white/90"
        role="img"
        aria-label="A media operator turns source footage, script, and style into reviewed content and publishes it to three channels"
      >
        <defs>
          <pattern id="media-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" stroke="currentColor" strokeWidth=".7" opacity=".07" />
          </pattern>
          <radialGradient id="core-glow">
            <stop offset="0" stopColor={amber} stopOpacity=".62" />
            <stop offset=".45" stopColor={amber} stopOpacity=".18" />
            <stop offset="1" stopColor={amber} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="screen-glow" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#203b60" />
            <stop offset="1" stopColor="#0b1c36" />
          </linearGradient>
        </defs>

        <rect width="720" height="340" fill="url(#media-grid)" stroke="none" />
        <path d="M22 310H698" opacity=".18" />

        {/* SOURCE: large reel feeding one continuous machine. */}
        <g transform="translate(28 78)">
          <text
            x="0"
            y="-25"
            fill={amber}
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="14"
            fontWeight="700"
            letterSpacing="2.4"
          >
            SOURCE
          </text>
          <g data-reel transform="translate(54 54)">
            <circle r="48" />
            <circle r="12" />
            {[0, 72, 144, 216, 288].map((angle) => (
              <path
                key={angle}
                transform={`rotate(${angle})`}
                d="M7-8C19-19 35-25 40-16 44-8 31 0 13 4Z"
                opacity=".8"
              />
            ))}
            <circle r="3" fill={amber} stroke={amber} />
          </g>
          <path
            data-film
            d="M98 62C126 69 119 122 154 126 174 128 182 112 198 112"
            stroke={amber}
            strokeDasharray="6 7"
            strokeWidth="3"
          />
          <rect x="8" y="117" width="91" height="77" fill={navy} />
          <path d="M18 132h71v45H18zM24 139h59v31H24z" />
          <path d="M47 148l15 8-15 8z" fill={amber} stroke={amber} />
          <text
            x="53"
            y="188"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="9.5"
            fontWeight="700"
            letterSpacing="1.5"
            opacity=".7"
          >
            RAW FOOTAGE
          </text>
        </g>

        {/* Script roll and style board physically feed the generator. */}
        <g transform="translate(146 46)">
          <path d="M0 8h86M6 8v60M80 8v60" />
          <rect x="12" y="0" width="62" height="14" rx="7" fill={navy} />
          <path d="M17 14h52v73l-8-5-8 5-8-5-8 5-8-5-12 5z" fill="#0d1b32" />
          <text
            x="43"
            y="33"
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
          >
            SCRIPT
          </text>
          <path d="M25 44h36M25 53h31M25 62h36M25 71h25" opacity=".42" strokeWidth="1.4" />
        </g>
        <g transform="translate(145 150)">
          <rect width="88" height="66" fill={navy} />
          <text
            x="12"
            y="17"
            fill="currentColor"
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
          >
            STYLE
          </text>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={12 + i * 17}
              y="27"
              width="12"
              height="12"
              fill={i === 3 ? amber : "none"}
              opacity={i === 3 ? 1 : 0.6}
            />
          ))}
          <path d="M12 51h58" opacity=".35" strokeWidth="1.4" />
        </g>
        <path d="M233 89h28M233 181h28" stroke={amber} strokeWidth="2.4" />
        <path d="M254 84l8 5-8 5M254 176l8 5-8 5" stroke={amber} />

        {/* GENERATE: substantial central engine with pipes and illuminated core. */}
        <g transform="translate(258 38)">
          <text
            x="70"
            y="-7"
            textAnchor="middle"
            fill={amber}
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="14"
            fontWeight="700"
            letterSpacing="2.4"
          >
            GENERATE
          </text>
          <path d="M14 21h112l14 16v139l-14 16H14L0 176V37z" fill={navy} />
          <path d="M24 35h92l10 11v121l-10 11H24l-10-11V46z" opacity=".6" />
          <circle cx="70" cy="106" r="62" fill="url(#core-glow)" stroke="none" />
          <circle
            data-core-ring
            cx="70"
            cy="106"
            r="48"
            stroke={amber}
            strokeDasharray="5 8"
            opacity=".8"
          />
          <g data-core>
            <circle cx="70" cy="106" r="31" fill="#102342" stroke={amber} />
            <circle cx="70" cy="106" r="6" fill={amber} stroke={amber} />
            <circle cx="51" cy="88" r="3" fill={amber} stroke="none" />
            <circle cx="91" cy="87" r="3" fill={amber} stroke="none" />
            <circle cx="49" cy="126" r="3" fill={amber} stroke="none" />
            <circle cx="91" cy="127" r="3" fill={amber} stroke="none" />
            <path
              d="M54 91l12 11M87 90l-13 12M53 123l13-12M87 124l-13-13"
              stroke={amber}
              opacity=".7"
              strokeWidth="1.5"
            />
          </g>
          <path d="M24 14V4h30M86 4h30v10M24 198v10h30M86 208h30v-10" opacity=".5" />
        </g>

        {/* Travelling source signal enters the core. */}
        <g data-signal transform="translate(228 144)">
          <circle r="5" fill={amber} stroke="none" />
          <circle r="11" fill={amber} fillOpacity=".16" stroke="none" />
        </g>

        {/* REVIEW: one large monitor, not another tiny node. */}
        <g transform="translate(421 44)">
          <text
            x="88"
            y="-13"
            textAnchor="middle"
            fill={amber}
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="14"
            fontWeight="700"
            letterSpacing="2.4"
          >
            REVIEW
          </text>
          <path d="M8 0h160l10 10v122l-10 10H8L0 132V10z" fill={navy} />
          <rect x="14" y="14" width="150" height="95" rx="3" fill="url(#screen-glow)" />
          <g data-monitor-image opacity=".56">
            <circle cx="132" cy="39" r="12" fill={amber} fillOpacity=".58" stroke="none" />
            <path d="M20 96 59 54 83 78 104 55 158 96Z" fill="#152f4d" />
            <path d="M20 96 59 54 83 78M83 78l21-23 54 41" opacity=".85" />
            <path d="M20 98c34-14 61 9 138-8" stroke={amber} opacity=".65" />
          </g>
          <circle cx="140" cy="83" r="18" fill="#071226" fillOpacity=".82" stroke={amber} />
          <path data-check d="M131 83l7 7 13-16" stroke={amber} strokeWidth="3.2" />
          <path d="M18 121h64M96 121h58" opacity=".4" strokeWidth="1.5" />
          <path d="M74 142v16M104 142v16M58 158h62" />
        </g>

        {/* Editing console physically joins generator and review monitor. */}
        <g transform="translate(182 231)">
          <path d="M15 0h311l16 65H0z" fill="#09182d" />
          <path d="M31 14h213v31H31z" />
          <path
            d="M41 23h28v13H41M78 23h44v13H78M131 23h24v13h-24M164 23h52v13h-52"
            opacity=".55"
            strokeWidth="1.5"
          />
          <path d="M42 50h202" stroke={amber} opacity=".75" />
          <g data-playhead transform="translate(63 10)">
            <path d="M0 0v42" stroke={amber} strokeWidth="2.4" />
            <path d="M-5 0h10L0 7z" fill={amber} stroke={amber} />
          </g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={31 + i * 31}
              y="54"
              width="18"
              height="6"
              fill={i === 3 ? amber : "none"}
              opacity={i === 3 ? 1 : 0.55}
            />
          ))}
          <g data-lever transform="translate(284 47)">
            <circle cx="0" cy="0" r="20" />
            <path d="M0 0 12-25" strokeWidth="4" />
            <circle cx="12" cy="-25" r="6" fill={amber} stroke={amber} />
          </g>
        </g>

        {/* Generated frames move through a physical film strip beneath review. */}
        <g transform="translate(428 204)">
          <path d="M0 0h170v42H0z" fill={navy} />
          <g data-frame-strip>
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(${8 + i * 40} 8)`}>
                <rect width="32" height="25" />
                <path
                  d="M3 21 12 11l7 7 5-6 5 9"
                  stroke={amber}
                  opacity={0.45 + i * 0.15}
                  strokeWidth="1.4"
                />
              </g>
            ))}
          </g>
        </g>

        {/* Operator: large, articulated, planted, and physically using the console. */}
        <g transform="translate(286 165)">
          <circle cx="0" cy="0" r="10" fill={navy} />
          <path d="M0 11 4 58" strokeWidth="3.2" />
          {/* left arm adjusts timeline; right arm reaches the lever */}
          <g data-operator-arm>
            <path d="M1 23-19 41-49 39" strokeWidth="3.2" />
            <circle cx="-49" cy="39" r="3.6" fill={amber} stroke={amber} />
          </g>
          <path d="M2 23 29 43 58 39" strokeWidth="3.2" />
          <circle cx="58" cy="39" r="3.6" fill={amber} stroke={amber} />
          {/* planted bent legs */}
          <path d="M4 58-16 83-35 118M4 58l29 24 17 36" strokeWidth="3.2" />
          <path d="M-44 118h18M43 118h18" strokeWidth="3.2" />
        </g>

        {/* PUBLISH: three genuinely different output formats. */}
        <g transform="translate(620 45)">
          <text
            x="42"
            y="-14"
            textAnchor="middle"
            fill={amber}
            stroke="none"
            fontFamily="var(--font-mono)"
            fontSize="14"
            fontWeight="700"
            letterSpacing="2.4"
          >
            PUBLISH
          </text>
          <path d="M-20 110h18M-7 105l8 5-8 5" stroke={amber} />
          <g data-output>
            <rect x="12" y="0" width="52" height="82" rx="8" fill={navy} />
            <rect x="18" y="10" width="40" height="55" rx="2" />
            <path d="M21 59 34 42l8 8 7-10 6 19" stroke={amber} strokeWidth="1.5" />
            <circle cx="38" cy="73" r="2" fill={amber} stroke="none" />
          </g>
          <g data-output transform="translate(0 98)">
            <rect x="4" y="0" width="68" height="68" fill={navy} />
            <rect x="11" y="8" width="54" height="39" />
            <path d="M15 43 29 27l10 9 8-10 14 17" stroke={amber} strokeWidth="1.5" />
            <path d="M13 57h22M43 57h16" opacity=".45" strokeWidth="1.4" />
          </g>
          <g data-output transform="translate(-8 183)">
            <rect x="0" y="0" width="84" height="56" rx="3" fill={navy} />
            <rect x="7" y="7" width="70" height="34" />
            <path d="M11 37 27 21l10 9 9-12 27 19" stroke={amber} strokeWidth="1.5" />
            <path d="M8 48h68" opacity=".4" strokeWidth="1.4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
