// Builds public/rive/transform.riv — "How we make your company AI-native".
// One looping timeline that autoplays while in view (frames @60fps):
//   Chaos 0–240 · We walk in and code 240–480 · It clicks 480–720 · Runs on its own 720–1050
// The page highlights the matching stage card every 4s. Run: npm run rive:transform.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE, DEEP, NIGHT, WHITE } from "./kit.mjs";

const FPS = 60;
const STORY = 960;
const END = STORY + 90; // hold the calm office for 1.5s before looping
const MUTED = "#9AA9DB";
const LABELS = ["OPERATIONS", "PRODUCT", "CONTENT"];

function scene(L) {
  const k = makeKit(L.desks[0].g);
  const { shapes, ink, group, line, key, figure, pose, reach, walk } = k;
  const texts = [];
  const D = L.desks;
  const M = { x: L.mx, g: D[0].g }; // machine and laptop sit on the first floor

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
  const relax = (id) => ({
    ...SIT,
    ...reach(id, "L", -7, -60),
    ...reach(id, "R", 7, -60),
    thR: -70,
    shR: 60,
    lean: -12,
  });
  const TYPE_A = { ...SIT, faL: -5, faR: -45 };
  const TYPE_B = { ...SIT, faL: -35, faR: -15 };
  const HAMMER_UP = {
    uaL: -40,
    faL: -50,
    uaR: -145,
    faR: -20,
    thL: 10,
    shL: -10,
    thR: -10,
    shR: 10,
    lean: 6,
  };
  const HAMMER_DOWN = { ...HAMMER_UP, uaR: -95, faR: -10, lean: 10 };
  const BUMP = { uaL: 12, faL: -6, uaR: -90, faR: 0, thL: 4, shL: 0, thR: -4, shR: 0, lean: 4 };
  const BUMP_L = { uaL: 90, faL: 0, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: -4 };

  // ---- floors ----
  for (const g of [...new Set(D.map((d) => d.g))])
    line(
      `floor${g}`,
      [
        { x: 0, y: g },
        { x: L.w, y: g },
      ],
      { stroke: ink(1.2), opacity: 0.25 }
    );

  // ---- desks: label, desk, monitor, paper pile, chair, employee, alarm bubble ----
  D.forEach((d, i) => {
    const x = d.x,
      g = d.g;
    texts.push({
      id: `label${i}`,
      x: x - 40,
      y: g - 146,
      width: 160,
      align: "center",
      runs: [{ text: LABELS[i], fontSize: 12, color: MUTED }],
    });
    line(`desk${i}`, [
      { x: x + 4, y: g },
      { x: x + 4, y: g - 34 },
      { x: x + 80, y: g - 34 },
      { x: x + 80, y: g },
    ]);
    line(`deskTop${i}`, [
      { x: x - 2, y: g - 34 },
      { x: x + 84, y: g - 34 },
    ]);
    shapes.push({
      id: `mon${i}`,
      type: "rect",
      x: x + 58,
      y: g - 50,
      width: 34,
      height: 22,
      stroke: ink(),
      fill: { color: DEEP },
    });
    shapes.push({
      id: `glow${i}`,
      type: "rect",
      x: x + 58,
      y: g - 50,
      width: 26,
      height: 14,
      opacity: 0,
      fill: { color: AMBER },
    });
    line(`stand${i}`, [
      { x: x + 58, y: g - 39 },
      { x: x + 58, y: g - 34 },
    ]);
    group(`pile${i}`, x + 24, g - 34, { scaleY: 1.5 });
    for (let s = 0; s < 5; s++)
      shapes.push({
        id: `sheet${i}_${s}`,
        type: "rect",
        x: (s % 2) * 2 - 1,
        y: -3 - s * 5,
        width: 20,
        height: 4,
        parent: `pile${i}`,
        stroke: ink(1.4),
        fill: { color: NIGHT },
      });
    line(
      `chair${i}`,
      [
        { x: x - 22, y: g - 34 },
        { x: x - 22, y: g - 15 },
        { x: x - 6, y: g - 15 },
        { x: x - 6, y: g },
      ],
      { stroke: ink(1.8) }
    );
    figure(`emp${i}`, x - 14, { y: g, glasses: i === 1, fat: i === 2 });
    // Alarm bubble ("!") that flips to a tick once their work is automated.
    const head = i === 2 ? -58 : -55;
    group(`alarm${i}`, 0, head - 20, { parent: `emp${i}_body`, scaleX: 0, scaleY: 0 });
    shapes.push({
      id: `alarmBg${i}`,
      type: "ellipse",
      x: 0,
      y: 0,
      width: 13,
      height: 13,
      parent: `alarm${i}`,
      fill: { color: AMBER },
    });
    line(
      `alarmBar${i}`,
      [
        { x: 0, y: -3.5 },
        { x: 0, y: 1 },
      ],
      { parent: `alarm${i}`, stroke: { color: NIGHT, thickness: 2, cap: "round" } }
    );
    shapes.push({
      id: `alarmDot${i}`,
      type: "ellipse",
      x: 0,
      y: 3.6,
      width: 2,
      height: 2,
      parent: `alarm${i}`,
      fill: { color: NIGHT },
    });
    group(`tick${i}`, 0, head - 20, { parent: `emp${i}_body`, scaleX: 0, scaleY: 0 });
    shapes.push({
      id: `tickBg${i}`,
      type: "ellipse",
      x: 0,
      y: 0,
      width: 13,
      height: 13,
      parent: `tick${i}`,
      stroke: { ...ink(1.4), color: AMBER },
      fill: { color: NIGHT },
    });
    line(
      `tickMark${i}`,
      [
        { x: -3, y: 0 },
        { x: -1, y: 2.5 },
        { x: 3.5, y: -2.5 },
      ],
      { parent: `tick${i}`, stroke: { color: AMBER, thickness: 1.8, cap: "round", join: "round" } }
    );
  });

  // ---- the system: laptop station, machine, pipes ----
  const LX = L.lapX,
    G0 = M.g;
  line("lapTable", [
    { x: LX - 18, y: G0 },
    { x: LX - 18, y: G0 - 28 },
    { x: LX + 22, y: G0 - 28 },
    { x: LX + 22, y: G0 },
  ]);
  line(
    "lapStool",
    [
      { x: LX - 44, y: G0 - 15 },
      { x: LX - 30, y: G0 - 15 },
      { x: LX - 37, y: G0 - 15 },
      { x: LX - 37, y: G0 },
    ],
    { stroke: ink(1.8) }
  );
  line(
    "lapBase",
    [
      { x: LX - 10, y: G0 - 29 },
      { x: LX + 14, y: G0 - 29 },
    ],
    { stroke: ink(2) }
  );
  group("lapLid", LX + 14, G0 - 29, { scaleY: 0 });
  shapes.push({
    id: "lapScreen",
    type: "rect",
    x: -1,
    y: -11,
    width: 22,
    height: 20,
    parent: "lapLid",
    rotation: -8,
    stroke: ink(1.8),
    fill: { color: DEEP },
  });
  for (let c = 0; c < 4; c++)
    line(
      `code${c}`,
      [
        { x: -8 + (c % 2) * 3, y: -17 + c * 4 },
        { x: -8 + (c % 2) * 3 + [10, 7, 12, 6][c], y: -17 + c * 4 },
      ],
      {
        parent: "lapLid",
        stroke: {
          color: c === 2 ? AMBER : WHITE,
          thickness: 1.4,
          cap: "round",
          trim: { start: 0, end: 0 },
        },
      }
    );

  group("machine", M.x, M.g, { scaleX: 0, scaleY: 0 });
  shapes.push({
    id: "mBox",
    type: "rect",
    x: 0,
    y: -26,
    width: 60,
    height: 50,
    parent: "machine",
    cornerRadius: 3,
    stroke: ink(),
    fill: {
      gradient: {
        type: "linear",
        stops: [{ color: BLUE }, { color: DEEP }],
        start: { x: -30, y: 0 },
        end: { x: 30, y: 0 },
      },
    },
  });
  group("gear", 0, -26, { parent: "machine" });
  shapes.push({
    id: "gearRim",
    type: "ellipse",
    x: 0,
    y: 0,
    width: 26,
    height: 26,
    parent: "gear",
    stroke: { ...ink(2), color: AMBER },
  });
  for (const a of [0, 60, 120]) {
    const r = (a * Math.PI) / 180;
    line(
      `spoke${a}`,
      [
        { x: -Math.cos(r) * 13, y: -Math.sin(r) * 13 },
        { x: Math.cos(r) * 13, y: Math.sin(r) * 13 },
      ],
      { parent: "gear", stroke: { ...ink(1.6), color: AMBER } }
    );
  }
  line(
    "chute",
    [
      { x: -30, y: -44 },
      { x: -44, y: -58 },
    ],
    { parent: "machine" }
  );
  line(
    "tray",
    [
      { x: 30, y: -6 },
      { x: 52, y: -6 },
      { x: 52, y: 0 },
    ],
    { parent: "machine" }
  );
  L.pipes.forEach((pts, i) => {
    line(`pipe${i}`, pts, { stroke: { ...ink(2), trim: { start: 0, end: 0 } } });
    line(`pulse${i}`, pts, { stroke: { ...ink(3), color: AMBER, trim: { start: 0, end: 0 } } });
  });

  // ---- Sudo Sapient: two devs in amber glasses ----
  figure("dev1", -40, { glasses: true });
  figure("dev2", -60, { glasses: true });

  // ================= CHAOS 0–520 =================
  // Employees up and pacing, arms flailing; resolved one by one from 520.
  const sitAt = [560, 600, 640]; // when each walks back to their chair
  D.forEach((d, i) => {
    const id = `emp${i}`,
      home = d.x - 14,
      far = d.x + 96 - i * 6;
    pose(id, 0, STAND);
    let f = i * 9,
      x = home,
      out = true;
    while (f + 46 < sitAt[i] - 50) {
      const to = out ? far : home;
      walk(id, f, f + 46, x, to);
      // Panic: arms up and flapping instead of the normal walk swing.
      for (let t = f + 6; t < f + 46; t += 12) {
        key(`${id}_uaL`, "rotation", [[t, t % 24 < 12 ? 140 : 95, "ease-in-out"]]);
        key(`${id}_uaR`, "rotation", [[t, t % 24 < 12 ? -95 : -140, "ease-in-out"]]);
        key(`${id}_faL`, "rotation", [[t, 40, "ease-in-out"]]);
        key(`${id}_faR`, "rotation", [[t, -40, "ease-in-out"]]);
      }
      x = to;
      out = !out;
      f += 52;
    }
    walk(id, sitAt[i] - 48, sitAt[i], x, home);
    pose(id, sitAt[i], STAND);
    key(`${id}_body`, "y", [
      [sitAt[i], 0, "hold"],
      [sitAt[i] + 14, 12, "ease-out"],
    ]);
    pose(id, sitAt[i] + 14, SIT, "ease-out");
    for (let t = sitAt[i] + 20; t < 720; t += 16) {
      pose(id, t, TYPE_A);
      pose(id, t + 8, TYPE_B);
    }
    pose(id, 720 + i * 20, SIT);
    pose(id, 740 + i * 20, relax(id), "ease-out-back");
    pose(id, END, relax(id));
    key(`${id}_body`, "y", [[END, 12, "hold"]]);

    // Alarm pops repeatedly over their head, then becomes a tick.
    for (let t = 20 + i * 23; t < sitAt[i] - 40; t += 70) {
      key(`alarm${i}`, "scaleX", [
        [t, 0, "hold"],
        [t + 8, 1.15, "ease-out-back"],
        [t + 40, 1, "ease-in-out"],
        [t + 52, 0, "ease-in"],
      ]);
      key(`alarm${i}`, "scaleY", [
        [t, 0, "hold"],
        [t + 8, 1.15, "ease-out-back"],
        [t + 40, 1, "ease-in-out"],
        [t + 52, 0, "ease-in"],
      ]);
    }
    const ok = sitAt[i] - 30;
    for (const p of ["scaleX", "scaleY"])
      key(`tick${i}`, p, [
        [0, 0, "hold"],
        [ok, 0, "hold"],
        [ok + 10, 1.2, "ease-out-back"],
        [ok + 18, 1, "ease-out"],
        [ok + 90, 1, "hold"],
        [ok + 104, 0, "ease-in"],
      ]);

    // Papers fountain off the pile until their pipe connects.
    for (let s = 0; s < 3; s++) {
      const sid = `fly${i}_${s}`;
      shapes.push({
        id: sid,
        type: "rect",
        x: d.x + 24,
        y: d.g - 60,
        width: 12,
        height: 3,
        opacity: 0,
        stroke: ink(1.2),
        fill: { color: NIGHT },
      });
      for (let t = s * 26 + i * 11; t < sitAt[i] - 60; t += 78) {
        const dx = (s - 1) * 26 + 8;
        key(sid, "opacity", [
          [t, 1, "hold"],
          [t + 50, 1, "hold"],
          [t + 54, 0, "ease-in"],
        ]);
        key(sid, "x", [
          [t, d.x + 24, "hold"],
          [t + 54, d.x + 24 + dx, "linear"],
        ]);
        key(sid, "y", [
          [t, d.g - 60, "hold"],
          [t + 20, d.g - 92, "ease-out"],
          [t + 54, d.g - 4, "ease-in"],
        ]);
        key(sid, "rotation", [
          [t, 0, "hold"],
          [t + 54, (s - 1) * 200 + 90, "linear"],
        ]);
      }
      key(sid, "opacity", [[0, 0, "hold"]]);
    }
    // Monitors flicker in the chaos, then hold a steady glow.
    for (let t = 6 + i * 5; t < sitAt[i] - 40; t += 18)
      key(`glow${i}`, "opacity", [
        [t, 0.7, "hold"],
        [t + 6, 0.1, "hold"],
      ]);
    key(`glow${i}`, "opacity", [
      [0, 0, "hold"],
      [sitAt[i] - 20, 0, "hold"],
      [sitAt[i], 0.85, "ease-out"],
    ]);
    key(`pile${i}`, "scaleY", [
      [0, 1.5, "hold"],
      [sitAt[i] - 60, 1.5, "hold"],
      [sitAt[i], 0.15, "ease-in-out"],
    ]);
  });

  // ================= WE WALK IN 240–480 =================
  walk("dev1", 240, 300, -40, LX - 37);
  walk("dev2", 252, 320, -60, M.x - 44);
  pose("dev1", 0, STAND);
  pose("dev2", 0, STAND);
  key("dev1_body", "y", [
    [302, 0, "hold"],
    [314, 12, "ease-out"],
  ]);
  pose("dev1", 314, SIT, "ease-out");
  key("lapLid", "scaleY", [
    [0, 0, "hold"],
    [314, 0, "hold"],
    [330, 1, "ease-out-back"],
  ]);
  for (let t = 334; t < 480; t += 14) {
    pose("dev1", t, TYPE_A);
    pose("dev1", t + 7, TYPE_B);
  }
  // Code scrolls in, line by line.
  [0, 1, 2, 3].forEach((c) =>
    key(`code${c}`, "trimEnd", [
      [0, 0, "hold"],
      [340 + c * 30, 0, "hold"],
      [360 + c * 30, 1, "linear"],
      [850, 1, "hold"],
      [870, 0, "ease-in"],
    ])
  );
  for (let t = 326; t < 400; t += 14) {
    pose("dev2", t, HAMMER_UP, "ease-out");
    pose("dev2", t + 7, HAMMER_DOWN, "ease-in");
  }
  pose("dev2", 406, STAND);
  key("machine", "scaleX", [
    [0, 0, "hold"],
    [380, 0, "hold"],
    [402, 1, "ease-out-back"],
  ]);
  key("machine", "scaleY", [
    [0, 0, "hold"],
    [380, 0, "hold"],
    [402, 1, "ease-out-back"],
  ]);
  key("gear", "rotation", [
    [0, 0, "hold"],
    [480, 0, "hold"],
    [END, 1800, "linear"],
  ]);

  // ================= IT CLICKS 480–720 =================
  // Paperwork from the first desk now flies into the machine and comes out done.
  const P0 = D[0];
  for (let n = 0; n < 4; n++) {
    const t = 486 + n * 18,
      id = `item${n}`,
      out = `out${n}`;
    shapes.push({
      id,
      type: "rect",
      x: P0.x + 24,
      y: P0.g - 52,
      width: 16,
      height: 4,
      opacity: 0,
      stroke: ink(1.4),
      fill: { color: NIGHT },
    });
    key(id, "opacity", [
      [0, 0, "hold"],
      [t, 1, "hold"],
      [t + 30, 1, "hold"],
      [t + 32, 0, "hold"],
    ]);
    key(id, "x", [
      [t, P0.x + 24, "hold"],
      [t + 30, M.x - 42, "ease-in-out"],
    ]);
    key(id, "y", [
      [t, P0.g - 52, "hold"],
      [t + 14, P0.g - 100, "ease-out"],
      [t + 30, M.g - 58, "ease-in"],
    ]);
    shapes.push({
      id: out,
      type: "rect",
      x: M.x + 40,
      y: M.g - 10,
      width: 10,
      height: 6,
      opacity: 0,
      fill: { color: AMBER },
    });
    key(out, "opacity", [
      [0, 0, "hold"],
      [t + 44, 0, "hold"],
      [t + 46, 1, "hold"],
    ]);
    key(out, "y", [
      [t + 44, M.g - 10, "hold"],
      [t + 56, M.g - 10 - n * 7, "ease-out-back"],
    ]);
  }
  L.pipes.forEach((_, i) => {
    const t = 500 + i * 40;
    key(`pipe${i}`, "trimEnd", [
      [0, 0, "hold"],
      [t, 0, "hold"],
      [t + 60, 1, "emphasized-decel"],
    ]);
    // Pulses keep flowing to the end of the loop: it runs on its own.
    for (let s = t + 64; s < END - 30; s += 34) {
      key(`pulse${i}`, "trimEnd", [
        [s, 0, "hold"],
        [s + 26, 1, "linear"],
      ]);
      key(`pulse${i}`, "trimStart", [
        [s + 8, 0, "hold"],
        [s + 30, 1, "linear"],
      ]);
    }
  });
  pose("dev2", 500, { ...STAND, uaR: -125, faR: -5 }, "ease-out-back"); // points at the pipes
  pose("dev2", 600, STAND);

  // ================= RUNS ON ITS OWN 720–1050 =================
  // Devs close up, fist-bump, and leave the office running itself.
  pose("dev1", 840, TYPE_A);
  key("lapLid", "scaleY", [
    [850, 1, "hold"],
    [866, 0, "ease-in"],
  ]);
  key("dev1_body", "y", [
    [866, 12, "hold"],
    [880, 0, "ease-out"],
  ]);
  pose("dev1", 880, STAND);
  walk("dev2", 860, 890, M.x - 44, LX - 10);
  pose("dev2", 892, STAND);
  pose("dev1", 896, BUMP, "ease-out-back");
  pose("dev2", 896, BUMP_L, "ease-out-back");
  pose("dev1", 914, STAND);
  pose("dev2", 914, STAND);
  walk("dev1", 920, END, LX - 37, L.w + 40);
  walk("dev2", 926, END, LX - 10, L.w + 20);

  return {
    name: L.name,
    width: L.w,
    height: L.h,
    groups: k.groups,
    shapes,
    texts,
    animations: [{ name: "story", fps: FPS, duration: END, loop: "loop", tracks: k.tracksOut() }],
  };
}

