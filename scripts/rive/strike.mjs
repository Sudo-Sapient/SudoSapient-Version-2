// Builds public/rive/strike.riv: section 1, "Stop paying people to ~~copy and paste~~".
// A worker at his desk grinds through one chore per phrase. Each time, a cute agent
// (agents.mjs) pops in, the chore flies into it, and the worker leans back, hands behind
// his head. One 4s cycle per phrase, `loop` = 16s. Pillars.tsx strikes the phrase on the
// same clock. Run: npm run rive:strike.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE } from "./kit.mjs";
import { addAgent, blink, pop, KINDS } from "./agents.mjs";

// Must match PHRASES in components/sections/Pillars.tsx.
const PHRASES = ["copy and paste.", "chase follow ups.", "type up reports.", "sort the inbox."];
const CYCLE = 240; // 4s per phrase
const END = PHRASES.length * CYCLE;
const W = 200,
  H = 136,
  G = 128;
const X = 58; // the worker's chair
const CX = 98; // where the chores sit on the desk
const AX = 162,
  AY = 58; // where the agents hover
const DESK = G - 34;
const PAPER = "#EEF1F5";
const k = makeKit(G, { line: BLUE, paper: PAPER });
const { shapes, group, line, key, figure, pose, reach } = k;
const ink = (t = 1.6) => ({ color: BLUE, thickness: t, cap: "round", join: "round" });

// ---- set ----
line(
  "floor",
  [
    { x: 10, y: G },
    { x: W - 10, y: G },
  ],
  { stroke: ink(1.2), opacity: 0.3 }
);
line(
  "deskTop",
  [
    { x: 106, y: DESK },
    { x: 236, y: DESK },
  ],
  { stroke: ink(2.6) }
);
for (const lx of [74, 186])
  line(
    `leg${lx}`,
    [
      { x: lx, y: DESK },
      { x: lx, y: G },
    ],
    { stroke: ink(2) }
  );

// ---- the worker ----
figure("w", X);
line(
  "chair",
  [
    { x: -8, y: -34 },
    { x: -8, y: -15 },
    { x: 8, y: -15 },
    { x: 8, y: 0 },
  ],
  { parent: "w", stroke: ink(1.8) }
);
shapes.push({
  id: "phone",
  type: "rect",
  x: 0,
  y: 12,
  width: 4,
  height: 8,
  cornerRadius: 1,
  parent: "w_faR",
  fill: { color: BLUE },
  opacity: 0,
});
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
const TYPE_A = { ...SIT, faL: -5, faR: -45, lean: 8 };
const TYPE_B = { ...SIT, faL: -35, faR: -15, lean: 8 };
const PHONE = { ...SIT, ...reach("w", "R", 6, -55), uaL: -40, faL: -60, lean: 4 };
const PHONE_B = { ...PHONE, lean: 10 };
const SURPRISE = { ...SIT, lean: -8 };
const CHILL = {
  ...SIT,
  ...reach("w", "L", -7, -60),
  ...reach("w", "R", 7, -60),
  thL: -112,
  shL: 8,
  thR: -108,
  shR: 10,
  lean: -16,
};
key("w_body", "y", [[0, 12, "hold"]]);

// ---- the four chores, each a group sitting on the desk ----
const envelope = (id, parent, y) => {
  shapes.push({
    id,
    type: "rect",
    x: 0,
    y,
    width: 18,
    height: 9,
    cornerRadius: 1,
    parent,
    stroke: ink(1.2),
    fill: { color: "#FFFFFF" },
  });
  line(
    `${id}V`,
    [
      { x: -9, y: y - 4.5 },
      { x: 0, y: y + 1 },
      { x: 9, y: y - 4.5 },
    ],
    { parent, stroke: ink(1) }
  );
};
const sheet = (id, parent, x) => {
  shapes.push({
    id,
    type: "rect",
    x,
    y: -10,
    width: 14,
    height: 19,
    cornerRadius: 1,
    parent,
    stroke: ink(1.2),
    fill: { color: "#FFFFFF" },
  });
  for (let l = 0; l < 3; l++)
    line(
      `${id}L${l}`,
      [
        { x: x - 4, y: -15 + l * 4 },
        { x: x + 4, y: -15 + l * 4 },
      ],
      { parent, stroke: ink(0.9), opacity: 0.6 }
    );
};
const P = PHRASES.map((_, i) => group(`chore${i}`, CX, DESK, { scaleX: 0, scaleY: 0 }));
// 0: copy and paste: a chip hops from one sheet to the other, over and over
sheet("sheetA", P[0], -12);
sheet("sheetB", P[0], 12);
shapes.push({
  id: "chip",
  type: "rect",
  x: -12,
  y: -24,
  width: 7,
  height: 4,
  cornerRadius: 1,
  parent: P[0],
  fill: { color: AMBER },
});
// 1: chase follow-ups: unanswered envelopes stack up while he's on the phone
for (let e = 0; e < 3; e++) envelope(`fu${e}`, P[1], -5 - e * 9);
// 2: type up reports: a laptop, and the pile of pages beside it keeps growing
line(
  "lapBase",
  [
    { x: -14, y: -1 },
    { x: 10, y: -1 },
  ],
  { parent: P[2], stroke: ink(2.4) }
);
shapes.push({
  id: "lapScr",
  type: "rect",
  x: -2,
  y: -11,
  width: 22,
  height: 15,
  cornerRadius: 1.5,
  parent: P[2],
  stroke: ink(1.4),
  fill: { color: BLUE },
});
group("pages", 22, 0, { parent: P[2], scaleY: 0.3 });
for (let pg = 0; pg < 4; pg++)
  shapes.push({
    id: `page${pg}`,
    type: "rect",
    x: 0,
    y: -3 - pg * 5,
    width: 14,
    height: 5,
    parent: "pages",
    stroke: ink(1),
    fill: { color: "#FFFFFF" },
  });
