// Builds public/rive/climber.riv — the ladder climber on the right edge.
// The page moves him down the rail with scroll; this file only animates the figure.
// State machine `Climber`, inputs: scrolling, atFooter, hover (all booleans).
// Run: npm run rive:climber. Spec: docs/RIVE.md §3.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE } from "./kit.mjs";

const FPS = 60;
// Artboard units are half a CSS pixel: 70×72 renders at 140×144px.
const LADDER_X = 50; // on the rungs
const FLOOR_X = 23; // 54px to the left, where he stands for his break
const G = 70; // 8 units of headroom for raised hands

const k = makeKit(G);
const { shapes, line, key, figure, pose, reach, takeTracks } = k;
figure("w", LADDER_X, { halo: BLUE });
// Water bottle in his right hand; hidden while climbing.
shapes.push({
  id: "bottle",
  type: "rect",
  x: 0,
  y: 15,
  width: 5,
  height: 9,
  cornerRadius: 1.5,
  parent: "w_faR",
  stroke: { color: BLUE, thickness: 1.2 },
  fill: { color: AMBER },
});
line(
  "cap",
  [
    { x: -1.5, y: 10 },
    { x: 1.5, y: 10 },
  ],
  { parent: "w_faR", stroke: { color: "#FFFFFF", thickness: 1.6, cap: "round" } }
);

// Hands grip the ladder rails (±8 units = the 32px-wide rail), elbows out.
const grip = (lY, rY) => ({ ...reach("w", "L", -8, lY), ...reach("w", "R", 8, rY) });
const HANG = { ...grip(-60, -60), thL: 10, shL: -10, thR: -10, shR: 10, lean: 0 };
const CLIMB_A = { ...grip(-60, -52), thL: 38, shL: -72, thR: -6, shR: 6, lean: 2 };
const CLIMB_B = { ...grip(-52, -60), thL: 6, shL: -6, thR: -38, shR: 72, lean: -2 };
const STEP = {
  uaL: 70,
  faL: 20,
  uaR: -165,
  faR: -10,
  thL: 40,
  shL: -20,
  thR: -8,
  shR: 8,
  lean: -6,
};
const STAND = { uaL: 12, faL: -6, uaR: -30, faR: -60, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };
// Standing break poses (right hand holds the bottle).
const REST = { uaL: 30, faL: -95, uaR: -18, faR: -55, thL: 8, shL: -4, thR: -3, shR: 0, lean: 2 }; // left hand on hip
const DRINK = { ...REST, uaR: -100, faR: -129, lean: -5 }; // bottle to the side of his mouth, head back
const WIPE = { ...REST, uaL: 131, faL: 90, lean: 0 }; // back of the left hand across the brow
const HANDS_UP = {
  uaL: 165,
  faL: -15,
  uaR: -165,
  faR: 15,
  thL: 8,
  shL: 0,
  thR: -8,
  shR: 0,
  lean: 0,
};

const place = (f, x, bodyY, easing = "hold") => {
  key("w", "x", [[f, x, easing]]);
  key("w_body", "y", [[f, bodyY, easing]]);
};
const bottle = (f, on) => {
  key("bottle", "opacity", [[f, on ? 1 : 0, "hold"]]);
  key("cap", "opacity", [[f, on ? 1 : 0, "hold"]]);
};
const animations = [];
const anim = (name, duration, loop, build) => {
  build();
  animations.push({ name, fps: FPS, duration, loop, tracks: takeTracks() });
};

anim("hang", 60, "loop", () => {
  place(0, LADDER_X, 0);
  bottle(0, false);
  pose("w", 0, HANG);
  key("w_body", "y", [
    [30, -0.6, "ease-in-out"],
    [60, 0, "ease-in-out"],
  ]); // breathing
});

// Climb cycle: alternate reach and knee lift with a small body bob (0.8s).
anim("climb", 48, "loop", () => {
  place(0, LADDER_X, 0);
  bottle(0, false);
  pose("w", 0, CLIMB_A);
  pose("w", 24, CLIMB_B);
  pose("w", 48, CLIMB_A);
  key("w_body", "y", [
    [12, -2, "ease-in-out"],
    [24, 0, "ease-in-out"],
    [36, -2, "ease-in-out"],
    [48, 0, "ease-in-out"],
  ]);
});

