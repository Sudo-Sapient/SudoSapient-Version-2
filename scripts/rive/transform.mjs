// Builds public/rive/transform.riv — section 3, a small comic strip.
// Mess → Call → Audit → Pilot → Chill. One looping animation, `story` (18s).
// Beat start times are mirrored in components/sections/Process.tsx (BEATS).
// Run: npm run rive:transform.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE, NIGHT } from "./kit.mjs";

const FPS = 60;
const END = 1080;
const W = 430,
  H = 126,
  G = 112,
  D = 140; // desk left edge
const PAPER = "#EEF1F5";

const k = makeKit(G, { line: BLUE, paper: PAPER });
const { shapes, group, line, key, figure, pose, reach, walk } = k;
const ink = (t = 2.4) => ({ color: BLUE, thickness: t, cap: "round", join: "round" });

// ---- set: desk, chair, pile, floor ----
line(
  "floor",
  [
    { x: 0, y: G },
    { x: W, y: G },
  ],
  { stroke: ink(1.4), opacity: 0.35 }
);
line("desk", [
  { x: D + 4, y: G },
  { x: D + 4, y: G - 34 },
  { x: D + 80, y: G - 34 },
  { x: D + 80, y: G },
]);
line("deskTop", [
  { x: D - 2, y: G - 34 },
  { x: D + 84, y: G - 34 },
]);
line(
  "chair",
  [
    { x: D - 22, y: G - 34 },
    { x: D - 22, y: G - 15 },
    { x: D - 6, y: G - 15 },
    { x: D - 6, y: G },
  ],
  { stroke: ink(1.8) }
);
group("pile", D + 24, G - 34);
for (let s = 0; s < 7; s++)
  shapes.push({
    id: `sheet${s}`,
    type: "rect",
    x: (s % 3) * 2 - 2,
    y: -3 - s * 5,
    width: 22,
    height: 4,
    rotation: s % 2 ? 4 : -5,
    parent: "pile",
    stroke: ink(1.4),
    fill: { color: PAPER },
  });

// ---- the employee ----
figure("emp", D - 14);
key("emp_body", "y", [[0, 12, "hold"]]);
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
// Leaning tilts the whole seated body about the feet; counter-rotate the thighs so the
// feet stay planted instead of sinking through the floor.
const seated = (p) => ({ ...p, thL: SIT.thL - p.lean, thR: SIT.thR - p.lean });
const TYPE_A = seated({ ...SIT, faL: -5, faR: -45, lean: 8 });
const TYPE_B = seated({ ...SIT, faL: -35, faR: -15, lean: 8 });
// Head in hands. A small lean only: the body pivots at the feet, so a big one swings the
// seated legs through the floor.
const DESPAIR = seated({
  ...SIT,
  ...reach("emp", "L", -5, -52),
  ...reach("emp", "R", 5, -52),
  lean: 7,
});
const PHONE = { ...SIT, ...reach("emp", "R", 6, -55), uaL: -40, faL: -60, lean: 0 };
const THUMBS = { ...SIT, uaR: -150, faR: -40 };
const CHILL = {
  ...SIT,
  ...reach("emp", "L", -7, -60),
  ...reach("emp", "R", 7, -60),
  thL: -112,
  shL: 8,
  thR: -108,
  shR: 10,
  lean: -18,
};

