// Builds public/rive/footer.riv — the footer "plan → build → launch" loop.
// Run: npm run rive:footer. Spec: docs/RIVE.md §2.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE, DEEP, NIGHT } from "./kit.mjs";

const FPS = 60;
const LOOP = 1200; // 20s

function scene(L) {
  const G = L.ground;
  // The big guy gets knocked over by the launch; two builders drag him clear.
  const FH = L.fatHome,
    d = L.fallDir,
    DRAG = L.drag;
  const head = FH + d * 66; // where his head lands
  const front = d < 0 ? "b2" : "b1",
    rear = d < 0 ? "b1" : "b2";
  const grab = { [front]: head + d * 14, [rear]: head + d * 28 };
  const home = { [front]: grab[front] + d * DRAG, [rear]: grab[rear] + d * DRAG };
  L = { ...L, b1Home: home.b1, b2Home: home.b2 };
  const U = L.upper ?? G; // shelf level for the plan board and console (mobile stacks them above the pad)
  const { shapes, groups, ink, group, line, key, figure, pose, walk, tracksOut } = makeKit(G);

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

  // ================= choreography =================
  for (const id of ["arch", "fat", "b1", "b2", "eng"])
    pose(id, 0, id === "arch" ? "sketch" : "stand");

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
  walk("b1", 250, 340, L.b1Home, P - 82);
  walk("b2", 262, 352, L.b2Home, P + 82);
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
  walk("b1", 700, 760, P - 82, P - 150);
  walk("b2", 706, 766, P + 82, P + 150);
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
  for (const id of ["b1", "b2", "arch", "eng"]) {
    pose(id, 852, "ears", "ease-out-back");
    pose(id, 896, "ears");
    pose(id, 912, "stand");
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
  pose("eng", 975, "cheer", "ease-out-back");
  pose("eng", 1060, "stand");

  // The blast knocks the big guy flat: anticipation lean, fall, bounce, settle.
  // Hold each pose until the launch reaction, so arms don't drift for 14 seconds.
  for (const id of ["fat", "b1", "b2", "arch"]) pose(id, 840, "stand");
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
  // Two builders run over, grab his hands, and haul him clear in tugs.
  walk(front, 912, 985, d < 0 ? P + 150 : P - 150, grab[front]);
  walk(rear, 925, 985, d < 0 ? P - 150 : P + 150, grab[rear]);
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
  pose(front, 992, haul, "ease-out-back");
  pose(rear, 995, haul, "ease-out-back");
  for (let i = 0; i < 5; i++) {
    const f = 1005 + i * 19,
      step = (DRAG / 5) * (i + 1) * d;
    for (const [id, x0] of [
      [front, grab[front]],
      [rear, grab[rear]],
      ["fat", FH],
    ]) {
      const lag = id === "fat" ? 3 : 0;
      key(id, "x", [
        [f + lag, x0 + step - (DRAG / 5) * d, "hold"],
        [f + lag + 10, x0 + step, "ease-out"],
      ]);
    }
    for (const id of [front, rear]) {
      key(`${id}_body`, "rotation", [
        [f, 16 * d, "ease-in-out"],
        [f + 5, 26 * d, "ease-out"],
        [f + 14, 16 * d, "ease-in-out"],
      ]);
      key(`${id}_thL`, "rotation", [[f + 8, (i % 2 ? -14 : 8) * d, "ease-in-out"]]);
    }
    key("fat_thL", "rotation", [[f + 6, i % 2 ? 50 : 20, "ease-in-out"]]);
    key("fat_thR", "rotation", [[f + 6, i % 2 ? -20 : -50, "ease-in-out"]]);
  }
  // Crew straightens up; he pops back on his feet and waddles home.
  pose(front, 1110, "stand");
  pose(rear, 1112, "stand");
  key("fat", "rotation", [
    [1115, 90 * d, "hold"],
    [1138, -8 * d, "ease-out-back"],
    [1150, 0, "ease-in-out"],
  ]);
  pose("fat", 1120, "stand");
  walk("fat", 1150, 1196, FH + d * DRAG, FH);
  pose("arch", 1150, "sketch");
  for (const id of ["arch", "fat", "b1", "b2", "eng"])
    pose(id, LOOP, id === "arch" ? "sketch" : "stand");
  key("fat", "rotation", [[LOOP, 0, "hold"]]);

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
  puffSpread: 1.3,
});

const { bytes, warnings } = createRiv({ artboards: [desktop, mobile] });
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/footer.riv", bytes);
console.log(`public/rive/footer.riv ${(bytes.length / 1024).toFixed(1)} KB`);
