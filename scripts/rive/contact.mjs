// Builds public/rive/contact.riv: the contact page. A visitor taps out a message on his
// phone; a cute agent (agents.mjs) swoops in, grabs it and flies it to our dev, who
// catches it, jumps, gives a thumbs up, and the agent flies a reply back. The visitor
// cheers. Twice per loop: first a WhatsApp style chat bubble, then an email envelope.
// One animation, `loop` (8s). Run: npm run rive:contact.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, WHITE } from "./kit.mjs";
import { addAgent, blink, pop } from "./agents.mjs";

const W = 300,
  H = 170,
  G = 156,
  HALF = 240,
  END = HALF * 2;
const BG = "#1E40AF"; // drawn on the blueprint section
const VX = 54, // the visitor
  DX = 246; // our dev
const HOME = [150, 38]; // where the agent hovers between deliveries
const k = makeKit(G, { line: WHITE, paper: BG });
const { shapes, group, line, key, figure, pose, reach } = k;
const ink = (t = 1.6, color = WHITE) => ({ color, thickness: t, cap: "round", join: "round" });
const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };

line(
  "floor",
  [
    { x: 12, y: G },
    { x: W - 12, y: G },
  ],
  { stroke: ink(1.2), opacity: 0.35 }
);

// ---- the visitor, phone in hand, and the "typing..." dots over his head ----
figure("v", VX);
shapes.push({
  id: "phone",
  type: "rect",
  x: 0,
  y: 14,
  width: 5,
  height: 9,
  cornerRadius: 1.2,
  parent: "v_faR",
  fill: { color: WHITE },
});
group("dots", VX + 2, 76, { scaleX: 0, scaleY: 0 });
shapes.push({
  id: "dotsBg",
  type: "rect",
  x: 0,
  y: 0,
  width: 18,
  height: 10,
  cornerRadius: 5,
  parent: "dots",
  fill: { color: WHITE },
});
for (let d = 0; d < 3; d++)
  shapes.push({
    id: `dot${d}`,
    type: "ellipse",
    x: -5 + d * 5,
    y: 0,
    width: 2.6,
    height: 2.6,
    parent: "dots",
    fill: { color: BG },
  });

// ---- our dev ----
figure("dev", DX, { glasses: true });
key("dev", "scaleX", [[0, -1, "hold"]]); // faces the visitor; reach x is "towards him"
group("bang", DX, 66, { scaleX: 0, scaleY: 0 });
line(
  "bangL",
  [
    { x: 0, y: -8 },
    { x: 0, y: 1 },
  ],
  { parent: "bang", stroke: { color: AMBER, thickness: 3, cap: "round" } }
);
shapes.push({
  id: "bangD",
  type: "ellipse",
  x: 0,
  y: 6,
  width: 3.2,
  height: 3.2,
  parent: "bang",
  fill: { color: AMBER },
});

// ---- the things being carried ----
group("chat", 0, 0, { scaleX: 0, scaleY: 0 });
shapes.push({
  id: "chatB",
  type: "rect",
  x: 0,
  y: 0,
  width: 24,
  height: 15,
  cornerRadius: 6,
  parent: "chat",
  fill: { color: "#25D366" },
});
shapes.push({
  id: "chatTail",
  type: "polygon",
  x: 0,
  y: 0,
  parent: "chat",
  points: [
    { x: -7, y: 6 },
    { x: -11, y: 11 },
    { x: -2, y: 7 },
  ],
  fill: { color: "#25D366" },
});
for (let d = 0; d < 3; d++)
  shapes.push({
    id: `chatD${d}`,
    type: "ellipse",
    x: -6 + d * 6,
    y: 0,
    width: 3,
    height: 3,
    parent: "chat",
    fill: { color: WHITE },
  });
group("env", 0, 0, { scaleX: 0, scaleY: 0 });
shapes.push({
  id: "envB",
  type: "rect",
  x: 0,
  y: 0,
  width: 24,
  height: 15,
  cornerRadius: 1.5,
  parent: "env",
  fill: { color: WHITE },
});
line(
  "envV",
  [
    { x: -12, y: -7.5 },
    { x: 0, y: 1.5 },
    { x: 12, y: -7.5 },
  ],
  { parent: "env", stroke: ink(1.4, BG) }
);
group("reply", 0, 0, { scaleX: 0, scaleY: 0 });
shapes.push({
  id: "replyB",
  type: "rect",
  x: 0,
  y: 0,
  width: 22,
  height: 15,
  cornerRadius: 6,
  parent: "reply",
  fill: { color: AMBER },
});
line(
  "replyT",
  [
    { x: -5, y: 0 },
    { x: -1.5, y: 3.5 },
    { x: 5.5, y: -4 },
  ],
  { parent: "reply", stroke: ink(2, BG) }
);

// ---- the courier ----
addAgent(k, "ag", "spark", HOME[0], HOME[1], {}, 1.7);

// Poses
const TYPE_A = { ...STAND, ...reach("v", "R", 7, -38), ...reach("v", "L", 3, -36) };
const TYPE_B = { ...STAND, ...reach("v", "R", 8, -36), ...reach("v", "L", 4, -38) };
const SEND = { ...STAND, ...reach("v", "R", 12, -52), lean: -3 };
const WAIT = { ...STAND, ...reach("v", "R", 7, -38) };
const CATCH = { ...STAND, ...reach("dev", "R", 15, -50), ...reach("dev", "L", 11, -48), lean: 4 };
const THUMB = { ...STAND, uaR: -150, faR: -40 };