// Frustration scribble over the head, the phone, the shades, the coffee.
group("scribble", D - 14, G - 92, { scaleX: 0, scaleY: 0 });
line(
  "scrib",
  [
    { x: -12, y: 0, cubic: { rotation: -60, distance: 6 } },
    { x: -2, y: -8, cubic: { rotation: 30, distance: 6 } },
    { x: 6, y: 2, cubic: { rotation: 160, distance: 6 } },
    { x: -6, y: 4, cubic: { rotation: -40, distance: 7 } },
    { x: 12, y: -4, cubic: { rotation: 20, distance: 5 } },
  ],
  {
    parent: "scribble",
    stroke: { color: AMBER, thickness: 2.4, cap: "round" },
  }
);
shapes.push({
  id: "phone",
  type: "rect",
  x: 0,
  y: 13,
  width: 5,
  height: 11,
  cornerRadius: 1.5,
  parent: "emp_faR",
  opacity: 0,
  fill: { color: AMBER },
});
group("ring", D - 2, G - 70);
for (const r of [0, 1])
  line(
    `ring${r}`,
    [
      { x: 4 + r * 5, y: -6 - r * 2, cubic: { rotation: 60, distance: 3 } },
      { x: 4 + r * 5, y: 6 + r * 2, cubic: { rotation: 120, distance: 3 } },
    ],
    { parent: "ring", stroke: { color: AMBER, thickness: 1.8, cap: "round" } }
  );
for (const gx of [-3.2, 3.2])
  shapes.push({
    id: `shade${gx}`,
    type: "ellipse",
    x: gx,
    y: -55,
    width: 6,
    height: 4.4,
    parent: "emp_body",
    opacity: 0,
    fill: { color: NIGHT },
  });
group("steam", D + 44, G - 46, { opacity: 0 });
line(
  "steamL",
  [
    { x: 0, y: 0, cubic: { rotation: -80, distance: 3 } },
    { x: 2, y: -10, cubic: { rotation: -100, distance: 3 } },
  ],
  { parent: "steam", stroke: ink(1.4) }
);
shapes.push({
  id: "mug",
  type: "rect",
  x: D + 44,
  y: G - 39,
  width: 9,
  height: 10,
  cornerRadius: 1.5,
  opacity: 0,
  fill: { color: AMBER },
});

// ---- flying papers (mess) ----
for (let s = 0; s < 3; s++) {
  const id = `fly${s}`;
  shapes.push({
    id,
    type: "rect",
    x: D + 24,
    y: G - 70,
    width: 12,
    height: 3,
    opacity: 0,
    stroke: ink(1.2),
    fill: { color: PAPER },
  });
  key(id, "opacity", [[0, 0, "hold"]]);
  for (let t = s * 24; t < 300; t += 72) {
    const dx = (s - 1) * 34 + 6;
    key(id, "opacity", [
      [t, 1, "hold"],
      [t + 52, 1, "hold"],
      [t + 56, 0, "ease-in"],
    ]);
    key(id, "x", [
      [t, D + 24, "hold"],
      [t + 56, D + 24 + dx, "linear"],
    ]);
    key(id, "y", [
      [t, G - 70, "hold"],
      [t + 20, G - 100, "ease-out"],
      [t + 56, G - 4, "ease-in"],
    ]);
    key(id, "rotation", [
      [t, 0, "hold"],
      [t + 56, (s - 1) * 260 + 120, "linear"],
    ]);
  }
}

// ---- our dev, the magnifier, the dust, the AI box, the ticks ----
figure("dev", W + 30, { glasses: true });
line(
  "magHandle",
  [
    { x: 0, y: 10 },
    { x: 0, y: 16 },
  ],
  { parent: "dev_faR", opacity: 0, stroke: { color: AMBER, thickness: 2.4, cap: "round" } }
);
shapes.push({
  id: "magGlass",
  type: "ellipse",
  x: 0,
  y: 21,
  width: 10,
  height: 10,
  parent: "dev_faR",
  opacity: 0,
  stroke: { color: AMBER, thickness: 2 },
  fill: { color: PAPER },
});
for (let p = 0; p < 3; p++)
  shapes.push({
    id: `puff${p}`,
    type: "ellipse",
    x: W,
    y: G - 4,
    width: 8,
    height: 6,
    opacity: 0,
    stroke: ink(1.2),
    fill: { color: PAPER },
  });
