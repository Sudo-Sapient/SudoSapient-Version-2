// Builds public/rive/cta.riv: "The napkin", the closing call to action.
// A client and our dev at a café table. The client describes the mess and scribbles
// a tangle on a napkin; our dev listens, sips, then draws three neat boxes beside it.
// Ticks pop on all three, the client breathes out, they shake on it. A clock sweeps
// round over the loop, and the TV on the wall plays our reel (a video laid over it).
// State machine "SM": layer Main loops `napkin`; layer Seat slides an empty chair in
// while bool input `seat` is true (the page sets it on CTA hover).
// Run: npm run rive:cta.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, WHITE } from "./kit.mjs";

const W = 300,
  H = 170,
  G = 150,
  END = 480;
const BG = "#1E40AF"; // sits on the blueprint section
const k = makeKit(G, { line: WHITE, paper: BG });
const { shapes, group, line, key, figure, pose, reach } = k;
const ink = (t = 2, color = WHITE) => ({ color, thickness: t, cap: "round", join: "round" });

const SIT = {
  uaL: -60,
  faL: -30,
  uaR: -70,
  faR: -20,
  thL: -90,
  shL: 90,
  thR: -80,
  shR: 80,
  lean: 0,
};
const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };
const CX = 112,
  DX = 188,
  TABLE = G - 34; // client, dev, table top

// ---- set ----
line(
  "floor",
  [
    { x: 0, y: G },
    { x: W, y: G },
  ],
  { stroke: ink(1.2), opacity: 0.35 }
);
line(
  "tableTop",
  [
    { x: 124, y: TABLE },
    { x: 176, y: TABLE },
  ],
  { stroke: ink(2.6) }
);
line(
  "tableLeg",
  [
    { x: 150, y: TABLE },
    { x: 150, y: G },
  ],
  { stroke: ink(2) }
);
line(
  "tableBase",
  [
    { x: 140, y: G },
    { x: 160, y: G },
  ],
  { stroke: ink(2) }
);
const chair = (id, parent) =>
  line(
    id,
    [
      { x: -8, y: -34 },
      { x: -8, y: -15 },
      { x: 8, y: -15 },
      { x: 8, y: 0 },
    ],
    { parent, stroke: ink(1.8) }
  );

// The client's mug on the table, with steam.
shapes.push({
  id: "mugC",
  type: "rect",
  x: 134,
  y: TABLE - 4.5,
  width: 7,
  height: 8,
  cornerRadius: 1,
  stroke: ink(1.4),
  fill: { color: BG },
});
for (let s = 0; s < 2; s++) {
  line(
    `steam${s}`,
    [
      { x: 132 + s * 4, y: TABLE - 11 },
      { x: 134 + s * 4, y: TABLE - 15 },
      { x: 132 + s * 4, y: TABLE - 19 },
    ],
    { stroke: ink(1.1), opacity: 0 }
  );
  key(`steam${s}`, "opacity", [[0, 0, "hold"]]);
  for (let t = s * 30; t + 50 <= END; t += 60)
    key(`steam${s}`, "opacity", [
      [t, 0, "hold"],
      [t + 15, 0.6, "ease-out"],
      [t + 50, 0, "ease-in"],
    ]);
}

// The empty seat that slides in for you (layer Seat).
group("seat", -30, G);
chair("seatChair", "seat");

// ---- the two of them ----
figure("c", CX);
chair("chairC", "c");
figure("dev", DX, { glasses: true });
chair("chairD", "dev");
shapes.push({
  id: "mugD",
  type: "rect",
  x: 0,
  y: 15,
  width: 6,
  height: 7,
  cornerRadius: 1,
  parent: "dev_faR",
  stroke: ink(1.3),
  fill: { color: BG },
});
line(
  "pen",
  [
    { x: 0, y: 11 },
    { x: 0, y: 18 },
  ],
  { parent: "dev_faL", stroke: { color: AMBER, thickness: 1.8, cap: "round" }, opacity: 0 }
);

