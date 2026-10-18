// Builds public/rive/hero.riv — "AI makes your job easier and faster".
// A stickman shoves a paperwork boulder up a blueprint hill; an AI spark redraws the
// hill as an escalator; he rides to the top and has a coffee while more boulders ride up
// on their own. One looping linear animation, `loop` (14s). Run: npm run rive:hero.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, DEEP, NIGHT, WHITE } from "./kit.mjs";

const FPS = 60;
const END = 840;
const W = 600,
  H = 450;
// The hill: a straight slope from A (bottom left) to B (top right), then a plateau.
const A = { x: 90, y: 390 },
  B = { x: 470, y: 150 };
const SLOPE = (B.y - A.y) / (B.x - A.x);
const hillY = (x) => A.y + (x - A.x) * SLOPE;
const RUN = 30,
  RISE = -RUN * SLOPE; // one stair
const S = 1.7; // figure scale
const R = 36; // boulder radius
const GAP = 80; // hands-to-boulder distance while pushing
const RAIL = 72; // handrail height above the slope
const LIFT = 10; // feet stand on the treads, above the slope line

const k = makeKit(A.y);
const { shapes, groups, ink, group, line, key, figure, pose, reach, tracksOut } = k;

// ---- hill ----
line("ground", [{ x: 0, y: A.y }, A], { stroke: ink(2) });
line("slope", [A, B], { stroke: ink(2) });
line("plateau", [B, { x: W, y: B.y }], { stroke: ink(2) });

// ---- escalator: stairs drawn on by the spark, then sliding up the slope ----
const stairPath = [];
for (let n = -1; n <= 13; n++) {
  const x = A.x + RUN * n,
    y = A.y - RISE * n;
  stairPath.push({ x, y }, { x, y: y - RISE });
}
shapes.push({
  id: "clip",
  type: "polygon",
  x: 0,
  y: 0,
  points: [
    { x: A.x, y: A.y + 2 },
    { x: B.x + 2, y: B.y + 2 },
    { x: B.x + 2, y: B.y - RISE - 4 },
    { x: A.x, y: A.y - RISE - 4 },
  ],
});
group("stairs", 0, 0, { clipBy: "clip" });
line("stairLine", stairPath, {
  parent: "stairs",
  stroke: { ...ink(2.2), color: AMBER, trim: { start: 0, end: 0 } },
});
line(
  "rail",
  [
    { x: A.x + 10, y: A.y - RAIL },
    { x: B.x, y: B.y - RAIL },
  ],
  { stroke: { ...ink(2), trim: { start: 0, end: 0 } } }
);
line(
  "railPostA",
  [
    { x: A.x + 10, y: A.y - RAIL },
    { x: A.x + 10, y: A.y - 6 },
  ],
  { stroke: { ...ink(1.6), trim: { start: 0, end: 0 } } }
);
line(
  "railPostB",
  [
    { x: B.x, y: B.y - RAIL },
    { x: B.x, y: B.y },
  ],
  { stroke: { ...ink(1.6), trim: { start: 0, end: 0 } } }
);

// ---- boulders: big paperwork balls (lines read as pages) ----
const boulder = (id, scale = 1) => {
  group(id, 0, 0, { opacity: 0 });
  group(`${id}_roll`, 0, 0, { parent: id, scaleX: scale, scaleY: scale });
  shapes.push({
    id: `${id}_ball`,
    type: "ellipse",
    x: 0,
    y: 0,
    width: R * 2,
    height: R * 2,
    parent: `${id}_roll`,
    stroke: ink(2.4),
    fill: { color: DEEP },
  });
  for (const [i, w] of [24, 34, 28].entries())
    line(
      `${id}_page${i}`,
      [
        { x: -w / 2, y: -10 + i * 10 },
        { x: w / 2, y: -10 + i * 10 },
      ],
      { parent: `${id}_roll`, stroke: ink(1.6) }
    );
};
boulder("rock");
boulder("rock2", 0.8);
boulder("rock3", 0.8);
// "Done" stack at the top: where boulders end up as neat pages with a tick.
group("done", B.x + 70, B.y, { scaleX: 0, scaleY: 0 });
for (let i = 0; i < 4; i++)
  shapes.push({
    id: `donePage${i}`,
    type: "rect",
    x: 0,
    y: -4 - i * 7,
    width: 34,
    height: 5,
    parent: "done",
    stroke: ink(1.6),
    fill: { color: NIGHT },
  });