// The dev's laptop: carried in his left hand, set on the desk, opened, closed, carried off.
// Carried as a laptop bag hanging from the hand, so it never reads as part of the arm.
group("carry", 0, 11.5, { parent: "dev_faL" });
line(
  "carryHandle",
  [
    { x: -3.5, y: 4 },
    { x: -3.5, y: 0 },
    { x: 3.5, y: 0 },
    { x: 3.5, y: 4 },
  ],
  { parent: "carry", stroke: ink(1.4) }
);
shapes.push({
  id: "carryBag",
  type: "rect",
  x: 0,
  y: 9,
  width: 15,
  height: 10,
  cornerRadius: 1.5,
  parent: "carry",
  stroke: ink(1.4),
  fill: { color: BLUE },
});
group("laptop", D + 66, G - 34, { scaleX: 0, scaleY: 0 });
line(
  "lapBase",
  [
    { x: -11, y: -1 },
    { x: 11, y: -1 },
  ],
  { parent: "laptop", stroke: ink(2.6) }
);
group("lid", -10, -2, { parent: "laptop", scaleY: 0 });
shapes.push({
  id: "lidScreen",
  type: "rect",
  x: 9,
  y: -8,
  width: 18,
  height: 14,
  cornerRadius: 1.5,
  parent: "lid",
  stroke: ink(1.8),
  fill: { color: BLUE },
});
for (let c = 0; c < 3; c++)
  line(
    `code${c}`,
    [
      { x: 4, y: -12 + c * 4 },
      { x: 4 + [10, 7, 11][c], y: -12 + c * 4 },
    ],
    {
      parent: "lid",
      stroke: {
        color: c === 1 ? AMBER : PAPER,
        thickness: 1.3,
        cap: "round",
        trim: { start: 0, end: 0 },
      },
    }
  );
for (let t = 0; t < 3; t++) {
  group(`tick${t}`, D + 18 + t * 14, G - 82, { scaleX: 0, scaleY: 0 });
  line(
    `tickM${t}`,
    [
      { x: -4, y: 0 },
      { x: -1, y: 3 },
      { x: 5, y: -4 },
    ],
    { parent: `tick${t}`, stroke: { color: AMBER, thickness: 2.4, cap: "round", join: "round" } }
  );
}

const STAND = { uaL: 20, faL: -8, uaR: -20, faR: 8, thL: 7, shL: 0, thR: -7, shR: 0, lean: 0 };
const RUN_A = {
  uaL: -50,
  faL: -60,
  uaR: 50,
  faR: 60,
  thL: -40,
  shL: 60,
  thR: 35,
  shR: 10,
  lean: -14,
};
const RUN_B = {
  uaL: 50,
  faL: 60,
  uaR: -50,
  faR: -60,
  thL: 35,
  shL: 10,
  thR: -40,
  shR: 60,
  lean: -14,
};
const SKID = {
  ...STAND,
  uaL: 60,
  faL: 20,
  uaR: -60,
  faR: -20,
  thL: -25,
  shL: 10,
  thR: 20,
  shR: 0,
  lean: 16,
};
const INSPECT_A = { ...STAND, ...reach("dev", "R", 14, -30), lean: 10 };
const INSPECT_B = { ...STAND, ...reach("dev", "R", 22, -36), lean: 14 };
const PLACE = { ...STAND, ...reach("dev", "L", 20, -34), lean: 12 };
const TYPE_DA = {
  ...STAND,
  ...reach("dev", "L", 18, -37),
  ...reach("dev", "R", 23, -38),
  lean: 10,
};
const TYPE_DB = {
  ...STAND,
  ...reach("dev", "L", 20, -38),
  ...reach("dev", "R", 21, -37),
  lean: 10,
};
const WAVE_A = { ...STAND, uaR: -150, faR: -30 };
const WAVE_B = { ...STAND, uaR: -150, faR: 10 };

