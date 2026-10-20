// Elevator cabs for the About page team lift (imported by about.mjs).
// Each cab has a state machine "SM": `caught` plays once when the doors open (they
// get caught slacking), then `code` loops (they pretend they were coding all along).
// Sabari is always coding, so his cab only has `code`. Kishen gets a spy entrance.
import { makeKit, AMBER, BLUE, WHITE, NIGHT } from "./kit.mjs";

const PAPER = "#EEF1F5";
const CW = 120,
  CH = 150,
  CG = 140;
const X = 44; // chair
const thin = (t = 1.4, color = BLUE) => ({ color, thickness: t, cap: "round", join: "round" });

const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };
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
const TYPE_A = { ...SIT, faL: -5, faR: -45, lean: 4 };
const TYPE_B = { ...SIT, faL: -35, faR: -15, lean: 4 };

function cab(name, { setup, caught, code, desk = true, night = false }) {
  const k = makeKit(CG, night ? { line: WHITE, paper: NIGHT } : { line: BLUE, paper: PAPER });
  if (night) {
    k.shapes.push({
      id: "bg",
      z: -100,
      type: "rect",
      x: CW / 2,
      y: CH / 2,
      width: CW,
      height: CH,
      fill: { color: NIGHT },
    });
  } else {
    k.line(
      "rail",
      [
        { x: 14, y: 40 },
        { x: CW - 14, y: 40 },
      ],
      { stroke: thin(1), opacity: 0.18 }
    );
    k.line(
      "floor",
      [
        { x: 8, y: CG },
        { x: CW - 8, y: CG },
      ],
      { stroke: thin(1.2), opacity: 0.3 }
    );
  }
  if (desk) {
    // Pedestal desk: drawers on the right, knee space on the left.
    k.line(
      "deskTop",
      [
        { x: 52, y: CG - 34 },
        { x: 118, y: CG - 34 },
      ],
      { stroke: thin(2.4) }
    );
    k.shapes.push({
      id: "drawers",
      type: "rect",
      x: 108,
      y: CG - 17,
      width: 16,
      height: 34,
      cornerRadius: 1,
      stroke: thin(1.8),
      fill: { color: PAPER },
    });
    k.line(
      "drawerLine",
      [
        { x: 101, y: CG - 17 },
        { x: 115, y: CG - 17 },
      ],
      { stroke: thin(1.2) }
    );
  }
  setup(k);

  const animations = [];
  let caughtFrames = 0;
  if (caught) {
    caughtFrames = caught(k);
    animations.push({
      name: "caught",
      fps: 60,
      duration: caughtFrames,
      loop: "oneShot",
      tracks: k.takeTracks(),
    });
  }
  const codeFrames = code(k);
  const tracks = k.takeTracks();
  // Anything `caught` moved but `code` doesn't touch stays where `caught` left it.
  const keyed = new Set(tracks.map((t) => `${t.target}|${t.property}`));
  for (const t of animations[0]?.tracks ?? [])
    if (!keyed.has(`${t.target}|${t.property}`))
      tracks.push({ ...t, keyframes: [{ ...t.keyframes.at(-1), frame: 0, easing: "hold" }] });
  animations.push({ name: "code", fps: 60, duration: codeFrames, loop: "loop", tracks });

  return {
    name,
    width: CW,
    height: CH,
    groups: k.groups,
    shapes: k.shapes,
    animations,
    stateMachine: {
      name: "SM",
      states: animations.map((a) => ({ name: a.name, animation: a.name })),
      transitions: caught
        ? [
            { from: "entry", to: "caught" },
            { from: "caught", to: "code", exitTimeMs: Math.round((caughtFrames / 60) * 1000) },
          ]
        : [{ from: "entry", to: "code" }],
    },
  };
}

