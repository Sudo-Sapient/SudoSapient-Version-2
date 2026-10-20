// Builds public/rive/portfolio.riv — section 2, "Company portfolio: coming soon".
// A painter with a comically long roller paints COMING SOON onto a frame, runs out
// of paint, gets a bucket from his buddy, finishes; the frame tilts, they tilt their
// heads, the buddy fixes it, high five. One looping animation, `loop` (14s).
// Run: npm run rive:portfolio.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE } from "./kit.mjs";

const FPS = 60;
const END = 840;
const W = 520,
  H = 200,
  G = 190;
const PAPER = "#EEF1F5";
// The frame on the wall, and the paintable span inside it.
const FX = 280,
  FY = 78,
  FW = 300,
  FH = 92;
const L0 = FX - FW / 2 + 16,
  L1 = FX + FW / 2 - 16;

const k = makeKit(G, { line: BLUE, paper: PAPER });
const { shapes, groups, group, line, key, figure, pose, reach, walk, tracksOut } = k;
const ink = (t = 2.4) => ({ color: BLUE, thickness: t, cap: "round", join: "round" });
const texts = [];
const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };

line(
  "floor",
  [
    { x: 0, y: G },
    { x: W, y: G },
  ],
  { stroke: ink(1.4), opacity: 0.35 }
);
// Nail and string; the frame hangs from the nail so it can tilt.
shapes.push({
  id: "nail",
  type: "ellipse",
  x: FX,
  y: FY - FH / 2 - 18,
  width: 5,
  height: 5,
  fill: { color: BLUE },
});
group("frame", FX, FY - FH / 2 - 18);
line(
  "string",
  [
    { x: -60, y: 18 },
    { x: 0, y: 0 },
    { x: 60, y: 18 },
  ],
  { parent: "frame", stroke: ink(1.4) }
);
shapes.push({
  id: "board",
  type: "rect",
  x: 0,
  y: 18 + FH / 2,
  width: FW,
  height: FH,
  cornerRadius: 4,
  parent: "frame",
  stroke: ink(3),
  fill: { color: "#FFFFFF" },
});
// A white cover over the words, pinned at the right end: shrinking it uncovers the paint.
group("paint", 0, 0, { parent: "frame" });
texts.push({
  id: "words",
  parent: "paint",
  x: -FW / 2,
  y: 18 + FH / 2 - 22,
  width: FW,
  align: "center",
  runs: [{ text: "COMING SOON", fontSize: 38, color: BLUE }],
});

group("cover", L1 - FX, 0, { parent: "frame" });
shapes.push({
  id: "coverRect",
  z: 2500, // above the text layer
  type: "rect",
  x: -(L1 - L0) / 2,
  y: 18 + FH / 2,
  width: L1 - L0 + 4,
  height: FH - 8,
  parent: "cover",
  fill: { color: "#FFFFFF" },
});
const shown = (x) => (L1 - x) / (L1 - L0); // cover scaleX that leaves everything left of x painted

// ---- the painter, with a long roller on a pole ----
figure("painter", 60);
const POLE_TOP = { x: 34, y: -122 }; // roller head, in the painter's own units
line("pole", [{ x: 10, y: -30 }, POLE_TOP], {
  parent: "painter",
  stroke: { color: AMBER, thickness: 3, cap: "round" },
});
group("rollerHead", POLE_TOP.x, POLE_TOP.y, { parent: "painter" });
shapes.push({
  id: "roller",
  type: "rect",
  x: 0,
  y: 0,
  width: 8,
  height: 26,
  cornerRadius: 3,
  parent: "rollerHead",
  stroke: ink(1.8),
  fill: { color: BLUE },
});
for (let d = 0; d < 2; d++)
  shapes.push({
    id: `drip${d}`,
    type: "ellipse",
    x: 0,
    y: 14,
    width: 3,
    height: 4,
    parent: "rollerHead",
    opacity: 0,
    fill: { color: BLUE },
  });
const GRIP = { ...STAND, ...reach("painter", "R", 10, -30), ...reach("painter", "L", 14, -44) };
// The roller head sits at painter.x + POLE_TOP.x, so this is where he stands to paint at x.
const standFor = (x) => x - POLE_TOP.x;

// ---- the buddy, with a paint bucket ----
figure("buddy", -40, { glasses: true });
shapes.push({
  id: "bucket",
  type: "polygon",
  x: 0,
  y: 18,
  parent: "buddy_faR",
  points: [
    { x: -6, y: -5 },
    { x: 6, y: -5 },
    { x: 5, y: 6 },
    { x: -5, y: 6 },
  ],
  stroke: ink(1.4),
  fill: { color: AMBER },
});

const HIPS = { ...STAND, ...reach("painter", "L", -8, -28), ...reach("painter", "R", 8, -28) };
const HIPS_B = { ...STAND, ...reach("buddy", "L", -8, -28), ...reach("buddy", "R", 8, -28) };
const HAND_OVER = { ...STAND, uaR: -80, faR: -10, lean: 6 };
const NUDGE = { ...STAND, ...reach("buddy", "R", 16, -58), lean: 8 };
const FIVE_P = { ...STAND, uaL: 140, faL: 10 };
const FIVE_B = { ...STAND, uaR: -140, faR: -10 };

// ================= 0–250: paint left to right =================
for (const id of ["painter", "buddy"])
  key(id, "opacity", [
    [0, 0, "hold"],
    [16, 1, "ease-out"],
    [780, 1, "hold"],
    [820, 0, "ease-in"],
  ]);
