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
