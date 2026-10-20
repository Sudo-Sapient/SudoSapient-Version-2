// Builds public/rive/testimonials.riv — "The Podium".
// Six clients sit either side of a podium; the selected one walks up, speaks,
// takes applause and walks back. Lives inside the white quote card. State machine `Podium`, number input `speaker` (0 to 5):
// each state plays that client's 9.5s turn. Run: npm run rive:testimonials.
import { writeFileSync, mkdirSync } from "node:fs";
import { createRiv } from "rive-mcp-server/dist/rivWriter.js";
import { makeKit, AMBER, BLUE, DEEP, WHITE } from "./kit.mjs";

const FPS = 60;
const TURN_SECONDS = 9.5; // Testimonials.tsx advances on the same beat
const PROPS = ["box", "laptop", "puzzle", "note", "camera", "trophy"]; // Shipzy, Taamul, Jgsaw, Fabplay, Vencuts, Yogi

function scene(L) {
  const G = L.ground;
  // Drawn in blueprint blue on the white testimonial card.
  const k = makeKit(G, { line: BLUE, paper: WHITE });
  const { shapes, ink, line, key, figure, pose, reach, walk, takeTracks } = k;
  const P = L.podium;

  // Seated, facing the podium. `dir` 1 = podium to the right, -1 = to the left.
  const sit = (dir) => ({
    uaL: -60 * dir,
    faL: -30 * dir,
    uaR: -70 * dir,
    faR: -20 * dir,
    thL: -90 * dir,
    shL: 90 * dir,
    thR: -80 * dir,
    shR: 80 * dir,
    lean: 0,
  });
  const STAND = { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 };
  const clap = (id, dir, together) => ({
    ...sit(dir),
    ...reach(id, "L", (together ? 13 : 8) * dir, together ? -40 : -44),
    ...reach(id, "R", (together ? 16 : 22) * dir, together ? -40 : -36),
  });
  const GESTURE_A = { ...STAND, uaL: 70, faL: 45, uaR: -20, faR: -30 };
  const GESTURE_B = { ...STAND, uaL: 105, faL: 15, uaR: -20, faR: -30, lean: -3 };
  const BOW = { ...STAND, uaR: -20, faR: -30, lean: 18 };

  // ---- stage ----
  line(
    "floor",
    [
      { x: 0, y: G },
      { x: L.w, y: G },
    ],
    { stroke: ink(1.2), opacity: 0.3 }
  );
  const chair = (id, x, dir) =>
    line(
      id,
      [
        { x: x - 8 * dir, y: G - 34 },
        { x: x - 8 * dir, y: G - 15 },
        { x: x + 8 * dir, y: G - 15 },
        { x: x + 8 * dir, y: G },
      ],
      { stroke: ink(1.8) }
    );

  // ---- clients, each holding a prop for what we built them ----
  const clients = L.seats.map((x, i) => ({ id: `c${i}`, x, dir: x < P ? 1 : -1 }));
  clients.forEach(({ id, x, dir }, i) => {
    chair(`chair${i}`, x - 10 * dir, dir);
    figure(id, x);
    const hand = `${id}_faR`;
    if (PROPS[i] === "box") {
      shapes.push({
        id: `${id}_prop`,
        type: "rect",
        x: 0,
        y: 16,
        width: 11,
        height: 9,
        parent: hand,
        stroke: ink(1.4),
        fill: { color: DEEP },
      });
      line(
        `${id}_tape`,
        [
          { x: 0, y: 11.5 },
          { x: 0, y: 20.5 },
        ],
        { parent: hand, stroke: { color: AMBER, thickness: 1.2 } }
      );
    } else if (PROPS[i] === "laptop") {
      shapes.push({
        id: `${id}_prop`,
        type: "rect",
        x: 0,
        y: 16,
        width: 13,
        height: 9,
        parent: hand,
        stroke: ink(1.4),
        fill: { color: DEEP },
      });
      line(
        `${id}_kb`,
        [
          { x: -7, y: 21.5 },
          { x: 7, y: 21.5 },
        ],
        { parent: hand, stroke: ink(1.6) }
      );
    } else if (PROPS[i] === "puzzle") {
      shapes.push({
        id: `${id}_prop`,
        type: "polygon",
        x: 0,
        y: 16,
        parent: hand,
        fill: { color: AMBER },
        points: [
          { x: -5, y: -5 },
          { x: -1, y: -5 },
          { x: 0, y: -7 },
          { x: 1, y: -5 },
          { x: 5, y: -5 },
          { x: 5, y: -1 },
          { x: 7, y: 0 },
          { x: 5, y: 1 },
          { x: 5, y: 5 },
          { x: -5, y: 5 },
        ],
      });
    } else if (PROPS[i] === "camera") {
      shapes.push({
        id: `${id}_prop`,
        type: "rect",
        x: 0,
        y: 16,
        width: 12,
        height: 8,
        parent: hand,
        stroke: ink(1.4),
        fill: { color: DEEP },
      });
      shapes.push({
        id: `${id}_lens`,
        type: "ellipse",
        x: 0,
        y: 16,
        width: 5,
        height: 5,
        parent: hand,
        stroke: { color: AMBER, thickness: 1.3 },
        fill: { color: WHITE },
      });
    } else if (PROPS[i] === "note") {
      shapes.push({
        id: `${id}_prop`,
        type: "ellipse",
        x: -2,
        y: 20,
        width: 6,
        height: 5,
        parent: hand,
        fill: { color: AMBER },
      });
      line(
        `${id}_stem`,
        [
          { x: 1, y: 20 },
          { x: 1, y: 10 },
          { x: 5, y: 13 },
        ],
        {
          parent: hand,
          stroke: { color: AMBER, thickness: 1.6, cap: "round", join: "round" },
        }
      );
    } else if (PROPS[i] === "trophy") {
      shapes.push({
        id: `${id}_prop`,
        type: "polygon",
        x: 0,
        y: 16,
        parent: hand,
        stroke: ink(1.2),
        fill: { color: AMBER },
        points: [
          { x: -5, y: -6 },
          { x: 5, y: -6 },
          { x: 3, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 4 },
          { x: 3, y: 6 },
          { x: -3, y: 6 },
          { x: -1, y: 4 },
          { x: -1, y: 1 },
          { x: -3, y: 0 },
        ],
      });
    } else {
      shapes.push({
        id: `${id}_prop`,
        type: "rect",
        x: 0,
        y: 15,
        width: 5,
        height: 9,
        cornerRadius: 1,
        parent: hand,
        stroke: ink(1.3),
        fill: { color: DEEP },
      });
    }
  });

  // ---- podium, drawn after the people so it hides the speaker's legs ----
  shapes.push({
    id: "podium",
    type: "polygon",
    x: P,
    y: G,
    stroke: ink(),
    points: [
      { x: -20, y: 0 },
      { x: 20, y: 0 },
      { x: 16, y: -24 },
      { x: -16, y: -24 },
    ],
    fill: {
      gradient: {
        type: "linear",
        stops: [{ color: BLUE }, { color: DEEP }],
        start: { x: -20, y: 0 },
        end: { x: 20, y: 0 },
      },
    },
  });
  line(
    "podiumTop",
    [
      { x: P - 20, y: G - 24 },
      { x: P + 20, y: G - 24 },
    ],
    { stroke: ink(2.6) }
  );
  line(
    "micStand",
    [
      { x: P + 8, y: G - 24 },
      { x: P + 10, y: G - 38 },
      { x: P + 5, y: G - 44 },
    ],
    { stroke: ink(1.6) }
  );
  shapes.push({
    id: "mic",
    type: "ellipse",
    x: P + 4,
    y: G - 45,
    width: 4,
    height: 4,
    fill: { color: AMBER },
  });
  for (let w = 0; w < 2; w++)
    line(
      `wave${w}`,
      [
        { x: P + 12 + w * 5, y: G - 50 - w * 2, cubic: { rotation: 40, distance: 3 } },
        { x: P + 12 + w * 5, y: G - 40 + w * 2, cubic: { rotation: 140, distance: 3 } },
      ],
      {
        opacity: 0,
        stroke: { color: AMBER, thickness: 1.4, cap: "round" },
      }
    );

  const seated = clients;
  const restAll = (f) =>
    seated.forEach(({ id, x, dir }) => {
      key(id, "x", [[f, x, "hold"]]);
      key(`${id}_body`, "y", [[f, 12, "hold"]]);
      pose(id, f, sit(dir));
    });

  // ---- one turn per client ----
  const animations = [];
  clients.forEach((c, i) => {
    const spot = P - 4;
    const walkFrames = Math.max(45, Math.round(Math.abs(spot - c.x) / 3.2));
    const up = 14,
      arrive = up + walkFrames;
    const talkEnd = 400,
      back = 450,
      home = back + walkFrames,
      END = Math.round(TURN_SECONDS * FPS);
    restAll(0);
    // Audience idles: small nods and shifts, out of step with each other.
    seated.forEach(({ id }, n) => {
      if (id === c.id) return;
      for (let t = 40 + n * 23; t < talkEnd; t += 140)
        key(`${id}_body`, "rotation", [
          [t, 0, "ease-in-out"],
          [t + 15, n % 2 ? 4 : -4, "ease-in-out"],
          [t + 35, 0, "ease-in-out"],
        ]);
    });
    // Stand, walk up, speak.
    key(`${c.id}_body`, "y", [
      [0, 12, "hold"],
      [up, 0, "ease-out"],
    ]);
    pose(c.id, up, STAND, "ease-out");
    walk(c.id, up, arrive, c.x, spot);
    pose(c.id, arrive + 4, STAND);
    for (let t = arrive + 12; t < talkEnd - 20; t += 36) {
      pose(c.id, t, GESTURE_A);
      pose(c.id, t + 18, GESTURE_B);
    }
    pose(c.id, talkEnd - 10, STAND);
    [0, 1].forEach((w) => {
      key(`wave${w}`, "opacity", [[0, 0, "hold"]]);
      for (let t = arrive + 10 + w * 8; t < talkEnd - 20; t += 24)
        key(`wave${w}`, "opacity", [
          [t, 0, "hold"],
          [t + 6, 0.9, "ease-out"],
          [t + 18, 0, "ease-in"],
        ]);
    });
    // Bow; everyone else claps.
    pose(c.id, talkEnd + 10, BOW, "ease-out");
    pose(c.id, talkEnd + 30, STAND, "ease-in-out");
    seated.forEach(({ id, dir }) => {
      if (id === c.id) return;
      pose(id, talkEnd - 6, sit(dir));
      for (let t = talkEnd; t < back + 6; t += 10)
        pose(id, t, clap(id, dir, (t / 10) % 2 === 0), "ease-in-out");
      pose(id, back + 16, sit(dir), "ease-out");
    });
    // Walk back and sit.
    walk(c.id, back, home, spot, c.x);
    pose(c.id, home, STAND);
    key(`${c.id}_body`, "y", [
      [home, 0, "hold"],
      [home + 12, 12, "ease-out"],
    ]);
    pose(c.id, home + 12, sit(c.dir), "ease-out");
    restAll(END);
    animations.push({
      name: `turn${i}`,
      fps: FPS,
      duration: END,
      loop: "oneShot",
      tracks: takeTracks(),
    });
  });

  const transitions = [{ from: "entry", to: "turn0" }];
  clients.forEach((_, i) =>
    clients.forEach((__, j) => {
      if (i !== j)
        transitions.push({
          from: `turn${i}`,
          to: `turn${j}`,
          durationMs: 250,
          condition: { input: "speaker", op: "==", value: j },
        });
    })
  );
  return {
    name: L.name,
    width: L.w,
    height: L.h,
    groups: k.groups,
    shapes,
    animations,
    stateMachine: {
      name: "Podium",
      inputs: [{ name: "speaker", type: "number" }],
      states: clients.map((_, i) => ({ name: `turn${i}`, animation: `turn${i}` })),
      transitions,
    },
  };
}

// Sized for the empty space in the quote card, between the quote and the client's name.
const desktop = scene({
  name: "Desktop",
  w: 680,
  h: 170,
  ground: 160,
  podium: 340,
  seats: [40, 125, 210, 470, 555, 640],
});
const mobile = scene({
  name: "Mobile",
  w: 340,
  h: 170,
  ground: 160,
  podium: 236,
  seats: [20, 60, 100, 140, 288, 326],
});

const { bytes, warnings } = createRiv({ artboards: [desktop, mobile] });
if (warnings?.length) console.warn(warnings.join("\n"));
mkdirSync("public/rive", { recursive: true });
writeFileSync("public/rive/testimonials.riv", bytes);
console.log(`public/rive/testimonials.riv ${(bytes.length / 1024).toFixed(1)} KB`);
