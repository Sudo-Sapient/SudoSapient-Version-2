import * as React from "react";

export type MicroKind =
  | "no-transfer"
  | "your-control"
  | "direct-contact"
  | "use-boundary"
  | "clear-ownership"
  | "external-edge";

const INK = "#0f172a";
const LINE = "#334155";
const PAPER = "#f7f9fc";
const ACCENT = "#fbbf24";

function W({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      stroke={INK}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      {children}
    </g>
  );
}

const body = (armLeft: string, armRight: React.ReactNode, extraHead?: React.ReactNode) => (
  <>
    <circle cx="0" cy="-46" r="7" fill={PAPER} />
    {extraHead}
    <line x1="0" y1="-39" x2="0" y2="-8" />
    <path d={armLeft} />
    {armRight}
    <path d="M0 -8 L-10 18 L-12 40" />
    <path d="M0 -8 L10 18 L12 40" />
  </>
);

const scenes: Record<MicroKind, React.ReactNode> = {
  "no-transfer": (
    <>
      <W x={34} y={66}>
        {body("M0 -30 L-14 -18", <path d="M0 -30 L16 -30 L28 -30" />)}
      </W>
      {/* barrier the worker holds down against an outgoing arrow */}
      <rect x={62} y={44} width={5} height={40} fill={INK} />
      <g>
        <path d="M78 60 h26" stroke={LINE} strokeWidth="2.4" />
        <path d="M98 54 l8 6 l-8 6" fill="none" stroke={LINE} strokeWidth="2.4" />
        <animate
          attributeName="opacity"
          values="0.2;0.2;1;0.2"
          dur="3.4s"
          repeatCount="indefinite"
        />
      </g>
      <line x1="62" y1="52" x2="104" y2="52" stroke={ACCENT} strokeWidth="3" />
      <rect
        x="86"
        y="70"
        width="26"
        height="18"
        rx="2"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.6"
      />
    </>
  ),
  "your-control": (
    <>
      <W x={30} y={66}>
        {body(
          "M0 -28 L-14 -16",
          <g>
            <path d="M0 -28 L16 -24 L26 -18" />
          </g>
        )}
      </W>
      {/* drawer sliding out with the requested file returned */}
      <rect
        x="60"
        y="46"
        width="52"
        height="42"
        rx="3"
        fill="#dbe3f0"
        stroke={INK}
        strokeWidth="2"
      />
      <g>
        <rect
          x="64"
          y="52"
          width="40"
          height="12"
          rx="2"
          fill={PAPER}
          stroke={INK}
          strokeWidth="1.6"
        />
        <circle cx="102" cy="58" r="2.5" fill={ACCENT} />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 14 0; 14 0; 0 0"
          keyTimes="0;0.3;0.7;1"
          dur="3.6s"
          repeatCount="indefinite"
        />
      </g>
      <line x1="64" y1="76" x2="104" y2="76" stroke={LINE} strokeWidth="1.4" />
    </>
  ),
  "direct-contact": (
    <>
      <W x={34} y={66}>
        {body(
          "M0 -30 L-14 -18",
          <g>
            <path d="M0 -30 L14 -34 L24 -42" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 0 -30;-16 0 -30;0 0 -30;0 0 -30"
              keyTimes="0;0.2;0.4;1"
              dur="2.6s"
              repeatCount="indefinite"
            />
          </g>
        )}
      </W>
      {/* terminal receiving mail + acknowledgement flag */}
      <rect x="66" y="48" width="46" height="34" rx="3" fill={INK} />
      <rect x="72" y="54" width="34" height="18" fill="#1c2b4a" stroke={LINE} strokeWidth="1" />
      <path d="M72 54 l17 11 l17 -11" fill="none" stroke={ACCENT} strokeWidth="1.6" />
      <g>
        <line x1="112" y1="48" x2="112" y2="30" stroke={INK} strokeWidth="2" />
        <path d="M112 30 h14 v9 h-14" fill={ACCENT} stroke={INK} strokeWidth="1.4" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 112 48;0 112 48;-8 112 48;0 112 48"
          keyTimes="0;0.4;0.5;0.7"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </g>
    </>
  ),
  "use-boundary": (
    <>
      <W x={30} y={66}>
        {body(
          "M0 -28 L-13 -16",
          <path d="M0 -28 L18 -32 L30 -34" />,
          <line x1="-2.5" y1="-48" x2="1.5" y2="-48" stroke={INK} strokeWidth="1.3" />
        )}
      </W>
      {/* protected terminal, blocked figure at an access line */}
      <line x1="70" y1="40" x2="70" y2="88" stroke={ACCENT} strokeWidth="3" strokeDasharray="4 5" />
      <rect x="78" y="54" width="34" height="34" rx="3" fill={INK} />
      <rect x="84" y="60" width="22" height="14" fill="#1c2b4a" />
      <g opacity="0.55">
        <circle cx="118" cy="52" r="5" stroke={LINE} strokeWidth="2" />
        <path d="M118 57 v14 M112 63 h12" stroke={LINE} strokeWidth="2" />
        <path d="M62 48 l16 16 M78 48 l-16 16" stroke="#b91c1c" strokeWidth="2">
          <animate attributeName="opacity" values="0;1;0;0" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
    </>
  ),
  "clear-ownership": (
    <>
      <W x={30} y={66}>
        {body(
          "M0 -28 L-14 -16",
          <path d="M0 -28 L16 -24 L26 -18" />,
          <line x1="-2.5" y1="-48" x2="1.5" y2="-48" stroke={INK} strokeWidth="1.3" />
        )}
      </W>
      {/* two labelled drawers, nothing crosses */}
      <rect
        x="58"
        y="48"
        width="26"
        height="40"
        rx="2"
        fill="#dbe3f0"
        stroke={INK}
        strokeWidth="1.8"
      />
      <rect
        x="90"
        y="48"
        width="26"
        height="40"
        rx="2"
        fill="#dbe3f0"
        stroke={INK}
        strokeWidth="1.8"
      />
      <text
        x="71"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="7"
        fill={INK}
      >
        SUDO
      </text>
      <text
        x="103"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="7"
        fill={INK}
      >
        CLNT
      </text>
      <line x1="87" y1="44" x2="87" y2="90" stroke={ACCENT} strokeWidth="2.4" />
      <g>
        <rect x="62" y="52" width="18" height="9" fill={PAPER} stroke={INK} strokeWidth="1.4" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -6; 0 0"
          keyTimes="0;0.5;1"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </g>
    </>
  ),
  "external-edge": (
    <>
      <W x={28} y={66}>
        {body("M0 -28 L-13 -16", <path d="M0 -28 L18 -26 L30 -24" />)}
      </W>
      {/* cable to an external, independent terminal past a boundary line */}
      <path d="M58 42 h58" stroke={ACCENT} strokeWidth="2" strokeDasharray="3 4" />
      <path d="M58 52 q22 18 44 0" fill="none" stroke={INK} strokeWidth="2" />
      <rect x="96" y="50" width="22" height="30" rx="3" fill={INK} />
      <rect x="100" y="55" width="14" height="12" fill="#1c2b4a" />
      <circle cx="107" cy="74" r="2.5" fill={ACCENT}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <text
        x="107"
        y="94"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="7"
        fill={LINE}
      >
        EXTERNAL
      </text>
    </>
  ),
};

