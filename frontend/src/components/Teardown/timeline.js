// The whole scroll story is a pure function of progress p in [0, 1], so it works
// the same with or without an OS reduced-motion preference: nothing moves unless
// the visitor scrolls.
//
//   0.00 - 0.09  assembled: one product, seen from the front
//   0.09 - 0.28  explode, and the camera pulls out to an overview
//   0.28 - 0.32  overview settles, then the camera dives to the first layer
//   0.32 - 0.90  fly through the layers, one dwell each
//   0.90 - 0.975 pull back to the overview, hold to the end

export const T = { intro: 0.09, explodeEnd: 0.28, diveStart: 0.32, diveEnd: 0.9, outro: 0.955, overviewFull: 0.975 };

const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const explodeAt = (p) => smooth(T.intro, T.explodeEnd, p);

// 1 when the camera should show the whole stack, 0 when it is at a layer.
export function overviewAt(p) {
  const up = smooth(T.intro, T.explodeEnd, p);
  const down = 1 - smooth(T.explodeEnd, T.diveStart, p);
  const out = smooth(T.diveEnd, T.overviewFull, p);
  return Math.max(Math.min(up, down), out);
}

const DWELL = 0.62;

// Layer the camera is at, as a float: k while dwelling, k -> k+1 while moving.
export function focusAt(p, n) {
  if (p <= T.diveStart) return 0;
  if (p >= T.diveEnd) return n - 1;
  const t = ((p - T.diveStart) / (T.diveEnd - T.diveStart)) * n;
  const k = Math.min(n - 1, Math.floor(t));
  const frac = t - k;
  return k < n - 1 ? k + smooth(DWELL, 1, frac) : n - 1;
}

export function phaseAt(p, n) {
  if (p < T.intro + 0.02) return { key: "intro", i: -1 };
  if (p < T.diveStart) return { key: "overview", i: -1 };
  if (p >= T.outro) return { key: "outro", i: -1 };
  // The caption follows the camera: it switches when the camera passes halfway.
  const i = Math.min(n - 1, Math.max(0, Math.floor(focusAt(p, n) + 0.5)));
  return { key: `step-${i}`, i };
}

// Scroll position (0..1) that lands on a given layer's dwell.
export function progressForLayer(i, n) {
  return T.diveStart + ((i + 0.3) / n) * (T.diveEnd - T.diveStart);
}