// Desktop: one long floor. Mobile: a three-storey building, one front per floor.
const desktop = scene({
  name: "Desktop",
  w: 900,
  h: 210,
  mx: 320,
  lapX: 238,
  desks: [
    { x: 100, g: 190 },
    { x: 450, g: 190 },
    { x: 750, g: 190 },
  ],
  pipes: [
    [
      { x: 320, y: 138 },
      { x: 320, y: 90 },
      { x: 508, y: 90 },
      { x: 508, y: 128 },
    ],
    [
      { x: 320, y: 138 },
      { x: 320, y: 90 },
      { x: 808, y: 90 },
      { x: 808, y: 128 },
    ],
  ],
});
const mobile = scene({
  name: "Mobile",
  w: 390,
  h: 640,
  mx: 300,
  lapX: 214,
  desks: [
    { x: 70, g: 210 },
    { x: 70, g: 420 },
    { x: 70, g: 630 },
  ],
  pipes: [
    [
      { x: 300, y: 158 },
      { x: 300, y: 120 },
      { x: 368, y: 120 },
      { x: 368, y: 330 },
      { x: 128, y: 330 },
      { x: 128, y: 358 },
    ],
    [
      { x: 300, y: 158 },
      { x: 300, y: 120 },
      { x: 368, y: 120 },
      { x: 368, y: 540 },
      { x: 128, y: 540 },
      { x: 128, y: 568 },
    ],
  ],
});

const require = createRequire(import.meta.url);
const inter = readFileSync(require.resolve("rive-mcp-server/assets/inter.ttf"));
const { bytes, warnings } = createRiv({
  fonts: [{ id: "inter", bytes: new Uint8Array(inter) }],
  artboards: [desktop, mobile],
});
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/transform.riv", bytes);
console.log(`public/rive/transform.riv ${(bytes.length / 1024).toFixed(1)} KB`);