const meta: Record<MicroKind, { label: string; note: string }> = {
  "no-transfer": { label: "NO TRANSFER", note: "Information stays inside the stated workflow." },
  "your-control": {
    label: "YOUR CONTROL",
    note: "Access, correction, and deletion stay available on request.",
  },
  "direct-contact": { label: "DIRECT CONTACT", note: "Questions reach a real studio inbox." },
  "use-boundary": { label: "USE BOUNDARY", note: "An information surface, not an access point." },
  "clear-ownership": {
    label: "CLEAR OWNERSHIP",
    note: "Studio and client materials stay separately labelled.",
  },
  "external-edge": {
    label: "EXTERNAL EDGE",
    note: "Outside services operate beyond our boundary.",
  },
};

export function LegalMicroScene({ kind }: { kind: MicroKind }) {
  const { label, note } = meta[kind];
  return (
    <div className="relative overflow-hidden">
      <svg viewBox="0 0 150 110" className="w-full" role="img" aria-label={`${label}. ${note}`}>
        <g opacity="0.35" stroke={LINE} strokeWidth="0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={i * 18} y1="0" x2={i * 18} y2="110" opacity="0.3" />
          ))}
        </g>
        <line x1="8" y1="106" x2="142" y2="106" stroke={LINE} strokeWidth="1.2" />
        {scenes[kind]}
      </svg>
      <p className="mt-3 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-ink">
        {label}
      </p>
      <p className="mt-1 max-w-[16rem] text-[11px] leading-4 text-ink/55">{note}</p>
    </div>
  );
}
