// Decide once, at mount, whether the WebGL scenes should render or fall back to
// the CSS-3D drawings. Kept dependency-free so it does not join the 3D chunk.

// Honours the OS setting. Adding ?motion=1 to the address opts in to full motion
// for that visit, which is also how the animated version is checked in browsers
// whose system has animations switched off.
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("motion")) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Phones with little memory or few cores get the lighter CSS drawing.
export function isLowPower() {
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  return (typeof memory === "number" && memory <= 2) || (typeof cores === "number" && cores <= 2);
}

export function canRun3D() {
  return hasWebGL() && !isLowPower();
}

// Resolves once the page has loaded and the browser has a quiet moment, so the
// 3D engine (the heaviest download) never competes with the first paint.
let idle = null;
export function whenIdle() {
  if (idle) return idle;
  idle = new Promise((resolve) => {
    const go = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 1500 });
      else window.setTimeout(resolve, 300);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
  return idle;
}
