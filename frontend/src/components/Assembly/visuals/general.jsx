import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { clamp01, lerp, smooth } from "../timeline";
import { Block, C, Frame, Glow, M, OFF, basic } from "./common";

// The hero: how any system gets built, as pictures. No product in particular.

const dummy = new THREE.Object3D();
const col = new THREE.Color();
const tmpc = new THREE.Color();

// ─── Plan: a floor plan is drawn, walls rise as outlines, then turn solid ──
const PLAN = [
  // x, z, width, depth, height
  [-1.05, 0.75, 1.5, 1.1, 0.45],
  [0.85, 0.75, 1.5, 1.1, 0.3],
  [-1.05, -0.85, 1.5, 1.4, 0.95],
  [0.85, -0.85, 1.5, 1.4, 1.35],
];
const rect = (x, z, w, d, y = 0.012) => [
  [x - w / 2, y, z - d / 2],
  [x + w / 2, y, z - d / 2],
  [x + w / 2, y, z + d / 2],
  [x - w / 2, y, z + d / 2],
  [x - w / 2, y, z - d / 2],
];

export function Blueprint({ mod }) {
  const walls = useRef([]);
  const solids = useRef([]);
  const pencil = useRef();
  const edges = useMemo(() => PLAN.map(([, , w, d, h]) => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d))), []);

  useFrame(() => {
    const { s } = mod.current;
    let px = PLAN[0][0];
    let pz = PLAN[0][1];
    let ph = 0.3;
    PLAN.forEach(([x, z, , , h], i) => {
      const draw = smooth(0.04 + i * 0.13, 0.17 + i * 0.13, s);
      const fill = smooth(0.62 + i * 0.07, 0.76 + i * 0.07, s);
      const wl = walls.current[i];
      if (wl) {
        wl.visible = draw > 0.01;
        wl.scale.y = Math.max(0.001, draw);
        wl.position.y = (h * draw) / 2;
        wl.material.opacity = 0.95 - 0.55 * fill;
      }
      const so = solids.current[i];
      if (so) {
        so.visible = fill > 0.01;
        so.scale.y = Math.max(0.001, fill);
        so.position.y = (h * fill) / 2;
      }
      if (s > 0.04 + i * 0.13) {
        px = x;
        pz = z;
        ph = h * draw;
      }
    });
    if (pencil.current) {
      const t = s * 40;
      pencil.current.position.set(px + Math.sin(t) * 0.35, ph + 0.55, pz + Math.cos(t * 0.8) * 0.3);
      pencil.current.visible = s < 0.66;
    }
  });

  return (
    <group>
      {/* the drawing: guide lines and footprints */}
      {[-1.9, 1.9].map((z) => (
        <Line key={z} points={[[-2.1, 0.012, z], [2.1, 0.012, z]]} color={C.deep} lineWidth={1} dashed dashSize={0.12} gapSize={0.1} />
      ))}
      {PLAN.map(([x, z, w, d], i) => (
        <Line key={i} points={rect(x, z, w, d)} color={C.accent} lineWidth={1.4} dashed dashSize={0.16} gapSize={0.1} />
      ))}
      {PLAN.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <lineSegments ref={(m) => { walls.current[i] = m; }} geometry={edges[i]}>
            <lineBasicMaterial color={C.hi} transparent opacity={0.9} />
          </lineSegments>
          <mesh ref={(m) => { solids.current[i] = m; }} material={i === 3 ? M.body2 : M.body}>
            <boxGeometry args={[PLAN[i][2] - 0.04, PLAN[i][4], PLAN[i][3] - 0.04]} />
          </mesh>
        </group>
      ))}
      {/* the pencil */}
      <group ref={pencil}>
        <mesh material={M.hi} position={[0, -0.16, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.06, 0.18, 12]} />
        </mesh>
        <mesh material={M.accent} position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.55, 12]} />
        </mesh>
        <Glow size={0.9} opacity={0.5} position={[0, -0.25, 0]} />
      </group>
    </group>
  );
}

// ─── Logic: requests flow into a core; rules route them, one is refused ──
const CORE = new THREE.Vector3(0, 0.95, 0);
const IN = new THREE.Vector3(-2.0, 0.95, 1.0);
const OUT_A = new THREE.Vector3(1.95, 0.95, 0.95);
const OUT_B = new THREE.Vector3(1.8, 0.95, -1.15);
const REJECT = new THREE.Vector3(-0.2, 0.95, -2.0);
const PACKETS = 12;

