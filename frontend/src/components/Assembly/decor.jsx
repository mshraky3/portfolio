import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { clamp01, lerp, smooth } from "./timeline";
import { RIGS, TUNNEL_D } from "./rigs";
import { C, Glow, M } from "./visuals/common";

// The scenery each rig adds around its modules: the road, the orbit, the lens
// rings, the machine's shell, the gallery rail. Modules report their world
// positions in state.current.groups, so scenery can point at them.

const col = new THREE.Color();

// ─── SQB: the road, the stations, and the student walking it ──────
function Road({ state, ctx, n }) {
  const walker = useRef();
  const trail = useRef([]);
  const beams = useRef([]);
  const pads = useRef([]);
  const tube = useMemo(() => new THREE.TubeGeometry(ctx.curve, 240, 0.06, 6, false), [ctx.curve]);
  const band = useMemo(() => new THREE.TubeGeometry(ctx.curve, 240, 0.55, 8, false), [ctx.curve]);
  const at = (x, out) => ctx.curve.getPointAt(clamp01((x - ctx.xMin) / (ctx.xMax - ctx.xMin)), out);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const st = state.current;
    const x = RIGS.path.walkerX(st, ctx, n);
    if (walker.current) {
      at(x, tmp);
      walker.current.position.set(tmp.x, 0.55 + Math.sin(st.T * 9) * 0.06, tmp.z);
    }
    trail.current.forEach((t, k) => {
      if (!t) return;
      at(x - (k + 1) * 0.45, tmp);
      t.position.set(tmp.x, 0.5, tmp.z);
      t.scale.setScalar(1 - k * 0.14);
    });
    for (let i = 0; i < n; i += 1) {
      const on = st.mods[i].active;
      const b = beams.current[i];
      if (b) {
        b.material.opacity = 0.08 + 0.7 * on;
      }
      const p = pads.current[i];
      if (p) p.material.color.set(C.deep).lerp(col.set(C.hi), on);
    }
  });

  return (
    <group>
      <mesh geometry={band} scale={[1, 0.04, 1]} position={[0, -0.02, 0]}>
        <meshBasicMaterial color="#141019" />
      </mesh>
      <mesh geometry={tube} material={M.accent} />
      {ctx.stations.map((s, i) => {
        at(s.x, tmp);
        return (
          <group key={i}>
            <mesh ref={(m) => { pads.current[i] = m; }} position={[s.x, 0.01, s.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.95, 3.12, 64]} />
              <meshBasicMaterial color={C.deep} />
            </mesh>
            <mesh ref={(m) => { beams.current[i] = m; }} position={[(s.x + tmp.x) / 2, 0.05, (s.z + 2.9 + tmp.z) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.35, Math.max(0.1, tmp.z - s.z - 2.9)]} />
              <meshBasicMaterial color={C.accent} transparent opacity={0.1} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
      {/* the student */}
      <group ref={walker}>
        <mesh material={M.hi}>
          <sphereGeometry args={[0.26, 20, 20]} />
        </mesh>
        <Glow size={2.4} opacity={0.7} />
      </group>
      {[0, 1, 2, 3, 4].map((k) => (
        <mesh key={k} ref={(m) => { trail.current[k] = m; }} material={M.accent}>
          <sphereGeometry args={[0.1, 8, 8]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── HR: the orbit ring and the spokes from the globe to each module ──
function Orbit({ state, n }) {
  const spokes = useRef();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Array(Math.max(1, n - 1) * 6).fill(0), 3));
    return g;
  }, [n]);
  const ring = useMemo(() => Array.from({ length: 129 }, (_, k) => {
    const a = (k / 128) * Math.PI * 2;
    return [Math.sin(a) * 9.5, 0.02, Math.cos(a) * 9.5];
  }), []);

  useFrame(() => {
    const st = state.current;
    const pos = geo.getAttribute("position");
    for (let i = 1; i < n; i += 1) {
      const g = st.groups[i];
      const k = (i - 1) * 2;
      pos.setXYZ(k, 0, 2.6, 0);
      if (g && g.visible) pos.setXYZ(k + 1, g.position.x, g.position.y + 0.4, g.position.z);
      else pos.setXYZ(k + 1, 0, 2.6, 0);
    }
    pos.needsUpdate = true;
    if (spokes.current) spokes.current.material.opacity = 0.25 + 0.35 * (1 - st.ov);
  });

  return (
    <group>
      <Line points={ring} color={C.deep} lineWidth={1.2} dashed dashSize={0.3} gapSize={0.25} />
      <lineSegments ref={spokes} geometry={geo}>
        <lineBasicMaterial color={C.accent} transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
}

// ─── NeuroLink: lens rings to fly through, and drifting specks ────
function Tunnel({ state, n }) {
  const rings = useRef([]);
  const specks = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = [];
    let seed = 11;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let k = 0; k < 500; k += 1) {
      const a = rnd() * Math.PI * 2;
      const r = 5 + rnd() * 9;
      p.push(Math.cos(a) * r, 3 + Math.sin(a) * r * 0.6, 8 - rnd() * (n * TUNNEL_D + 14));
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    return g;
  }, [n]);

  useFrame(() => {
    const st = state.current;
    rings.current.forEach((r, i) => {
      if (!r) return;
      const d = Math.abs(st.f - i + 0.45);
      const near = Math.exp(-d * d * 3);
      r.rotation.z = st.T * (i % 2 ? -0.6 : 0.6);
      const open = lerp(0.72, 1.15, smooth(0, 1, near));
      r.scale.setScalar(open);
      r.children.forEach((c) => {
        if (c.material) c.material.opacity = 0.25 + 0.65 * near;
      });
    });
  });

  return (
    <group>
      {Array.from({ length: n }, (_, i) => (
        <group key={i} ref={(g) => { rings.current[i] = g; }} position={[0, 3, -i * TUNNEL_D + TUNNEL_D * 0.5]}>
          <mesh>
            <torusGeometry args={[6.4, 0.07, 10, 96]} />
            <meshBasicMaterial color={C.accent} transparent opacity={0.4} />
          </mesh>
          {Array.from({ length: 12 }, (_, k) => {
            const a = (k / 12) * Math.PI * 2;
            return (
              <mesh key={k} position={[Math.cos(a) * 5.7, Math.sin(a) * 5.7, 0]} rotation={[0, 0, a + 0.6]}>
                <boxGeometry args={[1.3, 0.08, 0.04]} />
                <meshBasicMaterial color={C.hi} transparent opacity={0.4} />
              </mesh>
            );
          })}
        </group>
      ))}
      <points geometry={specks}>
        <pointsMaterial color={C.hi} size={0.07} transparent opacity={0.55} depthWrite={false} />
      </points>
    </group>
  );
}

// ─── Email: the machine whose walls fold open ─────────────────────
const W = 5.6;
const HGT = 2.6;
function Machine({ state, n }) {
  const walls = useRef([]);
  const lid = useRef();
  const core = useRef();
  const guides = useRef();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Array(n * 6).fill(0), 3));
    return g;
  }, [n]);
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: C.body, metalness: 0.5, roughness: 0.45, transparent: true, opacity: 0.92, side: THREE.DoubleSide }), []);

  useFrame(() => {
    const st = state.current;
    const e = RIGS.explode.open(st);
    const fold = smooth(0, 0.55, e);
    walls.current.forEach((w) => {
      if (w) w.rotation.x = fold * (Math.PI / 2);
    });
    if (lid.current) {
      lid.current.position.y = HGT + smooth(0, 0.5, e) * 5;
      lid.current.rotation.z = smooth(0, 0.6, e) * 0.5;
      lid.current.visible = e < 0.95;
    }
    if (core.current) {
      core.current.rotation.y = st.T * 1.4;
      core.current.scale.setScalar(0.7 + 0.5 * e);
    }
    const pos = geo.getAttribute("position");
    for (let i = 0; i < n; i += 1) {
      const g = st.groups[i];
      pos.setXYZ(i * 2, 0, 0.9, 0);
      if (g) pos.setXYZ(i * 2 + 1, g.position.x, 0.3, g.position.z);
    }
    pos.needsUpdate = true;
    if (guides.current) {
      guides.current.computeLineDistances();
      guides.current.material.opacity = 0.6 * smooth(0.2, 0.8, e);
    }
  });

  // Four walls, hinged at the floor, each folding outward.
  const sides = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
  return (
    <group>
      {sides.map((a, k) => (
        <group key={k} rotation={[0, a, 0]}>
          <group position={[0, 0, W / 2]}>
            <group ref={(g) => { walls.current[k] = g; }}>
              <mesh position={[0, HGT / 2, 0]} material={wallMat}>
                <boxGeometry args={[W, HGT, 0.08]} />
              </mesh>
              <mesh position={[0, HGT / 2, 0.05]} material={M.accent}>
                <boxGeometry args={[W * 0.6, 0.05, 0.01]} />
              </mesh>
            </group>
          </group>
        </group>
      ))}
      <group ref={lid}>
        <mesh material={M.body2}>
          <boxGeometry args={[W + 0.2, 0.12, W + 0.2]} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.accent}>
          <ringGeometry args={[0.6, 0.72, 40]} />
        </mesh>
      </group>
      {/* the gateway's heart */}
      <group ref={core} position={[0, 1.1, 0]}>
        <mesh material={M.wire}>
          <octahedronGeometry args={[0.9, 0]} />
        </mesh>
        <mesh material={M.hi}>
          <octahedronGeometry args={[0.38, 0]} />
        </mesh>
        <Glow size={3.4} opacity={0.5} />
      </group>
      <lineSegments ref={guides} geometry={geo}>
        <lineDashedMaterial color={C.accent} dashSize={0.3} gapSize={0.2} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

// ─── Sites: a rail under the row of screens ───────────────────────
function Rail({ ctx }) {
  const len = ctx.xs.length > 1 ? ctx.xs[ctx.xs.length - 1] - ctx.xs[0] + 10 : 10;
  return (
    <group>
      <mesh position={[0, -0.25, 2.7]} material={M.body2}>
        <boxGeometry args={[len, 0.08, 0.3]} />
      </mesh>
      <mesh position={[0, -0.2, 2.7]} material={M.accent}>
        <boxGeometry args={[len, 0.02, 0.05]} />
      </mesh>
      {ctx.xs.map((x) => (
        <Glow key={x} position={[x, 0, 2.7]} size={2} opacity={0.35} />
      ))}
    </group>
  );
}

export const DECOR = { road: Road, orbit: Orbit, tunnel: Tunnel, machine: Machine, rail: Rail };