// Step off the ladder to the left and settle into a stance (1.1s).
anim("dismount", 66, "oneShot", () => {
  bottle(0, false);
  bottle(50, true);
  pose("w", 0, HANG);
  pose("w", 16, STEP, "ease-out");
  pose("w", 34, STAND, "ease-in-out");
  pose("w", 52, STAND);
  pose("w", 66, REST, "ease-out-back");
  key("w", "x", [
    [0, LADDER_X, "hold"],
    [16, LADDER_X - 8, "ease-in-out"],
    [34, FLOOR_X + 4, "ease-in-out"],
    [48, FLOOR_X, "ease-out"],
  ]);
  key("w", "y", [
    [0, G, "hold"],
    [34, G + 3.5, "ease-in"],
  ]);
  key("w_body", "y", [
    [0, 0, "hold"],
    [20, -2, "ease-out"],
    [34, 0, "ease-in"],
  ]);
});

// The break, standing: sip, lower, wipe his brow, shift his weight (5s loop).
anim("drink", 300, "loop", () => {
  place(0, FLOOR_X, 0);
  key("w", "y", [[0, G + 3.5, "hold"]]);
  bottle(0, true);
  pose("w", 0, REST);
  pose("w", 26, REST);
  pose("w", 52, DRINK, "ease-in-out");
  key("bottle", "rotation", [
    [0, 0, "hold"],
    [52, 0, "hold"],
    [70, -60, "ease-in-out"],
    [110, -75, "ease-in-out"],
    [130, 0, "ease-in-out"],
  ]);
  pose("w", 112, DRINK);
  pose("w", 138, REST, "ease-in-out");
  pose("w", 160, REST);
  pose("w", 182, WIPE, "ease-in-out");
  key("w_faL", "rotation", [
    [192, 78, "ease-in-out"],
    [202, 100, "ease-in-out"],
    [212, 84, "ease-in-out"],
  ]);
  pose("w", 236, REST, "ease-in-out");
  // Weight shift and a slow exhale.
  key("w_body", "rotation", [
    [250, -3, "ease-in-out"],
    [280, 1, "ease-in-out"],
    [300, 2, "ease-in-out"],
  ]);
  key("w_body", "y", [
    [250, 0.8, "ease-in-out"],
    [275, 0, "ease-in-out"],
  ]);
  pose("w", 300, REST);
});

// Hands up while the cursor is on him: one version on the ladder, one at the floor.
const handsUp = (name, x, bodyY, y, held) =>
  anim(name, 24, "loop", () => {
    place(0, x, bodyY);
    key("w", "y", [[0, y, "hold"]]);
    bottle(0, held);
    pose("w", 0, HANDS_UP);
    key("w_body", "rotation", [
      [6, -3, "ease-in-out"],
      [18, 3, "ease-in-out"],
      [24, 0, "ease-in-out"],
    ]);
  });
handsUp("upLadder", LADDER_X, 0, G, false);
handsUp("upFloor", FLOOR_X, 0, G + 3.5, true);

const t = (from, to, input, value, durationMs = 180) => ({
  from,
  to,
  durationMs,
  condition: { input, value },
});
const { bytes, warnings } = createRiv({
  artboard: { name: "Climber", width: 70, height: 72 },
  groups: k.groups,
  shapes,
  animations,
  stateMachine: {
    name: "Climber",
    inputs: [
      { name: "scrolling", type: "bool" },
      { name: "atFooter", type: "bool" },
      { name: "hover", type: "bool" },
    ],
    states: ["hang", "climb", "dismount", "drink", "upLadder", "upFloor"].map((n) => ({
      name: n,
      animation: n,
    })),
    transitions: [
      { from: "entry", to: "hang" },
      t("hang", "climb", "scrolling", true, 120),
      t("climb", "hang", "scrolling", false, 220),
      t("hang", "dismount", "atFooter", true),
      t("climb", "dismount", "atFooter", true),
      { from: "dismount", to: "drink", exitTimeMs: 1100, durationMs: 0 },
      t("dismount", "climb", "atFooter", false, 260),
      t("drink", "climb", "atFooter", false, 260),
      t("hang", "upLadder", "hover", true, 120),
      t("climb", "upLadder", "hover", true, 120),
      t("upLadder", "hang", "hover", false),
      t("drink", "upFloor", "hover", true, 120),
      t("upFloor", "drink", "hover", false),
    ],
  },
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/climber.riv", bytes);
console.log(`public/rive/climber.riv ${(bytes.length / 1024).toFixed(1)} KB`);
