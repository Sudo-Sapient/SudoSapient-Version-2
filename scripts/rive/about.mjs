// Builds public/rive/about.riv: small looping stickmen for the About page.
// Artboards: Rescue (origin story), Key (handover) and Learn (watch, note, idea), each with one animation `loop`,
// plus the five team elevator cabs from cabs.mjs (state machine "SM").
// Run: npm run rive:about.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE } from "./kit.mjs";
import { cabs } from "./cabs.mjs";

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
  // A worker sinks under a growing pile; our dev pulls him out.
  board("Rescue", 220, 120, 108, 240, (k) => {
    floor(k, 220, 108);
    k.figure("w", 120);
    k.pose("w", 0, "stand");
    k.pose("w", 60, "reachUp");
    k.key("w", "y", [
      [0, 108, "hold"],
      [20, 108, "hold"],
      [110, 140, "ease-in"],
      [150, 140, "hold"],
      [176, 108, "ease-out-back"],
    ]);
    k.group("pile", 120, 108);
    for (let i = 0; i < 7; i++) {
      const id = `sheet${i}`;
      k.shapes.push(
        rect(id, ((i * 7) % 11) - 5, -6 - i * 9, 30, 8, {
          parent: "pile",
          fill: { color: "#FFFFFF" },
          rotation: i % 2 ? 6 : -5,
        })
      );
      k.key(id, "opacity", [
        [0, 0, "hold"],
        [10 + i * 14, 0, "hold"],
        [16 + i * 14, 1, "ease-out"],
        [190, 1, "hold"],
        [210, 0, "ease-in"],
      ]);
      k.key(id, "y", [
        [0, -60 - i * 9, "hold"],
        [10 + i * 14, -60 - i * 9, "hold"],
        [22 + i * 14, -6 - i * 9, "ease-in"],
      ]);
    }
    k.figure("dev", 250, { glasses: true });
    k.pose("dev", 0, STAND); // stands still until his walk starts
    k.pose("dev", 90, STAND);
    k.walk("dev", 90, 140, 250, 150);
    k.pose("dev", 144, { ...STAND, ...k.reach("dev", "L", -28, -56), lean: -8 });
    k.pose("dev", 176, { ...STAND, ...k.reach("dev", "L", -22, -40), lean: 4 }, "ease-out");
    k.pose("dev", 200, "cheer");
    k.pose("w", 200, "cheer");
    k.pose("dev", 230, STAND);
    k.pose("w", 230, STAND);
    k.key("dev", "x", [
      [220, 150, "hold"],
      [221, 250, "hold"],
    ]);
    k.key("dev", "opacity", [
      [0, 1, "hold"],
      [214, 1, "hold"],
      [220, 0, "ease-in"],
      [236, 0, "hold"],
      [240, 1, "hold"],
    ]);
  }),

  // One stickman hands the other a key; it gets a happy little spin.
  board("Key", 140, 110, 100, 120, (k) => {
    floor(k, 140, 100);
    k.figure("give", 46, { glasses: true });
    k.figure("take", 96);
    k.group("key", 62, 60);
    k.shapes.push({
      id: "keyRing",
      type: "ellipse",
      x: 0,
      y: 0,
      width: 8,
      height: 8,
      parent: "key",
      stroke: { color: AMBER, thickness: 2 },
    });
    k.line(
      "keyStem",
      [
        { x: 4, y: 0 },
        { x: 14, y: 0 },
        { x: 14, y: 3 },
        { x: 11, y: 0 },
      ],
      { parent: "key", stroke: { color: AMBER, thickness: 2, cap: "round" } }
    );
    const out = { ...STAND, ...k.reach("give", "R", 16, -40) };
    k.pose("give", 0, out);
    k.pose("take", 0, STAND);
    k.pose("take", 30, { ...STAND, ...k.reach("take", "L", -26, -40) });
    k.pose("give", 44, out);
    k.pose("give", 60, STAND);
    k.pose("take", 70, { ...STAND, uaL: 150, faL: 10 });
    k.pose("take", 108, STAND);
    k.pose("give", 120, out);
    k.pose("take", 120, STAND);
    k.key("key", "x", [
      [0, 62, "hold"],
      [34, 62, "hold"],
      [46, 72, "ease-in-out"],
      [60, 72, "hold"],
      [74, 82, "ease-out"],
      [108, 82, "hold"],
      [119, 62, "hold"],
    ]);
    k.key("key", "y", [
      [0, 60, "hold"],
      [60, 60, "hold"],
      [74, 28, "ease-out"],
      [100, 28, "hold"],
      [108, 60, "ease-in"],
    ]);
    k.key("key", "rotation", [
      [0, 0, "hold"],
      [74, 0, "hold"],
      [96, 360, "ease-in-out"],
      [97, 0, "hold"],
    ]);
  }),

  // "We learn before we build": our dev watches a worker, takes notes, gets the idea.
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
    k.figure("dev", 40, { glasses: true });
    k.shapes.push(rect("clip", 0, 16, 12, 15, { parent: "dev_faL", fill: { color: "#FFFFFF" } }));
    for (let i = 0; i < 3; i++)
      k.line(
        `note${i}`,
        [
          { x: -4, y: 12 + i * 4 },
          { x: 4, y: 12 + i * 4 },
        ],
        { parent: "dev_faL", stroke: { ...thin(1.2), trim: { start: 0, end: 0 } } }
      );
    const HOLD = k.reach("dev", "L", 10, -34);
    const W1 = { ...STAND, ...HOLD, ...k.reach("dev", "R", 12, -36), lean: 8 };
    const W2 = { ...STAND, ...HOLD, ...k.reach("dev", "R", 14, -33), lean: 8 };
    k.pose("dev", 0, { ...STAND, ...HOLD, lean: 14 }); // leaning in to watch
    k.key("dev_body", "rotation", [
      [20, 14, "hold"],
      [30, 10, "ease-in-out"],
      [40, 14, "ease-in-out"],
      [50, 10, "ease-in-out"],
    ]); // nod nod
    for (let t = 56; t < 110; t += 8) {
      k.pose("dev", t, W1);
      k.pose("dev", t + 4, W2);
    }
    for (let i = 0; i < 3; i++)
      k.key(`note${i}`, "trimEnd", [
        [0, 0, "hold"],
        [56 + i * 18, 0, "hold"],
        [72 + i * 18, 1, "linear"],
        [168, 1, "hold"],
        [176, 0, "ease-in"],
      ]);
    // the idea
    k.group("bulb", 40, 24, { scaleX: 0, scaleY: 0 });
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
    k.pose("dev", 116, { ...STAND, ...HOLD, lean: -4 }, "ease-out"); // aha
    k.pose("dev", 132, { ...STAND, ...HOLD, uaR: -150, faR: -40, lean: 0 }, "ease-out-back"); // thumbs up
    k.pose("dev", 160, { ...STAND, ...HOLD, uaR: -150, faR: -40, lean: 0 });
    k.pose("dev", 176, { ...STAND, ...HOLD, lean: 14 }, "ease-in-out");
    k.pose("dev", 180, { ...STAND, ...HOLD, lean: 14 });
  }),

  ...cabs,
];

const { bytes, warnings } = createRiv({ artboards: boards });
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/about.riv", bytes);
console.log(`public/rive/about.riv ${(bytes.length / 1024).toFixed(1)} KB`);
