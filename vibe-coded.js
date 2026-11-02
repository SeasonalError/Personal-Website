const hero = document.querySelector(".hero");
const motionButton = hero.querySelector(".motion");
const motionLabel = motionButton.querySelector("[data-state]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let userPaused = false;
let visible = true;
let frame = 0;
let pointerX = 0;
let pointerY = 0;

function paint() {
  frame = 0;
  const bounds = hero.getBoundingClientRect();
  const distance = Math.min(bounds.height, Math.max(0, -bounds.top));
  hero.style.setProperty("--scroll", distance.toFixed(1) + "px");
  hero.style.setProperty("--px", pointerX.toFixed(1) + "px");
  hero.style.setProperty("--py", pointerY.toFixed(1) + "px");
}

function schedulePaint() {
  if (visible && !frame && !userPaused && !reducedMotion.matches) {
    frame = requestAnimationFrame(paint);
  }
}

function syncMotion() {
  const enabled = !userPaused && !reducedMotion.matches;
  motionButton.hidden = reducedMotion.matches;
  motionButton.setAttribute("aria-pressed", String(enabled));
  motionLabel.textContent = enabled ? "Motion on" : "Motion off";
  if (enabled) {
    schedulePaint();
  } else {
    cancelAnimationFrame(frame);
    frame = 0;
    for (const name of ["--scroll", "--px", "--py"]) hero.style.removeProperty(name);
  }
}

hero.addEventListener("pointermove", event => {
  if (event.pointerType !== "mouse" || reducedMotion.matches || userPaused) return;
  const bounds = hero.getBoundingClientRect();
  pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 24;
  pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * 14;
  schedulePaint();
});
hero.addEventListener("pointerleave", () => {
  pointerX = pointerY = 0;
  schedulePaint();
});
motionButton.addEventListener("click", () => {
  userPaused = !userPaused;
  syncMotion();
});
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedulePaint();
  }).observe(hero);
}
window.addEventListener("scroll", schedulePaint, { passive: true });
window.addEventListener("resize", schedulePaint);
reducedMotion.addEventListener("change", syncMotion);
syncMotion();