line(
  "doneTick",
  [
    { x: -7, y: -40 },
    { x: -2, y: -35 },
    { x: 8, y: -46 },
  ],
  { parent: "done", stroke: { color: AMBER, thickness: 2.4, cap: "round", join: "round" } }
);

// ---- the stickman ----
figure("man", 110);
key("man", "scaleX", [[0, S, "hold"]]);
key("man", "scaleY", [[0, S, "hold"]]);
for (const [i, dx] of [-5, 6].entries())
  shapes.push({
    id: `sweat${i}`,
    type: "ellipse",
    x: dx,
    y: -62,
    width: 2.6,
    height: 3.6,
    parent: "man_body",
    opacity: 0,
    fill: { color: WHITE },
  });
shapes.push({
  id: "mug",
  type: "rect",
  x: 2,
  y: 13,
  width: 6,
  height: 7,
  cornerRadius: 1,
  parent: "man_faR",
  opacity: 0,
  fill: { color: AMBER },
});
line(
  "mugHandle",
  [
    { x: 5, y: 11 },
    { x: 8, y: 11 },
    { x: 8, y: 15 },
    { x: 5, y: 15 },
  ],
  { parent: "man_faR", opacity: 0, stroke: { color: AMBER, thickness: 1.2 } }
);

// ---- the AI spark ----
group("spark", W + 30, 40, { scaleX: 0.9, scaleY: 0.9 });
for (const a of [0, 45, 90, 135]) {
  const r = (a * Math.PI) / 180,
    l = a % 90 ? 6 : 11;
  line(
    `ray${a}`,
    [
      { x: -Math.cos(r) * l, y: -Math.sin(r) * l },
      { x: Math.cos(r) * l, y: Math.sin(r) * l },
    ],
    { parent: "spark", stroke: { color: AMBER, thickness: 2.4, cap: "round" } }
  );
}

// Poses (figure-local; positive lean tips him forward, to the right).
const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };
const PUSH_A = {
  uaL: -75,
  faL: -15,
  uaR: -65,
  faR: -20,
  thL: 35,
  shL: 5,
  thR: -25,
  shR: 45,
  lean: 20,
};
const PUSH_B = { ...PUSH_A, thL: 15, shL: 25, thR: -5, shR: 15 };
const SLIP = {
  ...PUSH_A,
  uaL: 120,
  faL: 30,
  uaR: -40,
  faR: -40,
  thL: -20,
  shL: 30,
  thR: 30,
  shR: 0,
  lean: -6,
};
const TIRED = {
  uaL: -10,
  faL: -40,
  uaR: 10,
  faR: 40,
  thL: 10,
  shL: -20,
  thR: -10,
  shR: 20,
  lean: 30,
};
const LOOK_UP = { ...STAND, lean: -8 };
const RIDE = { ...STAND, ...reach("man", "R", 12, -(RAIL - LIFT) / S) }; // hand resting on the rail
const WAVE_A = { ...RIDE, uaL: 140, faL: 20 };
const WAVE_B = { ...RIDE, uaL: 140, faL: -20 };
const SIP = { ...STAND, uaL: 30, faL: -95, ...reach("man", "R", 5, -51), lean: -5 };
const HOLD_MUG = { ...STAND, uaL: 30, faL: -95, uaR: -25, faR: -80 };

