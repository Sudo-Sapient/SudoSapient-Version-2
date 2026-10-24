// Cute AI agent characters shared by services.mjs and strike.mjs: a starburst (a nod to
// Claude), a dark rosette (a nod to OpenAI) and a blue sparkle (a nod to Gemini), each
// with a face. Stylised nods to those brands, not their logos.

const star = (n, R, r, turn = -Math.PI / 2) =>
  [...Array(n * 2).keys()].map((i) => {
    const a = turn + (i * Math.PI) / n;
    const d = i % 2 ? r : R;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d };
  });

export const KINDS = ["spark", "knot", "twinkle"];

/** Adds agent `id` as a group at (x, y), drawn at `size`. Animate the group; blink with blink(). */
export function addAgent(k, id, kind, x, y, extra = {}, size = 1) {
  k.group(id, x, y, extra);
  k.group(`${id}_s`, 0, 0, { parent: id, scaleX: size, scaleY: size });
  k.group(`${id}_body`, 0, 0, { parent: `${id}_s` });
  const body = `${id}_body`;
  let eye = "#FFFFFF";
  if (kind === "spark") {
    eye = "#3B1E12";
    k.shapes.push({
      id: `${id}_b`,
      type: "polygon",
      x: 0,
      y: 0,
      parent: body,
      points: star(10, 8, 5.4),
      fill: { color: "#D97757" },
    });
  } else if (kind === "knot") {
    for (let p = 0; p < 3; p++)
      k.shapes.push({
        id: `${id}_p${p}`,
        type: "ellipse",
        x: 0,
        y: 0,
        width: 7,
        height: 15,
        rotation: p * 60,
        parent: body,
        fill: { color: "#111827" },
      });
  } else {
    k.shapes.push({
      id: `${id}_b`,
      type: "polygon",
      x: 0,
      y: 0,
      parent: body,
      points: star(4, 9.5, 4),
      fill: { color: "#4F7BFF" },
    });
  }
  k.group(`${id}_eyes`, 0, -0.5, { parent: `${id}_s` });
  for (const s of [-1, 1])
    k.shapes.push({
      id: `${id}_e${s}`,
      type: "ellipse",
      x: s * 2.2,
      y: 0,
      width: 1.9,
      height: 2.4,
      parent: `${id}_eyes`,
      fill: { color: eye },
    });
  return id;
}

/** A quick blink starting at frame f. */
export const blink = (k, id, f) =>
  k.key(`${id}_eyes`, "scaleY", [
    [f, 1, "hold"],
    [f + 3, 0.1, "ease-in"],
    [f + 6, 1, "ease-out"],
  ]);

/** Scale pop in (or out with out=true) over about 8 frames from frame f. */
export function pop(k, id, f, out = false) {
  for (const p of ["scaleX", "scaleY"])
    k.key(
      id,
      p,
      out
        ? [
            [f, 1, "hold"],
            [f + 3, 1.2, "ease-out"],
            [f + 8, 0, "ease-in"],
          ]
        : [
            [f, 0, "hold"],
            [f + 6, 1.2, "ease-out"],
            [f + 10, 1, "ease-in-out"],
          ]
    );
}
