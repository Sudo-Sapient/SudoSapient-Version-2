import * as React from "react";

export const climberCore = (
  <>
    <circle cx="20" cy="8" r="5" />
    <line x1="20" y1="13" x2="20" y2="38" />
  </>
);

export const climberLimbsA = (
  <>
    <polyline points="20,15 14,9 12,3" />
    <polyline points="20,16 26,19 29,16" />
    <polyline points="20,38 16,50 15,60" />
    <polyline points="20,38 26,43 28,50" />
  </>
);

export const climberLimbsB = (
  <>
    <polyline points="20,15 14,18 11,15" />
    <polyline points="20,16 26,9 28,3" />
    <polyline points="20,38 14,43 12,50" />
    <polyline points="20,38 24,50 25,60" />
  </>
);

export const surrenderPose = (
  <>
    <circle cx="20" cy="8" r="5" />
    <line x1="20" y1="13" x2="20" y2="38" />
    <polyline points="20,15 14,8 13,2" />
    <polyline points="20,16 27,8 28,2" />
    <polyline points="20,38 15,50 13,60" />
    <polyline points="20,38 25,50 27,60" />
  </>
);

/** Last-rung pose: both hands still on the ladder, left foot finding ground. */
export function StepPoseOne() {
  return (
    <>
      <circle cx="20" cy="8" r="5" />
      <path d="M20 13 19 38" />
      <path d="M20 16 13 24 12 33" />
      <path d="M20 16 27 24 28 33" />
      <path d="M19 38 12 49 9 60" />
      <path d="M19 38 26 48 28 54" />
    </>
  );
}

/** Weight-transfer pose: one hand releases and the second foot leaves the rung. */
export function StepPoseTwo() {
  return (
    <>
      <circle cx="19" cy="8" r="5" />
      <path d="M19 13 18 38" />
      <path d="M19 16 13 25 12 34" />
      <path d="M19 17 25 28 31 34" />
      <path d="M18 38 11 49 9 60" />
      <path d="M18 38 24 50 25 60" />
    </>
  );
}

/** Stable standing pose. Both halo and ink copies share these animation hooks. */
export function StandingDrinkPose({ accent = false }: { accent?: boolean }) {
  return (
    <>
      <g data-break-head>
        <circle cx="20" cy="8" r="5" />
      </g>
      <g data-break-body>
        <path d="M20 13 20 38" />
        <path d="M20 38 14 50 13 60M13 60h5" />
        <path d="M20 38 26 50 27 60M27 60h-5" />
        <path d="M20 17 13 27 14 38" />
        <g data-break-upper>
          <path d="M20 17 28 25" />
          <g data-break-fore>
            <path d="M28 25 29 37" />
            <g data-break-bottle>
              <path d="M26.7 34h4.8v8h-4.8z" stroke={accent ? "#FBBF24" : undefined} />
              <path d="M28 32h2.2v2H28z" stroke={accent ? "#FBBF24" : undefined} />
            </g>
          </g>
        </g>
      </g>
      {accent && <path d="M7 62h26" strokeWidth="1.2" opacity="0.3" />}
    </>
  );
}
