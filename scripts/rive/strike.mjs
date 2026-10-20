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
// The overlay sits on the phrase's bottom edge and is 2.2em tall (1em ≈ 33 units):
// the letters fill the bottom em, the figures stand on top of them like a ledge.
const W = 17 * CH,
  H = 74;
const LINE_Y = 59; // strike: mid-letter
const WALK_Y = 42; // the tops of the letters, where the figures stand
const S = 0.53; // figure scale: about one letter-height tall
const PAPER = "#EEF1F5";

const k = makeKit(WALK_Y, { line: "#0F172A", paper: PAPER });
const agentKit = makeKit(WALK_Y, { line: AMBER, paper: PAPER });
const { shapes, line, key, figure, pose, reach, walk } = k;
const TIP = 14; // pencil tip, in the pencil man's own (unscaled) units

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

figure("pen", -30, { halo: PAPER });
// A giant pencil: from his hand down to mid-letter, where its tip draws the strike.
line(
  "pencil",
  [
    { x: 10, y: -26 },
    { x: TIP, y: (LINE_Y - WALK_Y) / S },
  ],
  { parent: "pen", stroke: { color: AMBER, thickness: 4, cap: "round" } }
);
line(
  "pencilTip",
  [
    { x: TIP - 1, y: (LINE_Y - WALK_Y) / S - 4 },
    { x: TIP, y: (LINE_Y - WALK_Y) / S },
  ],
  { parent: "pen", stroke: { color: "#0F172A", thickness: 4, cap: "round" } }
);
agentKit.figure("agent", 0, { halo: BLUE });
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

for (const p of ["scaleX", "scaleY"]) key("pen", p, [[0, S, "hold"]]);

const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };
const DRAW = { ...STAND, ...reach("pen", "R", 10, -26), lean: 6 }; // gripping the pencil
const GRAB = { ...STAND, uaL: 40, faL: 50, lean: -10 };
const CARRY = { ...STAND, uaL: 60, faL: 70 };

PHRASES.forEach((p, i) => {
  const s = i * CYCLE,
    end = (p.length - 1) * CH + 6;
  const drawFrames = p.length * 4;
  // Pencil man walks on, strikes the phrase, hops off.
  key("pen", "opacity", [[s, 1, "hold"]]);
  // Offset by the pencil reach so the tip, not his feet, starts and ends the strike.
  const off = TIP * S;
  walk("pen", s, s + 20, -30, -off);
  walk("pen", s + 20, s + 20 + drawFrames, -off, end - off);
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

  // The AI agent pops up on the last letters, grabs the task, and pops away with it.
  const at = end - 18;
  agentKit.key("agent", "x", [[s, at, "hold"]]);
  for (const prop of ["scaleX", "scaleY"])
    agentKit.key("agent", prop, [
      [s, 0, "hold"],
      [s + 118, 0, "hold"],
      [s + 130, S * 1.15, "ease-out-back"],
      [s + 136, S, "ease-out"],
      [s + 196, S, "hold"],
      [s + 210, 0, "ease-in-back"],
    ]);
  agentKit.pose("agent", s, STAND);
  agentKit.pose("agent", s + 140, STAND);
  agentKit.pose("agent", s + 148, GRAB, "ease-out-back");
  agentKit.key("parcel", "opacity", [
    [s, 0, "hold"],
    [s + 152, 0, "hold"],
    [s + 154, 1, "hold"],
    [s + 208, 1, "hold"],
    [s + 210, 0, "hold"],
  ]);
  agentKit.pose("agent", s + 160, CARRY);
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