// ---- the napkin, as a comic close up above the table ----
group("napkin", 150, 48, { rotation: -2 });
shapes.push({
  id: "napkinCard",
  type: "rect",
  x: 0,
  y: 0,
  width: 96,
  height: 54,
  cornerRadius: 2,
  parent: "napkin",
  stroke: ink(1.6),
  fill: { color: "#F8FAFC" },
});
line(
  "zoomL",
  [
    { x: 116, y: 76 },
    { x: 140, y: TABLE - 2 },
  ],
  { stroke: ink(1), opacity: 0.35 }
);
line(
  "zoomR",
  [
    { x: 184, y: 76 },
    { x: 160, y: TABLE - 2 },
  ],
  { stroke: ink(1), opacity: 0.35 }
);
const BLUE_INK = { color: "#1E40AF", thickness: 1.5, cap: "round", join: "round" };
// The mess: one long knotted line.
const tangle = [];
for (let i = 0; i <= 26; i++) {
  const a = i * 1.9;
  tangle.push({
    x: -26 + Math.cos(a) * (10 + (i % 5) * 2) + i * 0.6,
    y: Math.sin(a * 1.3) * (12 - (i % 4)),
  });
}
line("tangle", tangle, { parent: "napkin", stroke: { ...BLUE_INK, trim: { start: 0, end: 0 } } });
// The plan: three boxes, a line of notes under each, a tick in each.
const BOX = [8, 22, 36];
BOX.forEach((bx, i) => {
  line(
    `box${i}`,
    [
      { x: bx - 5, y: -11 },
      { x: bx + 5, y: -11 },
      { x: bx + 5, y: -1 },
      { x: bx - 5, y: -1 },
      { x: bx - 5, y: -11 },
    ],
    {
      parent: "napkin",
      stroke: { ...BLUE_INK, trim: { start: 0, end: 0 } },
    }
  );
  line(
    `note${i}`,
    [
      { x: bx - 5, y: 6 },
      { x: bx + 4, y: 6 },
    ],
    { parent: "napkin", stroke: { ...BLUE_INK, thickness: 1.1, trim: { start: 0, end: 0 } } }
  );
  group(`tick${i}`, bx, -6, { parent: "napkin", scaleX: 0, scaleY: 0 });
  line(
    `tickL${i}`,
    [
      { x: -3.5, y: 0 },
      { x: -1, y: 3 },
      { x: 4, y: -3.5 },
    ],
    { parent: `tick${i}`, stroke: { color: AMBER, thickness: 2.4, cap: "round", join: "round" } }
  );
});

// ---- a TV on the wall; FinalCTA.tsx plays the studio reel over its screen ----
// Screen in artboard units: x 219 to 289, y 30 to 70 (FinalCTA.tsx positions the video by these).
shapes.push({
  id: "tv",
  type: "rect",
  x: 254,
  y: 50,
  width: 76,
  height: 46,
  cornerRadius: 3,
  stroke: ink(2.2),
  fill: { color: "#0E1424" },
});
line(
  "tvMount",
  [
    { x: 254, y: 73 },
    { x: 254, y: 80 },
    { x: 246, y: 80 },
    { x: 262, y: 80 },
  ],
  { stroke: ink(1.6), opacity: 0.6 }
);
shapes.push({
  id: "tvLed",
  type: "ellipse",
  x: 286,
  y: 75.5,
  width: 2.4,
  height: 2.4,
  fill: { color: AMBER },
});

// ---- a clock in the corner ----
shapes.push({
  id: "clock",
  type: "ellipse",
  x: 22,
  y: 22,
  width: 18,
  height: 18,
  stroke: ink(1.4),
  opacity: 0.7,
});
group("clockHand", 22, 22);
line(
  "clockH",
  [
    { x: 0, y: 0 },
    { x: 0, y: -6.5 },
  ],
  { parent: "clockHand", stroke: { color: AMBER, thickness: 1.6, cap: "round" } }
);
key("clockHand", "rotation", [
  [0, 0, "linear"],
  [END, 360, "linear"], // a full turn, so no jump at the loop
]);

// ================= the conversation =================
for (const id of ["c", "dev"]) key(`${id}_body`, "y", [[0, 12, "hold"]]);
key("dev", "scaleX", [[0, -1, "hold"]]); // faces the client; reach x is "towards the table" for both

const TALK_A = { ...SIT, ...reach("c", "R", 20, -52), ...reach("c", "L", 14, -40), lean: 4 };
const TALK_B = { ...SIT, ...reach("c", "R", 15, -44), ...reach("c", "L", 18, -54), lean: 6 };
const WATCH = { ...SIT, ...reach("c", "R", 16, -46), ...reach("c", "L", 13, -44), lean: 12 };
const PHEW = { ...SIT, ...reach("c", "R", 5, -58), ...reach("c", "L", 12, -44), lean: -10 };
const LISTEN = { ...SIT, ...reach("dev", "R", 15, -47), ...reach("dev", "L", 13, -44), lean: 2 };
const SIP = { ...LISTEN, ...reach("dev", "R", 5, -52) };
const DRAW_A = { ...SIT, ...reach("dev", "R", 13, -45), ...reach("dev", "L", 21, -47), lean: 12 };
const DRAW_B = { ...DRAW_A, ...reach("dev", "L", 23, -45) };
const SHAKE = (id) => ({ ...STAND, ...reach(id, "R", 22, -40), lean: 18 });

// 0–150: the client explains the mess; the tangle appears. The dev nods and sips.
for (let t = 0; t < 150; t += 24) {
  pose("c", t, TALK_A, "ease-out");
  pose("c", t + 12, TALK_B, "ease-out");
}
key("tangle", "trimEnd", [
  [0, 0, "hold"],
  [20, 0, "hold"],
  [140, 1, "ease-in-out"],
]);
pose("dev", 0, LISTEN);
key("dev_body", "rotation", [
  [20, 2, "ease-in-out"],
  [30, 7, "ease-in-out"],
  [40, 2, "ease-in-out"],
  [50, 7, "ease-in-out"],
  [60, 2, "ease-in-out"],
]);
pose("dev", 84, LISTEN);
pose("dev", 96, SIP, "ease-out");
pose("dev", 116, SIP);
pose("dev", 128, LISTEN, "ease-in-out");