// ---- props ----
function laptop(k, id, x, y, extra = {}) {
  k.group(id, x, y, extra);
  k.line(
    `${id}Base`,
    [
      { x: -11, y: -1 },
      { x: 11, y: -1 },
    ],
    { parent: id, stroke: { color: BLUE, thickness: 2.6, cap: "round" } }
  );
  k.group(`${id}Lid`, -10, -2, { parent: id });
  k.shapes.push({
    id: `${id}Scr`,
    type: "rect",
    x: 9,
    y: -8,
    width: 18,
    height: 14,
    cornerRadius: 1.5,
    parent: `${id}Lid`,
    stroke: thin(1.8),
    fill: { color: BLUE },
  });
  for (let c = 0; c < 3; c++)
    k.line(
      `${id}C${c}`,
      [
        { x: 4, y: -12 + c * 4 },
        { x: 4 + [10, 7, 11][c], y: -12 + c * 4 },
      ],
      {
        parent: `${id}Lid`,
        stroke: {
          color: c === 1 ? AMBER : PAPER,
          thickness: 1.3,
          cap: "round",
          trim: { start: 0, end: 0 },
        },
      }
    );
}
// Code lines writing themselves across the screen between f0 and f1.
function codeRun(k, id, f0, f1, every = 24) {
  for (let c = 0; c < 3; c++) {
    k.key(`${id}C${c}`, "trimEnd", [[f0, 0, "hold"]]);
    for (let t = f0 + c * 6; t + every <= f1; t += every)
      k.key(`${id}C${c}`, "trimEnd", [
        [t, 0, "hold"],
        [t + Math.round(every * 0.6), 1, "linear"],
        [t + every - 2, 1, "hold"],
      ]);
    k.key(`${id}C${c}`, "trimEnd", [[f1, 0, "hold"]]);
  }
}
function typing(k, id, f0, f1, step = 6, a = TYPE_A, b = TYPE_B) {
  for (let t = f0; t < f1; t += step * 2) {
    k.pose(id, t, a);
    k.pose(id, Math.min(t + step, f1), b);
  }
  k.pose(id, f1, a);
}
function chair(k, x) {
  k.group("chairG", x, CG);
  k.line(
    "chair",
    [
      { x: -8, y: -34 },
      { x: -8, y: -15 },
      { x: 8, y: -15 },
      { x: 8, y: 0 },
    ],
    { parent: "chairG", stroke: thin(1.8) }
  );
}
// The "!" that pops over someone's head when the doors open.
function bang(k, x, y) {
  k.group("bang", x, y, { scaleX: 0, scaleY: 0 });
  k.line(
    "bangL",
    [
      { x: 0, y: -9 },
      { x: 0, y: 1 },
    ],
    { parent: "bang", stroke: { color: AMBER, thickness: 3, cap: "round" } }
  );
  k.shapes.push({
    id: "bangD",
    type: "ellipse",
    x: 0,
    y: 6,
    width: 3.4,
    height: 3.4,
    parent: "bang",
    fill: { color: AMBER },
  });
}
function pop(k, id, f, hold = 40) {
  for (const p of ["scaleX", "scaleY"])
    k.key(id, p, [
      [0, 0, "hold"],
      [f, 0, "hold"],
      [f + 6, 1.3, "ease-out"],
      [f + 10, 1, "ease-in-out"],
      [f + hold, 1, "hold"],
      [f + hold + 6, 0, "ease-in"],
    ]);
}
const sit = (k, id, f) => k.key(`${id}_body`, "y", [[f, 12, "hold"]]);
// Walk to the chair and sit down: walk f0..f1, settle by f1 + 8.
function goSit(k, id, f0, f1, from) {
  k.walk(id, f0, f1, from, X);
  k.pose(id, f1 + 8, SIT, "ease-out");
  k.key(`${id}_body`, "y", [
    [f1, 0, "hold"],
    [f1 + 8, 12, "ease-out"],
  ]);
}
const PL = X + 31; // laptop on the desk, in reach of the chair

