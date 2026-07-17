import * as React from "react";
import { ClimberPoseStack } from "./ClimberStylePoses";

function Glasses() {
  return (
    <g data-glasses stroke="#FBBF24" strokeWidth="1.7">
      <circle cx="16.5" cy="8" r="2.8" />
      <circle cx="23.5" cy="8" r="2.8" />
      <path d="M19.3 8h1.4M13.7 7l-2-1M26.3 7l2-1" />
    </g>
  );
}

export function UnifiedBlueprintFooter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 960 440"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="An architect and four builders assemble and launch a large rocket"
    >
      <defs>
        <pattern id="rocket-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0v20" stroke="#A4B6FF" strokeOpacity=".075" strokeWidth=".8" />
        </pattern>
        <filter id="exhaust-soft" x="-80%" y="-20%" width="260%" height="180%">
          <feGaussianBlur stdDeviation="2.8" />
        </filter>
      </defs>

      <rect x="30" y="34" width="900" height="354" fill="url(#rocket-grid)" stroke="none" />
      <g opacity=".18" strokeWidth="1.2">
        <path d="M28 386h904" />
        <path d="M78 400h804" />
        <path d="M480 34v352" strokeDasharray="3 12" />
      </g>
      <g
        fill="#CBD5FF"
        stroke="none"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="1.5"
        opacity=".46"
      >
        <text x="50" y="58">
          01 / ARCHITECT
        </text>
        <text x="395" y="58">
          02 / BUILD CREW
        </text>
        <text x="784" y="58">
          03 / LAUNCH
        </text>
      </g>

      {/* The table is built as two physical halves so the launch shockwave can split it. */}
      <g data-desk-left>
        <path d="M112 292h95v14h-95z" fill="#111D3B" />
        <path d="M128 306v66M197 306v66" />
      </g>
      <g data-desk-right>
        <path d="M207 292h95v14h-95z" fill="#111D3B" />
        <path d="M217 306v66M286 306v66" />
      </g>
      <g data-desk-crack opacity="0" stroke="#FBBF24" strokeWidth="2.2">
        <path d="m207 286-7 9 8 7-8 9" />
      </g>
      <g data-rocket-plan>
        <path d="M145 254h130v37H145z" fill="#17357F" stroke="#A8BAFF" />
        <path d="M157 267h42M157 278h30" stroke="#D4DBFF" strokeOpacity=".6" strokeWidth="1.4" />
        <path
          d="M234 282v-17c0-7 5-13 12-17 7 4 12 10 12 17v17M234 274l-7 8M258 274l7 8"
          stroke="#D4DBFF"
          strokeOpacity=".86"
          strokeWidth="1.5"
        />
      </g>
      <g data-architect transform="translate(24 264) scale(1.55)">
        <ClimberPoseStack initial="draft" prefix="architect" />
        <Glasses />
      </g>
      <g data-callout opacity="0" stroke="#FBBF24">
        <path d="M280 247c55-39 103-49 153-39" strokeDasharray="4 7" />
        <path d="m423 201 11 8-13 5" />
      </g>

      <g data-platform>
        <path d="M354 366h454v18H354z" fill="#111D3B" />
        <path d="M380 384v9M782 384v9" />
      </g>

      {/* Ground smoke stays at the pad while the flight plume travels with the rocket. */}
      <g
        data-ground-smoke
        opacity="0"
        fill="#CBD5FF"
        fillOpacity=".11"
        stroke="#CBD5FF"
        strokeOpacity=".34"
        strokeWidth="1.6"
      >
        <circle data-ground-puff cx="503" cy="378" r="19" />
        <circle data-ground-puff cx="536" cy="382" r="27" />
        <circle data-ground-puff cx="576" cy="378" r="32" />
        <circle data-ground-puff cx="619" cy="382" r="27" />
        <circle data-ground-puff cx="657" cy="378" r="19" />
      </g>

      {/* Large hero rocket and its attached exhaust system. */}
      <g data-rocket>
        <g data-rocket-body opacity="0">
          <path d="M522 132h128v206H522z" fill="#0A1020" strokeWidth="3" />
          <path d="M542 164h88M542 183h62" opacity=".42" />
          <circle cx="586" cy="239" r="24" fill="#17357F" stroke="#A8BAFF" strokeWidth="3" />
          <circle cx="586" cy="239" r="13" opacity=".38" />
        </g>
        <g data-rocket-nose opacity="0">
          <path
            d="M522 132c9-56 31-94 64-121 33 27 55 65 64 121z"
            fill="#17357F"
            stroke="#A8BAFF"
            strokeWidth="3"
          />
          <path d="M586 24v79" opacity=".3" />
        </g>
        <g data-left-fin opacity="0">
          <path
            d="M522 268c-45 20-72 55-82 101h82z"
            fill="#17357F"
            stroke="#A8BAFF"
            strokeWidth="3"
          />
        </g>
        <g data-right-fin opacity="0">
          <path
            d="M650 268c45 20 72 55 82 101h-82z"
            fill="#17357F"
            stroke="#A8BAFF"
            strokeWidth="3"
          />
        </g>
        <g data-engine opacity="0">
          <path d="M547 338h78l-14 30h-50z" fill="#0A1020" strokeWidth="3" />
        </g>

        {/* Turbulent exhaust: glow, amber envelope, yellow body, and white-hot core. */}
        <g data-flame opacity="0">
          <path
            data-flame-glow
            d="M552 364C542 399 557 429 586 461C615 429 630 399 620 364C609 381 598 392 586 407C574 392 563 381 552 364Z"
            fill="#F59E0B"
            fillOpacity=".34"
            stroke="none"
            filter="url(#exhaust-soft)"
          />
          <path
            data-flame-outer
            d="M554 365C549 391 558 420 586 451C614 420 623 391 618 365C608 380 598 390 586 404C574 390 564 380 554 365Z"
            fill="#F59E0B"
            fillOpacity=".72"
            stroke="#F59E0B"
            strokeWidth="1.2"
          />
          <path
            data-flame-mid
            d="M565 365C561 386 568 406 586 430C604 406 611 386 607 365C600 377 593 386 586 395C579 386 572 377 565 365Z"
            fill="#FBBF24"
            stroke="#FBBF24"
            strokeWidth="1"
          />
          <path
            data-flame-core
            d="M578 365C576 382 580 396 586 408C592 396 596 382 594 365Z"
            fill="#FFF7D6"
            stroke="#FFF7D6"
            strokeWidth="1"
          />
        </g>
        <g
          data-flight-smoke
          opacity="0"
          fill="#CBD5FF"
          fillOpacity=".12"
          stroke="#CBD5FF"
          strokeOpacity=".42"
          strokeWidth="1.4"
        >
          <circle data-flight-puff cx="566" cy="409" r="12" />
          <circle data-flight-puff cx="590" cy="421" r="17" />
          <circle data-flight-puff cx="612" cy="407" r="11" />
          <path
            data-smoke-trail
            d="M568 397C548 420 551 447 569 467M604 397c19 25 15 51-2 72"
            strokeDasharray="5 8"
            fill="none"
          />
        </g>
      </g>

      {/* Five people total, each in a clear zone: glasses architect, thin builder, broad builder, glasses engineer, thin operator. */}
      <g data-builder-one transform="translate(290 292) scale(1.48)">
        <ClimberPoseStack initial="stand" prefix="builder-one" />
      </g>

      <g data-builder-fat transform="translate(402 279) scale(1.5)">
        {/* Standing broad builder: round head, short neck, egg torso, planted stance. */}
        <g data-fat-silhouette>
          <circle cx="20" cy="9" r="6" fill="#0A1020" stroke="currentColor" strokeWidth="2.35" />
          <path d="M20 15v3" stroke="currentColor" strokeWidth="2.35" />
          <path
            d="M20 18c-9 0-13 7-13 17s4 15 13 15 13-5 13-15-4-17-13-17Z"
            fill="#0A1020"
            stroke="currentColor"
            strokeWidth="2.35"
          />
          <path
            d="M9 40c4 3 18 3 22 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            opacity=".5"
          />
        </g>
        {/* Rest arms: left hangs, right holds the bottle at the hip. */}
        <g
          data-fat-arms
          stroke="currentColor"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M9 24 4 33 6 42" />
          <path d="M31 24 36 32 34 41" />
        </g>
        <g
          data-fat-legs
          stroke="currentColor"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M15 49 12 60 11 68M9 68h6" />
          <path d="M25 49 28 60 29 68M27 68h6" />
        </g>
        {/* Bottle rests in the right hand and travels with the drink arm. */}
        <g data-bottle transform="translate(31 39)" stroke="#FBBF24" strokeWidth="1.8" fill="none">
          <path d="M0 2h6v13H0z" fill="#0A1020" />
          <path d="M2-2h2v4H2z" />
          <path d="M1.2 7h3.6" />
        </g>
        {/* Drink arm: bent elbow bringing the hand toward the mouth. */}
        <g
          data-fat-drink-arm
          opacity="0"
          stroke="currentColor"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M31 24 34 30 27 15" />
        </g>
        {/* Crouched broad build for the launch duck. */}
        <g
          data-fat-duck
          opacity="0"
          stroke="currentColor"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <circle cx="20" cy="26" r="6" fill="#0A1020" />
          <path d="M20 32c-9 0-12 6-11 13s4 9 11 9 11-2 11-9-2-13-11-13Z" fill="#0A1020" />
          <path d="M10 38 4 32M30 38 36 32M14 54 9 65M13 65h6M26 54 31 65M25 65h6" />
        </g>
      </g>

      <g data-builder-glasses transform="translate(760 290) scale(-1.5 1.5)">
        <ClimberPoseStack initial="stand" prefix="builder-glasses" />
        <Glasses />
        <g data-laptop transform="translate(25 24)" strokeWidth="1.7">
          <path d="M0 0h17v11H0z" fill="#10235A" stroke="#A8BAFF" />
          <path d="M-2 13h21" stroke="#A8BAFF" />
          <path data-laptop-line d="M3 8 7 5l3 2 4-5" stroke="#FBBF24" />
          <circle data-laptop-light cx="14" cy="3" r="1.2" fill="#FBBF24" stroke="none" />
        </g>
      </g>

      <g data-builder-console transform="translate(920 286) scale(-1.5 1.5)">
        <ClimberPoseStack initial="stand" prefix="builder-console" />
      </g>
      <g data-launch-console>
        <path d="M842 300h60v60h-60z" fill="#0A1020" />
        <path d="M853 314h38M853 326h24" opacity=".42" />
        <circle data-launch-button cx="884" cy="345" r="7" fill="#FBBF24" stroke="#FBBF24" />
      </g>
      <g
        data-launch-status
        opacity="0"
        fill="#FBBF24"
        stroke="none"
        fontFamily="var(--font-mono)"
        fontSize="9"
        letterSpacing="1.5"
      >
        <text x="586" y="20" textAnchor="middle">
          CLEARED FOR LAUNCH
        </text>
      </g>

      <g
        fill="#CBD5FF"
        stroke="none"
        fontFamily="var(--font-mono)"
        fontSize="7"
        letterSpacing="1.3"
        opacity=".35"
      >
        <text x="203" y="422" textAnchor="middle">
          DRAW THE PLAN
        </text>
        <text x="586" y="422" textAnchor="middle">
          BUILD THE ROCKET
        </text>
        <text x="866" y="422" textAnchor="middle">
          SEND IT
        </text>
      </g>
    </svg>
  );
}
