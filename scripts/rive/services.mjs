// Builds public/rive/services.riv: small looping scenes for the Services, About and legal pages.
// Artboards: Hello, Agent, Flow, Button, Vault, Calendar. Each has one animation, `loop`.
// Agent, Flow and Button star the cute agents from agents.mjs.
// Run: npm run rive:services.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE } from "./kit.mjs";
import { addAgent, blink, pop, KINDS } from "./agents.mjs";

const W = 140,
  H = 110,
  G = 100,
  PAPER = "#EEF1F5";
const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };

function board(name, frames, build, width = W) {
  const k = makeKit(G, { line: BLUE, paper: PAPER });
  const extra = build(k) ?? {};
  const kits = [k, ...(extra.kits ?? [])];
  return {
    name,
    width,
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
const CW = 200; // the calendar board is wider
const ink = (t = 1.6) => ({ color: BLUE, thickness: t, cap: "round", join: "round" });
// Code lines writing themselves on a screen whose top-left text starts at (x, y).
function codeLines(k, id, x, y, frames, s = 1) {
  [14, 9, 12].forEach((w, c) => {
    k.line(
      `${id}${c}`,
      [
        { x, y: y + c * 5 * s },
        { x: x + w * s * 1.4, y: y + c * 5 * s },
      ],
      {
        stroke: {
          color: c === 1 ? AMBER : PAPER,
          thickness: 1.4 * s,
          cap: "round",
          trim: { start: 0, end: 0 },
        },
      }
    );
    for (let t = c * 8; t + 30 <= frames; t += 36)
      k.key(`${id}${c}`, "trimEnd", [
        [t, 0, "hold"],
        [t + 18, 1, "linear"],
        [t + 30, 1, "hold"],
      ]);
    k.key(`${id}${c}`, "trimEnd", [[frames, 0, "hold"]]);
  });
}
const floor = (k, width = W) =>
  k.line(
    "floor",
    [
      { x: 10, y: G },
      { x: width - 10, y: G },
    ],
    { stroke: { color: BLUE, thickness: 1.2 }, opacity: 0.3 }
  );

const boards = [
  // Our dev, waving hello.
  board("Hello", 72, (k) => {
    floor(k);
    k.figure("dev", 70, { glasses: true });
    // A real wave: elbow out at shoulder height, the hand swinging above it.
    const WAVE = (x) => ({ ...STAND, ...k.reach("dev", "R", x, -60), lean: -2 });
    for (let t = 0; t <= 72; t += 18) k.pose("dev", t, WAVE((t / 18) % 2 ? 20 : 11), "ease-in-out");
    k.key("dev_body", "rotation", [
      [0, -1, "ease-in-out"],
      [36, 1, "ease-in-out"],
      [72, -1, "ease-in-out"],
    ]);
  }),
  // AI agents: three cute agents orbit a computer while it writes code.
  board("Agent", 180, (k) => {
    floor(k);
    k.shapes.push({
      id: "mon",
      type: "rect",
      x: 70,
      y: 56,
      width: 46,
      height: 31,
      cornerRadius: 2.5,
      stroke: ink(2),
      fill: { color: BLUE },
    });
    k.line(
      "monStand",
      [
        { x: 70, y: 72 },
        { x: 70, y: 82 },
      ],
      { stroke: ink(2) }
    );
    k.line(
      "monBase",
      [
        { x: 61, y: 82 },
        { x: 79, y: 82 },
      ],
      { stroke: ink(2.2) }
    );
    codeLines(k, "scr", 52, 46, 180);
    KINDS.forEach((kind, i) => {
      const id = `ag${i}`;
      addAgent(k, id, kind, 70, 56, {}, 1.5);
      const steps = 12;
      for (const [prop, f] of [
        ["x", (a) => 70 + Math.cos(a) * 54],
        ["y", (a) => 56 + Math.sin(a) * 24],
        ["scaleX", (a) => 0.82 + 0.18 * Math.sin(a)],
        ["scaleY", (a) => 0.82 + 0.18 * Math.sin(a)],
      ])
        k.key(
          id,
          prop,
          [...Array(steps + 1).keys()].map((s) => [
            s * 15,
            f((2 * Math.PI * s) / steps + (i * 2 * Math.PI) / 3),
            "linear",
          ])
        );
      k.key(`${id}_body`, "rotation", [
        [0, 0, "linear"],
        [180, kind === "spark" ? 360 : kind === "knot" ? -180 : 90, "linear"],
      ]);
      blink(k, id, 40 + i * 45);
    });
  }),
  // Workflow automation: the agents pass a document down the line, each adding its part.
  board("Flow", 120, (k) => {
    floor(k);
    const X = [26, 70, 114];
    k.line(
      "link",
      [
        { x: X[0], y: 66 },
        { x: X[2], y: 66 },
      ],
      { stroke: { color: BLUE, thickness: 1, dash: [2, 3] }, opacity: 0.35 }
    );
    KINDS.forEach((kind, i) => addAgent(k, `ag${i}`, kind, X[i], 66, {}, 1.6));
    k.group("doc", X[0], 46);
    k.shapes.push({
      id: "docP",
      type: "rect",
      x: 0,
      y: 0,
      width: 12,
      height: 15,
      cornerRadius: 1,
      parent: "doc",
      stroke: ink(1.3),
      fill: { color: "#FFFFFF" },
    });
    for (let l = 0; l < 2; l++)
      k.line(
        `docL${l}`,
        [
          { x: -3.5, y: -3 + l * 3.5 },
          { x: 3.5, y: -3 + l * 3.5 },
        ],
        { parent: "doc", stroke: { ...ink(1.1), trim: { start: 0, end: 0 } } }
      );
    k.group("docTick", 0, 3.5, { parent: "doc", scaleX: 0, scaleY: 0 });
    k.line(
      "docTickL",
      [
        { x: -3, y: 0 },
        { x: -1, y: 2 },
        { x: 3.5, y: -2.5 },
      ],
      { parent: "docTick", stroke: { color: AMBER, thickness: 1.8, cap: "round", join: "round" } }
    );
    // Each agent: the doc lands, the agent hops and does its bit, the doc flies on.
    const at = [0, 36, 72];
    at.forEach((t, i) => {
      k.key(`ag${i}`, "y", [
        [t, 66, "hold"],
        [t + 6, 60, "ease-out"],
        [t + 12, 66, "ease-in"],
      ]);
      blink(k, `ag${i}`, t + 14);
    });
    k.key("doc", "x", [
      [0, X[0], "hold"],
      [18, X[0], "hold"],
      [36, X[1], "ease-in-out"],
      [54, X[1], "hold"],
      [72, X[2], "ease-in-out"],
      [92, X[2], "hold"],
      [104, 132, "ease-in"],
      [105, X[0], "hold"],
    ]);
    k.key("doc", "y", [
      [0, 46, "hold"],
      [18, 46, "hold"],
      [27, 30, "ease-out"],
      [36, 46, "ease-in"],
      [54, 46, "hold"],
      [63, 30, "ease-out"],
      [72, 46, "ease-in"],
      [92, 46, "hold"],
      [104, 40, "ease-out"],
    ]);
    k.key("doc", "opacity", [
      [0, 1, "hold"],
      [100, 1, "hold"],
      [106, 0, "ease-in"],
      [114, 0, "hold"],
      [120, 1, "ease-out"],
    ]);
    k.key("docL0", "trimEnd", [
      [0, 0, "hold"],
      [4, 0, "hold"],
      [14, 1, "ease-out"],
      [110, 1, "hold"],
      [111, 0, "hold"],
    ]);
    k.key("docL1", "trimEnd", [
      [0, 0, "hold"],
      [40, 0, "hold"],
      [50, 1, "ease-out"],
      [110, 1, "hold"],
      [111, 0, "hold"],
    ]);
    for (const p of ["scaleX", "scaleY"])
      k.key("docTick", p, [
        [0, 0, "hold"],
        [76, 0, "hold"],
        [82, 1.4, "ease-out"],
        [86, 1, "ease-in-out"],
        [110, 1, "hold"],
        [111, 0, "hold"],
      ]);
  }),
  // AI in your software: a stickman codes, and agents pop out of his laptop to get to work.
  board("Button", 180, (k) => {
    floor(k);
    k.line(
      "tableTop",
      [
        { x: 66, y: G - 34 },
        { x: 118, y: G - 34 },
      ],
      { stroke: ink(2.2) }
    );
    k.line(
      "tableLeg",
      [
        { x: 112, y: G - 34 },
        { x: 112, y: G },
      ],
      { stroke: ink(1.8) }
    );
    k.shapes.push({
      id: "lapScr",
      type: "rect",
      x: 92,
      y: G - 44,
      width: 20,
      height: 14,
      cornerRadius: 1.5,
      stroke: ink(1.6),
      fill: { color: BLUE },
    });
    k.line(
      "lapBase",
      [
        { x: 78, y: G - 35 },
        { x: 102, y: G - 35 },
      ],
      { stroke: ink(2.4) }
    );
    codeLines(k, "scr", 85, G - 48, 180, 0.7);
    k.figure("p", 50);
    const TA = { ...STAND, ...k.reach("p", "L", 26, -36), ...k.reach("p", "R", 30, -35), lean: 8 };
    const TB = { ...STAND, ...k.reach("p", "L", 28, -35), ...k.reach("p", "R", 28, -36), lean: 8 };
    for (let t = 0; t < 180; t += 10) {
      k.pose("p", t, TA);
      k.pose("p", t + 5, TB);
    }
    k.pose("p", 180, TA);
    const spots = [
      [44, 24],
      [92, 18],
      [126, 34],
    ];
    KINDS.forEach((kind, i) => {
      const id = `ag${i}`;
      const [hx, hy] = spots[i];
      const t = 20 + i * 24;
      addAgent(k, id, kind, 92, G - 44, { scaleX: 0, scaleY: 0 }, 1.5);
      pop(k, id, t);
      k.key(id, "x", [
        [0, 92, "hold"],
        [t, 92, "hold"],
        [t + 14, hx, "ease-out"],
        [140 + i * 6, hx, "hold"],
        [154 + i * 6, 92, "ease-in"],
      ]);
      k.key(id, "y", [
        [0, G - 44, "hold"],
        [t, G - 44, "hold"],
        [t + 14, hy, "ease-out"],
      ]);
      for (let b = t + 20; b < 136; b += 24)
        k.key(id, "y", [
          [b, hy, "ease-in-out"],
          [b + 12, hy - 4, "ease-in-out"],
        ]);
      k.key(id, "y", [
        [140 + i * 6, hy, "ease-in-out"],
        [154 + i * 6, G - 44, "ease-in"],
      ]);
      pop(k, id, 150 + i * 6, true);
      k.key(`${id}_body`, "rotation", [
        [0, 0, "hold"],
        [t + 14, 0, "hold"],
        [140, kind === "knot" ? -120 : 180, "linear"],
      ]);
      blink(k, id, t + 40);
    });
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
  // How to start: a two week audit. Our dev ticks off each working day on the calendar.
  board(
    "Calendar",
    240,
    (k) => {
      floor(k, CW);
      const left = 40,
        cw = 20,
        rowY = [44.5, 61.5];
      k.shapes.push({
        id: "cal",
        type: "rect",
        x: 110,
        y: 48,
        width: 148,
        height: 44,
        cornerRadius: 3,
        stroke: ink(2),
        fill: { color: "#FFFFFF" },
      });
      k.shapes.push({
        id: "calHead",
        type: "rect",
        x: 110,
        y: 31,
        width: 148,
        height: 10,
        cornerRadius: 2,
        fill: { color: BLUE },
      });
      for (const rx of [70, 150])
        k.line(
          `ring${rx}`,
          [
            { x: rx, y: 22 },
            { x: rx, y: 30 },
          ],
          { stroke: ink(2.4) }
        );
      for (let c = 1; c < 7; c++)
        k.line(
          `col${c}`,
          [
            { x: left + c * cw, y: 36 },
            { x: left + c * cw, y: 70 },
          ],
          { stroke: ink(0.8), opacity: 0.3 }
        );
      k.line(
        "rowLine",
        [
          { x: 36, y: 53 },
          { x: 184, y: 53 },
        ],
        { stroke: ink(0.8), opacity: 0.3 }
      );
      // weekends stay pale; the ten working days get ticked off one by one
      const days = [];
      rowY.forEach((y, r) =>
        [...Array(7).keys()].forEach((c) => {
          const cx = left + c * cw + cw / 2;
          if (c > 4)
            k.shapes.push({
              id: `wk${r}${c}`,
              type: "rect",
              x: cx,
              y,
              width: cw - 3,
              height: 14,
              fill: { color: "#E2E8F0" },
            });
          else days.push([`d${r}${c}`, cx, y]);
        })
      );
      k.figure("a", 30, { glasses: true });
      k.line(
        "marker",
        [
          { x: 0, y: 10 },
          { x: 0, y: 16 },
        ],
        { parent: "a_faR", stroke: { color: AMBER, thickness: 2.4, cap: "round" } }
      );
      let x = 30;
      days.forEach(([id, cx, cy], i) => {
        const t = 14 + i * 15;
        k.shapes.push({
          id: `${id}f`,
          type: "rect",
          x: cx,
          y: cy,
          width: cw - 3,
          height: 14,
          cornerRadius: 1,
          fill: { color: AMBER },
          opacity: 0,
        });
        k.group(`${id}t`, cx, cy, { scaleX: 0, scaleY: 0 });
        k.line(
          `${id}tl`,
          [
            { x: -3.5, y: 0 },
            { x: -1, y: 2.5 },
            { x: 4, y: -3 },
          ],
          {
            parent: `${id}t`,
            stroke: { color: "#FFFFFF", thickness: 1.8, cap: "round", join: "round" },
          }
        );
        const nx = cx - 8;
        if (nx !== x) k.walk("a", t - 12, t - 3, x, nx);
        x = nx;
        const reach = { ...STAND, ...k.reach("a", "R", 8, cy - G - 1), lean: -2 };
        k.pose("a", t - 2, reach, "ease-out");
        k.pose("a", t + 6, STAND, "ease-in-out");
        k.key(`${id}f`, "opacity", [
          [0, 0, "hold"],
          [t, 0, "hold"],
          [t + 4, 1, "ease-out"],
          [220, 1, "hold"],
          [232, 0, "ease-in"],
        ]);
        for (const p of ["scaleX", "scaleY"])
          k.key(`${id}t`, p, [
            [0, 0, "hold"],
            [t + 2, 0, "hold"],
            [t + 7, 1.3, "ease-out"],
            [t + 10, 1, "ease-in-out"],
            [220, 1, "hold"],
            [228, 0, "ease-in"],
          ]);
      });
      // two weeks done: a little cheer, then walk back to day one
      k.pose("a", 176, { ...STAND, uaL: 150, faL: 15, uaR: -150, faR: -15 }, "ease-out-back");
      k.pose("a", 204, { ...STAND, uaL: 150, faL: 15, uaR: -150, faR: -15 });
      k.pose("a", 212, STAND);
      k.walk("a", 214, 236, x, 30);
      // he stands in front of the calendar, so draw him over the ticked days
      for (const sh of k.shapes) if (sh.id.startsWith("a_") || sh.id === "marker") sh.z = 50;
    },
    CW
  ),
];

const { bytes, warnings } = createRiv({ artboards: boards });
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/services.riv", bytes);
console.log(`public/rive/services.riv ${(bytes.length / 1024).toFixed(1)} KB`);