// 3: sort the inbox: mail keeps raining onto the desk
for (let e = 0; e < 4; e++) {
  group(`mail${e}`, (e % 2 ? 8 : -6) + e, -70, { parent: P[3] });
  envelope(`ib${e}`, `mail${e}`, 0);
}

// ---- one agent per phrase, waiting off stage ----
const AG = PHRASES.map((_, i) =>
  addAgent(k, `ag${i}`, KINDS[i % KINDS.length], AX, AY, { scaleX: 0, scaleY: 0 }, 1.9)
);

// ================= the loop =================
PHRASES.forEach((_, i) => {
  const s = i * CYCLE;
  const chore = P[i];
  // the grind
  if (i === 1) {
    key("phone", "opacity", [
      [s, 1, "hold"],
      [s + 132, 0, "hold"],
    ]);
    for (let t = s; t < s + 110; t += 24) {
      pose("w", t, PHONE, "ease-in-out");
      pose("w", t + 12, PHONE_B, "ease-in-out");
    }
    for (let e = 0; e < 3; e++)
      for (const p of ["scaleX", "scaleY"])
        key(`fu${e}`, p, [
          [s, 0, "hold"],
          [s + 14 + e * 26, 0, "hold"],
          [s + 20 + e * 26, 1.2, "ease-out"],
          [s + 24 + e * 26, 1, "ease-in-out"],
        ]);
  } else {
    for (let t = s; t < s + 110; t += 12) {
      pose("w", t, TYPE_A);
      pose("w", t + 6, TYPE_B);
    }
  }
  if (i === 0)
    for (let t = s + 6; t + 26 <= s + 112; t += 26) {
      key("chip", "x", [
        [t, -12, "hold"],
        [t + 14, 12, "ease-in-out"],
        [t + 22, 12, "hold"],
        [t + 23, -12, "hold"],
      ]);
      key("chip", "y", [
        [t, -24, "hold"],
        [t + 7, -32, "ease-out"],
        [t + 14, -24, "ease-in"],
      ]);
    }
  if (i === 2)
    key("pages", "scaleY", [
      [s, 0.3, "hold"],
      [s + 110, 1.4, "linear"],
      [s + CYCLE - 1, 0.3, "hold"],
    ]);
  if (i === 3)
    for (let e = 0; e < 4; e++)
      key(`mail${e}`, "y", [
        [s, -70, "hold"],
        [s + 10 + e * 22, -70, "hold"],
        [s + 24 + e * 22, -5 - e * 5, "ease-in"],
        [s + CYCLE - 1, -70, "hold"],
      ]);

  // an agent pops in; the chore flies into it
  const ag = AG[i];
  pop(k, ag, s + 108);
  const bob = [0, 0, -6, 0, -4, 0, -4, 0];
  key(
    ag,
    "y",
    [120, 120, 132, 144, 160, 176, 192, 204].map((f, n) => [
      s + f,
      AY + bob[n],
      n < 2 ? "hold" : "ease-in-out",
    ])
  );
  key(`${ag}_body`, "rotation", [
    [s, 0, "hold"],
    [s + 144, 0, "hold"],
    [s + 204, 360, "ease-in-out"],
    [s + 205, 0, "hold"],
  ]);
  blink(k, ag, s + 170);
  pop(k, ag, s + 208, true);
  // The chore shows only during its own cycle (scale, since group opacity doesn't hide
  // children in this writer), then flies into the agent.
  key(chore, "x", [
    [s, CX, "hold"],
    [s + 122, CX, "hold"],
    [s + 136, AX, "ease-in"],
    [s + CYCLE - 1, CX, "hold"],
  ]);
  key(chore, "y", [
    [s, DESK, "hold"],
    [s + 122, DESK, "hold"],
    [s + 136, AY, "ease-in"],
    [s + CYCLE - 1, DESK, "hold"],
  ]);
  for (const p of ["scaleX", "scaleY"])
    key(chore, p, [
      ...(s > 0 ? [[0, 0, "hold"]] : []),
      [s, 1, "hold"],
      [s + 122, 1, "hold"],
      [s + 136, 0, "ease-in"],
    ]);

  // and he finally leans back
  pose("w", s + 112, SURPRISE, "ease-out");
  pose("w", s + 140, CHILL, "ease-out-back");
  pose("w", s + 212, CHILL);
  pose("w", s + 232, i === 0 ? PHONE : TYPE_A, "ease-in-out"); // next phrase's chore
});
pose("w", END, TYPE_A);

const { bytes, warnings } = createRiv({
  artboard: { name: "Desk", width: W, height: H },
  groups: k.groups,
  shapes,
  animations: [{ name: "loop", fps: 60, duration: END, loop: "loop", tracks: k.tracksOut() }],
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/strike.riv", bytes);
console.log(`public/rive/strike.riv ${(bytes.length / 1024).toFixed(1)} KB`);
