// Builds public/rive/about.riv: small looping stickmen for the About page.
// Artboards: Rescue (origin story), Key (handover), Learn (watch, note, idea) and
// Queue (one fix at a time), each with one animation `loop`,
// plus the five team elevator cabs from cabs.mjs (state machine "SM").
// Run: npm run rive:about.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE } from "./kit.mjs";
import { cabs } from "./cabs.mjs";
import { addAgent, blink, pop } from "./agents.mjs";

const PAPER = "#EEF1F5";
const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };
const thin = (t = 1.4) => ({ color: BLUE, thickness: t, cap: "round", join: "round" });

function board(name, w, h, g, frames, build) {
  const k = makeKit(g, { line: BLUE, paper: PAPER });
  const extra = build(k) ?? {};
  const kits = [k, ...(extra.kits ?? [])];
  return {
    name,
    width: w,
    height: h,
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
const floor = (k, w, g) =>
  k.line(
    "floor",
    [
      { x: 8, y: g },
      { x: w - 8, y: g },
    ],
    { stroke: thin(1.2), opacity: 0.3 }
  );
const rect = (id, x, y, width, height, extra = {}) => ({
  id,
  type: "rect",
  x,
  y,
  width,
  height,
  cornerRadius: 1.5,
  stroke: thin(),
  fill: { color: AMBER },
  ...extra,
});

const boards = [
  // "We kept seeing the same thing": a worker sinks under a messy pile. Our dev brings a
  // cute agent, it swirls round the pile, every sheet falls into a neat stack, he's free.
  board("Rescue", 220, 120, 108, 300, (k) => {
    floor(k, 220, 108);
    k.figure("w", 112);
    k.pose("w", 0, STAND);
    k.pose("w", 60, "reachUp");
    k.key("w", "y", [
      [0, 108, "hold"],
      [20, 108, "hold"],
      [110, 140, "ease-in"],
      [204, 140, "hold"],
      [222, 108, "ease-out-back"],
    ]);
    k.group("pile", 112, 108);
    for (let i = 0; i < 7; i++) {
      const id = `sheet${i}`;
      k.shapes.push(
        rect(id, ((i * 7) % 11) - 5, -6 - i * 9, 30, 8, {
          parent: "pile",
          fill: { color: "#FFFFFF" },
          rotation: i % 2 ? 7 : -6,
        })
      );
      const drop = 10 + i * 14;
      const tidy = 132 + i * 9; // the agent passes, this sheet straightens up
      k.key(id, "opacity", [
        [0, 0, "hold"],
        [drop, 0, "hold"],
        [drop + 6, 1, "ease-out"],
        [282, 1, "hold"],
        [294, 0, "ease-in"],
      ]);
      k.key(id, "y", [
        [0, -60 - i * 9, "hold"],
        [drop, -60 - i * 9, "hold"],
        [drop + 12, -6 - i * 9, "ease-in"],
        [tidy, -6 - i * 9, "hold"],
        [tidy + 10, -4 - i * 4.5, "ease-in-out"],
      ]);
      k.key(id, "x", [
        [0, ((i * 7) % 11) - 5, "hold"],
        [tidy, ((i * 7) % 11) - 5, "hold"],
        [tidy + 10, 0, "ease-in-out"],
      ]);
      k.key(id, "rotation", [
        [0, i % 2 ? 7 : -6, "hold"],
        [tidy, i % 2 ? 7 : -6, "hold"],
        [tidy + 10, 0, "ease-in-out"],
      ]);
    }
    // the tidy stack slides aside and the worker pops back up
    k.key("pile", "x", [
      [0, 112, "hold"],
      [196, 112, "hold"],
      [212, 162, "ease-in-out"],
      [299, 162, "hold"],
    ]);
    k.figure("dev", 250, { glasses: true });
    k.pose("dev", 0, STAND);
    k.pose("dev", 70, STAND);
    k.walk("dev", 70, 108, 250, 186);
    k.pose("dev", 116, { ...STAND, uaR: -140, faR: -20 }, "ease-out"); // go on, little one
    k.pose("dev", 140, STAND, "ease-in-out");
    const CHEER = "cheer";
    k.pose("w", 214, STAND);
    k.pose("dev", 214, STAND); // hold still until the cheer, or the arms drift up early
    k.pose("w", 232, CHEER, "ease-out-back");
    k.pose("dev", 232, CHEER, "ease-out-back");
    k.pose("w", 270, CHEER);
    k.pose("dev", 270, CHEER);
    k.pose("w", 290, STAND, "ease-in-out");
    k.walk("dev", 282, 299, 186, 250); // off he goes; the loop walks him back in
    // the agent: out of his hand, twice round the pile, then a happy spin above it
    addAgent(k, "ag", "spark", 196, 50, { scaleX: 0, scaleY: 0 }, 1.6);
    pop(k, "ag", 114);
    const orbit = [...Array(17).keys()].map((n) => {
      const a = -Math.PI / 2 + (n / 8) * 2 * Math.PI;
      return [
        128 + n * 5,
        112 + Math.cos(a) * 36,
        82 + Math.sin(a) * 18,
        0.85 + 0.15 * Math.sin(a),
      ];
    });
    k.key("ag", "x", [
      [0, 196, "hold"],
      [124, 196, "hold"],
      ...orbit.map(([f, x]) => [f, x, "linear"]),
      [226, 162, "ease-out"],
      [282, 162, "hold"],
    ]);
    k.key("ag", "y", [
      [0, 50, "hold"],
      [124, 50, "hold"],
      ...orbit.map(([f, , y]) => [f, y, "linear"]),
      [226, 52, "ease-out"],
      [240, 47, "ease-in-out"],
      [254, 52, "ease-in-out"],
      [268, 47, "ease-in-out"],
      [282, 52, "ease-in-out"],
    ]);
    k.key("ag_body", "rotation", [
      [0, 0, "hold"],
      [124, 0, "hold"],
      [208, 540, "linear"],
      [240, 540, "hold"],
      [262, 900, "ease-in-out"],
      [263, 0, "hold"],
    ]);
    blink(k, "ag", 244);
    pop(k, "ag", 284, true);
  }),

  // "It stays yours": one stickman hands the other a key; he holds it up and jingles it.
  board("Key", 140, 110, 100, 150, (k) => {
    floor(k, 140, 100);
    k.figure("give", 46, { glasses: true });
    k.figure("take", 94);
    // the key lives in one hand at a time: the giver's, then the taker's
    const keyIn = (id, hand) => {
      k.group(id, 0, 14, { parent: hand });
      k.shapes.push({
        id: `${id}Ring`,
        type: "ellipse",
        x: 0,
        y: 0,
        width: 7,
        height: 7,
        parent: id,
        stroke: { color: AMBER, thickness: 2 },
      });
      k.line(
        `${id}Stem`,
        [
          { x: 0, y: 3.5 },
          { x: 0, y: 12 },
          { x: 3, y: 12 },
          { x: 0, y: 9 },
        ],
        { parent: id, stroke: { color: AMBER, thickness: 2, cap: "round", join: "round" } }
      );
    };
    keyIn("keyA", "give_faR");
    keyIn("keyB", "take_faL");
    const LOW = { ...STAND, ...k.reach("give", "R", 8, -30) };
    const OFFER = { ...STAND, ...k.reach("give", "R", 21, -40), lean: 4 };
    const GRAB = { ...STAND, ...k.reach("take", "L", -21, -40), lean: -4 };
    const UP = { ...STAND, ...k.reach("take", "L", -4, -66) };
    const THUMB = { ...STAND, uaR: -150, faR: -40 };
    k.pose("give", 0, LOW);
    k.pose("take", 0, STAND);
    k.pose("give", 16, LOW);
    k.pose("give", 34, OFFER, "ease-in-out");
    k.pose("take", 22, STAND);
    k.pose("take", 38, GRAB, "ease-in-out");
    for (const p of ["scaleX", "scaleY"]) {
      k.key("keyA", p, [
        [0, 1, "hold"],
        [42, 1, "hold"],
        [43, 0, "hold"],
        [146, 0, "hold"],
        [147, 1, "hold"],
      ]);
      k.key("keyB", p, [
        [0, 0, "hold"],
        [42, 0, "hold"],
        [43, 1, "hold"],
        [146, 1, "hold"],
        [147, 0, "hold"],
      ]);
    }
    k.pose("give", 56, STAND, "ease-in-out");
    k.pose("give", 70, THUMB, "ease-out-back");
    k.pose("give", 120, THUMB);
    k.pose("give", 140, LOW, "ease-in-out");
    k.pose("take", 50, GRAB);
    k.pose("take", 66, UP, "ease-out-back");
    k.key("keyB", "rotation", [
      [0, 0, "hold"],
      [70, 0, "hold"],
      [78, 25, "ease-in-out"],
      [86, -20, "ease-in-out"],
      [94, 22, "ease-in-out"],
      [102, -15, "ease-in-out"],
      [110, 0, "ease-out"],
    ]);
    k.pose("take", 114, UP);
    k.pose("take", 136, STAND, "ease-in-out");
    k.pose("give", 150, LOW);
    k.pose("take", 150, STAND);
  }),

  // "We learn before we build": our dev stands behind someone at work, watches, writes it
  // down on a proper clipboard, and gets the idea.
  board("Learn", 140, 110, 100, 180, (k) => {
    floor(k, 140, 100);
    const SITP = {
      uaL: -60,
      faL: -30,
      uaR: -70,
      faR: -20,
      thL: -90,
      shL: 90,
      thR: -80,
      shR: 80,
      lean: 4,
    };
    k.line(
      "deskTop",
      [
        { x: 96, y: 66 },
        { x: 134, y: 66 },
      ],
      { stroke: thin(2.4) }
    );
    k.line(
      "deskLeg",
      [
        { x: 128, y: 66 },
        { x: 128, y: 100 },
      ],
      { stroke: thin(1.8) }
    );
    k.line(
      "chair",
      [
        { x: 74, y: 66 },
        { x: 74, y: 85 },
        { x: 90, y: 85 },
        { x: 90, y: 100 },
      ],
      { stroke: thin(1.8) }
    );
    k.shapes.push(rect("screen", 118, 57, 16, 12, { fill: { color: BLUE } }));
    k.line(
      "lapBase",
      [
        { x: 106, y: 65 },
        { x: 128, y: 65 },
      ],
      { stroke: { color: BLUE, thickness: 2.6, cap: "round" } }
    );
    k.figure("w", 82);
    k.key("w_body", "y", [[0, 12, "hold"]]);
    for (let t = 0; t < 180; t += 12) {
      k.pose("w", t, { ...SITP, faL: -5, faR: -45 });
      k.pose("w", t + 6, { ...SITP, faL: -35, faR: -15 });
    }
    k.pose("w", 180, { ...SITP, faL: -5, faR: -45 });

    k.figure("dev", 42, { glasses: true });
    // The clipboard rides his body (so it leans with him), held up in front of his chest.
    k.group("clip", 13, -37, { parent: "dev_body", rotation: -10 });
    k.shapes.push(rect("clipBoard", 0, 0, 12, 15, { parent: "clip", fill: { color: "#FFFFFF" } }));
    k.shapes.push(
      rect("clipTop", 0, -7.5, 6, 2.5, { parent: "clip", fill: { color: AMBER }, cornerRadius: 1 })
    );
    for (let i = 0; i < 3; i++)
      k.line(
        `note${i}`,
        [
          { x: -4, y: -3 + i * 3.5 },
          { x: 4, y: -3 + i * 3.5 },
        ],
        { parent: "clip", stroke: { ...thin(1.1), trim: { start: 0, end: 0 } } }
      );
    k.line(
      "pen",
      [
        { x: 0, y: 9 },
        { x: 0, y: 15 },
      ],
      { parent: "dev_faR", stroke: { color: AMBER, thickness: 1.8, cap: "round" } }
    );
    // left hand holds the board's lower left corner; right hand writes across it
    const HOLD = k.reach("dev", "L", 8, -31);
    const AT = (x, y, lean) => ({ ...STAND, ...HOLD, ...k.reach("dev", "R", x, y), lean });
    const READY = AT(9, -40, 10);
    k.pose("dev", 0, READY);
    k.pose("dev", 20, READY);
    k.key("dev_body", "rotation", [
      [30, 6, "ease-in-out"],
      [40, 12, "ease-in-out"],
      [50, 6, "ease-in-out"],
      [60, 10, "ease-in-out"],
    ]); // nod nod
    for (let t = 64; t < 112; t += 8) {
      k.pose("dev", t, AT(11, -41, 10));
      k.pose("dev", t + 4, AT(17, -38, 10));
    }
    for (let i = 0; i < 3; i++)
      k.key(`note${i}`, "trimEnd", [
        [0, 0, "hold"],
        [64 + i * 16, 0, "hold"],
        [78 + i * 16, 1, "linear"],
        [168, 1, "hold"],
        [176, 0, "ease-in"],
      ]);
    // the idea
    k.group("bulb", 42, 24, { scaleX: 0, scaleY: 0 });
    k.shapes.push({
      id: "bulbG",
      type: "ellipse",
      x: 0,
      y: 0,
      width: 11,
      height: 11,
      parent: "bulb",
      stroke: thin(1.4),
      fill: { color: AMBER },
    });
    k.shapes.push(rect("bulbBase", 0, 7.5, 5, 3, { parent: "bulb", fill: { color: BLUE } }));
    for (let r = 0; r < 5; r++) {
      const a = Math.PI + (r * Math.PI) / 4;
      k.line(
        `ray${r}`,
        [
          { x: Math.cos(a) * 9, y: Math.sin(a) * 9 },
          { x: Math.cos(a) * 13, y: Math.sin(a) * 13 },
        ],
        { parent: "bulb", stroke: { color: AMBER, thickness: 1.6, cap: "round" } }
      );
    }
    for (const p of ["scaleX", "scaleY"])
      k.key("bulb", p, [
        [0, 0, "hold"],
        [116, 0, "hold"],
        [124, 1.3, "ease-out"],
        [130, 1, "ease-in-out"],
        [166, 1, "hold"],
        [174, 0, "ease-in"],
      ]);
    k.pose("dev", 116, { ...READY, lean: -2 }, "ease-out"); // aha
    k.pose("dev", 132, { ...STAND, ...HOLD, uaR: -150, faR: -40, lean: 0 }, "ease-out-back"); // thumbs up, board still held
    k.pose("dev", 160, { ...STAND, ...HOLD, uaR: -150, faR: -40, lean: 0 });
    k.pose("dev", 176, READY, "ease-in-out");
    k.pose("dev", 180, READY);
  }),

  // "One fix at a time": a queue at our dev's counter. He fixes the one in front, they
  // walk off happy, everyone shuffles up, someone new joins the back. Forever.
  (() => {
    const P = 90,
      N = 3,
      FRONT = 56;
    const SLOTS = [-20, 22, FRONT]; // arriving, waiting, front
    return board("Queue", 140, 110, 100, P * N, (k) => {
      floor(k, 140, 100);
      for (let j = 0; j < N; j++) {
        const id = `c${j}`;
        k.figure(id, SLOTS[0]);
        k.group(`${id}Item`, 0, 14, { parent: `${id}_faR` });
        k.shapes.push({
          id: `${id}Box`,
          type: "rect",
          x: 0,
          y: 0,
          width: 8,
          height: 8,
          cornerRadius: 1.5,
          parent: `${id}Item`,
          stroke: thin(1.2),
          fill: { color: "#CBD5E1" },
        });
        k.line(
          `${id}Crack`,
          [
            { x: -3, y: -3 },
            { x: 0, y: 0 },
            { x: -1, y: 1.5 },
            { x: 3, y: 3 },
          ],
          { parent: `${id}Item`, stroke: thin(1) }
        );
        k.group(`${id}Tick`, 0, 0, { parent: `${id}Item`, scaleX: 0, scaleY: 0 });
        k.line(
          `${id}TickL`,
          [
            { x: -2.5, y: 0 },
            { x: -0.5, y: 2 },
            { x: 3, y: -2.5 },
          ],
          {
            parent: `${id}Tick`,
            stroke: { color: "#FFFFFF", thickness: 1.6, cap: "round", join: "round" },
          }
        );
      }
      k.figure("dev", 98, { glasses: true });
      k.shapes.push({
        id: "counter",
        z: 10,
        type: "rect",
        x: 90,
        y: 86,
        width: 24,
        height: 28,
        cornerRadius: 1.5,
        stroke: thin(2),
        fill: { color: PAPER },
      });
      k.line(
        "wrench",
        [
          { x: 0, y: 9 },
          { x: 0, y: 17 },
          { x: -2, y: 19 },
        ],
        { parent: "dev_faR", stroke: { color: AMBER, thickness: 2, cap: "round", join: "round" } }
      );
      k.key("dev", "scaleX", [[0, -1, "hold"]]); // faces the queue; reach x is "towards them"
      const CARRY = (id) => ({ ...STAND, ...k.reach(id, "R", 8, -32) });
      const OFFER = (id) => ({ ...STAND, ...k.reach(id, "R", 12, -38) });
      const TAP_A = { ...STAND, ...k.reach("dev", "R", 22, -38), lean: 6 };
      const TAP_B = { ...STAND, ...k.reach("dev", "R", 20, -43), lean: 6 };
      for (let c = 0; c < N; c++) {
        const s = c * P;
        // the dev: three taps on whatever is in front of him, then back to waiting
        k.pose("dev", s, STAND);
        k.pose("dev", s + 6, TAP_A, "ease-out");
        for (const t of [10, 16, 22]) k.pose("dev", s + t, t % 12 ? TAP_B : TAP_A);
        k.pose("dev", s + 28, TAP_A);
        k.pose("dev", s + 40, STAND, "ease-in-out");
        for (let j = 0; j < N; j++) {
          const id = `c${j}`;
          const ph = (c + j) % N;
          if (ph < N - 1) {
            // waiting in line, then shuffle up one place
            k.key(id, "x", [[s, SLOTS[ph], "hold"]]);
            k.pose(id, s, CARRY(id));
            k.walk(id, s + 40, s + 70, SLOTS[ph], SLOTS[ph + 1]);
            k.pose(id, s + 74, CARRY(id), "ease-out");
            k.key(id, "x", [[s + P - 1, SLOTS[ph + 1], "hold"]]);
            if (ph === 0) {
              // a new face: the item is broken again
              k.key(`${id}Crack`, "opacity", [[s, 1, "hold"]]);
              k.key(`${id}Box`, "fillColor", [[s, "#CBD5E1", "hold"]]);
              for (const p of ["scaleX", "scaleY"]) k.key(`${id}Tick`, p, [[s, 0, "hold"]]);
            }
          } else {
            // at the front: hold it out, it gets fixed, a happy hop, off to the right
            k.key(id, "x", [[s, FRONT, "hold"]]);
            k.pose(id, s + 4, OFFER(id), "ease-out");
            k.key(`${id}Crack`, "opacity", [
              [s + 25, 1, "hold"],
              [s + 26, 0, "hold"],
            ]);
            k.key(`${id}Box`, "fillColor", [
              [s + 25, "#CBD5E1", "hold"],
              [s + 28, AMBER, "ease-out"],
            ]);
            for (const p of ["scaleX", "scaleY"])
              k.key(`${id}Tick`, p, [
                [s + 25, 0, "hold"],
                [s + 30, 1.3, "ease-out"],
                [s + 34, 1, "ease-in-out"],
              ]);
            k.pose(id, s + 32, "cheer", "ease-out-back");
            k.key(`${id}_body`, "y", [
              [s + 30, 0, "hold"],
              [s + 34, -4, "ease-out"],
              [s + 38, 0, "ease-in"],
            ]);
            k.walk(id, s + 42, s + 76, FRONT, 156);
            k.key(id, "x", [[s + P - 1, 156, "hold"]]);
          }
        }
      }
      // keep the people in front of the counter they walk past
      for (const sh of k.shapes) if (/^c\d/.test(sh.id)) sh.z = 20;
    });
  })(),

  ...cabs,
];

const { bytes, warnings } = createRiv({ artboards: boards });
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/about.riv", bytes);
console.log(`public/rive/about.riv ${(bytes.length / 1024).toFixed(1)} KB`);
