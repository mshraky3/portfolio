// The whole scroll story is a pure function of scroll progress p in [0, 1], so it
// behaves the same with or without an OS reduced-motion setting: nothing moves
// unless the visitor scrolls.
//
// The system is BUILT as you scroll. Modules are added bottom to top. For
// module i, T is the "build clock" (one unit per module):
//
//   T = i - 0.42 .. i - 0.02   module i flies in from where it was floating and snaps on
//   T = i + 0.03 .. i + 0.62   module i plays its story (data arriving, a payment clearing...)
//   T = i + 0.60 .. i + 1.00   the camera climbs to the next module
//
// Before the build (hero) all modules float apart. After the last module the
// camera pulls back and the finished stack separates a little, so all layers show.

// H: scroll share spent on the intro before the build starts. B: where the build
// ends and the outro starts. Chapters are shorter sections, so their intro and
// outro take a larger share of their (smaller) scroll length.
export const TIMING = {
  full: { H: 0.07, B: 0.86 },
  chapter: { H: 0.12, B: 0.84 },
  compact: { H: 0.14, B: 0.82 },
};

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeIn = (t) => Math.pow(clamp01(t), 2.2);

// Build clock: -0.5 in the hero, n when the last module is done.
export function clockAt(p, n, t = TIMING.full) {
  return lerp(-0.5, n, clamp01((p - t.H) / (t.B - t.H)));
}

export const landAt = (T, i) => smooth(i - 0.42, i - 0.02, T);
export const playAt = (T, i) => smooth(i + 0.03, i + 0.62, T);

// How visible module i is while it is waiting to be placed.
export function showAt(T, i) {
  if (i === 0) return 1;
  const hero = 1 - smooth(-0.46, -0.18, T);
  const incoming = smooth(i - 0.6, i - 0.44, T);
  return Math.max(hero, incoming);
}

// Module the camera is at, as a float: k while dwelling, k -> k + 1 while climbing.
export function focusAt(T, n) {
  if (T <= 0) return 0;
  if (T >= n - 1) return n - 1;
  const k = Math.floor(T);
  return k + smooth(0.6, 1, T - k);
}

// 1 when the camera shows the whole stack (hero, and the end), 0 at a module.
export function overviewAt(T, n) {
  const start = 1 - smooth(-0.45, -0.05, T);
  const end = smooth(n - 0.38, n, T);
  return Math.max(start, end);
}

// After the build: 0 to 1 while the finished stack separates.
export const outroAt = (p, t = TIMING.full) => smooth(t.B, 1, p);

export function phaseAt(p, n, t = TIMING.full) {
  const T = clockAt(p, n, t);
  if (T < -0.3) return { key: "intro", i: -1 };
  if (T >= n - 0.12) return { key: "outro", i: -1 };
  const i = Math.min(n - 1, Math.max(0, Math.round(focusAt(T, n))));
  return { key: `step-${i}`, i };
}

// Scroll position (0..1) that lands on a module's story.
export function progressForLayer(i, n, t = TIMING.full) {
  return t.H + ((i + 0.35 + 0.5) / (n + 0.5)) * (t.B - t.H);
}