// One delivery: the visitor sends `msg`, the agent carries it over, a reply comes back.
function delivery(s, msg) {
  // typing, dots bubbling
  for (let t = s; t < s + 54; t += 10) {
    pose("v", t, TYPE_A);
    pose("v", t + 5, TYPE_B);
  }
  pop(k, "dots", s + 8);
  for (let d = 0; d < 3; d++)
    for (let t = s + 12 + d * 5; t < s + 52; t += 15)
      key(`dot${d}`, "y", [
        [t, 0, "ease-out"],
        [t + 5, -2.5, "ease-out"],
        [t + 10, 0, "ease-in"],
      ]);
  pop(k, "dots", s + 54, true);
  // send: the message pops up over his head
  pose("v", s + 58, SEND, "ease-out");
  pose("v", s + 76, WAIT, "ease-in-out");
  for (const p of ["scaleX", "scaleY"])
    key(msg, p, [
      [s, 0, "hold"],
      [s + 58, 0, "hold"],
      [s + 64, 1.25, "ease-out"],
      [s + 68, 1, "ease-in-out"],
      [s + 132, 1, "hold"],
      [s + 142, 0, "ease-in"],
    ]);
  // the agent swoops down, grabs it, flies it over (the message hangs just under it)
  const path = [
    [s, ...HOME],
    [s + 66, ...HOME],
    [s + 80, VX + 20, 58],
    [s + 88, VX + 20, 58],
    [s + 104, 150, 30],
    [s + 122, DX - 16, 82],
    [s + 134, DX - 16, 82],
    [s + 150, ...HOME],
  ];
  key(
    "ag",
    "x",
    path.map(([f, x], n) => [f, x, n < 2 ? "hold" : "ease-in-out"])
  );
  key(
    "ag",
    "y",
    path.map(([f, , y], n) => [f, y, n < 2 ? "hold" : "ease-in-out"])
  );
  key(msg, "x", [
    [s, VX + 20, "hold"],
    [s + 88, VX + 20, "hold"],
    [s + 104, 150, "ease-in-out"],
    [s + 122, DX - 16, "ease-in-out"],
  ]);
  key(msg, "y", [
    [s, 74, "hold"],
    [s + 80, 74, "hold"],
    [s + 88, 72, "ease-in-out"],
    [s + 104, 44, "ease-in-out"],
    [s + 122, 96, "ease-in-out"],
    [s + 132, 104, "ease-in"],
  ]);
  key("ag_body", "rotation", [
    [s, 0, "hold"],
    [s + 88, 0, "hold"],
    [s + 122, 360, "ease-in-out"],
    [s + 123, 0, "hold"],
  ]);
  blink(k, "ag", s + 40);
  // the dev catches it, "!", a happy hop, thumbs up
  pose("dev", s, STAND);
  pose("dev", s + 108, STAND);
  pose("dev", s + 122, CATCH, "ease-out");
  pose("dev", s + 140, CATCH);
  for (const p of ["scaleX", "scaleY"])
    key("bang", p, [
      [s, 0, "hold"],
      [s + 134, 0, "hold"],
      [s + 140, 1.3, "ease-out"],
      [s + 144, 1, "ease-in-out"],
      [s + 160, 1, "hold"],
      [s + 166, 0, "ease-in"],
    ]);
  key("dev_body", "y", [
    [s, 0, "hold"],
    [s + 142, 0, "hold"],
    [s + 148, -6, "ease-out"],
    [s + 156, 0, "ease-in"],
  ]);
  pose("dev", s + 150, "cheer", "ease-out");
  pose("dev", s + 164, THUMB, "ease-out-back");
  pose("dev", s + 200, THUMB);
  pose("dev", s + 220, STAND, "ease-in-out");
  // the reply flies back the same way
  const back = [
    [s + 150, ...HOME],
    [s + 164, DX - 16, 60],
    [s + 170, DX - 16, 60],
    [s + 188, 150, 30],
    [s + 206, VX + 20, 62],
    [s + 214, VX + 20, 62],
    [s + HALF - 4, ...HOME],
  ];
  key(
    "ag",
    "x",
    back.map(([f, x]) => [f, x, "ease-in-out"])
  );
  key(
    "ag",
    "y",
    back.map(([f, , y]) => [f, y, "ease-in-out"])
  );
  for (const p of ["scaleX", "scaleY"])
    key("reply", p, [
      [s, 0, "hold"],
      [s + 160, 0, "hold"],
      [s + 166, 1.25, "ease-out"],
      [s + 170, 1, "ease-in-out"],
      [s + 216, 1, "hold"],
      [s + 226, 0, "ease-in"],
    ]);
  key("reply", "x", [
    [s, DX - 16, "hold"],
    [s + 170, DX - 16, "hold"],
    [s + 188, 150, "ease-in-out"],
    [s + 206, VX + 20, "ease-in-out"],
  ]);
  key("reply", "y", [
    [s, 74, "hold"],
    [s + 164, 74, "hold"],
    [s + 170, 74, "ease-in-out"],
    [s + 188, 44, "ease-in-out"],
    [s + 206, 76, "ease-in-out"],
  ]);
  // the visitor reads it and cheers
  pose("v", s + 210, WAIT);
  pose("v", s + 220, "cheer", "ease-out-back");
  key("v_body", "y", [
    [s, 0, "hold"],
    [s + 218, 0, "hold"],
    [s + 224, -5, "ease-out"],
    [s + 230, 0, "ease-in"],
  ]);
  pose("v", s + HALF - 4, TYPE_A, "ease-in-out");
}
delivery(0, "chat");
delivery(HALF, "env");

const { bytes, warnings } = createRiv({
  artboard: { name: "Contact", width: W, height: H },
  groups: k.groups,
  shapes,
  animations: [{ name: "loop", fps: 60, duration: END, loop: "loop", tracks: k.tracksOut() }],
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/contact.riv", bytes);
console.log(`public/rive/contact.riv ${(bytes.length / 1024).toFixed(1)} KB`);