export function Sorter({ mod }) {
  const core = useRef();
  const packets = useRef([]);
  const flash = useRef();

  useFrame(() => {
    const { s } = mod.current;
    if (core.current) {
      core.current.rotation.y = s * Math.PI * 4;
      core.current.rotation.z = s * Math.PI * 1.2;
    }
    let refuse = 0;
    for (let j = 0; j < PACKETS; j += 1) {
      const p = packets.current[j];
      if (!p) continue;
      const t = (s * 2.4 + j / PACKETS) % 1;
      const rejected = j % 4 === 3;
      if (t < 0.5) {
        p.position.lerpVectors(IN, CORE, t * 2);
        p.material = M.accent;
      } else {
        const u = (t - 0.5) * 2;
        p.position.lerpVectors(CORE, rejected ? REJECT : j % 2 ? OUT_A : OUT_B, u);
        if (rejected) {
          p.position.y -= u * u * 0.9;
          refuse = Math.max(refuse, Math.exp(-(((u - 0.12) / 0.12) ** 2)));
        }
        p.material = rejected ? M.deep : M.hi;
      }
      p.visible = s > 0.03;
    }
    if (flash.current) flash.current.material.opacity = 0.1 + 0.6 * refuse;
  });

  return (
    <group>
      {/* the intake, two outputs and a refusal chute */}
      <Block size={[0.6, 0.5, 0.6]} position={[IN.x, 0.25, IN.z]} />
      <Block size={[0.6, 0.35, 0.6]} position={[OUT_A.x, 0.18, OUT_A.z]} material={M.body2} />
      <Block size={[0.6, 0.35, 0.6]} position={[OUT_B.x, 0.18, OUT_B.z]} material={M.body2} />
      <mesh position={[REJECT.x, 0.05, REJECT.z]} material={M.body2}>
        <cylinderGeometry args={[0.34, 0.26, 0.1, 20]} />
      </mesh>
      <Line points={[IN.toArray(), CORE.toArray()]} color={C.deep} lineWidth={1.4} />
      <Line points={[CORE.toArray(), OUT_A.toArray()]} color={C.accent} lineWidth={1.4} />
      <Line points={[CORE.toArray(), OUT_B.toArray()]} color={C.accent} lineWidth={1.4} />
      <Line points={[CORE.toArray(), [REJECT.x, 0.3, REJECT.z]]} color={C.deep} lineWidth={1} dashed dashSize={0.1} gapSize={0.08} />
      {/* the rules */}
      <group position={CORE.toArray()}>
        <group ref={core}>
          <mesh material={M.wire}>
            <dodecahedronGeometry args={[0.6, 0]} />
          </mesh>
          <mesh material={M.hi}>
            <boxGeometry args={[0.32, 0.32, 0.32]} />
          </mesh>
        </group>
        <Glow size={3} opacity={0.45} />
        <mesh ref={flash} position={[0, 0, -0.75]}>
          <circleGeometry args={[0.45, 28]} />
          <meshBasicMaterial color={C.deep} transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {Array.from({ length: PACKETS }, (_, j) => (
        <mesh key={j} ref={(m) => { packets.current[j] = m; }} material={M.accent}>
          <boxGeometry args={[0.13, 0.13, 0.13]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Access: three badges, three gates; each badge stops at its level ────
const GATES = [
  { z: 1.05, w: 2.1, h: 1.7 },
  { z: 0.05, w: 1.65, h: 1.4 },
  { z: -0.95, w: 1.2, h: 1.1 },
];
const BADGE_STOP = [0.45, -0.55, -1.45];

export function Gate({ mod }) {
  const badges = useRef([]);
  const bars = useRef([]);
  const lights = useMemo(() => GATES.map(() => basic(C.deep)), []);
  const heart = useRef();

  useFrame(() => {
    const { s } = mod.current;
    const shut = [0, 0, 0];
    const pass = [0, 0, 0];
    let core = 0;
    for (let k = 0; k < 3; k += 1) {
      const w0 = k / 3;
      const u = smooth(w0 + 0.02, w0 + 0.22, s);
      const z = lerp(2.15, BADGE_STOP[k], u);
      const b = badges.current[k];
      if (b) {
        b.position.set((k - 1) * 0.32, 0.62, z);
        b.visible = s > w0 - 0.02;
        b.rotation.y = (1 - u) * 0.6;
      }
      const held = smooth(w0 + 0.2, w0 + 0.24, s) * (1 - smooth(w0 + 0.3, w0 + 0.33, s));
      if (k < 2) shut[k + 1] = Math.max(shut[k + 1], held);
      else core = smooth(w0 + 0.18, w0 + 0.24, s);
      GATES.forEach((g, gi) => {
        if (gi <= k) pass[gi] = Math.max(pass[gi], Math.exp(-(((z - g.z) / 0.35) ** 2)) * (s > w0 ? 1 : 0));
      });
    }
    GATES.forEach((_, gi) => {
      lights[gi].color.set(C.deep).lerp(col.set(C.hi), pass[gi]);
      const bar = bars.current[gi];
      if (bar) {
        bar.scale.y = Math.max(0.001, shut[gi]);
        bar.visible = shut[gi] > 0.01;
      }
    });
    if (heart.current) heart.current.scale.setScalar(0.6 + 0.6 * core);
  });

  return (
    <group>
      {GATES.map((g, gi) => (
        <group key={gi} position={[0, 0, g.z]}>
          <Frame w={g.w} h={g.h} material={lights[gi]} />
          <mesh ref={(m) => { bars.current[gi] = m; }} position={[0, g.h / 2, 0]} material={M.glass}>
            <boxGeometry args={[g.w - 0.1, g.h - 0.1, 0.02]} />
          </mesh>
        </group>
      ))}
      {/* what the innermost gate protects */}
      <group position={[0, 0.55, -1.8]}>
        <mesh ref={heart} material={M.hi}>
          <octahedronGeometry args={[0.28, 0]} />
        </mesh>
        <Glow size={2.2} opacity={0.45} />
      </group>
      {[0, 1, 2].map((k) => (
        <group key={k} ref={(m) => { badges.current[k] = m; }}>
          <Block size={[0.32, 0.44, 0.04]} material={M.body2} />
          {Array.from({ length: k + 1 }, (_, i) => (
            <mesh key={i} position={[0, 0.12 - i * 0.1, 0.025]} material={M.hi}>
              <boxGeometry args={[0.2, 0.05, 0.01]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── Interface: panels fly into a browser window and a phone ──────
const BROWSER = [
  // x, y, w, h, material
  [0, 0.7, 2.6, 0.14, "deep"],
  [-0.5, 0.22, 1.5, 0.64, "accent"],
  [0.82, 0.22, 0.9, 0.64, "body2"],
  [-0.88, -0.36, 0.78, 0.4, "body2"],
  [0, -0.36, 0.78, 0.4, "body2"],
  [0.88, -0.36, 0.78, 0.4, "body2"],
  [0, -0.78, 2.6, 0.1, "deep"],
];
const PHONE = [
  [0, 0.48, 0.52, 0.12, "deep"],
  [0, 0.14, 0.52, 0.42, "accent"],
  [0, -0.28, 0.52, 0.3, "body2"],
];

export function Wireframe({ mod }) {
  const panels = useRef([]);
  const phone = useRef([]);

  useFrame(() => {
    const { s } = mod.current;
    const fly = (m, [x, y], t) => {
      if (!m) return;
      const u = smooth(0, 1, t);
      m.position.set(x, lerp(y + 1.5, y, u), lerp(1.6, 0.05, u));
      m.rotation.set((1 - u) * -0.9, (1 - u) * 0.5, 0);
      m.visible = t > 0.001;
    };
    BROWSER.forEach((p, i) => fly(panels.current[i], p, clamp01((s - 0.03 - i * 0.075) / 0.14)));
    PHONE.forEach((p, i) => fly(phone.current[i], p, clamp01((s - 0.62 - i * 0.09) / 0.14)));
  });

  const pick = (k) => M[k];
  return (
    <group>
      <group position={[-0.45, 1.2, -0.55]}>
        <Block size={[2.95, 2.05, 0.06]} />
        <mesh position={[0, 0.93, 0.035]} material={M.body2}>
          <boxGeometry args={[2.9, 0.14, 0.01]} />
        </mesh>
        {[-1.3, -1.18, -1.06].map((x) => (
          <mesh key={x} position={[x, 0.93, 0.045]} material={M.accent}>
            <circleGeometry args={[0.035, 12]} />
          </mesh>
        ))}
        {BROWSER.map((p, i) => (
          <mesh key={i} ref={(m) => { panels.current[i] = m; }} material={pick(p[4])}>
            <boxGeometry args={[p[2], p[3], 0.03]} />
          </mesh>
        ))}
      </group>
      <group position={[1.7, 0.8, 0.55]} rotation={[0, -0.35, 0]}>
        <Block size={[0.66, 1.3, 0.06]} radius={0.06} />
        {PHONE.map((p, i) => (
          <mesh key={i} ref={(m) => { phone.current[i] = m; }} material={pick(p[4])}>
            <boxGeometry args={[p[2], p[3], 0.03]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── Run: a heartbeat, uptime bars and a clock that fires scheduled jobs ──
const BEAT_POINTS = 140;
function ecg(u) {
  const ph = (u * 4) % 1;
  if (ph > 0.14 && ph < 0.24) return Math.sin(((ph - 0.14) / 0.1) * Math.PI) * 0.08;
  if (ph > 0.38 && ph < 0.44) return ((ph - 0.38) / 0.06) * 0.7;
  if (ph >= 0.44 && ph < 0.5) return 0.7 - ((ph - 0.44) / 0.06) * 0.95;
  if (ph >= 0.5 && ph < 0.55) return -0.25 + ((ph - 0.5) / 0.05) * 0.25;
  if (ph > 0.66 && ph < 0.8) return Math.sin(((ph - 0.66) / 0.14) * Math.PI) * 0.14;
  return 0;
}
const BARS = 14;

export function Pulse({ mod }) {
  const line = useRef();
  const head = useRef();
  const bars = useRef();
  const hand = useRef();
  const fire = useRef();
  const pts = useMemo(() => Array.from({ length: BEAT_POINTS }, (_, i) => {
    const u = i / (BEAT_POINTS - 1);
    return [lerp(-2.05, 2.05, u), 0.45 + ecg(u), 1.05];
  }), []);

  useEffect(() => {
    const b = bars.current;
    for (let i = 0; i < BARS; i += 1) {
      b.setColorAt(i, col.set(OFF));
    }
    b.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const { s } = mod.current;
    const shown = Math.max(2, Math.round(BEAT_POINTS * smooth(0.02, 0.8, s)));
    if (line.current) line.current.geometry.instanceCount = shown - 1;
    if (head.current) head.current.position.set(...pts[shown - 1]);
    const b = bars.current;
    if (b) {
      for (let i = 0; i < BARS; i += 1) {
        const u = smooth(0.1 + i * 0.04, 0.2 + i * 0.04, s);
        const h = 0.08 + 0.72 * u * (0.9 + ((i * 7) % 3) * 0.05);
        dummy.position.set(lerp(-2.0, 0.55, i / (BARS - 1)), h / 2, -0.55);
        dummy.scale.set(1, h, 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        b.setMatrixAt(i, dummy.matrix);
        b.setColorAt(i, col.set(OFF).lerp(tmpc.set(C.accent), u));
      }
      b.instanceMatrix.needsUpdate = true;
      b.instanceColor.needsUpdate = true;
    }
    const turns = s * 2;
    if (hand.current) hand.current.rotation.z = -turns * Math.PI * 2;
    const near12 = Math.exp(-(((((turns + 0.5) % 1) - 0.5) / 0.05) ** 2));
    if (fire.current) fire.current.material.opacity = 0.1 + 0.8 * (s > 0.05 ? near12 : 0);
  });

  return (
    <group>
      <Line ref={line} points={pts} color={C.hi} lineWidth={2.4} />
      <group ref={head}>
        <mesh material={M.hi}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
        <Glow size={1} opacity={0.6} />
      </group>
      <mesh position={[0, 0.45, 1.05]} material={M.body2}>
        <boxGeometry args={[4.2, 0.012, 0.012]} />
      </mesh>
      <instancedMesh ref={bars} args={[null, null, BARS]}>
        <boxGeometry args={[0.14, 1, 0.3]} />
        <meshBasicMaterial />
      </instancedMesh>
      {/* the clock of scheduled jobs */}
      <group position={[1.45, 1.05, -0.95]} rotation={[0, 0.4, 0]}>
        <mesh material={M.body} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.08, 40]} />
        </mesh>
        <mesh material={M.accent} position={[0, 0, 0.02]}>
          <torusGeometry args={[0.72, 0.03, 8, 48]} />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.sin(a) * 0.58, Math.cos(a) * 0.58, 0.05]} rotation={[0, 0, -a]} material={i === 0 ? M.hi : M.deep}>
              <boxGeometry args={[0.04, 0.12, 0.02]} />
            </mesh>
          );
        })}
        <group ref={hand} position={[0, 0, 0.07]}>
          <mesh position={[0, 0.25, 0]} material={M.hi}>
            <boxGeometry args={[0.05, 0.5, 0.02]} />
          </mesh>
        </group>
        <mesh ref={fire} position={[0, 0.58, 0.08]}>
          <circleGeometry args={[0.16, 20]} />
          <meshBasicMaterial color={C.hi} transparent opacity={0.1} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