pose("painter", 0, GRIP);
pose("buddy", 0, STAND);
const paintTo = (f0, f1, x0, x1) => {
  key("painter", "x", [
    [f0, standFor(x0), "hold"],
    [f1, standFor(x1), "linear"],
  ]);
  key("cover", "scaleX", [
    [f0, shown(x0), "hold"],
    [f1, shown(x1), "linear"],
  ]);
  for (let t = f0; t < f1; t += 16) {
    key("rollerHead", "y", [
      [t, POLE_TOP.y, "ease-in-out"],
      [t + 8, POLE_TOP.y + 6, "ease-in-out"],
    ]);
    key("painter_body", "y", [
      [t, 0, "ease-in-out"],
      [t + 8, -1.5, "ease-in-out"],
    ]);
  }
};
key("cover", "scaleX", [[0, 1, "hold"]]);
const MID = L0 + (L1 - L0) * 0.62;
paintTo(30, 250, L0, MID);

// ================= 250–330: out of paint: shake, drip, nothing =================
key("painter", "rotation", [
  [0, 0, "hold"],
  [252, 0, "hold"],
]);
for (let t = 256; t < 320; t += 8)
  key("painter", "rotation", [[t, t % 16 ? 4 : -4, "ease-in-out"]]);
key("painter", "rotation", [[324, 0, "ease-out"]]);
[0, 1].forEach((d) => {
  key(`drip${d}`, "opacity", [
    [0, 0, "hold"],
    [270 + d * 20, 1, "hold"],
    [292 + d * 20, 0, "ease-in"],
  ]);
  key(`drip${d}`, "y", [
    [0, 14, "hold"],
    [270 + d * 20, 14, "hold"],
    [292 + d * 20, 40, "ease-in"],
  ]);
});

// ================= 290–410: the buddy brings a bucket =================
walk("buddy", 290, 360, -40, standFor(MID) - 30);
pose("buddy", 366, HAND_OVER, "ease-out-back");
key("bucket", "opacity", [
  [0, 1, "hold"],
  [396, 1, "hold"],
  [400, 0, "ease-in"],
  [820, 0, "hold"],
  [821, 1, "hold"],
]);
key("rollerHead", "rotation", [
  [0, 0, "hold"],
  [370, 0, "hold"],
  [380, -25, "ease-out"],
  [392, 0, "ease-out-back"],
]); // a quick dip
pose("buddy", 400, STAND);

// ================= 410–510: finish the word, flourish =================
paintTo(410, 490, MID, L1);
key("rollerHead", "y", [
  [492, POLE_TOP.y - 14, "ease-out-back"],
  [510, POLE_TOP.y, "ease-in-out"],
]);

// ================= 512–640: step back, admire; the frame tilts =================
walk("painter", 512, 560, standFor(L1), standFor(L1) + 60);
walk("buddy", 512, 560, standFor(MID) - 30, 70);
pose("painter", 564, HIPS);
pose("buddy", 564, HIPS_B);
key("frame", "rotation", [
  [0, 0, "hold"],
  [584, 0, "hold"],
  [604, -7, "ease-in"],
  [612, -6, "ease-out"],
]);
key("painter_body", "rotation", [
  [0, 0, "hold"],
  [612, 0, "hold"],
  [626, -8, "ease-out"],
  [700, -8, "hold"],
  [716, 0, "ease-out"],
]);
key("buddy_body", "rotation", [
  [0, 0, "hold"],
  [616, 0, "hold"],
  [630, -8, "ease-out"],
  [650, 0, "ease-out"],
]);

// ================= 650–730: the buddy nudges it straight =================
walk("buddy", 650, 690, 70, FX - FW / 2 - 6);
pose("buddy", 694, NUDGE, "ease-out");
key("frame", "rotation", [
  [698, -6, "hold"],
  [708, 3, "ease-out"],
  [718, -1.5, "ease-in-out"],
  [728, 0, "ease-out"],
]);
pose("buddy", 730, STAND);

// ================= 734–840: high five, then reset =================
walk("buddy", 734, 760, FX - FW / 2 - 6, standFor(L1) + 30);
pose("painter", 762, FIVE_P, "ease-out-back");
pose("buddy", 762, FIVE_B, "ease-out-back");
pose("painter", 790, GRIP);
pose("buddy", 790, STAND);
key("paint", "opacity", [
  [0, 1, "hold"],
  [780, 1, "hold"],
  [820, 0, "ease-in"],
  [821, 1, "hold"],
]);
key("painter", "x", [[820, standFor(L0), "hold"]]);
key("buddy", "x", [[820, -40, "hold"]]);
key("cover", "scaleX", [[820, 1, "hold"]]);
pose("painter", END, GRIP);
pose("buddy", END, STAND);

const require = createRequire(import.meta.url);
const inter = readFileSync(require.resolve("rive-mcp-server/assets/inter.ttf"));
const { bytes, warnings } = createRiv({
  fonts: [{ id: "inter", bytes: new Uint8Array(inter) }],
  artboard: { name: "Portfolio", width: W, height: H },
  groups,
  shapes,
  texts,
  animations: [{ name: "loop", fps: FPS, duration: END, loop: "loop", tracks: tracksOut() }],
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/portfolio.riv", bytes);
console.log(`public/rive/portfolio.riv ${(bytes.length / 1024).toFixed(1)} KB`);
