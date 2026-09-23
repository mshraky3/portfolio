import * as THREE from "three";
import { clamp01, landAt, lerp, smooth } from "./timeline";

// A rig is how one scroll section moves: where each module sits and travels,
// and where the camera goes. The captions and the timeline are shared; the
// motion is not, so every system tells its story its own way.
//
//   stack    the hero: parts fly in and snap onto a tower
//   path     SQB: stations along a road; the camera follows a student
//   orbit    HR: modules gather round a globe of branches and revolve past
//   tunnel   NeuroLink: a flight through lens rings, one module per ring
//   explode  email: a closed machine opens into an exploded view, then shuts
//   gallery  client sites: a row of screens that turn as you pass
//
// Every rig answers the same questions each frame:
//   land(T, i, st)          0..1, how far module i has arrived
//   place(i, st, ctx, g)    set module i's group transform; returns its yaw
//   camera(st, ctx, H)      set H.pos and H.look
// `yaw` turns a module so the camera sees it from the angle it was drawn for
// (visuals are designed to be seen from azimuth VIEW_AZ, elevation VIEW_EL).

export const VIEW_AZ = 0.42;
export const VIEW_EL = 0.42;
export const GAP = 2.15; // stack: distance between trays
export const AZ_STEP = 0.2; // stack: camera turn per module

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const ease = (t) => t * t * (3 - 2 * t);
export function easeOutBack(t) {
  const c1 = 1.25;
  const c3 = c1 + 1;
  const x = clamp01(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

// Camera at `look`, seen from azimuth `az` and elevation `el`, `dist` away.
export function orbitAt(look, az, el, dist, out) {
  return out.set(look.x + Math.sin(az) * Math.cos(el) * dist, look.y + Math.sin(el) * dist, look.z + Math.cos(az) * Math.cos(el) * dist);
}

// Focus as (floor index, next index, fraction), clamped to the modules.
function span(f, n) {
  const a = Math.max(0, Math.min(n - 1, Math.floor(f)));
  const b = Math.min(n - 1, a + 1);
  return [a, b, n > 1 ? clamp01(f - a) : 0];
}

// ─── stack ───────────────────────────────────────────────────────
const stack = {
  platform: () => "tray",
  floor: -1.4,
  fog: [22, 70],
  extras: "stack",
  setup(n, { turn }) {
    const scatter = Array.from({ length: n }, (_, i) => {
      const a = 0.9 + turn + (i / n) * Math.PI * 1.7;
      const r = 6.2 - (i % 2) * 1.2;
      return new THREE.Vector3(Math.cos(a) * r, 2.2 + (i % 3) * 0.7, Math.sin(a) * r * 0.7 - 1);
    });
    return { scatter, turn };
  },
  land: (T, i) => landAt(T, i),
  place(i, st, ctx, g) {
    const m = st.mods[i];
    const L = easeOutBack(m.land);
    const slot = i * GAP * st.gs;
    const sc = ctx.scatter[i];
    g.position.set(lerp(sc.x, 0, L), lerp(sc.y + slot * 0.45, slot, L), lerp(sc.z, 0, L));
    g.rotation.set((1 - L) * 0.5, (1 - L) * 1.1, (1 - L) * -0.3);
    g.scale.setScalar(Math.max(0.0001, lerp(0.62, 1, m.land) * m.show));
    g.visible = m.show > 0.01;
    return i * AZ_STEP;
  },
  camera(st, ctx, H) {
    const { n, cys, wide } = H;
    const f = st.f;
    const fl = Math.min(Math.max(0, n - 2), Math.floor(f));
    const fr = f - fl;
    const y0 = fl * GAP * st.gs + cys[fl];
    const y1 = Math.min(n - 1, fl + 1) * GAP * st.gs + cys[Math.min(n - 1, fl + 1)];
    v1.set(0, lerp(y0, y1, n > 1 ? fr : 0), 0);
    orbitAt(v1, VIEW_AZ + f * AZ_STEP, VIEW_EL, H.distFor(wide ? 12.6 : 8.4, wide ? 8.4 : 7.6), H.pos);
    H.look.copy(v1);
    const heroW = 1 - smooth(-0.45, -0.05, st.T);
    v2.set(0, lerp(((n - 1) * GAP * st.gs) / 2 + 1.7, 3.5, heroW), 0);
    orbitAt(v2, 0.6 + ctx.turn + st.outro * 0.55, 0.4, H.distFor(wide ? 22 : 13, (wide ? 14 : 13) + 8.5 * st.outro), H.ovPos);
    H.ovLook.copy(v2);
  },
};

// ─── path: a road with a station per module; a student travels it ──
const SP = 10;
const path = {
  platform: () => "disc",
  floor: -0.35,
  fog: [26, 110],
  extras: "road",
  setup(n, { turn }) {
    const half = ((n - 1) * SP) / 2;
    const stations = Array.from({ length: n }, (_, i) => new THREE.Vector3(i * SP - half, 0, -1.4));
    const pts = [];
    for (let k = 0; k <= 80; k += 1) {
      const x = lerp(-half - 9, half + 9, k / 80);
      pts.push(new THREE.Vector3(x, 0.03, 3.3 + Math.sin(x * 0.33) * 0.9));
    }
    return { stations, curve: new THREE.CatmullRomCurve3(pts), xMin: -half - 9, xMax: half + 9, half, turn };
  },
  land: (T, i) => smooth(i - 0.55, i - 0.1, T),
  place(i, st, ctx, g) {
    const m = st.mods[i];
    const b = ctx.stations[i];
    const L = easeOutBack(m.land);
    g.position.set(b.x, lerp(-2.6, 0, L), b.z);
    g.rotation.set(0, (1 - clamp01(m.land)) * 1.6, 0);
    g.scale.setScalar(Math.max(0.0001, lerp(0.4, 1, clamp01(m.land))));
    g.visible = m.land > 0.01;
    return 0;
  },
  // Where the student is on the road (world x), as the camera moves.
  walkerX(st, ctx, n) {
    const [a, b, fr] = span(st.f, n);
    const x = lerp(ctx.stations[a].x, ctx.stations[b].x, fr);
    const start = ctx.xMin + 1;
    const end = ctx.xMax - 1;
    return lerp(lerp(start, x, smooth(-0.5, -0.02, st.T)), end, st.outro);
  },
  camera(st, ctx, H) {
    const { n, cys, wide } = H;
    const [a, b, fr] = span(st.f, n);
    v1.set(lerp(ctx.stations[a].x, ctx.stations[b].x, fr), lerp(cys[a], cys[b], fr), -0.4);
    orbitAt(v1, VIEW_AZ, VIEW_EL, H.distFor(wide ? 13.5 : 8.8, wide ? 9 : 8), H.pos);
    H.look.copy(v1);
    v2.set(0, 0.5, 0.8);
    orbitAt(v2, VIEW_AZ + ctx.turn + st.outro * 0.25, 0.62 - st.outro * 0.12, H.distFor((n - 1) * SP + 16, 12), H.ovPos);
    H.ovLook.copy(v2);
  },
};

// ─── orbit: module 0 is a globe at the centre, the rest revolve round it ──
const R = 9.5;
const FRONT = VIEW_AZ + 0.55; // where the focused satellite stops, seen from the camera
const orbit = {
  platform: (i) => (i === 0 ? "none" : "disc"),
  floor: -1.2,
  fog: [30, 110],
  extras: "orbit",
  setup(n, { turn }) {
    return { turn, k: Math.max(1, n - 1) };
  },
  // Satellites gather in turn while the globe tells its story.
  land: (T, i) => (i === 0 ? smooth(-0.6, -0.15, T) : smooth(-0.25 + (i - 1) * 0.17, 0.3 + (i - 1) * 0.17, T)),
  ring(st, ctx) {
    return st.f <= 1 ? 0 : -(st.f - 1) * ((Math.PI * 2) / ctx.k);
  },
  satAngle(i, st, ctx) {
    return FRONT + (i - 1) * ((Math.PI * 2) / ctx.k) + orbit.ring(st, ctx);
  },
  place(i, st, ctx, g) {
    const m = st.mods[i];
    if (i === 0) {
      g.position.set(0, 0, 0);
      g.rotation.set(0, 0, 0);
      g.scale.setScalar(Math.max(0.0001, lerp(0.5, 1, easeOutBack(m.land))));
      g.visible = m.land > 0.01;
      return 0;
    }
    const L = clamp01(m.land);
    const a = orbit.satAngle(i, st, ctx) + (1 - ease(L)) * 2.6;
    const r = lerp(R * 2.1, R, ease(L));
    g.position.set(Math.sin(a) * r, lerp(8, 0, ease(L)), Math.cos(a) * r);
    g.rotation.set(0, 0, 0);
    g.scale.setScalar(Math.max(0.0001, lerp(0.25, 1, L)));
    g.visible = L > 0.01;
    return 0;
  },
  camera(st, ctx, H) {
    const { cys, wide } = H;
    const toSat = clamp01(st.f);
    v1.set(0, cys[0], 0);
    v2.set(Math.sin(FRONT) * R, cys[Math.min(H.n - 1, Math.max(1, Math.round(st.f)))] || 1, Math.cos(FRONT) * R);
    H.look.lerpVectors(v1, v2, ease(toSat));
    orbitAt(H.look, VIEW_AZ, lerp(0.3, VIEW_EL, toSat), H.distFor(wide ? 13.5 : 9, wide ? 9 : 8.5), H.pos);
    v2.set(0, 1.6, 0);
    orbitAt(v2, VIEW_AZ + ctx.turn + st.outro * 0.4, 0.5, H.distFor(2 * R + 9, 2 * R * 0.72), H.ovPos);
    H.ovLook.copy(v2);
  },
};

// ─── tunnel: modules one behind another, a ring before each ──────
export const TUNNEL_D = 11;
const tunnel = {
  platform: () => "tray",
  floor: -0.35,
  fog: [14, 62],
  extras: "tunnel",
  setup(n, { turn }) {
    return { turn };
  },
  land: (T, i) => smooth(i - 0.7, i - 0.08, T),
  place(i, st, ctx, g) {
    const m = st.mods[i];
    const L = clamp01(m.land);
    g.position.set(0, lerp(-1.2, 0, easeOutBack(L)), -i * TUNNEL_D);
    g.rotation.set(0, (1 - L) * -0.9, 0);
    g.scale.setScalar(Math.max(0.0001, lerp(0.15, 1, ease(L))));
    g.visible = L > 0.01;
    return 0;
  },
  camera(st, ctx, H) {
    const { n, cys, wide } = H;
    const [a, b, fr] = span(st.f, n);
    v1.set(0, lerp(cys[a], cys[b], fr), -st.f * TUNNEL_D);
    orbitAt(v1, VIEW_AZ, 0.36, H.distFor(wide ? 12.6 : 8.6, wide ? 8.4 : 7.8), H.pos);
    H.look.copy(v1);
    // outside, looking down the tunnel
    v2.set(0, 1.5, -((n - 1) * TUNNEL_D) * (0.35 + 0.3 * st.outro));
    orbitAt(v2, 0.95 + ctx.turn + st.outro * 0.3, 0.3, H.distFor(wide ? 30 : 22, 16), H.ovPos);
    H.ovLook.copy(v2);
  },
};

// ─── explode: a closed machine opens; its parts stand around it ───
const EX_R = 8.2;
const explode = {
  platform: () => "tray",
  floor: -0.35,
  fog: [28, 110],
  extras: "machine",
  setup(n, { turn }) {
    const angle = Array.from({ length: n }, (_, i) => VIEW_AZ - 0.5 + (i * Math.PI * 2) / n);
    const out = angle.map((a) => new THREE.Vector3(Math.sin(a) * EX_R, 0, Math.cos(a) * EX_R));
    return { angle, out, turn };
  },
  // All parts come out together, and go back in for the outro.
  open(st) {
    return smooth(-0.5, -0.02, st.T) * (1 - st.outro);
  },
  land: (T, i, st) => explode.open(st),
  place(i, st, ctx, g) {
    const e = ease(explode.open(st));
    const o = ctx.out[i];
    g.position.set(o.x * e, 0.35 + i * 0.28 * (1 - e) + Math.sin(e * Math.PI) * 3.2, o.z * e);
    g.rotation.set(0, ctx.angle[i] * e + (1 - e) * i * 0.5, 0);
    g.scale.setScalar(lerp(0.22, 1, e));
    g.visible = true;
    return 0;
  },
  camera(st, ctx, H) {
    const { n, cys, wide } = H;
    const f = st.f;
    const [a, b, fr] = span(f, n);
    // swing round the machine from one part to the next
    const ra = lerp(ctx.angle[a], ctx.angle[a] + (b > a ? (Math.PI * 2) / n : 0), ease(fr));
    const az = ra + VIEW_AZ;
    v1.set(Math.sin(ra) * EX_R, lerp(cys[a], cys[b], fr), Math.cos(ra) * EX_R);
    orbitAt(v1, az, VIEW_EL, H.distFor(wide ? 13 : 8.8, wide ? 8.8 : 8), H.pos);
    H.look.copy(v1);
    v2.set(0, 1.3, 0);
    orbitAt(v2, VIEW_AZ + ctx.turn, 0.42, H.distFor(wide ? 12 : 9, 9), H.ovPos);
    H.ovLook.copy(v2);
  },
};

// ─── gallery: a row of screens; each turns to face you as you pass ──
const GS = 8.5;
const gallery = {
  platform: () => "tray",
  floor: -0.35,
  fog: [26, 100],
  extras: "rail",
  setup(n, { turn }) {
    const half = ((n - 1) * GS) / 2;
    return { xs: Array.from({ length: n }, (_, i) => i * GS - half), turn };
  },
  // The screens already stand in a row; they turn to face you as you pass.
  land: () => 1,
  place(i, st, ctx, g) {
    const m = st.mods[i];
    const L = clamp01(m.land);
    const d = (st.f - i) * (1 - st.ov);
    g.position.set(ctx.xs[i], lerp(-2.2, 0, easeOutBack(L)), 0);
    g.rotation.set(0, Math.max(-1.1, Math.min(1.1, -d * 1.2)) + (1 - L) * -1.2, 0);
    g.scale.setScalar(Math.max(0.0001, lerp(0.5, 1, L)));
    g.visible = L > 0.01;
    return 0;
  },
  camera(st, ctx, H) {
    const { n, cys, wide } = H;
    const [a, b, fr] = span(st.f, n);
    v1.set(lerp(ctx.xs[a], ctx.xs[b], ease(fr)), lerp(cys[a], cys[b], fr), 0);
    orbitAt(v1, VIEW_AZ, VIEW_EL, H.distFor(wide ? 12.6 : 8.6, wide ? 8.4 : 7.8), H.pos);
    H.look.copy(v1);
    v2.set(-3.5, 1.2, 0);
    orbitAt(v2, 0.15 + ctx.turn + st.outro * 0.25, 0.36, H.distFor(((n - 1) * GS + 9) * 1.3, 10), H.ovPos);
    H.ovLook.copy(v2);
  },
};

export const RIGS = { stack, path, orbit, tunnel, explode, gallery };
