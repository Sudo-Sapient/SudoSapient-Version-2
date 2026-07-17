"use client";

import * as React from "react";

export type LegalSceneVariant = "privacy" | "terms";

/**
 * Fully authored SVG scenes. Everything — machinery, figures, motion — lives in
 * one coordinate space so the people read as part of the illustration rather
 * than boxed-out highlights. Animation is native SVG/SMIL so it survives SSR and
 * respects reduced-motion via the CSS guard at the bottom.
 */
export function LegalOperationsScene({ variant }: { variant: LegalSceneVariant }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current?.querySelector("svg")?.pauseAnimations?.();
    }
  }, []);
  return <div ref={ref}>{variant === "privacy" ? <PrivacyVault /> : <TermsForge />}</div>;
}

/* Shared ink + accent palette pulled from the site tokens. */
const INK = "#0f172a";
const LINE = "#334155";
const PAPER = "#f7f9fc";
const ACCENT = "#fbbf24";
const STEEL = "#c9d4e3";

function Worker({
  x,
  y,
  s = 1,
  flip = false,
  children,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
      stroke={INK}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      {children}
    </g>
  );
}

function PrivacyVault() {
  return (
    <figure
      className="legal-scene border-ink/12 relative overflow-hidden rounded-lg border bg-gradient-to-b from-[#eef2f8] to-[#dde5f0]"
      aria-label="An enquiry travels through a sealed privacy vault: received, encrypted, and stored under a retention clock."
    >
      <svg viewBox="0 0 640 400" className="h-full w-full" role="img">
        <defs>
          <linearGradient id="pv-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e4ebf5" />
            <stop offset="1" stopColor="#cdd8e8" />
          </linearGradient>
          <radialGradient id="pv-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={ACCENT} stopOpacity="0.35" />
            <stop offset="1" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
          <clipPath id="pv-vault">
            <rect x="382" y="150" width="150" height="150" rx="8" />
          </clipPath>
        </defs>

        {/* dotted blueprint field */}
        <g opacity="0.4" stroke={LINE} strokeWidth="0.6">
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" opacity="0.25" />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="640" y2={i * 40} opacity="0.25" />
          ))}
        </g>

        <rect x="0" y="312" width="640" height="88" fill="url(#pv-floor)" />
        <line x1="0" y1="312" x2="640" y2="312" stroke={LINE} strokeWidth="1.4" />

        {/* header ticket */}
        <g fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="2" fill={LINE}>
          <text x="28" y="40">
            PRIVACY VAULT — INTAKE / SEAL / HOLD
          </text>
          <circle cx="600" cy="35" r="4" fill={ACCENT}>
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* ── STATION 1: intake chute ── */}
        <path
          d="M40 150 h96 v40 l-20 18 h-56 l-20 -18 Z"
          fill={STEEL}
          stroke={LINE}
          strokeWidth="1.6"
        />
        <rect x="60" y="150" width="56" height="10" fill={INK} />
        {/* envelope dropping + sliding to the conveyor */}
        <g>
          <rect
            x="72"
            y="120"
            width="34"
            height="24"
            rx="2"
            fill={PAPER}
            stroke={INK}
            strokeWidth="1.6"
          />
          <path d="M72 122 l17 12 l17 -12" fill="none" stroke={INK} strokeWidth="1.4" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 -34; 0 84; 0 84; 210 84; 210 84; 210 84"
            keyTimes="0;0.18;0.34;0.58;0.9;1"
            dur="7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;1;0;0"
            keyTimes="0;0.12;0.34;0.82;0.9;1"
            dur="7s"
            repeatCount="indefinite"
          />
        </g>

        {/* conveyor */}
        <rect x="56" y="300" width="300" height="12" rx="6" fill={INK} />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={70 + i * 25} cy="306" r="3" fill={STEEL}>
            <animate
              attributeName="cx"
              values={`${70 + i * 25};${70 + i * 25 + 25}`}
              dur="1.1s"
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* intake worker: reaches for the drop, then rests */}
        <Worker x={92} y={236} s={1.15}>
          <circle cx="0" cy="-52" r="8" fill={PAPER} />
          <line x1="0" y1="-44" x2="0" y2="-8" />
          <path d="M0 -36 L-16 -20" />
          <g>
            <path d="M0 -36 L18 -46 L30 -60" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 -36; -22 0 -36; 0 0 -36; 0 0 -36"
              keyTimes="0;0.16;0.34;1"
              dur="7s"
              repeatCount="indefinite"
            />
          </g>
          <path d="M0 -8 L-12 22 L-14 46" />
          <path d="M0 -8 L12 22 L14 46" />
        </Worker>

        {/* ── STATION 2: vault (seal) ── */}
        <rect
          x="382"
          y="150"
          width="150"
          height="150"
          rx="8"
          fill="#dce4f0"
          stroke={LINE}
          strokeWidth="2"
        />
        <rect
          x="382"
          y="150"
          width="150"
          height="150"
          rx="8"
          fill="url(#pv-glow)"
          clipPath="url(#pv-vault)"
        />
        {/* vault door closing */}
        <g clipPath="url(#pv-vault)">
          <rect x="382" y="150" width="150" height="150" fill="#eef3fa" />
          <g>
            <rect
              x="382"
              y="150"
              width="150"
              height="150"
              fill="#b9c7dc"
              stroke={LINE}
              strokeWidth="2"
            />
            <circle cx="457" cy="225" r="30" fill="none" stroke={INK} strokeWidth="3" />
            <circle cx="457" cy="225" r="7" fill={INK} />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="457"
                y1="225"
                x2={457 + 30 * Math.cos((i * Math.PI) / 4)}
                y2={225 + 30 * Math.sin((i * Math.PI) / 4)}
                stroke={INK}
                strokeWidth="2"
              />
            ))}
            <animateTransform
              attributeName="transform"
              type="translate"
              values="150 0; 150 0; 0 0; 0 0; 150 0"
              keyTimes="0;0.34;0.46;0.86;1"
              dur="7s"
              repeatCount="indefinite"
            />
          </g>
        </g>
        <rect
          x="382"
          y="150"
          width="150"
          height="150"
          rx="8"
          fill="none"
          stroke={INK}
          strokeWidth="2.5"
        />
        {/* lock light */}
        <circle cx="512" cy="168" r="6" fill={ACCENT} stroke={INK} strokeWidth="1.5">
          <animate
            attributeName="fill"
            values={`${LINE};${LINE};${ACCENT};${ACCENT};${LINE}`}
            keyTimes="0;0.44;0.5;0.86;1"
            dur="7s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="457"
          y="330"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="9"
          letterSpacing="2"
          fill={LINE}
        >
          ENCRYPTED
        </text>

        {/* seal worker: pulls the lock lever */}
        <Worker x={352} y={236} s={1.15} flip>
          <circle cx="0" cy="-52" r="8" fill={PAPER} />
          <line x1="-2.5" y1="-54" x2="1.5" y2="-54" stroke={INK} strokeWidth="1.4" />
          <line x1="0" y1="-44" x2="0" y2="-8" />
          <path d="M0 -36 L-14 -22" />
          <g>
            <path d="M0 -36 L20 -40 L34 -34" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 -36; 0 0 -36; -30 0 -36; 6 0 -36; 0 0 -36"
              keyTimes="0;0.3;0.42;0.5;1"
              dur="7s"
              repeatCount="indefinite"
            />
          </g>
          <path d="M0 -8 L-11 22 L-13 46" />
          <path d="M0 -8 L11 22 L13 46" />
        </Worker>

        {/* ── STATION 3: retention clock + archive ── */}
        <rect x="560" y="196" width="60" height="116" rx="4" fill={INK} />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect
              x="568"
              y={206 + r * 34}
              width="44"
              height="24"
              rx="2"
              fill="#1c2b4a"
              stroke={STEEL}
              strokeWidth="1"
            />
            <rect
              x="574"
              y={214 + r * 34}
              width="16"
              height="8"
              fill={r === 0 ? ACCENT : STEEL}
              opacity={r === 0 ? 1 : 0.5}
            >
              {r === 0 && (
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              )}
            </rect>
          </g>
        ))}
        {/* retention clock */}
        <circle cx="590" cy="120" r="26" fill={PAPER} stroke={INK} strokeWidth="2.4" />
        <line x1="590" y1="120" x2="590" y2="102" stroke={INK} strokeWidth="2.4">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 590 120"
            to="360 590 120"
            dur="6s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="590" y1="120" x2="604" y2="120" stroke={LINE} strokeWidth="2">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 590 120"
            to="360 590 120"
            dur="30s"
            repeatCount="indefinite"
          />
        </line>
        <circle cx="590" cy="120" r="3" fill={ACCENT} />

        {/* floor station ticks */}
        <g fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="1.5" fill={LINE}>
          <text x="96" y="360" textAnchor="middle">
            01 · RECEIVED
          </text>
          <text x="320" y="360" textAnchor="middle">
            02 · SEALED
          </text>
          <text x="560" y="360" textAnchor="middle">
            03 · HELD
          </text>
        </g>
      </svg>
    </figure>
  );
}