// 150–290: the dev takes the pen and draws three boxes. The client leans in.
pose("c", 150, TALK_A);
pose("c", 166, WATCH, "ease-in-out");
key("pen", "opacity", [
  [0, 0, "hold"],
  [150, 0, "hold"],
  [156, 1, "ease-out"],
  [290, 1, "hold"],
  [298, 0, "ease-in"],
]);
pose("dev", 150, LISTEN);
for (let t = 162; t < 286; t += 8) {
  pose("dev", t, DRAW_A);
  pose("dev", t + 4, DRAW_B);
}
BOX.forEach((_, i) => {
  const t0 = 170 + i * 40;
  key(`box${i}`, "trimEnd", [
    [0, 0, "hold"],
    [t0, 0, "hold"],
    [t0 + 20, 1, "ease-in-out"],
  ]);
  key(`note${i}`, "trimEnd", [
    [0, 0, "hold"],
    [t0 + 20, 0, "hold"],
    [t0 + 30, 1, "ease-out"],
  ]);
});
pose("dev", 290, LISTEN, "ease-in-out");

// 296–340: tick, tick, tick.
BOX.forEach((_, i) => {
  const f = 300 + i * 14;
  for (const p of ["scaleX", "scaleY"])
    key(`tick${i}`, p, [
      [0, 0, "hold"],
      [f, 0, "hold"],
      [f + 6, 1.4, "ease-out"],
      [f + 10, 1, "ease-in-out"],
    ]);
});

// 340–380: the client breathes out.
pose("c", 340, WATCH);
pose("c", 352, PHEW, "ease-out");
pose("c", 376, PHEW);

// 384–448: both stand and shake on it over the table.
for (const id of ["c", "dev"]) {
  key(`${id}_body`, "y", [
    [384, 12, "hold"],
    [396, 0, "ease-out"],
    [436, 0, "hold"],
    [448, 12, "ease-in-out"],
  ]);
  pose(id, 384, id === "c" ? PHEW : LISTEN);
  pose(id, 398, SHAKE(id), "ease-out");
  pose(id, 404, { ...SHAKE(id), ...reach(id, "R", 22, -44) });
  pose(id, 410, SHAKE(id));
  pose(id, 416, { ...SHAKE(id), ...reach(id, "R", 22, -44) });
  pose(id, 430, SHAKE(id));
  pose(id, 448, id === "c" ? TALK_A : LISTEN, "ease-in-out");
}

// 440–480: the napkin clears for the next conversation.
for (const id of ["tangle", "box0", "box1", "box2", "note0", "note1", "note2"])
  key(id, "trimEnd", [
    [440, 1, "hold"],
    [470, 0, "ease-in"],
  ]);
BOX.forEach((_, i) => {
  for (const p of ["scaleX", "scaleY"])
    key(`tick${i}`, p, [
      [440, 1, "hold"],
      [452, 0, "ease-in"],
    ]);
});
pose("c", END, TALK_A);
pose("dev", END, LISTEN);

const napkin = k.takeTracks();

// ---- layer Seat ----
key("seat", "x", [[0, -30, "hold"]]);
const seatIdle = k.takeTracks();
key("seat", "x", [
  [0, -30, "hold"],
  [24, 62, "ease-out-back"],
]);
const seatIn = k.takeTracks();
key("seat", "x", [
  [0, 62, "hold"],
  [18, -30, "ease-in"],
]);
const seatOut = k.takeTracks();

const { bytes, warnings } = createRiv({
  artboard: { name: "Napkin", width: W, height: H },
  groups: k.groups,
  shapes,
  animations: [
    { name: "napkin", fps: 60, duration: END, loop: "loop", tracks: napkin },
    { name: "seatIdle", fps: 60, duration: 1, loop: "oneShot", tracks: seatIdle },
    { name: "seatIn", fps: 60, duration: 24, loop: "oneShot", tracks: seatIn },
    { name: "seatOut", fps: 60, duration: 18, loop: "oneShot", tracks: seatOut },
  ],
  stateMachine: {
    name: "SM",
    inputs: [{ name: "seat", type: "bool" }],
    layers: [
      {
        name: "Main",
        states: [{ name: "napkin", animation: "napkin" }],
        transitions: [{ from: "entry", to: "napkin" }],
      },
      {
        name: "Seat",
        states: [
          { name: "idle", animation: "seatIdle" },
          { name: "in", animation: "seatIn" },
          { name: "out", animation: "seatOut" },
        ],
        transitions: [
          { from: "entry", to: "idle" },
          { from: "idle", to: "in", condition: { input: "seat" } },
          { from: "in", to: "out", condition: { input: "seat", value: false } },
          { from: "out", to: "in", condition: { input: "seat" } },
        ],
      },
    ],
  },
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/cta.riv", bytes);
console.log(`public/rive/cta.riv ${(bytes.length / 1024).toFixed(1)} KB`);
