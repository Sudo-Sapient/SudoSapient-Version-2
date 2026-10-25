// Builds public/rive/footer.riv: the footer loop, one 28s animation on two artboards
// (Desktop 1280x320, Mobile 390x520). Run: npm run rive:footer. Spec: docs/RIVE.md §2.
//
// Timeline (frames at 60fps):
//   0–240     PLAN    the architect sketches; b2 dribbles, b1 types, the agent watches
//   240–660   BUILD   b1 and b2 walk to the pad and guide each rocket part down the crane
//   660–840   CHECK   the engineer runs the checklist and counts down
//   840–1020  LAUNCH  liftoff: the architect dances, the engineer eats popcorn, b2 drops
//                     his ball, the big guy is knocked flat
//   1020–1200 LAND    b2 drags the big guy clear; the agent's car picks up b1; all go home
//   1200–1680 LOGO    five of the crew flip into S d o S i, fly up and spell "Sudo Sapient.";
//                     the agent shoots the full stop, the name breaks, everyone flips back
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE, DEEP, NIGHT } from "./kit.mjs";
import { GLYPHS } from "./glyphs.mjs";

const FPS = 60;
const LOOP = 1680; // 28s: 20s of story, then the crew becomes the logo

function scene(L) {
  const G = L.ground;
  // The big guy gets knocked over by the launch; the basketball guy (b2) drags him clear.
  // The laptop guy (b1) gets picked up by the agent's car instead.
  const FH = L.fatHome,
    d = L.fallDir,
    DRAG = L.drag;
  const head = FH + d * 66; // where his head lands
  const grab = head + d * 14;
  L = { ...L, b1Home: L.b1Out, b2Home: grab + d * DRAG };
  const U = L.upper ?? G; // shelf level for the plan board and console (mobile stacks them above the pad)
  const { shapes, groups, ink, group, line, key, figure, pose, reach, walk, tracksOut } =
    makeKit(G);

  // ---- stage ----
  line(
    "ground",
    [
      { x: 0, y: G },
      { x: L.w, y: G },
    ],
    { stroke: { ...ink(1.2) }, opacity: 0.2 }
  );
  if (U !== G) {
    line(
      "shelfL",
      [
        { x: 0, y: U },
        { x: L.shelfL, y: U },
      ],
      { stroke: { ...ink(1.4) }, opacity: 0.5 }
    );
    line(
      "shelfR",
      [
        { x: L.shelfR, y: U },
        { x: L.w, y: U },
      ],
      { stroke: { ...ink(1.4) }, opacity: 0.5 }
    );
  }

  // Plan board (left)
  const D = L.desk;
  line("easel", [
    { x: D - 40, y: U },
    { x: D - 20, y: U - 60 },
    { x: D + 20, y: U - 60 },
    { x: D + 40, y: U },
  ]);
  shapes.push({
    id: "board",
    type: "rect",
    x: D,
    y: U - 100,
    width: 112,
    height: 78,
    stroke: ink(),
    fill: { color: DEEP },
  });
  // The plan: a rocket sketch that draws itself on the board.
  const sk = (x, y) => ({ x: D + x, y: U - 100 + y });
  line(
    "sketch",
    [
      sk(-10, 26),
      sk(-10, -10),
      sk(0, -28),
      sk(10, -10),
      sk(10, 26),
      sk(-10, 26),
      sk(-20, 32),
      sk(-10, 10),
      sk(10, 10),
      sk(20, 32),
      sk(10, 26),
    ],
    {
      stroke: { ...ink(1.6), trim: { start: 0, end: 0 } },
    }
  );
  line("dim", [sk(-34, -28), sk(-34, 26)], {
    stroke: { ...ink(1.2), color: AMBER, trim: { start: 0, end: 0 } },
  });
  for (const [i, [px, py, r]] of [
    [-48, -34, -6],
    [44, -32, 5],
    [46, 26, 8],
  ].entries()) {
    group(`paper${i}`, D + px, U - 100 + py, { rotation: r });
    shapes.push({
      id: `paperS${i}`,
      type: "rect",
      x: 0,
      y: 6,
      width: 14,
      height: 12,
      parent: `paper${i}`,
      stroke: ink(1.4),
      fill: { color: BLUE },
    });
  }

  // Projection: the plan arcs onto the launch pad.
  const P = L.pad;
  line(
    "beam",
    [
      { x: D + 58, y: U - 120, cubic: { rotation: -50, distance: (P - D) * 0.45 } },
      { x: P, y: G - 175, cubic: { rotation: 20, distance: (P - D) * 0.35 } },
    ],
    {
      stroke: { ...ink(1.6), color: AMBER, trim: { start: 0, end: 0 } },
    }
  );

  // Launch pad
  shapes.push({
    id: "pad",
    type: "rect",
    x: P,
    y: G - 4,
    width: 150,
    height: 8,
    stroke: ink(),
    fill: { color: NIGHT },
  });

  // Ghost outline of the rocket — fills in as parts arrive.
  const base = G - 8;
  const gp = (x, y) => ({ x: P + x, y: base + y });
  line(
    "ghost",
    [gp(-48, -4), gp(-26, -30), gp(-26, -124), gp(0, -164), gp(26, -124), gp(26, -30), gp(48, -4)],
    {
      stroke: { ...ink(1.4), trim: { start: 0, end: 0 } },
      opacity: 0.45,
    }
  );

  // ---- rocket (group origin = pad top centre) ----
  group("rocket", P, base);
  group("flame", 0, -14, { parent: "rocket", scaleY: 0, scaleX: 0.6 });
  shapes.push({
    id: "flameOut",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "flame",
    points: [
      { x: -12, y: 0 },
      { x: 12, y: 0 },
      { x: 0, y: 58 },
    ],
    fill: {
      gradient: {
        type: "linear",
        stops: [{ color: AMBER }, { color: "#F97316" }],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 58 },
      },
    },
  });
  shapes.push({
    id: "flameIn",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "flame",
    points: [
      { x: -5, y: 0 },
      { x: 5, y: 0 },
      { x: 0, y: 26 },
    ],
    fill: { color: "#FFF7D6" },
  });
  const OFF = -(L.h + 60); // parts wait above the artboard, then the crane lowers them
  const REST = { bodyR: -78, window: -92 };
  const part = (id, s) =>
    shapes.push({ id, x: 0, y: (REST[id] ?? 0) + OFF, parent: "rocket", stroke: ink(), ...s });
  part("engine", {
    type: "polygon",
    points: [
      { x: -16, y: -30 },
      { x: 16, y: -30 },
      { x: 12, y: -14 },
      { x: -12, y: -14 },
    ],
    fill: { color: DEEP },
  });
  part("finL", {
    type: "polygon",
    points: [
      { x: -26, y: -70 },
      { x: -26, y: -32 },
      { x: -48, y: -14 },
      { x: -48, y: -40 },
    ],
    fill: { color: BLUE },
  });
  part("finR", {
    type: "polygon",
    points: [
      { x: 26, y: -70 },
      { x: 26, y: -32 },
      { x: 48, y: -14 },
      { x: 48, y: -40 },
    ],
    fill: { color: BLUE },
  });
  part("bodyR", {
    type: "rect",
    width: 52,
    height: 96,
    cornerRadius: 3,
    fill: {
      gradient: {
        type: "linear",
        stops: [{ color: BLUE }, { color: DEEP }],
        start: { x: -26, y: 0 },
        end: { x: 26, y: 0 },
      },
    },
  });
  part("window", {
    type: "ellipse",
    width: 18,
    height: 18,
    fill: { color: NIGHT },
    stroke: { ...ink(), color: AMBER },
  });
  part("nose", {
    type: "polygon",
    points: [
      { x: -26, y: -126 },
      { x: 26, y: -126 },
      { x: 0, y: -166 },
    ],
    fill: { color: BLUE },
  });
  // Crane hook rides down with each part.
  group("hook", P, -30);
  line(
    "cable",
    [
      { x: 0, y: -400 },
      { x: 0, y: 0 },
    ],
    { parent: "hook", stroke: ink(1.4) }
  );
  line(
    "hookL",
    [
      { x: -6, y: 0 },
      { x: 6, y: 0 },
      { x: 6, y: 6 },
    ],
    { parent: "hook", stroke: { ...ink(2), color: AMBER } }
  );
  // Spark when a part seats.
  group("spark", P, base - 60, { scaleX: 0, scaleY: 0 });
  for (const a of [0, 45, 90, 135]) {
    const r = (a * Math.PI) / 180,
      c = Math.cos(r),
      s = Math.sin(r);
    line(
      `spark${a}`,
      [
        { x: -c * 14, y: -s * 14 },
        { x: c * 14, y: s * 14 },
      ],
      { parent: "spark", stroke: { ...ink(2), color: AMBER } }
    );
  }

  // Smoke puffs
  const puffs = [-70, -40, -14, 14, 40, 70];
  puffs.forEach((dx, i) =>
    shapes.push({
      id: `puff${i}`,
      type: "ellipse",
      x: P + dx * 0.4,
      y: G - 10,
      width: 34,
      height: 26,
      scaleX: 0.1,
      scaleY: 0.1,
      opacity: 0,
      stroke: ink(1.6),
      fill: { color: "#1A2440" },
    })
  );

  // ---- mission console (right) ----
  const C = L.console;
  line("consoleLegs", [
    { x: C - 24, y: U },
    { x: C - 24, y: U - 30 },
    { x: C + 24, y: U - 30 },
    { x: C + 24, y: U },
  ]);
  shapes.push({
    id: "console",
    type: "rect",
    x: C,
    y: U - 46,
    width: 70,
    height: 34,
    stroke: ink(),
    fill: { color: DEEP },
  });
  [-18, 0, 18].forEach((dx, i) =>
    line(
      `tick${i}`,
      [
        { x: C + dx - 5, y: U - 47 },
        { x: C + dx - 1, y: U - 42 },
        { x: C + dx + 6, y: U - 52 },
      ],
      { stroke: { ...ink(2), color: AMBER, trim: { start: 0, end: 0 } } }
    )
  );
  line(
    "mast",
    [
      { x: C + 30, y: U - 63 },
      { x: C + 30, y: U - 112 },
    ],
    { stroke: ink(1.6) }
  );
  [0, 1, 2].forEach((i) =>
    shapes.push({
      id: `count${i}`,
      type: "ellipse",
      x: C + 30,
      y: U - 106 + i * 14,
      width: 9,
      height: 9,
      stroke: ink(1.4),
      fill: { color: NIGHT },
    })
  );

  // ---- crew ----
  figure("arch", D - 66, { y: U });
  figure("fat", FH, { fat: true });
  figure("b1", L.b1Home, { glasses: true });
  figure("b2", L.b2Home);
  figure("eng", C - 58, { glasses: true, y: U });

  // ---- props ----
  // Laptop, held in front of b1's chest.
  group("laptop", 8, -31, { parent: "b1_body" });
  shapes.push({
    id: "laptopScreen",
    type: "rect",
    x: 0,
    y: -6,
    width: 16,
    height: 10,
    cornerRadius: 1.5,
    parent: "laptop",
    stroke: ink(1.4),
    fill: { color: BLUE },
  });
  shapes.push({
    id: "laptopLogo",
    type: "ellipse",
    x: 0,
    y: -6,
    width: 2.6,
    height: 2.6,
    parent: "laptop",
    fill: { color: AMBER },
  });
  line(
    "laptopBase",
    [
      { x: -9, y: 0 },
      { x: 9, y: 0 },
    ],
    { parent: "laptop", stroke: ink(2.2) }
  );
  // Basketball: lives in scene space so it can bounce off the floor and roll away.
  group("ball", L.b2Home + 12, G - 22);
  shapes.push({
    id: "ballS",
    type: "ellipse",
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    parent: "ball",
    stroke: ink(1.4),
    fill: { color: "#F97316" },
  });
  line(
    "ballSeam",
    [
      { x: 0, y: -5 },
      { x: 0, y: 5 },
    ],
    { parent: "ball", stroke: ink(1) }
  );
  line(
    "ballSeam2",
    [
      { x: -5, y: 0 },
      { x: 5, y: 0 },
    ],
    { parent: "ball", stroke: ink(1) }
  );
  // Popcorn bucket for the engineer, plus the kernel in his hand.
  group("popcorn", -8, -28, { parent: "eng_body", opacity: 0 });
  shapes.push({
    id: "popBucket",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "popcorn",
    points: [
      { x: -6, y: -7 },
      { x: 6, y: -7 },
      { x: 4.5, y: 7 },
      { x: -4.5, y: 7 },
    ],
    stroke: ink(1.4),
    fill: { color: "#FFFFFF" },
  });
  for (const sx of [-2.4, 2.4])
    line(
      `popStripe${sx}`,
      [
        { x: sx, y: -6 },
        { x: sx * 0.8, y: 6 },
      ],
      { parent: "popcorn", stroke: { ...ink(1.6), color: "#EF4444" } }
    );
  [-4, -1.2, 1.6, 4.2].forEach((kx, i) =>
    shapes.push({
      id: `popK${i}`,
      type: "ellipse",
      x: kx,
      y: -8.5 - (i % 2) * 1.5,
      width: 4,
      height: 4,
      parent: "popcorn",
      fill: { color: "#FFF7D6" },
    })
  );
  shapes.push({
    id: "popInHand",
    type: "ellipse",
    x: 0,
    y: 13.5,
    width: 3.6,
    height: 3.6,
    parent: "eng_faR",
    opacity: 0,
    fill: { color: "#FFF7D6" },
  });

  // ---- the agent: a sharp dresser watching from the back, then the getaway car ----
  figure("bond", L.bond);
  // A dark cap with the brim to one side.
  const CAP = [
    { x: -6.8, y: -57.4, cubic: { rotation: -80, distance: 3.6 } },
    { x: 0, y: -63.6, cubic: { rotation: 0, distance: 4.2 } },
    { x: 6.8, y: -57.4, cubic: { rotation: 80, distance: 3.6 } },
  ];
  const BRIM = [
    { x: 4.6, y: -58.4 },
    { x: 13, y: -57.6 },
    { x: 12.6, y: -56 },
    { x: 5.2, y: -56.4 },
  ];
  for (const [cid, pts] of [
    ["bondCap", CAP],
    ["bondBrim", BRIM],
  ])
    shapes.push({
      id: cid,
      type: "polygon",
      x: 0,
      y: 0,
      parent: "bond_body",
      points: pts,
      stroke: ink(1.2),
      fill: { color: "#111827" },
    });
  shapes.push({
    id: "bondCapButton",
    type: "ellipse",
    x: 0,
    y: -63.6,
    width: 2.2,
    height: 2.2,
    parent: "bond_body",
    fill: { color: "#FFFFFF" },
  });
  // A pistol in his left hand (forearm runs along +y), with a muzzle flash; hidden until needed.
  group("gun", 0, 0, { parent: "bond_faL", opacity: 0 });
  shapes.push({
    id: "gunBarrel",
    type: "rect",
    x: 0,
    y: 16.5,
    width: 3.2,
    height: 9,
    cornerRadius: 0.8,
    parent: "gun",
    stroke: ink(0.8),
    fill: { color: "#111827" },
  });
  shapes.push({
    id: "gunGrip",
    type: "rect",
    x: 2.6,
    y: 13.4,
    width: 4,
    height: 3,
    cornerRadius: 0.8,
    parent: "gun",
    stroke: ink(0.8),
    fill: { color: "#111827" },
  });
  group("muzzle", 0, 24, { parent: "bond_faL", scaleX: 0, scaleY: 0 });
  shapes.push({
    id: "muzzleStar",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "muzzle",
    points: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
      const a = (i * Math.PI) / 5,
        r = i % 2 ? 2.4 : 6.5;
      return { x: Math.sin(a) * r, y: Math.cos(a) * r };
    }),
    fill: { color: AMBER },
  });
  // Black wayfarer shades: two dark lenses and a bridge.
  for (const sx of [-2.9, 2.9])
    shapes.push({
      id: `bondLens${sx}`,
      type: "rect",
      x: sx,
      y: -56,
      width: 5.2,
      height: 3.8,
      cornerRadius: 1.2,
      parent: "bond_body",
      stroke: { ...ink(0.8), color: "#64748B" },
      fill: { color: "#000000" },
    });
  line(
    "bondBridge",
    [
      { x: -0.6, y: -56.6 },
      { x: 0.6, y: -56.6 },
    ],
    { parent: "bond_body", stroke: { ...ink(0.9), color: "#000000" } }
  );
  line(
    "bondLapels",
    [
      { x: -4, y: -46 },
      { x: 0, y: -37 },
      { x: 4, y: -46 },
    ],
    { parent: "bond_body", stroke: ink(1.4) }
  );
  shapes.push({
    id: "bondTie",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "bond_body",
    points: [
      { x: -4, y: -46.5 },
      { x: 4, y: -42.5 },
      { x: 4, y: -46.5 },
      { x: -4, y: -42.5 },
    ],
    fill: { color: AMBER },
  });

  // A low red sports car. Faces left (nose at -x); flipping scaleX turns it round.
  const CAR_S = L.carScale,
    CAR_OFF = L.w + 90,
    CAR_STOP = L.b1Out + 58 * CAR_S;
  group("car", CAR_OFF, G, { scaleX: CAR_S, scaleY: CAR_S });
  // Speed lines trail behind while it moves.
  group("carLines", 62, -14, { parent: "car", opacity: 0 });
  [
    [-4, 14],
    [2, 22],
    [8, 12],
  ].forEach(([ly, len], i) =>
    line(
      `carLine${i}`,
      [
        { x: 0, y: ly },
        { x: len, y: ly },
      ],
      { parent: "carLines", stroke: ink(1.4), opacity: 0.6 }
    )
  );
  shapes.push({
    id: "carSpoiler",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "car",
    points: [
      { x: 42, y: -19 },
      { x: 44, y: -25 },
      { x: 56, y: -26 },
      { x: 55, y: -22.5 },
      { x: 47, y: -22 },
      { x: 46, y: -19 },
    ],
    stroke: ink(1.4),
    fill: { color: "#111827" },
  });
  shapes.push({
    id: "carBody",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "car",
    points: [
      { x: -52, y: -5 },
      { x: -55, y: -10 },
      { x: -48, y: -14 },
      { x: -24, y: -18 },
      { x: -8, y: -27 },
      { x: 10, y: -28 },
      { x: 28, y: -20.5 },
      { x: 50, y: -18.5 },
      { x: 54, y: -12 },
      { x: 53, y: -5 },
    ],
    stroke: ink(2),
    fill: {
      gradient: {
        type: "linear",
        stops: [{ color: "#F87171" }, { color: "#B91C1C" }],
        start: { x: 0, y: -28 },
        end: { x: 0, y: -5 },
      },
    },
  });
  shapes.push({
    id: "carGlass",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "car",
    points: [
      { x: -16, y: -19 },
      { x: -6, y: -25.5 },
      { x: 9.5, y: -26.4 },
      { x: 24, y: -20 },
    ],
    fill: { color: "#0B1220" },
  });
  const carHead = (id, x, lens, cap) => {
    shapes.push({
      id,
      type: "ellipse",
      x,
      y: -21.5,
      width: 8,
      height: 8,
      parent: "car",
      stroke: ink(1.3),
      fill: { color: NIGHT },
    });
    shapes.push({
      id: `${id}Eyes`,
      type: "rect",
      x,
      y: -22.2,
      width: 7.4,
      height: 2.4,
      cornerRadius: 1,
      parent: "car",
      fill: { color: lens },
    });
    if (cap)
      for (const [cid, pts] of [
        [`${id}Cap`, CAP],
        [`${id}Brim`, BRIM],
      ])
        shapes.push({
          id: cid,
          type: "polygon",
          x,
          y: -21.5,
          parent: "car",
          points: pts.map((p) => ({ ...p, x: p.x * 0.66, y: (p.y + 55) * 0.66 })),
          stroke: ink(0.9),
          fill: { color: "#111827" },
        });
  };
  carHead("carDriver", 8, "#000000", true);
  carHead("carPassenger", -4, AMBER, false);
  line(
    "carWindow",
    [
      { x: -16, y: -19 },
      { x: -6, y: -25.5 },
      { x: 9.5, y: -26.4 },
      { x: 24, y: -20 },
      { x: -16, y: -19 },
    ],
    { parent: "car", stroke: ink(1.3) }
  );
  line(
    "carPillar",
    [
      { x: 3, y: -26 },
      { x: 3, y: -19.3 },
    ],
    { parent: "car", stroke: ink(1.3) }
  );
  line(
    "carStripe",
    [
      { x: -46, y: -11 },
      { x: 48, y: -11 },
    ],
    { parent: "car", stroke: ink(1), opacity: 0.55 }
  );
  shapes.push({
    id: "carIntake",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "car",
    points: [
      { x: 12, y: -15 },
      { x: 22, y: -16 },
      { x: 20, y: -12.5 },
    ],
    fill: { color: "#111827" },
  });
  shapes.push({
    id: "carLight",
    type: "polygon",
    x: 0,
    y: 0,
    parent: "car",
    points: [
      { x: -53, y: -11 },
      { x: -46, y: -13.5 },
      { x: -47, y: -11.5 },
    ],
    fill: { color: AMBER },
  });
  shapes.push({
    id: "carTail",
    type: "rect",
    x: 52,
    y: -14.5,
    width: 2.6,
    height: 3,
    parent: "car",
    fill: { color: "#EF4444" },
  });
  for (const [w, wx] of [
    ["wheelF", -33],
    ["wheelR", 33],
  ]) {
    group(w, wx, -8, { parent: "car" });
    shapes.push({
      id: `${w}T`,
      type: "ellipse",
      x: 0,
      y: 0,
      width: 18,
      height: 18,
      parent: w,
      stroke: ink(2),
      fill: { color: "#111827" },
    });
    shapes.push({
      id: `${w}Rim`,
      type: "ellipse",
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      parent: w,
      stroke: { ...ink(1.2), color: "#CBD5E1" },
      fill: { color: "#1F2937" },
    });
    for (const a of [0, 60, 120]) {
      const r = (a * Math.PI) / 180;
      line(
        `${w}S${a}`,
        [
          { x: -Math.cos(r) * 4.5, y: -Math.sin(r) * 4.5 },
          { x: Math.cos(r) * 4.5, y: Math.sin(r) * 4.5 },
        ],
        { parent: w, stroke: { ...ink(1.1), color: "#CBD5E1" } }
      );
    }
  }

  // Draw order (higher z on top; default is creation order): the agent stands behind the
  // set, and the car drives in front of the crew with its parts in build order.
  shapes.forEach((sh, i) => {
    // Behind the set, but keep his own order so the beard and shades sit on his face.
    if (sh.parent?.startsWith("bond")) sh.z = -10 + i / 10000;
    if (["car", "carLines"].includes(sh.parent) || sh.parent?.startsWith("wheel")) sh.z = 5000 + i;
  });

  // ================= choreography =================
  const STAND = { uaL: 20, faL: -8, uaR: -20, faR: 8, thL: 7, shL: 0, thR: -7, shR: 0, lean: 0 };
  const LAPTOP = { ...STAND, ...reach("b1", "L", 0, -31), ...reach("b1", "R", 16, -31) };
  const DRIBBLE_UP = { ...STAND, ...reach("b2", "R", 12, -27) };
  const DRIBBLE_DN = { ...STAND, ...reach("b2", "R", 13, -21) };
  const CROSSED = { ...STAND, ...reach("bond", "L", 6, -36), ...reach("bond", "R", -6, -35) };
  const SHADES = { ...CROSSED, ...reach("bond", "R", 4, -56) };
  const POP_DIP = { ...STAND, ...reach("eng", "L", -14, -29), ...reach("eng", "R", -6, -37) };
  const POP_EAT = { ...POP_DIP, ...reach("eng", "R", 1, -51) };
  // Typing: the hands patter on the keys.
  const typeOn = (f0, f1) => {
    for (let f = f0; f < f1; f += 10) {
      key("b1_faL", "rotation", [[f, LAPTOP.faL + (f % 20 ? 10 : -6), "ease-in-out"]]);
      key("b1_faR", "rotation", [[f, LAPTOP.faR + (f % 20 ? -8 : 10), "ease-in-out"]]);
    }
  };
  // Dribbling: ball and hand meet at the top of every bounce.
  const dribble = (f0, f1) => {
    for (let f = f0; f < f1; f += 16) {
      pose("b2", f, DRIBBLE_UP);
      pose("b2", f + 5, DRIBBLE_DN);
      key("ball", "y", [
        [f, G - 22, "ease-in"],
        [f + 8, G - 5, "ease-out"],
      ]);
    }
    key("ball", "y", [[f1, G - 22, "ease-out"]]);
  };
  pose("arch", 0, "sketch");
  pose("fat", 0, "stand");
  pose("eng", 0, "stand");
  pose("b1", 0, LAPTOP);
  pose("bond", 0, CROSSED);
  typeOn(6, 240);
  dribble(0, 240);
  key("laptop", "opacity", [
    [0, 1, "hold"],
    [244, 1, "hold"],
    [252, 0, "ease-in"],
    [762, 0, "hold"],
    [770, 1, "ease-out"],
  ]);
  key("ball", "x", [[0, L.b2Home + 12, "hold"]]);
  key("ball", "opacity", [
    [0, 1, "hold"],
    [244, 1, "hold"],
    [252, 0, "ease-in"],
    [766, 0, "hold"],
    [772, 1, "ease-out"],
  ]);
  // The agent watches from the back and straightens his shades now and then.
  for (const f of [300, 640]) {
    pose("bond", f, SHADES, "ease-out");
    pose("bond", f + 24, CROSSED);
  }

  // PLAN 0–240: architect sketches; the plan draws, then projects onto the pad.
  for (let f = 20; f < 200; f += 30) {
    pose("arch", f, "sketch2");
    pose("arch", f + 15, "sketch");
  }
  key("sketch", "trimEnd", [
    [10, 0, "hold"],
    [190, 1, "ease-in-out"],
  ]);
  key("dim", "trimEnd", [
    [150, 0, "hold"],
    [200, 1, "emphasized-decel"],
  ]);
  pose("arch", 205, "point", "ease-out-back");
  key("beam", "trimEnd", [
    [200, 0, "hold"],
    [250, 1, "emphasized-decel"],
  ]);
  key("beam", "trimStart", [
    [250, 0, "hold"],
    [300, 1, "emphasized-accel"],
  ]);
  key("ghost", "trimEnd", [
    [245, 0, "hold"],
    [320, 1, "emphasized-decel"],
  ]);
  pose("arch", 320, "stand");

  // BUILD 240–660: crew walks over, crane lowers each part, crew guides it home.
  walk("b1", 250, 340, L.b1Home, P + 82);
  walk("b2", 262, 352, L.b2Home, P - 82);
  pose("b1", 352, "stand");
  pose("b2", 364, "stand");
  const drops = [
    ["engine", 380, -30],
    ["bodyR", 440, -126],
    ["window", 440, -126],
    ["finL", 490, -70],
    ["finR", 502, -70],
    ["nose", 560, -166],
  ];
  key("hook", "y", [[0, -30, "hold"]]);
  for (const [id, f, top] of drops) {
    const rest = REST[id] ?? 0;
    key(id, "y", [
      [0, rest + OFF, "hold"],
      [f, rest + OFF, "hold"],
      [f + 44, rest, "ease-out-back"],
    ]);
    if (id === "window") continue;
    key("hook", "y", [
      [f - 1, -30, "hold"],
      [f + 44, base + top - 6, "ease-out-back"],
      [f + 54, base + top - 6, "hold"],
      [f + 64, -30, "emphasized-accel"],
    ]);
    key("spark", "y", [[f + 43, base + top + 4, "hold"]]);
    key("spark", "scaleX", [
      [f + 43, 0, "hold"],
      [f + 48, 1.1, "ease-out"],
      [f + 60, 0, "ease-in"],
    ]);
    key("spark", "scaleY", [
      [f + 43, 0, "hold"],
      [f + 48, 1.1, "ease-out"],
      [f + 60, 0, "ease-in"],
    ]);
    for (const b of ["b1", "b2"]) {
      pose(b, f + 20, "reachUp");
      pose(b, f + 46, "press", "ease-out-back");
      pose(b, f + 58, "stand");
    }
  }
  key("ghost", "opacity", [
    [600, 0.45, "hold"],
    [640, 0, "ease-out"],
  ]);

  // CHECK 660–840: engineer runs the checklist and counts down; crew steps back.
  pose("eng", 660, "type");
  for (let f = 670; f < 760; f += 16)
    key("eng_faR", "rotation", [
      [f, -40, "ease-in-out"],
      [f + 8, -55, "ease-in-out"],
    ]);
  [680, 705, 730].forEach((f, i) =>
    key(`tick${i}`, "trimEnd", [
      [f, 0, "hold"],
      [f + 16, 1, "emphasized-decel"],
    ])
  );
  walk("b1", 700, 760, P + 82, L.b1Out);
  walk("b2", 706, 766, P - 82, P - 150);
  pose("b1", 766, LAPTOP);
  typeOn(772, 846);
  key("ball", "x", [[766, P - 150 + 12, "hold"]]);
  dribble(772, 840);
  pose("eng", 770, "point");
  [770, 800, 830].forEach((f, i) =>
    key(`count${i}`, "fillColor", [
      [0, NIGHT, "hold"],
      [f, NIGHT, "hold"],
      [f + 4, AMBER, "ease-out"],
      [1100, AMBER, "hold"],
      [1140, NIGHT, "ease-out"],
    ])
  );

  // LAUNCH 840–1020: squash, ignite, lift off, crew covers ears.
  key("rocket", "scaleY", [
    [838, 1, "hold"],
    [866, 0.9, "ease-in-out"],
    [884, 1.06, "ease-out"],
    [910, 1, "ease-out"],
  ]);
  key("rocket", "scaleX", [
    [838, 1, "hold"],
    [866, 1.07, "ease-in-out"],
    [884, 0.96, "ease-out"],
    [910, 1, "ease-out"],
  ]);
  key("flame", "scaleY", [
    [858, 0, "hold"],
    [868, 1, "ease-out-back"],
  ]);
  for (let f = 872, s = 1; f < 1010; f += 5, s = -s)
    key("flame", "scaleY", [[f, s > 0 ? 1.35 : 0.95, "ease-in-out"]]);
  key("flame", "scaleY", [
    [1012, 1.8, "ease-in"],
    [1020, 0, "hold"],
  ]);
  key("flame", "scaleX", [
    [858, 0.6, "hold"],
    [868, 1, "ease-out"],
    [1010, 1.2, "ease-in"],
  ]);
  key("rocket", "y", [
    [0, base, "hold"],
    [880, base, "hold"],
    [1010, -L.h, "emphasized-accel"],
    [1150, -L.h, "hold"],
    [1151, base, "hold"],
  ]);
  puffs.forEach((dx, i) => {
    const f = 868 + Math.abs(i - 2.5) * 6;
    key(`puff${i}`, "opacity", [
      [f, 0, "hold"],
      [f + 6, 1, "ease-out"],
      [f + 120, 0, "ease-in"],
    ]);
    key(`puff${i}`, "scaleX", [
      [f, 0.1, "hold"],
      [f + 80, 1.5 + (i % 2) * 0.4, "emphasized-decel"],
    ]);
    key(`puff${i}`, "scaleY", [
      [f, 0.1, "hold"],
      [f + 80, 1.3 + (i % 3) * 0.3, "emphasized-decel"],
    ]);
    key(`puff${i}`, "x", [
      [f, P + dx * 0.4, "hold"],
      [f + 110, P + dx * (L.puffSpread ?? 2.2), "emphasized-decel"],
    ]);
    key(`puff${i}`, "y", [
      [f, G - 10, "hold"],
      [f + 110, G - 22 - (i % 2) * 12, "emphasized-decel"],
    ]);
  });
  pose("b2", 852, "ears", "ease-out-back");
  pose("b2", 896, "ears");
  pose("b2", 912, "stand");
  // He lets go of the ball: it bounces and rolls off.
  const ballX = P - 150 + 12;
  key("ball", "y", [
    [852, G - 22, "hold"],
    [860, G - 5, "ease-in"],
    [870, G - 14, "ease-out"],
    [878, G - 5, "ease-in"],
    [884, G - 8, "ease-out"],
    [889, G - 5, "ease-in"],
  ]);
  key("ball", "x", [
    [852, ballX, "hold"],
    [920, ballX - 26, "ease-out"],
    [1190, ballX - 26, "hold"],
    [1192, L.b2Home + 12, "hold"],
  ]);
  key("ball", "rotation", [
    [0, 0, "hold"],
    [852, 0, "hold"],
    [920, -300, "ease-out"],
    [1192, 0, "hold"],
  ]);
  key("ball", "opacity", [
    [1100, 1, "hold"],
    [1130, 0, "ease-in"],
    [1670, 0, "hold"],
    [1676, 1, "ease-out"],
  ]);
  // b1 tips his head back to watch it go, laptop still in hand.
  pose("b1", 852, { ...LAPTOP, lean: -6 }, "ease-out");
  // The architect dances; three moves on a loop with a little bounce.
  const MOVES = [
    { uaL: 150, faL: 20, uaR: -60, faR: -70, thL: 16, shL: 0, thR: -4, shR: 0, lean: -6 },
    { uaL: 60, faL: 70, uaR: -150, faR: -20, thL: 4, shL: 0, thR: -16, shR: 0, lean: 6 },
    { uaL: 20, faL: -8, uaR: -160, faR: -10, thL: 12, shL: 0, thR: -12, shR: 0, lean: 8 },
  ];
  for (let f = 852, i = 0; f < 1060; f += 20, i++) {
    pose("arch", f, MOVES[i % 3], "ease-out-back");
    key("arch_body", "y", [
      [f, 0, "ease-in-out"],
      [f + 8, -4, "ease-out"],
      [f + 16, 0, "ease-in"],
    ]);
  }
  pose("arch", 1076, "stand");
  // The engineer grabs his popcorn and munches through the launch.
  key("popcorn", "opacity", [
    [846, 0, "hold"],
    [852, 1, "ease-out"],
    [1058, 1, "hold"],
    [1066, 0, "ease-in"],
  ]);
  key("popInHand", "opacity", [
    [860, 0, "hold"],
    [864, 1, "hold"],
    [1056, 1, "hold"],
    [1058, 0, "hold"],
  ]);
  pose("eng", 852, POP_DIP, "ease-out");
  for (let f = 868; f < 1050; f += 26) {
    pose("eng", f, POP_EAT, "ease-in-out");
    pose("eng", f + 13, POP_DIP, "ease-in-out");
  }

  // LAND 1020–1200: shockwave flutters the papers, crew celebrates, walks home.
  [0, 1, 2].forEach((i) => {
    const r = [-6, 5, 8][i],
      f = 1000 + i * 6;
    key(`paper${i}`, "rotation", [
      [f, r, "hold"],
      [f + 12, r * 5, "ease-out"],
      [f + 40, r * 2, "ease-in-out"],
      [f + 70, r, "ease-out-back"],
    ]);
  });
  key("sketch", "trimEnd", [
    [1110, 1, "hold"],
    [1150, 0, "ease-in"],
  ]);
  key("dim", "trimEnd", [
    [1110, 1, "hold"],
    [1140, 0, "ease-in"],
  ]);
  [0, 1, 2].forEach((i) =>
    key(`tick${i}`, "trimEnd", [
      [1100, 1, "hold"],
      [1130, 0, "ease-in"],
    ])
  );
  key("ghost", "trimEnd", [
    [1150, 1, "hold"],
    [1151, 0, "hold"],
  ]);
  key("ghost", "opacity", [[1151, 0.45, "hold"]]);
  pose("eng", 1060, "stand");

  // The blast knocks the big guy flat: anticipation lean, fall, bounce, settle.
  // Hold each pose until the launch reaction, so arms don't drift for 14 seconds.
  for (const id of ["fat", "b2", "arch"]) pose(id, 840, "stand");
  pose("b1", 840, LAPTOP);
  pose("eng", 840, "point");
  pose("fat", 852, "ears", "ease-out-back");
  pose("fat", 884, "cheer", "ease-out");
  key("fat", "rotation", [
    [0, 0, "hold"],
    [880, 0, "hold"],
    [886, -8 * d, "ease-out"],
    [902, 96 * d, "ease-in"],
    [909, 82 * d, "ease-out"],
    [915, 90 * d, "ease-in-out"],
  ]);
  pose(
    "fat",
    904,
    { uaL: 170, faL: 10, uaR: -170, faR: -10, thL: 30, shL: -40, thR: -30, shR: 40, lean: 0 },
    "ease-out-back"
  );
  // The basketball guy runs over, grabs his hands, and hauls him clear in tugs.
  walk("b2", 912, 985, P - 150, grab);
  const haul = {
    uaL: 75 * d,
    faL: 25 * d,
    uaR: 70 * d,
    faR: 20 * d,
    thL: -14 * d,
    shL: 10 * d,
    thR: 18 * d,
    shR: -8 * d,
    lean: 16 * d,
  };
  pose("b2", 992, haul, "ease-out-back");
  for (let i = 0; i < 5; i++) {
    const f = 1005 + i * 19,
      step = (DRAG / 5) * (i + 1) * d;
    for (const [id, x0] of [
      ["b2", grab],
      ["fat", FH],
    ]) {
      const lag = id === "fat" ? 3 : 0;
      key(id, "x", [
        [f + lag, x0 + step - (DRAG / 5) * d, "hold"],
        [f + lag + 10, x0 + step, "ease-out"],
      ]);
    }
    key("b2_body", "rotation", [
      [f, 16 * d, "ease-in-out"],
      [f + 5, 26 * d, "ease-out"],
      [f + 14, 16 * d, "ease-in-out"],
    ]);
    key("b2_thL", "rotation", [[f + 8, (i % 2 ? -14 : 8) * d, "ease-in-out"]]);
    key("fat_thL", "rotation", [[f + 6, i % 2 ? 50 : 20, "ease-in-out"]]);
    key("fat_thR", "rotation", [[f + 6, i % 2 ? -20 : -50, "ease-in-out"]]);
  }
  // Crew straightens up; he pops back on his feet and waddles home.
  pose("b2", 1110, "stand");

  // The getaway: the agent strolls off, pulls up in his car, b1 hops in, they drive off,
  // then both stroll back in before the loop restarts.
  walk("bond", 882, 950, L.bond, L.w + 40);
  key("car", "x", [
    [0, CAR_OFF, "hold"],
    [990, CAR_OFF, "hold"],
    [1040, CAR_STOP, "ease-out"],
    [1072, CAR_STOP, "hold"],
    [1118, CAR_OFF, "ease-in"],
  ]);
  key("car", "y", [
    [1040, G, "hold"],
    [1044, G + 1.5, "ease-out"],
    [1050, G, "ease-in-out"],
  ]);
  key("car", "scaleX", [
    [0, CAR_S, "hold"],
    [1068, CAR_S, "hold"],
    [1070, -CAR_S, "hold"],
    [1119, CAR_S, "hold"],
  ]);
  key("carLines", "opacity", [
    [0, 0, "hold"],
    [990, 1, "hold"],
    [1032, 1, "hold"],
    [1040, 0, "ease-out"],
    [1074, 0, "hold"],
    [1080, 1, "ease-in"],
    [1118, 1, "hold"],
    [1119, 0, "hold"],
  ]);
  for (const w of ["wheelF", "wheelR"])
    key(w, "rotation", [
      [990, 0, "hold"],
      [1040, -900, "ease-out"],
      [1072, -900, "hold"],
      [1118, -1800, "ease-in"],
      [1119, 0, "hold"],
    ]);
  key("carPassenger", "opacity", [
    [0, 0, "hold"],
    [1060, 0, "hold"],
    [1062, 1, "hold"],
    [1119, 0, "hold"],
  ]);
  key("carPassengerEyes", "opacity", [
    [0, 0, "hold"],
    [1060, 0, "hold"],
    [1062, 1, "hold"],
    [1119, 0, "hold"],
  ]);
  walk("b1", 1044, 1058, L.b1Out, CAR_STOP - 8, { arms: false });
  key("b1", "opacity", [
    [0, 1, "hold"],
    [1060, 1, "hold"],
    [1062, 0, "hold"],
    [1138, 0, "hold"],
    [1140, 1, "hold"],
  ]);
  walk("b1", 1140, 1194, L.w + 30, L.b1Out, { arms: false });
  walk("bond", 1146, 1196, L.w + 40, L.bond);
  key("fat", "rotation", [
    [1115, 90 * d, "hold"],
    [1138, -8 * d, "ease-out-back"],
    [1150, 0, "ease-in-out"],
  ]);
  pose("fat", 1120, "stand");
  walk("fat", 1150, 1196, FH + d * DRAG, FH);
  pose("arch", 1150, "sketch");
  key("fat", "rotation", [[LOOP, 0, "hold"]]);

  // ================= LOGO 1200–1680: five of the crew become "Sudo Sapient." =================
  // [glyph, advance width, the crew member who becomes it]
  const WORD = [
    ["S", 22, "b2"],
    ["u", 20],
    ["d", 20, "arch"],
    ["o", 21, "fat"],
    [" ", 12],
    ["S", 22, "b1"],
    ["a", 19],
    ["p", 20],
    ["i", 10, "eng"],
    ["e", 20],
    ["n", 20],
    ["t", 13],
    [".", 8],
  ];
  const HOME_AT = {
    arch: [D - 66, U],
    b2: [L.b2Home, G],
    fat: [FH, G],
    b1: [L.b1Out, G],
    eng: [C - 58, U],
  };
  const T = 1200,
    LS = L.letterScale, // letter scale while standing in for a figure (about figure height)
    WM = L.wm; // where the wordmark sits: { x, y, s }
  const total = WORD.reduce((a, [, w]) => a + w, 0);
  let cursor = -total / 2;
  const letters = [];
  WORD.forEach(([ch, adv, who], n) => {
    const cx = cursor + adv / 2;
    cursor += adv;
    if (ch === " ") return;
    const id = `L${n}`;
    const at = { x: WM.x + cx * WM.s, y: WM.y };
    const from = who ? { x: HOME_AT[who][0], y: HOME_AT[who][1] } : at;
    group(id, from.x, from.y, {
      scaleX: who ? 0 : WM.s,
      scaleY: who ? LS : WM.s,
      opacity: who ? 1 : 0,
    });
    const parts = [];
    GLYPHS[ch].forEach((g, k) => {
      const sid = `${id}_${k}`;
      const stroke = { ...ink(3.2), trim: { start: 0, end: who ? 1 : 0 } };
      if (g.pts)
        shapes.push({
          id: sid,
          type: "polygon",
          x: 0,
          y: 0,
          closed: false,
          points: g.pts,
          parent: id,
          stroke,
        });
      else if (g.ell) {
        const [x, y, w, h] = g.ell;
        shapes.push({ id: sid, type: "ellipse", x, y, width: w, height: h, parent: id, stroke });
      } else {
        const [x, y, r, color] = g.dot;
        shapes.push({
          id: sid,
          type: "ellipse",
          x,
          y,
          width: r,
          height: r,
          parent: id,
          fill: { color },
        });
      }
      parts.push({ sid, trims: !g.dot });
    });
    letters.push({ id, ch, who, from, at, parts });
  });
  // A ring of light where each figure flips.
  for (const who of Object.keys(HOME_AT)) {
    const [x, y] = HOME_AT[who];
    group(`flash_${who}`, x, y - 30, { scaleX: 0.2, scaleY: 0.2, opacity: 0 });
    shapes.push({
      id: `flashRing_${who}`,
      type: "ellipse",
      x: 0,
      y: 0,
      width: 30,
      height: 30,
      parent: `flash_${who}`,
      stroke: { ...ink(2), color: AMBER },
    });
  }
  const flash = (who, f) => {
    key(`flash_${who}`, "opacity", [
      [f, 1, "hold"],
      [f + 20, 0, "ease-out"],
    ]);
    for (const p of ["scaleX", "scaleY"])
      key(`flash_${who}`, p, [
        [f, 0.2, "hold"],
        [f + 20, 2.2, "ease-out"],
      ]);
  };
  const STRAIGHT = { uaL: 6, faL: 0, uaR: -6, faR: 0, thL: 3, shL: 0, thR: -3, shR: 0, lean: 0 };
  const BASE = { arch: "sketch", b2: DRIBBLE_UP, fat: "stand", b1: LAPTOP, eng: "stand" };
  // Settle the walkers who arrive home just before the reveal, so no one stands mid-stride.
  pose("fat", 1204, "stand", "ease-out");
  pose("b1", 1200, LAPTOP, "ease-out");
  pose("bond", 1204, CROSSED, "ease-out");
  let order = 0;
  for (const Lt of letters) {
    if (Lt.who) {
      const s = order++ * 8,
        fig = Lt.who;
      // Hop, snap straight, then flip edge-on into the letter.
      const tj = T + 10 + s,
        tf = tj + 16;
      key(`${fig}_body`, "y", [
        [tj, 0, "hold"],
        [tj + 8, -10, "ease-out"],
        [tj + 16, 0, "ease-in"],
      ]);
      pose(fig, tj + 8, STRAIGHT, "ease-out");
      key(fig, "scaleX", [
        [tf, 1, "hold"],
        [tf + 10, 0, "ease-in"],
      ]);
      key(fig, "scaleY", [
        [tf, 1, "hold"],
        [tf + 10, 1.2, "ease-in"],
      ]);
      key(Lt.id, "scaleX", [
        [tf + 8, 0, "hold"],
        [tf + 22, LS, "ease-out-back"],
      ]);
      flash(fig, tf + 8);
      // Fly up into the wordmark, arcing (y leads x).
      const tl = T + 90 + s / 2;
      key(Lt.id, "x", [
        [tl, Lt.from.x, "hold"],
        [tl + 50, Lt.at.x, "ease-in-out"],
      ]);
      key(Lt.id, "y", [
        [tl, Lt.from.y, "hold"],
        [tl + 50, Lt.at.y, "emphasized-decel"],
      ]);
      for (const p of ["scaleX", "scaleY"])
        key(Lt.id, p, [
          [tl, LS, "hold"],
          [tl + 50, WM.s, "ease-in-out"],
        ]);
      // Fly home, flip back into the figure.
      const tb = T + 318 + s / 2,
        tr = tb + 46;
      key(Lt.id, "x", [
        [tb, Lt.at.x, "hold"],
        [tb + 44, Lt.from.x, "ease-in-out"],
      ]);
      key(Lt.id, "y", [
        [tb, Lt.at.y, "hold"],
        [tb + 44, Lt.from.y, "emphasized-accel"],
      ]);
      key(Lt.id, "scaleY", [
        [tb, WM.s, "hold"],
        [tb + 44, LS, "ease-in-out"],
      ]);
      key(Lt.id, "scaleX", [
        [tb, WM.s, "hold"],
        [tb + 44, LS, "ease-in-out"],
        [tr, LS, "hold"],
        [tr + 10, 0, "ease-in"],
      ]);
      key(fig, "scaleX", [
        [tr + 8, 0, "hold"],
        [tr + 22, 1, "ease-out-back"],
      ]);
      key(fig, "scaleY", [
        [tr + 8, 1.2, "hold"],
        [tr + 22, 1, "ease-out"],
      ]);
      flash(fig, tr + 8);
      pose(fig, tr + 22, BASE[fig], "ease-out");
    }
  }
  // The rest of the name writes itself in, left to right.
  const SHOT = T + 272, // the trigger
    HIT = SHOT + 7; // the bullet reaches the full stop
  letters
    .filter((Lt) => !Lt.who)
    .forEach((Lt, j) => {
      const t = T + 150 + j * 7;
      if (Lt.ch === ".") {
        // The target: it pops in, then bursts when hit.
        for (const p of ["scaleX", "scaleY"])
          key(Lt.id, p, [
            [t, 0, "hold"],
            [t + 14, WM.s, "ease-out-back"],
            [HIT, WM.s, "hold"],
            [HIT + 12, WM.s * 2.6, "ease-out"],
          ]);
        key(Lt.id, "opacity", [
          [t, 0, "hold"],
          [t + 1, 1, "hold"],
          [HIT, 1, "hold"],
          [HIT + 12, 0, "ease-out"],
        ]);
        return;
      }
      // After the hit the letters drop and fade, staggered from the right.
      const fall = HIT + 10 + (8 - j) * 3;
      key(Lt.id, "opacity", [
        [t, 0, "hold"],
        [t + 1, 1, "hold"],
        [fall, 1, "hold"],
        [fall + 18, 0, "ease-in"],
      ]);
      key(Lt.id, "y", [
        [fall, Lt.at.y, "hold"],
        [fall + 18, Lt.at.y + 40, "ease-in"],
        [fall + 19, Lt.at.y, "hold"],
      ]);
      for (const { sid, trims } of Lt.parts)
        if (trims)
          key(sid, "trimEnd", [
            [t, 0, "hold"],
            [t + 18, 1, "ease-out"],
            [fall + 19, 1, "hold"],
            [fall + 20, 0, "hold"],
          ]);
    });
  // Every letter jolts when the shot lands.
  letters.forEach((Lt, n) => {
    const w = n % 2 ? 1 : -1;
    key(Lt.id, "rotation", [
      [0, 0, "hold"],
      [HIT, 0, "hold"],
      [HIT + 5, 9 * w, "ease-out"],
      [HIT + 12, -5 * w, "ease-in-out"],
      [HIT + 20, 0, "ease-out"],
    ]);
  });
  // The agent applauds, then draws, aims at the full stop and fires.
  const dot = letters.find((Lt) => Lt.ch === ".");
  const target = { x: dot.at.x, y: dot.at.y - 2.5 * WM.s };
  const sh = { x: L.bond - 2, y: G - 42 }; // his left shoulder
  const aim = (Math.atan2(-(target.x - sh.x), target.y - sh.y) * 180) / Math.PI;
  const tip = {
    x: sh.x - Math.sin((aim * Math.PI) / 180) * 36,
    y: sh.y + Math.cos((aim * Math.PI) / 180) * 36,
  };
  pose("bond", T + 170, "cheer", "ease-out-back");
  pose("bond", T + 215, CROSSED);
  const AIM = { ...CROSSED, uaL: 0, faL: 0, lean: -4 };
  pose("bond", T + 245, AIM, "ease-out");
  key("bond_uaL", "rotation", [[T + 245, aim, "ease-out"]]); // past pose()'s 145° limit
  key("gun", "opacity", [
    [0, 0, "hold"],
    [T + 240, 0, "hold"],
    [T + 246, 1, "ease-out"],
    [T + 300, 1, "hold"],
    [T + 306, 0, "ease-in"],
  ]);
  // Recoil, flash, tracer.
  key("bond_uaL", "rotation", [
    [SHOT, aim, "hold"],
    [SHOT + 4, aim - 14, "ease-out"],
    [SHOT + 14, aim, "ease-in-out"],
  ]);
  for (const p of ["scaleX", "scaleY"])
    key("muzzle", p, [
      [SHOT, 0, "hold"],
      [SHOT + 2, 1.4, "ease-out"],
      [SHOT + 9, 0, "ease-in"],
    ]);
  line("tracer", [tip, target], {
    stroke: { ...ink(1.8), color: AMBER, trim: { start: 0, end: 0 } },
    z: 7000,
  });
  key("tracer", "trimEnd", [
    [SHOT, 0, "hold"],
    [HIT, 1, "linear"],
  ]);
  key("tracer", "trimStart", [
    [SHOT, 0, "hold"],
    [HIT + 4, 1, "ease-in"],
    [HIT + 5, 0, "hold"],
  ]);
  key("tracer", "trimEnd", [[HIT + 5, 0, "hold"]]);
  pose("bond", T + 300, CROSSED, "ease-in-out");
  shapes.forEach((sh) => {
    if (/^(L\d+|flash_)/.test(sh.parent ?? "")) sh.z = 6000 + shapes.indexOf(sh);
  });

  // Back to the opening poses so the loop joins up. Keyed last: each pose holds the joint's
  // latest earlier key, so everything before has to exist already.
  pose("arch", LOOP, "sketch");
  pose("fat", LOOP, "stand");
  pose("eng", LOOP, "stand");
  pose("b1", LOOP, LAPTOP);
  pose("b2", LOOP, DRIBBLE_UP);
  pose("bond", LOOP, CROSSED);

  // Parts return to the crane while the rocket is out of frame.
  for (const [id] of drops) {
    const rest = REST[id] ?? 0;
    key(id, "y", [
      [1140, rest, "hold"],
      [1141, rest + OFF, "hold"],
    ]);
  }

  return {
    name: L.name,
    width: L.w,
    height: L.h,
    groups,
    shapes,
    animations: [{ name: "launch", fps: FPS, duration: LOOP, loop: "loop", tracks: tracksOut() }],
    stateMachine: {
      name: "Launch",
      inputs: [],
      states: [{ name: "loop", animation: "launch" }],
      transitions: [{ from: "entry", to: "loop" }],
    },
  };
}

const desktop = scene({
  name: "Desktop",
  w: 1280,
  h: 320,
  ground: 296,
  desk: 200,
  pad: 640,
  console: 1080,
  fatHome: 450,
  fallDir: -1,
  drag: 80,
  b1Out: 810,
  bond: 935,
  carScale: 1.3,
  wm: { x: 640, y: 110, s: 2.4 },
  letterScale: 1.9,
});
const mobile = scene({
  name: "Mobile",
  w: 390,
  h: 520,
  ground: 492,
  upper: 290,
  shelfL: 150,
  shelfR: 258,
  desk: 92,
  pad: 205,
  console: 322,
  fatHome: 100,
  fallDir: 1,
  drag: 46,
  b1Out: 300,
  bond: 366,
  carScale: 0.95,
  wm: { x: 195, y: 95, s: 1.45 },
  letterScale: 1.5, // smaller, so the d at the far-left edge stays on screen
  puffSpread: 1.3,
});

const { bytes, warnings } = createRiv({ artboards: [desktop, mobile] });
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/footer.riv", bytes);
console.log(`public/rive/footer.riv ${(bytes.length / 1024).toFixed(1)} KB`);
