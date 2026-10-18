// Builds public/rive/strike.riv — section 1's inline gag. A transparent overlay that
// sits on the struck phrase in "Stop paying people to ~~copy and paste~~": a tiny
// stickman walks along the phrase drawing the strike-through with a pencil, then the
// amber AI agent carries the task off. One 4s cycle per phrase, `loop` = 16s.
// Run: npm run rive:strike.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE } from "./kit.mjs";

// Must match PHRASES in components/sections/Pillars.tsx (lengths drive the strike).
const PHRASES = ["copy and paste.", "chase follow-ups.", "type up reports.", "sort the inbox."];
const FPS = 60;
const CYCLE = 240; // 4s per phrase
const CH = 20; // artboard units per monospace character; the box is 17ch wide
const W = 17 * CH,
  H = 120;
const LINE_Y = 62; // the strike sits on the phrase's mid-height (artboard centre ≈ text centre)
const S = 0.72; // figure scale: small enough to stand on the text line

const k = makeKit(LINE_Y, { line: BLUE, paper: "#EEF1F5" });
const agentKit = makeKit(LINE_Y, { line: AMBER, paper: "#EEF1F5" });
const { shapes, line, key, figure, pose, walk } = k;

PHRASES.forEach((p, i) =>
  line(
    `strike${i}`,
    [
      { x: 0, y: LINE_Y },
      { x: (p.length - 1) * CH + 6, y: LINE_Y },
    ],
    {
      stroke: { color: BLUE, thickness: 5, cap: "round", trim: { start: 0, end: 0 } },
    }
  )
);

figure("pen", -30);
// The pencil, held low so its tip rides the strike line.
line(
  "pencil",
  [
    { x: 0, y: 6 },
    { x: 0, y: 20 },
  ],
  { parent: "pen_faR", stroke: { color: AMBER, thickness: 3.2, cap: "round" } }
);
agentKit.figure("agent", W + 30, { halo: BLUE });
agentKit.shapes.push({
  id: "parcel",
  type: "rect",
  x: 0,
  y: 16,
  width: 12,
  height: 9,
  parent: "agent_faL",
  opacity: 0,
  stroke: { color: BLUE, thickness: 1.4 },
  fill: { color: AMBER },
});

for (const [kit, id] of [
  [k, "pen"],
  [agentKit, "agent"],
])
  for (const p of ["scaleX", "scaleY"]) kit.key(id, p, [[0, S, "hold"]]);

const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };
const DRAW = { ...STAND, uaR: -30, faR: -10, lean: 8 }; // pencil down, leaning into it
const GRAB = { ...STAND, uaL: 40, faL: 50, lean: -10 };
const CARRY = { ...STAND, uaL: 60, faL: 70 };

PHRASES.forEach((p, i) => {
  const s = i * CYCLE,
    end = (p.length - 1) * CH + 6;
  const drawFrames = p.length * 4;
  // Pencil man walks on, strikes the phrase, hops off.
  key("pen", "opacity", [[s, 1, "hold"]]);
  walk("pen", s, s + 20, -30, 0);
  walk("pen", s + 20, s + 20 + drawFrames, 0, end);
  for (let t = s + 26; t < s + 20 + drawFrames; t += 12) pose("pen", t, DRAW);
  key(`strike${i}`, "trimEnd", [
    [0, 0, "hold"],
    [s + 20, 0, "hold"],
    [s + 20 + drawFrames, 1, "linear"],
    [s + 160, 1, "hold"],
    [s + 175, 0, "ease-in"],
  ]);
  key("pen", "opacity", [
    [s + 22 + drawFrames, 1, "hold"],
    [s + 36 + drawFrames, 0, "ease-in"],
  ]);
  key("pen_body", "y", [
    [s + 22 + drawFrames, 0, "hold"],
    [s + 30 + drawFrames, -10, "ease-out"],
    [s + 38 + drawFrames, 4, "ease-in"],
    [s + CYCLE - 1, 0, "hold"],
  ]);
  pose("pen", s + 22 + drawFrames, STAND);

  // The agent walks in, picks the task up, and carries it away.
  const meet = end + 26;
  agentKit.pose("agent", s, STAND);
  agentKit.walk("agent", s + 96, s + 140, W + 30, meet);
  agentKit.pose("agent", s + 146, GRAB, "ease-out-back");
  agentKit.key("parcel", "opacity", [
    [s, 0, "hold"],
    [s + 150, 0, "hold"],
    [s + 152, 1, "hold"],
    [s + 214, 1, "hold"],
    [s + 216, 0, "hold"],
  ]);
  agentKit.pose("agent", s + 156, CARRY);
  agentKit.walk("agent", s + 160, s + 214, meet, W + 30);
  agentKit.pose("agent", s + 216, CARRY);
  agentKit.pose("agent", s + CYCLE - 1, STAND);
});
key("pen", "opacity", [[PHRASES.length * CYCLE, 1, "hold"]]);

const { bytes, warnings } = createRiv({
  artboard: { name: "Strike", width: W, height: H },
  groups: [...k.groups, ...agentKit.groups],
  shapes: [...shapes, ...agentKit.shapes],
  animations: [
    {
      name: "loop",
      fps: FPS,
      duration: PHRASES.length * CYCLE,
      loop: "loop",
      tracks: [...k.tracksOut(), ...agentKit.tracksOut()],
    },
  ],
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/strike.riv", bytes);
console.log(`public/rive/strike.riv ${(bytes.length / 1024).toFixed(1)} KB`);
