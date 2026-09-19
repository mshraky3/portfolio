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