function TermsForge() {
  return (
    <figure
      className="legal-scene border-ink/12 relative overflow-hidden rounded-lg border bg-gradient-to-b from-[#eef2f8] to-[#dde5f0]"
      aria-label="An enquiry only becomes an engagement after review, two approvals unlock a gate, and the agreement is stamped."
    >
      <svg viewBox="0 0 640 400" className="h-full w-full" role="img">
        <defs>
          <linearGradient id="tf-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e4ebf5" />
            <stop offset="1" stopColor="#cdd8e8" />
          </linearGradient>
        </defs>

        <g opacity="0.4" stroke={LINE} strokeWidth="0.6">
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" opacity="0.25" />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="640" y2={i * 40} opacity="0.25" />
          ))}
        </g>

        <rect x="0" y="312" width="640" height="88" fill="url(#tf-floor)" />
        <line x1="0" y1="312" x2="640" y2="312" stroke={LINE} strokeWidth="1.4" />

        <g fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="2" fill={LINE}>
          <text x="28" y="40">
            AGREEMENT FORGE — REVIEW / UNLOCK / STAMP
          </text>
          <circle cx="600" cy="35" r="4" fill={ACCENT}>
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* review desk */}
        <rect x="70" y="286" width="150" height="10" fill={INK} />
        <rect x="82" y="296" width="6" height="16" fill={INK} />
        <rect x="202" y="296" width="6" height="16" fill={INK} />
        <rect
          x="96"
          y="252"
          width="96"
          height="34"
          rx="2"
          fill={PAPER}
          stroke={INK}
          strokeWidth="1.8"
        />
        <line x1="108" y1="264" x2="180" y2="264" stroke={LINE} strokeWidth="1.4" />
        <line x1="108" y1="272" x2="164" y2="272" stroke={LINE} strokeWidth="1.4" />

        {/* review worker: measures with a ruler */}
        <Worker x={130} y={244} s={1.15}>
          <circle cx="0" cy="-52" r="8" fill={PAPER} />
          <line x1="-2.5" y1="-54" x2="1.5" y2="-54" stroke={INK} strokeWidth="1.4" />
          <line x1="0" y1="-44" x2="0" y2="-8" />
          <path d="M0 -36 L-16 -24" />
          <g>
            <path d="M0 -36 L18 -30 L34 -30" />
            <rect
              x="30"
              y="-34"
              width="16"
              height="8"
              fill={ACCENT}
              stroke={INK}
              strokeWidth="1.4"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 6 0; 0 0; 0 0"
              keyTimes="0;0.15;0.3;1"
              dur="8s"
              repeatCount="indefinite"
            />
          </g>
          <path d="M0 -8 L-11 22 L-13 46" />
          <path d="M0 -8 L11 22 L13 46" />
        </Worker>

        {/* travelling document: stops at the gate until unlocked, then passes */}
        <g>
          <rect
            x="0"
            y="270"
            width="40"
            height="28"
            rx="2"
            fill={PAPER}
            stroke={INK}
            strokeWidth="1.8"
          />
          <text
            x="20"
            y="282"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="6"
            fill={LINE}
          >
            ENQUIRY
          </text>
          <line x1="8" y1="288" x2="32" y2="288" stroke={LINE} strokeWidth="1.2" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="60 0; 250 0; 250 0; 250 0; 470 0; 470 0"
            keyTimes="0;0.2;0.5;0.62;0.86;1"
            dur="8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;1;1;0"
            keyTimes="0;0.08;0.5;0.62;0.9;1"
            dur="8s"
            repeatCount="indefinite"
          />
        </g>

        {/* the gate: two approval lamps, then the bar lifts */}
        <g>
          <rect x="330" y="196" width="14" height="116" fill={INK} />
          <rect x="410" y="196" width="14" height="116" fill={INK} />
          {/* gate bar */}
          <g>
            <rect
              x="330"
              y="292"
              width="94"
              height="12"
              rx="3"
              fill={ACCENT}
              stroke={INK}
              strokeWidth="1.6"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 0; 0 -86; 0 -86; 0 0"
              keyTimes="0;0.5;0.6;0.86;1"
              dur="8s"
              repeatCount="indefinite"
            />
          </g>
          {/* approval lamps */}
          <circle cx="352" cy="176" r="9" fill={LINE} stroke={INK} strokeWidth="1.6">
            <animate
              attributeName="fill"
              values={`${LINE};${ACCENT};${ACCENT};${LINE}`}
              keyTimes="0;0.24;0.9;1"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="402" cy="176" r="9" fill={LINE} stroke={INK} strokeWidth="1.6">
            <animate
              attributeName="fill"
              values={`${LINE};${LINE};${ACCENT};${ACCENT};${LINE}`}
              keyTimes="0;0.42;0.48;0.9;1"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x="377"
            y="152"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            letterSpacing="1.5"
            fill={LINE}
          >
            BOTH · REQUIRED
          </text>
        </g>

        {/* stamp press */}
        <rect x="486" y="286" width="120" height="10" fill={INK} />
        <rect
          x="510"
          y="140"
          width="72"
          height="18"
          rx="3"
          fill={STEEL}
          stroke={LINE}
          strokeWidth="1.6"
        />
        <rect x="540" y="158" width="12" height="70" fill={INK} />
        <g>
          <rect x="520" y="228" width="52" height="24" rx="3" fill={INK} />
          <text
            x="546"
            y="245"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="10"
            fontWeight="bold"
            fill={ACCENT}
          >
            AGREED
          </text>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 0; 0 0; 0 34; 0 0; 0 0"
            keyTimes="0;0.6;0.72;0.78;0.86;1"
            dur="8s"
            repeatCount="indefinite"
          />
        </g>
        {/* stamped mark flashes on the desk output */}
        <g opacity="0">
          <circle cx="546" cy="286" r="16" fill="none" stroke={ACCENT} strokeWidth="3" />
          <animate
            attributeName="opacity"
            values="0;0;0;1;0;0"
            keyTimes="0;0.72;0.78;0.8;0.9;1"
            dur="8s"
            repeatCount="indefinite"
          />
        </g>

        {/* sign-off worker: presses the stamp */}
        <Worker x={470} y={244} s={1.15} flip>
          <circle cx="0" cy="-52" r="8" fill={PAPER} />
          <line x1="0" y1="-44" x2="0" y2="-8" />
          <path d="M0 -36 L-16 -22" />
          <g>
            <path d="M0 -36 L20 -34 L34 -40" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 -36; 0 0 -36; 0 0 -36; -18 0 -36; 0 0 -36"
              keyTimes="0;0.6;0.72;0.78;1"
              dur="8s"
              repeatCount="indefinite"
            />
          </g>
          <path d="M0 -8 L-11 22 L-13 46" />
          <path d="M0 -8 L11 22 L13 46" />
        </Worker>

        <g fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="1.5" fill={LINE}>
          <text x="130" y="360" textAnchor="middle">
            01 · REVIEW
          </text>
          <text x="377" y="360" textAnchor="middle">
            02 · UNLOCK
          </text>
          <text x="546" y="360" textAnchor="middle">
            03 · STAMP
          </text>
        </g>
      </svg>
    </figure>
  );
}
