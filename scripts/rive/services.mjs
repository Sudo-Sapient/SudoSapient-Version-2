// Builds public/rive/services.riv — five tiny looping stickmen for the Services page.
// Artboards: Hello, Agent, Flow, Button, Audit, Vault. Each has one animation, `loop`.
// Run: npm run rive:services.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE } from "./kit.mjs";

const W = 140,
  H = 110,
  G = 100,
  PAPER = "#EEF1F5";
const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };

function board(name, frames, build) {
  const k = makeKit(G, { line: BLUE, paper: PAPER });
  const extra = build(k) ?? {};
  const kits = [k, ...(extra.kits ?? [])];
  return {
    name,
    width: W,
    height: H,
    groups: kits.flatMap((x) => x.groups),
    shapes: kits.flatMap((x) => x.shapes),
    animations: [
      {
        name: "loop",
        fps: 60,
        duration: frames,
        loop: "loop",
        tracks: kits.flatMap((x) => x.tracksOut()),
      },
    ],
  };
}
const floor = (k) =>
  k.line(
    "floor",
    [
      { x: 10, y: G },
      { x: W - 10, y: G },
    ],
    { stroke: { color: BLUE, thickness: 1.2 }, opacity: 0.3 }
  );

const boards = [
  // Our dev, waving hello.
  board("Hello", 72, (k) => {
    floor(k);
    k.figure("dev", 70, { glasses: true });
    for (let t = 0; t <= 72; t += 12)
      k.pose("dev", t, { ...STAND, uaR: -150, faR: (t / 12) % 2 ? 25 : -25 });
  }),
  // The amber AI agent, striding along with a parcel.
  board("Agent", 48, (k) => {
    floor(k);
    const a = makeKit(G, { line: AMBER, paper: PAPER });
    a.figure("agent", 70);
    a.shapes.push({
      id: "parcel",
      type: "rect",
      x: 0,
      y: 16,
      width: 12,
      height: 9,
      parent: "agent_faL",
      stroke: { color: BLUE, thickness: 1.4 },
      fill: { color: AMBER },
    });
    const A = { ...STAND, uaL: 60, faL: 70, thL: 22, shL: 0, thR: -22, shR: -18 };
    const B = { ...STAND, uaL: 60, faL: 70, thL: -22, shL: -18, thR: 22, shR: 0 };
    a.pose("agent", 0, A);
    a.pose("agent", 24, B);
    a.pose("agent", 48, A);
    a.key("agent_body", "y", [
      [0, 0, "ease-in-out"],
      [12, -2, "ease-in-out"],
      [24, 0, "ease-in-out"],
      [36, -2, "ease-in-out"],
      [48, 0, "ease-in-out"],
    ]);
    return { kits: [a] };
  }),
  // Two figures passing a box down the line.
  board("Flow", 96, (k) => {
    floor(k);
    k.figure("left", 40);
    k.figure("right", 100);
    const give = (id, side, x) => ({ ...STAND, ...k.reach(id, side, x, -38) });
    k.pose("left", 0, give("left", "R", 14));
    k.pose("right", 0, STAND);
    k.pose("left", 40, give("left", "R", 26));
    k.pose("right", 40, give("right", "L", -26));
    k.pose("left", 64, STAND);
    k.pose("right", 64, give("right", "L", -14));
    k.pose("left", 96, give("left", "R", 14));
    k.pose("right", 96, STAND);
    k.shapes.push({
      id: "box",
      type: "rect",
      x: 56,
      y: G - 44,
      width: 12,
      height: 10,
      cornerRadius: 1.5,
      stroke: { color: BLUE, thickness: 1.4 },
      fill: { color: AMBER },
    });
    k.key("box", "x", [
      [0, 56, "hold"],
      [40, 70, "ease-in-out"],
      [64, 84, "ease-in-out"],
      [80, 84, "hold"],
      [81, 56, "hold"],
    ]);
    k.key("box", "opacity", [
      [0, 1, "hold"],
      [78, 1, "hold"],
      [80, 0, "hold"],
      [92, 0, "hold"],
      [96, 1, "ease-out"],
    ]);
  }),
  // Pressing the big amber button.
  board("Button", 90, (k) => {
    floor(k);
    k.figure("p", 54);
    k.line(
      "stand",
      [
        { x: 92, y: G },
        { x: 92, y: G - 30 },
      ],
      { stroke: { color: BLUE, thickness: 2.4 } }
    );
    k.group("btn", 92, G - 30);
    k.shapes.push({
      id: "dome",
      type: "ellipse",
      x: 0,
      y: -4,
      width: 22,
      height: 12,
      parent: "btn",
      stroke: { color: BLUE, thickness: 1.6 },
      fill: { color: AMBER },
    });
    const up = { ...STAND, ...k.reach("p", "R", 30, -50) };
    const down = { ...STAND, ...k.reach("p", "R", 38, -34), lean: 6 };
    k.pose("p", 0, STAND);
    k.pose("p", 24, up, "ease-out");
    k.pose("p", 34, down, "ease-in");
    k.pose("p", 50, up, "ease-out");
    k.pose("p", 90, STAND);
    k.key("btn", "scaleY", [
      [0, 1, "hold"],
      [33, 1, "hold"],
      [36, 0.55, "ease-in"],
      [48, 1, "ease-out-back"],
    ]);
  }),
  // Inspecting with a magnifying glass.
  board("Audit", 96, (k) => {
    floor(k);
    k.figure("a", 60, { glasses: true });
    k.line(
      "handle",
      [
        { x: 0, y: 10 },
        { x: 0, y: 16 },
      ],
      { parent: "a_faR", stroke: { color: AMBER, thickness: 2.4, cap: "round" } }
    );
    k.shapes.push({
      id: "glass",
      type: "ellipse",
      x: 0,
      y: 21,
      width: 11,
      height: 11,
      parent: "a_faR",
      stroke: { color: AMBER, thickness: 2 },
      fill: { color: PAPER },
    });
    k.shapes.push({
      id: "doc",
      type: "rect",
      x: 96,
      y: G - 7,
      width: 16,
      height: 14,
      cornerRadius: 1,
      stroke: { color: BLUE, thickness: 1.4 },
      fill: { color: "#FFFFFF" },
    });
    const at = (x, y, lean) => ({ ...STAND, ...k.reach("a", "R", x, y), lean });
    k.pose("a", 0, at(30, -22, 14));
    k.pose("a", 48, at(38, -26, 16));
    k.pose("a", 96, at(30, -22, 14));
  }),
  // Privacy: a document goes into the safe, door shut, dial spun, locked, thumbs up.
  board("Vault", 180, (k) => {
    floor(k);
    k.line(
      "standL",
      [
        { x: 93, y: 86 },
        { x: 93, y: G },
      ],
      { stroke: { color: BLUE, thickness: 2 } }
    );
    k.line(
      "standR",
      [
        { x: 115, y: 86 },
        { x: 115, y: G },
      ],
      { stroke: { color: BLUE, thickness: 2 } }
    );
    k.shapes.push({
      id: "safe",
      z: 0,
      type: "rect",
      x: 104,
      y: 68,
      width: 30,
      height: 36,
      cornerRadius: 2,
      stroke: { color: BLUE, thickness: 2 },
      fill: { color: "#DCE3EE" },
    });
    k.shapes.push({
      id: "docIn",
      z: 2,
      type: "rect",
      x: 104,
      y: 72,
      width: 9,
      height: 11,
      opacity: 0,
      stroke: { color: BLUE, thickness: 1.2 },
      fill: { color: "#FFFFFF" },
    });
    k.group("door", 89, 68, { scaleX: 0.15 });
    k.shapes.push({
      id: "doorP",
      z: 4,
      type: "rect",
      x: 15,
      y: 0,
      width: 30,
      height: 36,
      cornerRadius: 2,
      parent: "door",
      stroke: { color: BLUE, thickness: 2 },
      fill: { color: BLUE },
    });
    k.group("dial", 15, -6, { parent: "door" });
    k.shapes.push({
      id: "dialC",
      z: 5,
      type: "ellipse",
      x: 0,
      y: 0,
      width: 9,
      height: 9,
      parent: "dial",
      stroke: { color: "#FFFFFF", thickness: 1.4 },
    });
    k.line(
      "dialT",
      [
        { x: 0, y: 0 },
        { x: 0, y: -3.5 },
      ],
      { parent: "dial", z: 5, stroke: { color: "#FFFFFF", thickness: 1.4, cap: "round" } }
    );
    k.shapes.push({
      id: "led",
      z: 5,
      type: "ellipse",
      x: 25,
      y: -13,
      width: 3.5,
      height: 3.5,
      parent: "door",
      fill: { color: AMBER },
      opacity: 0,
    });
    k.figure("v", 82);
    k.shapes.push({
      id: "doc",
      type: "rect",
      x: 0,
      y: 15,
      width: 9,
      height: 11,
      parent: "v_faR",
      stroke: { color: BLUE, thickness: 1.2 },
      fill: { color: "#FFFFFF" },
    });
    const HOLD = { ...STAND, ...k.reach("v", "R", 10, -34) };
    const PUT = { ...STAND, ...k.reach("v", "R", 20, -32), lean: 8 };
    const PUSH = { ...STAND, ...k.reach("v", "R", 14, -40), lean: 6 };
    const DIAL_A = { ...STAND, ...k.reach("v", "R", 17, -38), lean: 4 };
    const DIAL_B = { ...STAND, ...k.reach("v", "R", 16, -35), lean: 4 };
    const THUMB = { ...STAND, uaL: 150, faL: 40 };
    k.pose("v", 0, HOLD);
    k.pose("v", 20, HOLD);
    k.pose("v", 36, PUT, "ease-in-out");
    k.key("doc", "opacity", [
      [0, 1, "hold"],
      [40, 1, "hold"],
      [41, 0, "hold"],
      [176, 0, "hold"],
      [177, 1, "hold"],
    ]);
    k.key("docIn", "opacity", [
      [0, 0, "hold"],
      [40, 0, "hold"],
      [41, 1, "hold"],
      [168, 1, "hold"],
      [169, 0, "hold"],
    ]);
    k.pose("v", 48, PUSH, "ease-in-out");
    k.key("door", "scaleX", [
      [0, 0.15, "hold"],
      [52, 0.15, "hold"],
      [64, 1, "ease-in"],
      [160, 1, "hold"],
      [172, 0.15, "ease-out"],
    ]);
    for (let t = 70; t < 108; t += 8) {
      k.pose("v", t, DIAL_A);
      k.pose("v", t + 4, DIAL_B);
    }
    k.key("dial", "rotation", [
      [0, 0, "hold"],
      [70, 0, "hold"],
      [86, 200, "ease-in-out"],
      [96, 120, "ease-in-out"],
      [108, 300, "ease-out"],
      [176, 300, "hold"],
      [177, 0, "hold"],
    ]);
    k.key("led", "opacity", [
      [0, 0, "hold"],
      [110, 0, "hold"],
      [112, 1, "hold"],
      [160, 1, "hold"],
      [162, 0, "hold"],
    ]);
    k.pose("v", 116, { ...STAND, lean: -2 }, "ease-out");
    k.pose("v", 126, THUMB, "ease-out-back");
    k.pose("v", 154, THUMB);
    k.pose("v", 172, HOLD, "ease-in-out");
    k.pose("v", 180, HOLD);
  }),
];

const { bytes, warnings } = createRiv({ artboards: boards });
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/services.riv", bytes);
console.log(`public/rive/services.riv ${(bytes.length / 1024).toFixed(1)} KB`);