// ================= MESS 0–180 =================
for (let t = 0; t < 110; t += 12) {
  pose("emp", t, TYPE_A);
  pose("emp", t + 6, TYPE_B);
}
pose("emp", 120, DESPAIR, "ease-out");
for (let t = 130; t < 170; t += 10)
  key("emp_body", "rotation", [
    [t, 9, "ease-in-out"],
    [t + 5, 5, "ease-in-out"],
  ]);
for (const p of ["scaleX", "scaleY"])
  key("scribble", p, [
    [0, 0, "hold"],
    [20, 1.1, "ease-out-back"],
    [280, 1, "hold"],
    [300, 0, "ease-in"],
  ]);
key("scribble", "rotation", [
  [0, 0, "hold"],
  [300, 720, "linear"],
]);
key("pile", "rotation", [[0, 0, "hold"]]);
for (let t = 10; t < 400; t += 40)
  key("pile", "rotation", [
    [t, -3, "ease-in-out"],
    [t + 20, 3, "ease-in-out"],
  ]);
key("pile", "rotation", [[420, 0, "ease-out"]]);

// ================= CALL 180–420: phone, then we dash in =================
pose("emp", 186, PHONE, "ease-out-back");
key("phone", "opacity", [
  [0, 0, "hold"],
  [190, 1, "hold"],
  [292, 1, "hold"],
  [296, 0, "hold"],
]);
for (const r of ["ring0", "ring1"])
  key(r, "opacity", [
    [0, 0, "hold"],
    [194, 0, "hold"],
  ]);
for (const r of ["ring0", "ring1"])
  for (let t = 196; t < 280; t += 20)
    key(r, "opacity", [
      [t, 1, "ease-out"],
      [t + 12, 0.1, "ease-in"],
    ]);
for (const r of ["ring0", "ring1"]) key(r, "opacity", [[290, 0, "hold"]]);
pose("emp", 300, SIT);
pose("dev", 0, STAND);
key("dev", "scaleX", [[0, -1, "hold"]]); // faces left as he runs in
key("dev", "x", [
  [0, W + 30, "hold"],
  [300, W + 30, "hold"],
  [356, D + 120, "ease-out"],
]);
for (let t = 300; t < 350; t += 10) {
  pose("dev", t, RUN_A);
  pose("dev", t + 5, RUN_B);
}
pose("dev", 360, SKID, "ease-out");
pose("dev", 384, STAND, "ease-out-back");
[0, 1, 2].forEach((p) => {
  const t = 340 + p * 6;
  key(`puff${p}`, "opacity", [
    [0, 0, "hold"],
    [t, 0.9, "hold"],
    [t + 30, 0, "ease-in"],
  ]);
  key(`puff${p}`, "x", [
    [t, D + 140 + p * 10, "hold"],
    [t + 30, D + 160 + p * 22, "ease-out"],
  ]);
  key(`puff${p}`, "y", [
    [t, G - 4, "hold"],
    [t + 30, G - 14 - p * 4, "ease-out"],
  ]);
});

// ================= AUDIT 420–600: the magnifier and three ticks =================
key("dev", "x", [
  [420, D + 120, "hold"],
  [446, D + 100, "ease-in-out"],
]);
for (const id of ["magHandle", "magGlass"])
  key(id, "opacity", [
    [0, 0, "hold"],
    [430, 0, "hold"],
    [434, 1, "hold"],
    [590, 1, "hold"],
    [594, 0, "hold"],
  ]);
for (let t = 450; t < 580; t += 30) {
  pose("dev", t, INSPECT_A);
  pose("dev", t + 15, INSPECT_B);
}
[0, 1, 2].forEach((n) => {
  const t = 480 + n * 34;
  for (const p of ["scaleX", "scaleY"])
    key(`tick${n}`, p, [
      [0, 0, "hold"],
      [t, 0, "hold"],
      [t + 10, 1.25, "ease-out-back"],
      [t + 18, 1, "ease-out"],
      [680, 1, "hold"],
      [700, 0, "ease-in"],
    ]);
});
pose("emp", 460, SIT);
pose("emp", 470, { ...SIT, lean: -6 }); // watching, hopeful