export const cabs = [
  // Sabari: standing between two desks, a laptop under each hand, coding on both.
  cab("Sabari", {
    desk: false,
    setup(k) {
      for (const [id, x0, x1] of [
        ["tL", 6, 38],
        ["tR", 82, 114],
      ]) {
        k.line(
          `${id}Top`,
          [
            { x: x0, y: CG - 34 },
            { x: x1, y: CG - 34 },
          ],
          { stroke: thin(2.4) }
        );
        k.line(
          `${id}Leg`,
          [
            { x: (x0 + x1) / 2, y: CG - 34 },
            { x: (x0 + x1) / 2, y: CG },
          ],
          { stroke: thin(1.8) }
        );
      }
      laptop(k, "lapL", 26, CG - 34, { scaleX: -1 });
      laptop(k, "lapR", 94, CG - 34);
      // a third one, balanced on top of the right one, also running
      laptop(k, "lapT", 94, CG - 52, { scaleX: 0.8, scaleY: 0.8 });
      k.figure("s", 60, { glasses: true });
    },
    code(k) {
      const reachBoth = (lx, ly, rx, ry, lean) => ({
        ...STAND,
        ...k.reach("s", "L", lx, ly),
        ...k.reach("s", "R", rx, ry),
        lean,
      });
      const A = reachBoth(-22, -35, 21, -38, -2);
      const B = reachBoth(-21, -38, 22, -35, 2);
      for (let t = 0; t < 96; t += 10) {
        k.pose("s", t, A);
        k.pose("s", t + 5, B);
      }
      k.pose("s", 96, A);
      k.key("s_body", "y", [
        [0, 0, "ease-in-out"],
        [24, 1.5, "ease-in-out"],
        [48, 0, "ease-in-out"],
        [72, 1.5, "ease-in-out"],
        [96, 0, "ease-in-out"],
      ]);
      codeRun(k, "lapL", 0, 96, 16);
      codeRun(k, "lapR", 4, 96, 20);
      codeRun(k, "lapT", 8, 96, 26);
      return 96;
    },
  }),

  // Siddharth: shooting hoops. Scores one. Caught on the second. Ball bonks off, to work.
  cab("Siddharth", {
    setup(k) {
      chair(k, X);
      laptop(k, "lap", PL, CG - 34);
      // hoop on the left wall
      k.line(
        "board",
        [
          { x: 5, y: 40 },
          { x: 5, y: 70 },
        ],
        { stroke: thin(2.4) }
      );
      k.group("net", 13, 64);
      k.line(
        "netL",
        [
          { x: -6, y: 0 },
          { x: -3, y: 10 },
          { x: 3, y: 10 },
          { x: 6, y: 0 },
        ],
        { parent: "net", stroke: thin(1, BLUE), opacity: 0.6 }
      );
      k.line(
        "netX",
        [
          { x: -6, y: 0 },
          { x: 3, y: 10 },
        ],
        { parent: "net", stroke: thin(0.8), opacity: 0.5 }
      );
      k.line(
        "netY",
        [
          { x: 6, y: 0 },
          { x: -3, y: 10 },
        ],
        { parent: "net", stroke: thin(0.8), opacity: 0.5 }
      );
      k.line(
        "rim",
        [
          { x: 5, y: 64 },
          { x: 20, y: 64 },
        ],
        { stroke: { color: AMBER, thickness: 2.4, cap: "round" } }
      );
      k.figure("a", 24);
      k.group("ball", 24, 100);
      k.shapes.push({
        id: "ballB",
        type: "ellipse",
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        parent: "ball",
        stroke: thin(1.4),
        fill: { color: AMBER },
      });
      k.line(
        "ballS",
        [
          { x: 0, y: -5 },
          { x: 0, y: 5 },
        ],
        { parent: "ball", stroke: thin(1) }
      );
      k.line(
        "ballS2",
        [
          { x: -5, y: 0 },
          { x: 5, y: 0 },
        ],
        { parent: "ball", stroke: thin(1) }
      );
      bang(k, 36, CG - 88);
    },
    caught(k) {
      const HOLD = { ...STAND, ...k.reach("a", "L", -5, -40), ...k.reach("a", "R", 5, -40) };
      const DIP = { ...HOLD, thL: 18, shL: -30, thR: -18, shR: 30 };
      const UP = { ...STAND, uaL: 150, faL: 10, uaR: -150, faR: -10, lean: -4 };
      const shoot = (f) => {
        k.pose("a", f, HOLD);
        k.pose("a", f + 14, DIP, "ease-in-out");
        k.key("a_body", "y", [
          [f, 0, "ease-in-out"],
          [f + 14, 4, "ease-in-out"],
          [f + 22, -2, "ease-out"],
        ]);
        k.pose("a", f + 22, UP, "ease-out");
      };
      // Shot one: swish.
      shoot(0);
      k.key("a_body", "y", [[34, 0, "ease-in-out"]]);
      k.key("ball", "x", [
        [0, 24, "hold"],
        [22, 24, "ease-out"],
        [46, 13, "linear"],
        [56, 13, "hold"],
        [80, 24, "ease-out"],
      ]);
      k.key("ball", "y", [
        [0, 100, "ease-in-out"],
        [14, 104, "ease-in-out"],
        [22, 74, "ease-out"],
        [34, 44, "ease-out"],
        [46, 60, "ease-in"],
        [56, 76, "linear"],
        [66, 136, "ease-in"],
        [80, 100, "ease-out"],
      ]);
      k.key("net", "scaleY", [
        [0, 1, "hold"],
        [48, 1, "hold"],
        [54, 1.4, "ease-out"],
        [62, 1, "ease-in-out"],
      ]);
      k.pose("a", 40, UP);
      k.pose("a", 70, HOLD, "ease-in-out");
      k.pose("a", 80, HOLD);
      // Shot two: caught mid release. Freeze. The ball drops on his head.
      shoot(84);
      k.key("ball", "y", [
        [84, 100, "ease-in-out"],
        [98, 104, "ease-in-out"],
        [106, 74, "ease-out"],
        [124, 74, "hold"],
        [130, 76, "ease-in"],
        [138, 52, "ease-out"],
        [152, 136, "ease-in"],
        [160, 126, "ease-out"],
        [166, 136, "ease-in"],
      ]);
      k.key("ball", "x", [
        [124, 24, "hold"],
        [152, 58, "linear"],
        [176, 80, "ease-out"],
      ]);
      k.key("ball", "rotation", [
        [0, 0, "hold"],
        [124, 0, "hold"],
        [176, 480, "ease-out"],
      ]);
      pop(k, "bang", 106, 30);
      k.pose("a", 124, UP);
      k.key("a_body", "y", [
        [118, -2, "hold"],
        [124, 0, "ease-out"],
        [130, 3, "ease-in"],
        [136, 0, "ease-out"],
      ]); // bonk
      k.pose("a", 138, STAND, "ease-in-out");
      goSit(k, "a", 140, 156, 24);
      typing(k, "a", 164, 186, 4);
      codeRun(k, "lap", 164, 186, 14);
      return 186;
    },
    code(k) {
      typing(k, "a", 0, 48);
      codeRun(k, "lap", 0, 48);
      return 48;
    },
  }),

  // Deepak: dancing. Caught mid move. Freezes, lowers his arms very slowly, sits.
  cab("Deepak", {
    setup(k) {
      chair(k, X);
      laptop(k, "lap", PL, CG - 34);
      k.figure("d", 22);
      for (let n = 0; n < 2; n++) {
        k.group(`note${n}`, 34 + n * 14, 90, { opacity: 0 });
        k.shapes.push({
          id: `noteH${n}`,
          type: "ellipse",
          x: 0,
          y: 0,
          width: 5,
          height: 4,
          parent: `note${n}`,
          fill: { color: AMBER },
        });
        k.line(
          `noteS${n}`,
          [
            { x: 2.4, y: 0 },
            { x: 2.4, y: -10 },
            { x: 6, y: -7 },
          ],
          {
            parent: `note${n}`,
            stroke: { color: AMBER, thickness: 1.4, cap: "round", join: "round" },
          }
        );
      }
      bang(k, 32, CG - 84);
    },
    caught(k) {
      const A = {
        uaL: 40,
        faL: 70,
        uaR: -150,
        faR: -10,
        thL: 12,
        shL: 0,
        thR: -24,
        shR: 26,
        lean: -6,
      };
      const B = {
        uaL: 150,
        faL: 10,
        uaR: -40,
        faR: -70,
        thL: 24,
        shL: -26,
        thR: -12,
        shR: 0,
        lean: 6,
      };
      for (let t = 0; t < 80; t += 40) {
        k.pose("d", t, A, "ease-out");
        k.pose("d", t + 20, B, "ease-out");
        k.key("d_body", "y", [
          [t, 0, "ease-in-out"],
          [t + 10, 3, "ease-in-out"],
          [t + 20, 0, "ease-in-out"],
          [t + 30, 3, "ease-in-out"],
        ]);
      }
      k.pose("d", 80, A, "ease-out");
      k.key("d_body", "y", [[80, 0, "ease-in-out"]]);
      for (let n = 0; n < 2; n++)
        for (let t = n * 20; t + 38 <= 84; t += 40) {
          k.key(`note${n}`, "y", [
            [t, 92, "hold"],
            [t + 38, 64, "linear"],
          ]);
          k.key(`note${n}`, "opacity", [
            [t, 0, "hold"],
            [t + 6, 1, "ease-out"],
            [t + 30, 1, "hold"],
            [t + 38, 0, "ease-in"],
          ]);
        }
      pop(k, "bang", 82, 40);
      k.pose("d", 104, A);
      k.pose("d", 134, STAND, "ease-in-out"); // very... slowly...
      goSit(k, "d", 136, 156, 22);
      typing(k, "d", 168, 186, 4);
      codeRun(k, "lap", 168, 186, 14);
      return 186;
    },
    code(k) {
      typing(k, "d", 0, 48);
      codeRun(k, "lap", 0, 48);
      return 48;
    },
  }),

  // Janith: leaning back, popcorn, a movie on the laptop. Caught. Popcorn flies, code on.
  cab("Janith", {
    setup(k) {
      chair(k, X);
      laptop(k, "lap", PL, CG - 34);
      k.shapes.push({
        id: "play",
        type: "polygon",
        x: 0,
        y: 0,
        parent: "lapLid",
        points: [
          { x: 6, y: -12 },
          { x: 13, y: -8 },
          { x: 6, y: -4 },
        ],
        fill: { color: AMBER },
      });
      k.figure("j", X, { glasses: true });
      // popcorn bucket in his left hand
      k.group("bucket", 0, 15, { parent: "j_faL" });
      k.shapes.push({
        id: "bucketB",
        type: "polygon",
        x: 0,
        y: 0,
        parent: "bucket",
        points: [
          { x: -5.5, y: -5 },
          { x: 5.5, y: -5 },
          { x: 4, y: 6 },
          { x: -4, y: 6 },
        ],
        stroke: thin(1.3),
        fill: { color: "#FFFFFF" },
      });
      for (const sx of [-2, 2])
        k.line(
          `stripe${sx}`,
          [
            { x: sx * 1.2, y: -5 },
            { x: sx, y: 6 },
          ],
          { parent: "bucket", stroke: { color: AMBER, thickness: 1.8 } }
        );
      for (const [i, [px, py]] of [
        [-3, -6],
        [0, -7.5],
        [3, -6],
      ].entries())
        k.shapes.push({
          id: `pc${i}`,
          type: "ellipse",
          x: px,
          y: py,
          width: 4,
          height: 4,
          parent: "bucket",
          stroke: thin(0.8),
          fill: { color: "#FFF7D6" },
        });
      // a single kernel, tossed into his mouth over and over
      k.shapes.push({
        id: "kernel",
        type: "ellipse",
        x: X + 8,
        y: CG - 18,
        width: 3.4,
        height: 3.4,
        opacity: 0,
        stroke: thin(0.6),
        fill: { color: "#FFF7D6" },
      });
      for (let i = 0; i < 3; i++)
        k.shapes.push({
          id: `fly${i}`,
          type: "ellipse",
          x: X - 2,
          y: CG - 22,
          width: 3.4,
          height: 3.4,
          opacity: 0,
          stroke: thin(0.6),
          fill: { color: "#FFF7D6" },
        });
      bang(k, X + 4, CG - 74);
    },
    caught(k) {
      sit(k, "j", 0);
      const LAZY = {
        ...SIT,
        ...k.reach("j", "L", -4, -32),
        ...k.reach("j", "R", 3, -34),
        lean: -10,
      };
      const TOSS = { ...LAZY, ...k.reach("j", "R", 8, -46) };
      k.pose("j", 0, LAZY);
      for (const t of [6, 46]) {
        k.pose("j", t, LAZY);
        k.pose("j", t + 8, TOSS, "ease-out");
        k.pose("j", t + 22, LAZY, "ease-in-out");
        k.key("kernel", "opacity", [
          [t + 8, 0, "hold"],
          [t + 9, 1, "hold"],
          [t + 26, 1, "hold"],
          [t + 27, 0, "hold"],
        ]);
        k.key("kernel", "x", [
          [t + 8, X + 6, "hold"],
          [t + 26, X - 3, "linear"],
        ]);
        k.key("kernel", "y", [
          [t + 8, CG - 36, "hold"],
          [t + 16, CG - 64, "ease-out"],
          [t + 26, CG - 50, "ease-in"],
        ]); // gulp
        k.key("j_body", "rotation", [
          [t + 26, -10, "hold"],
          [t + 30, -13, "ease-out"],
          [t + 34, -10, "ease-in-out"],
        ]);
      }
      k.key("kernel", "opacity", [[0, 0, "hold"]]);
      k.pose("j", 86, LAZY);
      pop(k, "bang", 90, 30);
      // Panic: bucket flies, popcorn everywhere, sit up, the movie becomes code.
      k.pose("j", 98, { ...SIT, uaL: 150, faL: 30, uaR: -60, faR: -40, lean: 6 }, "ease-out");
      for (const p of ["scaleX", "scaleY"])
        k.key("bucket", p, [
          [0, 1, "hold"],
          [96, 1, "hold"],
          [104, 0, "ease-in"],
        ]);
      [
        [-10, -40],
        [6, -48],
        [-18, -30],
      ].forEach(([dx, dy], i) => {
        k.key(`fly${i}`, "opacity", [
          [0, 0, "hold"],
          [96, 0, "hold"],
          [97, 1, "hold"],
          [140, 1, "hold"],
          [150, 0, "ease-in"],
        ]);
        k.key(`fly${i}`, "x", [
          [96, X - 2, "hold"],
          [140, X - 2 + dx * 1.6, "linear"],
        ]);
        k.key(`fly${i}`, "y", [
          [96, CG - 50, "hold"],
          [112, CG - 50 + dy, "ease-out"],
          [140, CG - 1, "ease-in"],
        ]);
      });
      k.key("play", "opacity", [
        [0, 1, "hold"],
        [104, 1, "hold"],
        [105, 0, "hold"],
      ]);
      typing(k, "j", 108, 160, 3);
      codeRun(k, "lap", 108, 160, 14);
      return 160;
    },
    code(k) {
      typing(k, "j", 0, 48);
      codeRun(k, "lap", 0, 48);
      return 48;
    },
  }),

  // Gokul: big guy, fast asleep on the desk. Caught. Jolts awake, wipes his face, types like mad.
  cab("Gokul", {
    setup(k) {
      chair(k, X);
      laptop(k, "lap", PL, CG - 34);
      k.figure("g", X, { fat: true });
      for (let z = 0; z < 3; z++) {
        k.group(`z${z}`, 62, 92, { opacity: 0 });
        k.line(
          `zl${z}`,
          [
            { x: -3, y: -3 },
            { x: 3, y: -3 },
            { x: -3, y: 3 },
            { x: 3, y: 3 },
          ],
          { parent: `z${z}`, stroke: thin(1.6) }
        );
      }
      bang(k, X + 8, CG - 78);
    },
    caught(k) {
      sit(k, "g", 0);
      const SLEEP = { ...SIT, uaL: -95, faL: -75, uaR: -100, faR: -70, lean: 22 };
      k.pose("g", 0, SLEEP);
      k.pose("g", 40, { ...SLEEP, lean: 18 });
      k.pose("g", 80, SLEEP);
      k.pose("g", 90, SLEEP);
      for (let z = 0; z < 3; z++) {
        const t = z * 24;
        k.key(`z${z}`, "y", [
          [t, 92, "hold"],
          [t + 54, 58, "linear"],
        ]);
        k.key(`z${z}`, "x", [
          [t, 62, "hold"],
          [t + 54, 74 + z * 4, "ease-in-out"],
        ]);
        for (const p of ["scaleX", "scaleY"])
          k.key(`z${z}`, p, [
            [t, 0.6, "hold"],
            [t + 54, 1.3, "linear"],
          ]);
        k.key(`z${z}`, "opacity", [
          [t, 0, "hold"],
          [t + 8, 1, "ease-out"],
          [t + 40, 1, "hold"],
          [t + 54, 0, "ease-in"],
        ]);
        k.key(`z${z}`, "opacity", [[91, 0, "hold"]]);
      }
      pop(k, "bang", 92, 34);
      k.pose(
        "g",
        97,
        { ...SIT, uaL: 150, faL: 20, uaR: -150, faR: -20, lean: -14 },
        "ease-out-back"
      );
      k.key("g_body", "y", [
        [90, 12, "hold"],
        [94, 3, "ease-out"],
        [100, 12, "ease-in"],
      ]);
      k.pose("g", 106, { ...SIT, lean: 6 });
      k.pose("g", 112, { ...SIT, lean: -6 });
      const WIPE_A = { ...SIT, ...k.reach("g", "R", 8, -58) };
      const WIPE_B = { ...SIT, ...k.reach("g", "R", 3, -54) };
      k.pose("g", 118, WIPE_A, "ease-out");
      k.pose("g", 122, WIPE_B);
      k.pose("g", 126, WIPE_A);
      k.pose("g", 130, WIPE_B);
      typing(k, "g", 136, 176, 3);
      codeRun(k, "lap", 136, 176, 12);
      return 176;
    },
    code(k) {
      typing(k, "g", 0, 48);
      codeRun(k, "lap", 0, 48);
      return 48;
    },
  }),

  // Kishen: the lights are off. A spotlight opens. He strolls in, shades on,
  // fixes a cufflink, tips the shades down, a glint, folds his arms, then aims at you and
  // fires. TeamElevator cracks the glass and drops the whole lift out of frame.
  cab("Kishen", {
    desk: false,
    night: true,
    setup(k) {
      k.shapes.push({
        id: "spot",
        z: -50,
        type: "ellipse",
        x: 60,
        y: 96,
        width: 110,
        height: 150,
        scaleX: 0,
        scaleY: 0,
        fill: { gradient: { type: "radial", stops: [{ color: "#33405F" }, { color: NIGHT }] } },
      });
      k.shapes.push({
        id: "pool",
        z: -40,
        type: "ellipse",
        x: 60,
        y: CG,
        width: 54,
        height: 8,
        opacity: 0,
        fill: { color: "#46557A" },
      });
      k.figure("kk", -20);
      // shades, a bow tie, and the glint
      for (const sx of [-1, 1])
        k.shapes.push({
          id: `shade${sx}`,
          type: "rect",
          x: sx * 3.6,
          y: -55,
          width: 6.4,
          height: 4.2,
          cornerRadius: 1.8,
          parent: "kk_body",
          fill: { color: "#CBD5E1" },
        });
      k.line(
        "bridge",
        [
          { x: -7, y: -56.6 },
          { x: 7, y: -56.6 },
        ],
        { parent: "kk_body", stroke: thin(1.2, WHITE) }
      );
      k.shapes.push({
        id: "bow",
        type: "polygon",
        x: 0,
        y: -46,
        parent: "kk_body",
        points: [
          { x: -4, y: -2.5 },
          { x: 4, y: 2.5 },
          { x: 4, y: -2.5 },
          { x: -4, y: 2.5 },
        ],
        fill: { color: AMBER },
      });
      k.group("glint", 63, CG - 55, { scaleX: 0, scaleY: 0 });
      k.line(
        "glintA",
        [
          { x: -4, y: 0 },
          { x: 4, y: 0 },
        ],
        { parent: "glint", stroke: thin(1.4, WHITE) }
      );
      k.line(
        "glintB",
        [
          { x: 0, y: -4 },
          { x: 0, y: 4 },
        ],
        { parent: "glint", stroke: thin(1.4, WHITE) }
      );
      // The pistol, seen front on: he aims it straight at whoever is riding the lift.
      k.group("gun", 61, 92, { scaleX: 0, scaleY: 0 });
      k.shapes.push({
        id: "gunBody",
        type: "rect",
        x: 0,
        y: 0,
        width: 9,
        height: 8,
        cornerRadius: 1.5,
        parent: "gun",
        fill: { color: "#CBD5E1" },
      });
      k.shapes.push({
        id: "gunGrip",
        type: "rect",
        x: 0,
        y: 6.5,
        width: 4.5,
        height: 6,
        cornerRadius: 1,
        parent: "gun",
        fill: { color: "#94A3B8" },
      });
      k.shapes.push({
        id: "muzzle",
        type: "ellipse",
        x: 0,
        y: -0.5,
        width: 4.6,
        height: 4.6,
        parent: "gun",
        fill: { color: "#000000" },
      });
      k.group("flash", 61, 91.5, { scaleX: 0, scaleY: 0 });
      k.shapes.push({
        id: "flashStar",
        type: "polygon",
        x: 0,
        y: 0,
        parent: "flash",
        fill: { color: AMBER },
        points: [...Array(12).keys()].map((i) => {
          const a = (i * Math.PI) / 6,
            r = i % 2 ? 4 : 11;
          return { x: Math.cos(a) * r, y: Math.sin(a) * r };
        }),
      });
      k.shapes.push({
        id: "flashCore",
        type: "ellipse",
        x: 0,
        y: 0,
        width: 7,
        height: 7,
        parent: "flash",
        fill: { color: WHITE },
      });
      k.shapes.push({
        id: "smoke",
        type: "ellipse",
        x: 61,
        y: 86,
        width: 5,
        height: 5,
        opacity: 0,
        stroke: thin(1, WHITE),
      });
    },
    caught(k) {
      for (const p of ["scaleX", "scaleY"])
        k.key("spot", p, [
          [0, 0, "hold"],
          [10, 0, "hold"],
          [34, 1, "ease-out"],
        ]);
      k.key("pool", "opacity", [
        [0, 0, "hold"],
        [20, 0, "hold"],
        [40, 0.9, "ease-out"],
      ]);
      k.walk("kk", 30, 78, -20, 60);
      k.pose("kk", 84, STAND, "ease-out");
      const CUFF = { ...STAND, ...k.reach("kk", "L", 5, -30), ...k.reach("kk", "R", 7, -31) };
      k.pose("kk", 96, CUFF, "ease-in-out");
      k.pose("kk", 102, { ...CUFF, ...k.reach("kk", "R", 8, -29) });
      k.pose("kk", 108, CUFF);
      k.pose("kk", 118, STAND, "ease-in-out");
      // tip the shades down... look... back up
      const TIP = { ...STAND, ...k.reach("kk", "R", 4, -52) };
      k.pose("kk", 128, TIP, "ease-out");
      for (const sx of [-1, 1])
        k.key(`shade${sx}`, "y", [
          [0, -55, "hold"],
          [128, -55, "hold"],
          [134, -52, "ease-out"],
          [150, -52, "hold"],
          [156, -55, "ease-in-out"],
        ]);
      k.pose("kk", 150, TIP);
      k.pose("kk", 160, STAND, "ease-in-out");
      pop(k, "glint", 160, 6);
      k.key("glint", "rotation", [
        [160, 0, "hold"],
        [172, 90, "ease-out"],
      ]);
      // arms folded, small nod
      const FOLD = { ...STAND, ...k.reach("kk", "L", 5, -36), ...k.reach("kk", "R", -5, -38) };
      k.pose("kk", 176, FOLD, "ease-in-out");
      k.key("kk_body", "rotation", [
        [176, 0, "hold"],
        [182, 4, "ease-out"],
        [190, 0, "ease-in-out"],
      ]);
      // ...then the draw. Both hands, straight at you. Fire. Recoil. Smoke.
      const AIM = {
        ...STAND,
        ...k.reach("kk", "R", 2, -48),
        ...k.reach("kk", "L", -1, -47),
        lean: 0,
      };
      k.pose("kk", 200, FOLD);
      k.pose("kk", 210, AIM, "ease-out-back");
      for (const p of ["scaleX", "scaleY"]) {
        k.key("gun", p, [
          [0, 0, "hold"],
          [204, 0, "hold"],
          [210, 1, "ease-out"],
          [222, 1, "hold"],
          [225, 1.25, "ease-out"],
          [232, 1, "ease-in-out"],
        ]);
        k.key("flash", p, [
          [0, 0, "hold"],
          [222, 0, "hold"],
          [224, 2.6, "ease-out"],
          [230, 0, "ease-in"],
        ]);
      }
      k.pose("kk", 222, AIM);
      k.key("kk_body", "y", [
        [222, 0, "hold"],
        [225, -3, "ease-out"],
        [234, 0, "ease-in-out"],
      ]); // recoil
      k.key("smoke", "opacity", [
        [0, 0, "hold"],
        [228, 0, "hold"],
        [232, 0.9, "ease-out"],
        [256, 0, "ease-in"],
      ]);
      k.key("smoke", "y", [
        [228, 86, "hold"],
        [256, 70, "ease-out"],
      ]);
      for (const p of ["scaleX", "scaleY"])
        k.key("smoke", p, [
          [228, 1, "hold"],
          [256, 2, "ease-out"],
        ]);
      return 256;
    },
    code(k) {
      // Idle: still aiming, a slow lean, the shades catch the light now and then.
      const AIM = {
        ...STAND,
        ...k.reach("kk", "R", 2, -48),
        ...k.reach("kk", "L", -1, -47),
        lean: 0,
      };
      k.pose("kk", 0, AIM);
      k.pose("kk", 120, AIM);
      k.key("kk_body", "rotation", [
        [0, 0, "ease-in-out"],
        [60, -2, "ease-in-out"],
        [120, 0, "ease-in-out"],
      ]);
      pop(k, "glint", 80, 6);
      k.key("glint", "rotation", [
        [80, 0, "hold"],
        [92, 90, "ease-out"],
      ]);
      return 120;
    },
  }),
];
