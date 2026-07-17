import * as React from "react";

export type ClimberPose =
  | "stand"
  | "walkA"
  | "walkB"
  | "reach"
  | "pullA"
  | "pullB"
  | "crouch"
  | "carry"
  | "draft"
  | "plug"
  | "press"
  | "inspect"
  | "camera"
  | "panLeft"
  | "panRight"
  | "push"
  | "duck"
  | "sit"
  | "point"
  | "measure"
  | "wave"
  | "surrender";

const poses: Record<ClimberPose, React.ReactNode> = {
  stand: (
    <>
      <circle cx="20" cy="8" r="5" />
      <path d="M20 13v26M20 18 13 30 12 41M20 18l7 12 1 11M20 39l-5 14-1 15M20 39l5 14 1 15" />
    </>
  ),
  walkA: (
    <>
      <circle cx="20" cy="8" r="5" />
      <path d="M20 13 19 39M20 18 12 27 8 36M20 18l8 8 5 8M19 39 10 50 6 64M19 39l9 9 5 9" />
    </>
  ),
  walkB: (
    <>
      <circle cx="20" cy="8" r="5" />
      <path d="M20 13 21 39M20 18l8 9 4 10M20 18l-8 8-5 8M21 39l9 11 4 14M21 39l-9 9-5 9" />
    </>
  ),
  reach: (
    <>
      <circle cx="20" cy="8" r="5" />
      <path d="M20 13 18 39M19 18 10 27 7 39M19 18l10 7 8 5M18 39l-7 14-1 15M18 39l7 14 2 15" />
    </>
  ),
  pullA: (
    <>
      <circle cx="17" cy="8" r="5" />
      <path d="M17 13 20 39M18 18 29 22 38 20M18 19l10 8 10 1M20 39l-9 12-2 16M20 39l8 12 5 13" />
    </>
  ),
  pullB: (
    <>
      <circle cx="16" cy="8" r="5" />
      <path d="M16 13 21 39M18 18 29 20 38 17M18 19l11 6 9-1M21 39l-10 10-4 15M21 39l8 14 2 15" />
    </>
  ),
  crouch: (
    <>
      <circle cx="20" cy="15" r="5" />
      <path d="M20 20 18 43M19 25 10 35 8 47M19 25l10 10 3 12M18 43 9 50 14 61M18 43l10 7-3 12" />
    </>
  ),
  carry: (
    <>
      <circle cx="20" cy="12" r="5" />
      <path d="M20 17v25M20 21 11 13 8 4M20 21l9-8 3-9M20 42l-6 13-1 13M20 42l7 13 2 13M7 2h26v7H7z" />
    </>
  ),
  draft: (
    <>
      <circle cx="17" cy="14" r="5" />
      <path d="M18 19 22 42M19 24 9 34 7 45M19 24l12 8 6 8M22 42l-7 13-1 13M22 42l7 13 1 13M29 43h12M36 39l5 5" />
    </>
  ),
  plug: (
    <>
      <circle cx="17" cy="9" r="5" />
      <path d="M17 14 21 40M18 19 8 29 6 41M18 19l12 7 9 1M21 40l-8 13-1 15M21 40l8 13 3 15M37 24h3v7h-3" />
    </>
  ),
  press: (
    <>
      <circle cx="18" cy="9" r="5" />
      <path d="M18 14 20 40M19 19 9 29 7 41M19 19l10-4 10 1M20 40l-7 14-1 14M20 40l7 14 2 14" />
    </>
  ),
  inspect: (
    <>
      <circle cx="20" cy="9" r="5" />
      <path d="M20 14v26M20 19 12 29 11 41M20 19l8 9-1 12M20 40l-6 14-1 14M20 40l7 14 1 14" />
      <path d="M22 29h12v10H22zM25 32h6M25 35h4" stroke="#FBBF24" strokeWidth="1.6" />
    </>
  ),
  camera: (
    <>
      <circle cx="17" cy="10" r="5" />
      <path d="M17 15 21 41M18 20 9 30 7 42M18 20l12 4 8-2M21 41l-7 14-1 13M21 41l8 14 2 13M35 18h6v10h-6M41 21l4-2v8l-4-2" />
    </>
  ),
  panLeft: (
    <>
      <circle cx="16" cy="10" r="5" />
      <path d="M16 15 21 41M17 20 8 29 6 41M17 20l12 2 9-4M21 41l-8 14-2 13M21 41l8 14 3 13M35 15h6v10h-6M41 18l4-2v8l-4-2" />
    </>
  ),
  panRight: (
    <>
      <circle cx="18" cy="10" r="5" />
      <path d="M18 15 21 41M18 20 10 31 9 43M18 20l12 6 8 1M21 41l-6 14-1 13M21 41l8 14 2 13M35 23h6v10h-6M41 26l4-2v8l-4-2" />
    </>
  ),
  push: (
    <>
      <circle cx="16" cy="9" r="5" />
      <path d="M16 14 21 40M18 19 29 24 38 24M18 20l11 9 9 1M21 40l-10 11-3 15M21 40l8 14 3 14M37 24v30H21M24 59a3 3 0 1 0 0 .1M36 59a3 3 0 1 0 0 .1" />
    </>
  ),
  duck: (
    <>
      <circle cx="19" cy="25" r="5" />
      <path d="M19 30 25 45M20 33 10 27 7 19M21 33l9-7 5-7M25 45l-12 7-3 12M25 45l9 6-2 13M8 18l3-4M34 18l-3-4" />
    </>
  ),
  sit: (
    <>
      <circle cx="20" cy="14" r="5" />
      <path d="M20 19v22M20 24l-8 9 5 8M20 24l8 9-5 8M20 41 9 50l11 3M20 41l11 9-11 3M7 55h26" />
    </>
  ),
  point: (
    <>
      <circle cx="18" cy="8" r="5" />
      <path d="M18 13 20 40M19 18 11 29 9 41M19 18l10-4 10-5M20 40l-7 14-1 14M20 40l8 14 2 14" />
    </>
  ),
  measure: (
    <>
      <circle cx="22" cy="9" r="5" />
      <path d="M22 14v26M22 19 13 11 8 6M22 19l8 10 1 12M22 40l-7 14-1 14M22 40l7 14 2 14M7 3v54M4 10h6M4 20h6M4 30h6M4 40h6M4 50h6" />
    </>
  ),
  wave: (
    <>
      <circle cx="20" cy="8" r="5" />
      <path d="M20 13v26M20 18 12 29 10 41M20 18l8-9 4-8M20 39l-6 14-1 15M20 39l7 14 1 15" />
    </>
  ),
  surrender: (
    <>
      <circle cx="20" cy="8" r="5" />
      <path d="M20 13v26M20 17 13 9 12 1M20 17l7-8 1-8M20 39l-5 14-1 15M20 39l5 14 1 15" />
    </>
  ),
};

export function ClimberPoseStack({
  initial = "stand",
  prefix = "figure",
}: {
  initial?: ClimberPose;
  prefix?: string;
}) {
  return (
    <>
      {(Object.keys(poses) as ClimberPose[]).map((pose) => (
        <g
          key={pose}
          data-pose-owner={prefix}
          data-pose={pose}
          style={pose === initial ? undefined : { opacity: 0, visibility: "hidden" }}
        >
          {poses[pose]}
        </g>
      ))}
    </>
  );
}

export function ClimberPoseFigure({
  pose,
  className,
  size,
  color = "currentColor",
  style,
}: {
  pose: ClimberPose;
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size ? size * (70 / 46) : undefined}
      viewBox="0 0 46 70"
      fill="none"
      stroke={color}
      strokeWidth="2.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      <g transform="translate(2 0)">{poses[pose]}</g>
    </svg>
  );
}