// ================= PILOT 600–780: open the laptop, fix it, close it =================
key("dev", "x", [
  [600, D + 100, "hold"],
  [612, D + 90, "ease-in-out"],
]);
pose("dev", 600, STAND);
pose("dev", 614, PLACE, "ease-out");
key("carry", "opacity", [
  [0, 1, "hold"],
  [618, 1, "hold"],
  [620, 0, "hold"],
  [758, 0, "hold"],
  [760, 1, "hold"],
]);
for (const p of ["scaleX", "scaleY"])
  key("laptop", p, [
    [0, 0, "hold"],
    [618, 0, "hold"],
    [620, 1, "hold"],
    [758, 1, "hold"],
    [760, 0, "hold"],
  ]);
key("lid", "scaleY", [
  [0, 0, "hold"],
  [626, 0, "hold"],
  [640, 1, "ease-out-back"],
  [744, 1, "hold"],
  [754, 0, "ease-in"],
]);
for (let t = 644; t < 738; t += 14) {
  pose("dev", t, TYPE_DA);
  pose("dev", t + 7, TYPE_DB);
}
[0, 1, 2].forEach((c) => {
  key(`code${c}`, "trimEnd", [
    [0, 0, "hold"],
    [648, 0, "hold"],
  ]);
  for (let t = 648 + c * 8; t < 736; t += 30)
    key(`code${c}`, "trimEnd", [
      [t, 0, "hold"],
      [t + 16, 1, "linear"],
      [t + 28, 1, "hold"],
    ]);
});
key("pile", "scaleY", [
  [0, 1, "hold"],
  [650, 1, "hold"],
  [736, 0.12, "ease-in-out"],
]);
pose("dev", 744, STAND, "ease-out");
pose("dev", 756, PLACE, "ease-out");
pose("dev", 766, STAND, "ease-out");
pose("emp", 700, { ...SIT, lean: -6 });
pose("emp", 714, THUMBS, "ease-out-back");
pose("emp", 770, SIT);

// ================= CHILL 780–1080: feet up, shades on, dev waves off =================
pose("emp", 790, CHILL, "ease-out-back");
for (const g of [-3.2, 3.2]) {
  key(`shade${g}`, "opacity", [
    [0, 0, "hold"],
    [800, 0, "hold"],
    [804, 1, "hold"],
  ]);
  key(`shade${g}`, "y", [
    [0, -55, "hold"],
    [800, -72, "hold"],
    [818, -55, "ease-out-back"],
  ]);
}
key("mug", "opacity", [
  [0, 0, "hold"],
  [810, 0, "hold"],
  [818, 1, "ease-out"],
]);
key("steam", "opacity", [
  [0, 0, "hold"],
  [828, 0, "hold"],
]);
for (let t = 830; t < END; t += 40)
  key("steam", "opacity", [
    [t, 0.8, "ease-in-out"],
    [t + 20, 0.1, "ease-in-out"],
  ]);
for (let t = 800; t < 860; t += 12) {
  pose("dev", t, WAVE_A);
  pose("dev", t + 6, WAVE_B);
}
key("dev", "scaleX", [[864, 1, "hold"]]); // turns to leave
walk("dev", 868, 940, D + 90, W + 30);
pose("emp", END, CHILL);

const { bytes, warnings } = createRiv({
  artboard: { name: "Strip", width: W, height: H },
  groups: k.groups,
  shapes,
  animations: [{ name: "story", fps: FPS, duration: END, loop: "loop", tracks: k.tracksOut() }],
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/transform.riv", bytes);
console.log(`public/rive/transform.riv ${(bytes.length / 1024).toFixed(1)} KB`);