const at = (f, x, lift = 0, easing = "ease-in-out") => {
  key("man", "x", [[f, x, easing]]);
  key("man", "y", [[f, hillY(Math.min(Math.max(x, A.x), B.x)) - lift, easing]]);
};
const rockAt = (id, f, x, easing = "ease-in-out", lift = 0) => {
  const cx = Math.min(x, B.x + 40);
  key(id, "x", [[f, cx, easing]]);
  key(id, "y", [[f, (cx <= B.x ? hillY(cx) : B.y) - R - lift, easing]]);
  key(`${id}_roll`, "rotation", [[f, ((x - 100) / R) * (180 / Math.PI), easing]]);
};

// ================= 0–300: the slog =================
key("man", "opacity", [
  [0, 0, "hold"],
  [16, 1, "ease-out"],
]);
key("rock", "opacity", [
  [0, 0, "hold"],
  [16, 1, "ease-out"],
]);
at(0, 110, 0, "hold");
rockAt("rock", 0, 110 + GAP, "hold");
// Shove forward in small heaves.
let x = 110;
for (let f = 10; f < 150; f += 20) {
  pose("man", f, PUSH_A);
  pose("man", f + 10, PUSH_B);
  x += 10;
  at(f + 18, x, 0, "ease-out");
  rockAt("rock", f + 18, x + GAP, "ease-out");
}
// ...and slips back.
pose("man", 152, SLIP, "ease-out");
at(170, x - 30, 0, "ease-out");
rockAt("rock", 168, x + GAP - 30, "ease-out");
x -= 30;
for (let f = 176; f < 236; f += 20) {
  pose("man", f, PUSH_A);
  pose("man", f + 10, PUSH_B);
  x += 7;
  at(f + 18, x, 0, "ease-out");
  rockAt("rock", f + 18, x + GAP, "ease-out");
}
pose("man", 240, TIRED, "ease-out");
[60, 110, 200, 250].forEach((f, i) => {
  const s = `sweat${i % 2}`;
  key(s, "opacity", [
    [f, 1, "hold"],
    [f + 20, 0, "ease-in"],
  ]);
  key(s, "y", [
    [f, -62, "hold"],
    [f + 20, -50, "ease-in"],
  ]);
  key(s, "x", [
    [f, i % 2 ? 6 : -5, "hold"],
    [f + 20, i % 2 ? 12 : -11, "ease-out"],
  ]);
});
for (const s of ["sweat0", "sweat1"]) key(s, "opacity", [[0, 0, "hold"]]);

// ================= 270–400: the spark redraws the hill =================
pose("man", 290, LOOK_UP, "ease-out-back");
key("spark", "x", [
  [0, W + 30, "hold"],
  [260, W + 30, "hold"],
  [300, 330, "ease-in-out"],
  [330, A.x + 20, "ease-in"],
  [400, B.x, "linear"],
  [430, W + 40, "ease-in"],
]);
key("spark", "y", [
  [0, 40, "hold"],
  [260, 40, "hold"],
  [300, 120, "ease-out"],
  [330, A.y - 20, "ease-in"],
  [400, B.y - 20, "linear"],
  [430, 30, "ease-in"],
]);
key("spark", "rotation", [
  [0, 0, "hold"],
  [260, 0, "hold"],
  [430, 540, "linear"],
]);
key("stairLine", "trimEnd", [
  [0, 0, "hold"],
  [330, 0, "hold"],
  [400, 1, "linear"],
  [770, 1, "hold"],
  [820, 0, "ease-in"],
]);
for (const id of ["rail", "railPostA", "railPostB"])
  key(id, "trimEnd", [
    [0, 0, "hold"],
    [350, 0, "hold"],
    [410, 1, "ease-out"],
    [770, 1, "hold"],
    [810, 0, "ease-in"],
  ]);

// Stairs slide up the slope one step at a time, forever (until the reset).
const STEP_FRAMES = 16;
key("stairs", "x", [[0, 0, "hold"]]);
key("stairs", "y", [[0, 0, "hold"]]);
for (let f = 410; f < 800; f += STEP_FRAMES) {
  key("stairs", "x", [
    [f, 0, "hold"],
    [f + STEP_FRAMES - 1, RUN, "linear"],
  ]);
  key("stairs", "y", [
    [f, 0, "hold"],
    [f + STEP_FRAMES - 1, -RISE, "linear"],
  ]);
}
const speed = RUN / STEP_FRAMES; // px of x per frame while riding

