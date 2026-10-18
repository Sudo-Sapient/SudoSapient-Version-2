// Shared rig for the generated Rive scenes: line-art stick figures with
// shoulder/elbow/hip/knee joints, named poses, a walk cycle, and keyframe
// accumulation. Used by footer.mjs and transform.mjs.
export const WHITE = "#FFFFFF";
export const AMBER = "#FBBF24";
export const BLUE = "#1E40AF";
export const DEEP = "#1E3A8A";
export const NIGHT = "#0E1424";

// line/paper: stroke colour and the fill behind heads and bodies (defaults suit dark scenes).
export function makeKit(G, { line: LINE = WHITE, paper: PAPER = NIGHT } = {}) {
  const shapes = [];
  const groups = [];
  const tracks = new Map(); // "target|prop" -> [[frame, value, easing]]
  const ink = (t = 2.4) => ({ color: LINE, thickness: t, cap: "round", join: "round" });

  const group = (id, x, y, extra = {}) => (groups.push({ id, x, y, ...extra }), id);
  const line = (id, points, extra = {}) =>
    shapes.push({
      id,
      type: "polygon",
      x: 0,
      y: 0,
      closed: false,
      points,
      stroke: ink(),
      ...extra,
    });
  const key = (target, prop, frames) => {
    const k = `${target}|${prop}`;
    tracks.set(k, [...(tracks.get(k) ?? []), ...frames]);
  };

  // ---- stick figure: shoulder/hip groups act as joints so limbs bend, not swap ----
  const builds = {}; // id -> { fat }, for reach()
  const figure = (id, x, { glasses = false, fat = false, y = G, halo } = {}) => {
    builds[id] = { fat };
    group(id, x, y);
    group(`${id}_body`, 0, 0, { parent: id });
    const b = `${id}_body`;
    const headY = fat ? -58 : -55;
    // halo: a thick outline drawn behind every limb so the figure reads on any background.
    const limb = (lid, pts, extra) => {
      if (halo) line(`${lid}H`, pts, { ...extra, z: -1, stroke: { ...ink(5.5), color: halo } });
      line(lid, pts, extra);
    };
    if (halo)
      shapes.push({
        id: `${id}_headH`,
        type: "ellipse",
        x: 0,
        y: headY,
        width: 15,
        height: 15,
        parent: b,
        z: -1,
        fill: { color: halo },
      });
    if (fat) {
      // Pear-shaped body: narrow at the chest, round belly.
      const pear = [
        { x: 0, y: -50, cubic: { rotation: 0, distance: 6 } },
        { x: 13, y: -34, cubic: { rotation: 90, distance: 9 } },
        { x: 0, y: -21, cubic: { rotation: 180, distance: 9 } },
        { x: -13, y: -34, cubic: { rotation: 270, distance: 9 } },
      ];
      if (halo)
        shapes.push({
          id: `${id}_bellyH`,
          type: "polygon",
          x: 0,
          y: 0,
          points: pear,
          parent: b,
          z: -1,
          stroke: { ...ink(5.5), color: halo },
        });
      limb(
        `${id}_neck`,
        [
          { x: 0, y: -52 },
          { x: 0, y: -50 },
        ],
        { parent: b }
      );
      shapes.push({
        id: `${id}_belly`,
        type: "polygon",
        x: 0,
        y: 0,
        points: pear,
        parent: b,
        stroke: ink(),
        fill: { color: halo ?? PAPER },
      });
    } else
      limb(
        `${id}_torso`,
        [
          { x: 0, y: -27 },
          { x: 0, y: -47 },
        ],
        { parent: b }
      );
    shapes.push({
      id: `${id}_head`,
      type: "ellipse",
      x: 0,
      y: headY,
      width: fat ? 13 : 12,
      height: fat ? 13 : 12,
      parent: b,
      stroke: ink(),
      fill: { color: halo ?? PAPER },
    });
    if (glasses) {
      for (const gx of [-3, 3])
        shapes.push({
          id: `${id}_lens${gx}`,
          type: "ellipse",
          x: gx,
          y: headY,
          width: 5,
          height: 5,
          parent: b,
          stroke: { ...ink(1.4), color: AMBER },
          fill: { color: PAPER },
        });
    }
    for (const s of ["L", "R"]) {
      const side = s === "L" ? -1 : 1;
      // Shoulders sit below the chin and slightly apart, so raised arms clear the head.
      group(`${id}_ua${s}`, fat ? 9 * side : 2 * side, fat ? -45 : -42, { parent: b });
      limb(
        `${id}_uaL${s}`,
        [
          { x: 0, y: 0 },
          { x: 0, y: 12 },
        ],
        { parent: `${id}_ua${s}` }
      );
      group(`${id}_fa${s}`, 0, 12, { parent: `${id}_ua${s}` });
      limb(
        `${id}_faL${s}`,
        [
          { x: 0, y: 0 },
          { x: 0, y: 11 },
        ],
        { parent: `${id}_fa${s}` }
      );
      if (halo)
        shapes.push({
          id: `${id}_hand${s}H`,
          type: "ellipse",
          x: 0,
          y: 11.5,
          width: 7,
          height: 7,
          parent: `${id}_fa${s}`,
          z: -1,
          fill: { color: halo },
        });
      shapes.push({
        id: `${id}_hand${s}`,
        type: "ellipse",
        x: 0,
        y: 11.5,
        width: 4,
        height: 4,
        parent: `${id}_fa${s}`,
        fill: { color: LINE },
      });
      group(`${id}_th${s}`, fat ? 6 * side : 0, fat ? -24 : -27, { parent: b });
      limb(
        `${id}_thL${s}`,
        [
          { x: 0, y: 0 },
          { x: 0, y: 14 },
        ],
        { parent: `${id}_th${s}` }
      );
      group(`${id}_sh${s}`, 0, 14, { parent: `${id}_th${s}` });
      limb(
        `${id}_shL${s}`,
        [
          { x: 0, y: 0 },
          { x: 0, y: 13 },
        ],
        { parent: `${id}_sh${s}` }
      );
    }
    return id;
  };
  // Pose = joint rotations in degrees (0 = limb hanging straight down).
  const POSES = {
    stand: { uaL: 12, faL: -6, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 },
    sketch: { uaL: 10, faL: -6, uaR: -95, faR: -40, thL: 6, shL: 0, thR: -6, shR: 0, lean: 4 },
    sketch2: { uaL: 10, faL: -6, uaR: -80, faR: -65, thL: 6, shL: 0, thR: -6, shR: 0, lean: 4 },
    reachUp: { uaL: 160, faL: 10, uaR: -160, faR: -10, thL: 6, shL: 0, thR: -6, shR: 0, lean: 0 },
    press: {
      uaL: 120,
      faL: 30,
      uaR: -120,
      faR: -30,
      thL: 14,
      shL: -18,
      thR: -14,
      shR: 18,
      lean: 0,
    },
    ears: {
      uaL: 150,
      faL: 120,
      uaR: -150,
      faR: -120,
      thL: 16,
      shL: -26,
      thR: -16,
      shR: 26,
      lean: 0,
    },
    type: { uaL: -50, faL: -50, uaR: -70, faR: -40, thL: 4, shL: 0, thR: -4, shR: 0, lean: 6 },
    point: { uaL: 12, faL: -6, uaR: -125, faR: -5, thL: 4, shL: 0, thR: -4, shR: 0, lean: 0 },
    cheer: { uaL: 165, faL: -15, uaR: -165, faR: 15, thL: 6, shL: 0, thR: -6, shR: 0, lean: 0 },
    fiveL: { uaL: 12, faL: -6, uaR: -140, faR: -10, thL: 4, shL: 0, thR: -4, shR: 0, lean: -4 },
    fiveR: { uaL: 140, faL: 10, uaR: -12, faR: 6, thL: 4, shL: 0, thR: -4, shR: 0, lean: 4 },
  };
  // Two-bone reach: rotations that put `side`'s hand on (tx, ty) in the figure's own
  // coordinates (feet at 0,0), with the elbow bent outward.
  const reach = (id, side, tx, ty) => {
    const fat = builds[id]?.fat;
    const sx = (fat ? 9 : 2) * (side === "L" ? -1 : 1),
      sy = fat ? -45 : -42;
    const L1 = 12,
      L2 = 11.5;
    const dx = tx - sx,
      dy = ty - sy;
    const d = Math.min(L1 + L2 - 0.01, Math.max(Math.abs(L1 - L2) + 0.01, Math.hypot(dx, dy)));
    const deg = (r) => (r * 180) / Math.PI;
    const toTarget = deg(Math.atan2(-dx, dy)); // rotation that points a limb at the target
    const bend = deg(Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
    const pick = [toTarget - bend, toTarget + bend]
      .map((ua) => {
        const r = (ua * Math.PI) / 180;
        const ex = sx - Math.sin(r) * L1,
          ey = sy + Math.cos(r) * L1;
        let fa = deg(Math.atan2(-(tx - ex), ty - ey)) - ua;
        fa = ((((fa + 180) % 360) + 360) % 360) - 180;
        return { ua, fa, out: Math.abs(ex) };
      })
      .sort((a, b) => b.out - a.out)[0];
    return { [`ua${side}`]: pick.ua, [`fa${side}`]: pick.fa };
  };
  const pose = (id, frame, name, easing = "ease-in-out") => {
    let p = typeof name === "string" ? POSES[name] : name;
    if (name === "ears") {
      // Hands land on the sides of the head, whatever the body shape.
      const hy = builds[id]?.fat ? -58 : -55;
      p = { ...p, ...reach(id, "L", -7, hy), ...reach(id, "R", 7, hy) };
    }
    for (const [j, v] of Object.entries(p)) {
      if (j === "lean") key(`${id}_body`, "rotation", [[frame, v, easing]]);
      // Upper arms stop at 145° from hanging: further would swing them through the head.
      // The big guy's arms splay out so they hang around his belly, not across it.
      else if (j === "uaL" || j === "uaR") {
        const splay = builds[id]?.fat && Math.abs(v) < 60 ? (j === "uaL" ? 22 : -22) : 0;
        key(`${id}_${j}`, "rotation", [[frame, Math.max(-145, Math.min(145, v + splay)), easing]]);
      } else key(`${id}_${j}`, "rotation", [[frame, v, easing]]);
    }
  };
  // Walk: travel x with contact/passing poses every 12 frames, plus a small bob.
  const walk = (id, f0, f1, x0, x1) => {
    key(id, "x", [
      [f0, x0, "hold"],
      [f1, x1, "ease-in-out"],
    ]);
    let s = 1;
    for (let f = f0; f < f1; f += 12, s = -s) {
      key(`${id}_thL`, "rotation", [[f + 6, 24 * s, "ease-in-out"]]);
      key(`${id}_thR`, "rotation", [[f + 6, -24 * s, "ease-in-out"]]);
      key(`${id}_shL`, "rotation", [[f + 6, s > 0 ? 0 : -20, "ease-in-out"]]);
      key(`${id}_shR`, "rotation", [[f + 6, s > 0 ? -20 : 0, "ease-in-out"]]);
      key(`${id}_uaL`, "rotation", [[f + 6, -18 * s, "ease-in-out"]]);
      key(`${id}_uaR`, "rotation", [[f + 6, 18 * s, "ease-in-out"]]);
      key(`${id}_body`, "y", [
        [f, 0, "ease-in-out"],
        [f + 6, -2, "ease-in-out"],
      ]);
    }
    key(`${id}_body`, "y", [[f1, 0, "ease-in-out"]]);
  };

  const tracksOut = () => {
    return [...tracks.entries()].map(([k, kfs]) => {
      const [target, property] = k.split("|");
      const byFrame = new Map();
      for (const [frame, v, easing] of kfs)
        byFrame.set(frame, {
          frame,
          easing,
          ...(property === "fillColor" ? { color: v } : { value: v }),
        });
      return {
        target,
        property,
        keyframes: [...byFrame.values()].sort((a, b) => a.frame - b.frame),
      };
    });
  };

  // For files with several animations: collect one animation's tracks and start fresh.
  const takeTracks = () => {
    const t = tracksOut();
    tracks.clear();
    return t;
  };

  return {
    shapes,
    groups,
    ink,
    group,
    line,
    key,
    figure,
    pose,
    reach,
    walk,
    tracksOut,
    takeTracks,
  };
}
