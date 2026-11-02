// The initial SVG is a complete print. Rotate its folded planes about a vertical axis.
const figure = document.getElementById("fold");
const crane = document.getElementById("crane");
const controls = figure.querySelector(".fold-tools");
const buttons = Array.from(controls.querySelectorAll("button"));
const facets = Array.from(crane.querySelectorAll("[data-depth]"), polygon => {
  const depth = polygon.dataset.depth.split(",").map(Number);
  const vertices = Array.from(polygon.points, (point, i) => ({
    x: point.x - 320,
    y: point.y - 195,
    z: depth[i]
  }));
  return { polygon, vertices };
});

const limit = 36;
let angle = 0;
let drag = null;

function turn(degrees) {
  angle = Math.max(-limit, Math.min(limit, degrees));
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  for (const { polygon, vertices } of facets) {
    const points = vertices.map(({ x, y, z }) => {
      const rotatedX = x * cos + z * sin;
      const rotatedZ = z * cos - x * sin;
      // Preserve the printed projection at zero, then add perspective as it turns.
      const scale = (1400 - z) / (1400 - rotatedZ);
      return [(320 + rotatedX * scale).toFixed(2), (195 + y * scale).toFixed(2)].join(",");
    });
    polygon.setAttribute("points", points.join(" "));
  }
  // Keep both buttons in the focus order, including at the ends of travel.
  for (const button of buttons) {
    const atLimit = angle === Number(button.dataset.turn) * limit;
    button.setAttribute("aria-disabled", String(atLimit));
  }
}
for (const button of buttons) {
  button.addEventListener("click", () => turn(angle + Number(button.dataset.turn) * 12));
}
crane.addEventListener("pointerdown", event => {
  if (!event.isPrimary || event.button !== 0) return;
  drag = { pointer: event.pointerId, x: event.clientX, angle, width: crane.getBoundingClientRect().width };
  crane.setPointerCapture(event.pointerId);
  figure.classList.add("dragging");
});
crane.addEventListener("pointermove", event => {
  if (drag?.pointer !== event.pointerId) return;
  turn(drag.angle + (event.clientX - drag.x) * 120 / drag.width);
});
crane.addEventListener("lostpointercapture", event => {
  if (drag?.pointer !== event.pointerId) return;
  drag = null;
  figure.classList.remove("dragging");
});
controls.hidden = false;
figure.classList.add("ready");