// ================= 410–620: he rides up, easy =================
pose("man", 412, RIDE, "ease-out-back");
at(414, x, 0, "hold");
at(426, x + 8, LIFT, "ease-out"); // hops onto a step
const ride0 = 426,
  rideEnd = ride0 + Math.round((B.x - 10 - (x + 8)) / speed);
at(rideEnd, B.x - 10, LIFT, "linear");
rockAt("rock", 414, x + GAP, "hold");
rockAt("rock", ride0, x + GAP + 4, "ease-out", LIFT);
rockAt("rock", rideEnd, B.x + 26, "linear", LIFT);
for (let f = 470; f < 530; f += 12) {
  pose("man", f, WAVE_A);
  pose("man", f + 6, WAVE_B);
}
pose("man", 536, RIDE);
// Step off onto the plateau; the boulder becomes a neat finished stack.
key("man", "x", [[rideEnd + 16, B.x + 20, "ease-out"]]);
key("man", "y", [[rideEnd + 16, B.y, "ease-out"]]);
pose("man", rideEnd + 16, STAND);
key("rock", "opacity", [
  [rideEnd, 1, "hold"],
  [rideEnd + 14, 0, "ease-in"],
  [END, 0, "hold"],
]);
for (const p of ["scaleX", "scaleY"])
  key("done", p, [
    [0, 0, "hold"],
    [rideEnd + 8, 0, "hold"],
    [rideEnd + 24, 1.15, "ease-out-back"],
    [rideEnd + 34, 1, "ease-out"],
    [770, 1, "hold"],
    [800, 0, "ease-in"],
  ]);

// ================= then: coffee, while the system carries more up on its own =================
const sip0 = rideEnd + 40;
key("mug", "opacity", [
  [0, 0, "hold"],
  [sip0, 1, "hold"],
  [790, 1, "hold"],
  [800, 0, "hold"],
]);
key("mugHandle", "opacity", [
  [0, 0, "hold"],
  [sip0, 1, "hold"],
  [790, 1, "hold"],
  [800, 0, "hold"],
]);
pose("man", sip0, HOLD_MUG, "ease-out");
pose("man", sip0 + 30, SIP, "ease-in-out");
pose("man", sip0 + 60, SIP);
pose("man", sip0 + 85, HOLD_MUG, "ease-in-out");
pose("man", sip0 + 140, HOLD_MUG);
pose("man", sip0 + 165, SIP, "ease-in-out");
pose("man", sip0 + 190, HOLD_MUG, "ease-in-out");
[
  ["rock2", 470],
  ["rock3", 560],
].forEach(([id, f0]) => {
  const x0 = A.x + 20,
    f1 = f0 + Math.round((B.x - x0) / speed);
  key(id, "opacity", [
    [0, 0, "hold"],
    [f0, 0, "hold"],
    [f0 + 12, 1, "ease-out"],
    [f1, 1, "hold"],
    [f1 + 12, 0, "ease-in"],
  ]);
  rockAt(id, f0, x0, "hold", LIFT);
  rockAt(id, f1, B.x, "linear", LIFT);
});

// ================= 780–840: reset =================
key("man", "opacity", [
  [780, 1, "hold"],
  [820, 0, "ease-in"],
]);
pose("man", 820, STAND);
pose("man", END, STAND);
at(END, 110, 0, "hold");

const { bytes, warnings } = createRiv({
  artboard: { name: "Hero", width: W, height: H },
  groups,
  shapes,
  animations: [{ name: "loop", fps: FPS, duration: END, loop: "loop", tracks: tracksOut() }],
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/hero.riv", bytes);
console.log(`public/rive/hero.riv ${(bytes.length / 1024).toFixed(1)} KB`);
