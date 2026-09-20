import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { IMAGES } from "../../../data/images";
import { clamp01, easeIn, lerp, smooth } from "../timeline";
import { Block, C, Glow, M } from "./common";

const dummy = new THREE.Object3D();
const col = new THREE.Color();
const tmp = new THREE.Color();

// ─── Data: questions and records drop into a database drum ───────
export function Vault({ mod }) {
  const cubes = useRef();
  const rings = useRef([]);
  const top = useRef();
  const N = 56;
  const data = useMemo(
    () =>
      Array.from({ length: N }, (_, j) => {
        const a = j * 2.399;
        const r = 0.1 + (((j * 37) % 10) / 10) * 0.62;
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, t0: (j / N) * 0.76 };
      }),
    [],
  );

  useFrame(() => {
    const { s } = mod.current;
    data.forEach((d, j) => {
      const q = clamp01((s - d.t0) / 0.2);
      const live = q > 0 && q < 1 ? 1 : 0;
      dummy.position.set(d.x, lerp(3.1, 1.62, easeIn(q)), d.z);
      dummy.rotation.set(q * 3, q * 5, 0);
      dummy.scale.setScalar(live * 0.95);
      dummy.updateMatrix();
      cubes.current.setMatrixAt(j, dummy.matrix);
    });
    cubes.current.instanceMatrix.needsUpdate = true;
    rings.current.forEach((r, k) => {
      if (!r) return;
      r.material.color.set(s > (k + 1) / 4.2 ? C.hi : C.deep);
    });
    if (top.current) top.current.material.opacity = 0.15 + 0.7 * s;
  });

  return (
    <group>
      {[0, 1, 2].map((k) => (
        <group key={k} position={[0, 0.27 + k * 0.5, 0]}>
          <mesh material={M.body}>
            <cylinderGeometry args={[1.05, 1.05, 0.4, 44]} />
          </mesh>
          <mesh
            ref={(m) => {
              rings.current[k] = m;
            }}
            position={[0, 0.2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[1.05, 0.03, 8, 64]} />
            <meshBasicMaterial color={C.deep} />
          </mesh>
        </group>
      ))}
      <mesh ref={top} position={[0, 1.485, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.98, 40]} />
        <meshBasicMaterial color={C.accent} transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <Glow position={[0, 1.5, 0]} size={4} opacity={0.35} />
      <instancedMesh ref={cubes} args={[null, null, N]} material={M.hi}>
        <boxGeometry args={[0.13, 0.13, 0.13]} />
      </instancedMesh>
    </group>
  );
}

// ─── Engine: three front doors, one brain ────────────────────────
const HUB = new THREE.Vector3(0, 1.05, 0);
const DOORS = [new THREE.Vector3(-1.85, 0.6, 0.55), new THREE.Vector3(1.75, 0.6, 0.95), new THREE.Vector3(0.1, 0.6, -1.85)];

export function Engine({ mod }) {
  const hub = useRef();
  const core = useRef();
  const packets = useRef([]);
  const back = useRef([]);
  const PER = 3;

  useFrame(() => {
    const { s } = mod.current;
    if (hub.current) {
      hub.current.rotation.y = s * Math.PI * 3;
      hub.current.rotation.x = s * Math.PI * 1.4;
    }
    if (core.current) core.current.scale.setScalar(0.85 + 0.15 * Math.sin(s * 40));
    DOORS.forEach((d, i) => {
      for (let j = 0; j < PER; j += 1) {
        const k = i * PER + j;
        const t = (s * 2.6 + j / PER + i * 0.11) % 1;
        const p = packets.current[k];
        if (p) {
          p.position.lerpVectors(d, HUB, t);
          p.scale.setScalar(s > 0.04 ? 1 - Math.abs(t - 0.5) * 0.5 : 0);
        }
        const q = back.current[k];
        if (q) {
          const t2 = (s * 2.6 + j / PER + i * 0.11 + 0.5) % 1;
          q.position.lerpVectors(HUB, d, t2);
          q.position.y += 0.14;
          q.scale.setScalar(s > 0.04 ? 0.8 : 0);
        }
      }
    });
  });

  return (
    <group>
      {/* the three front doors: a website, a phone app, a chat bot */}
      <group position={DOORS[0].toArray()} rotation={[0, 0.7, 0]}>
        <Block size={[1.1, 0.72, 0.07]} />
        <mesh position={[0, 0.2, 0.05]} material={M.accent}>
          <boxGeometry args={[0.9, 0.06, 0.01]} />
        </mesh>
        <mesh position={[-0.2, -0.08, 0.05]} material={M.deep}>
          <boxGeometry args={[0.5, 0.26, 0.01]} />
        </mesh>
      </group>
      <group position={DOORS[1].toArray()} rotation={[0, -0.6, 0]}>
        <Block size={[0.42, 0.78, 0.07]} />
        <mesh position={[0, 0.3, 0.05]} material={M.accent}>
          <boxGeometry args={[0.16, 0.03, 0.01]} />
        </mesh>
        <mesh position={[0, -0.05, 0.05]} material={M.deep}>
          <boxGeometry args={[0.3, 0.4, 0.01]} />
        </mesh>
      </group>
      <group position={DOORS[2].toArray()}>
        <mesh material={M.body} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.3, 0.72, 3]} />
        </mesh>
        <mesh material={M.wire} rotation={[0, 0, -Math.PI / 2]} scale={1.06}>
          <coneGeometry args={[0.3, 0.72, 3]} />
        </mesh>
      </group>
      {/* pedestals */}
      {DOORS.map((d, i) => (
        <mesh key={i} position={[d.x, 0.06, d.z]} material={M.body2}>
          <cylinderGeometry args={[0.38, 0.42, 0.1, 24]} />
        </mesh>
      ))}
      {/* links */}
      {DOORS.map((d, i) => (
        <Line key={i} points={[d.toArray(), HUB.toArray()]} color={C.deep} lineWidth={1.4} transparent opacity={0.85} />
      ))}
      {/* the brain */}
      <group position={HUB.toArray()}>
        <group ref={hub}>
          <mesh material={M.wire}>
            <icosahedronGeometry args={[0.66, 1]} />
          </mesh>
          <mesh ref={core} material={M.hi}>
            <octahedronGeometry args={[0.3, 0]} />
          </mesh>
        </group>
        <Glow size={3.2} opacity={0.5} />
      </group>
      {Array.from({ length: PER * 3 }, (_, k) => (
        <mesh key={`p${k}`} ref={(m) => { packets.current[k] = m; }} material={M.accent}>
          <sphereGeometry args={[0.07, 10, 8]} />
        </mesh>
      ))}
      {Array.from({ length: PER * 3 }, (_, k) => (
        <mesh key={`b${k}`} ref={(m) => { back.current[k] = m; }} material={M.text}>
          <sphereGeometry args={[0.05, 10, 8]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Money and messages: a coin clears a gate, a receipt and an email come out ──
export function Money({ mod }) {
  const coin = useRef();
  const gate = useRef();
  const gateGlow = useRef();
  const receipt = useRef();
  const mail = useRef();
  const stack = useRef([]);

  useFrame(() => {
    const { s } = mod.current;
    const travel = smooth(0.02, 0.5, s);
    const x = lerp(-1.95, 1.0, travel);
    if (coin.current) {
      coin.current.position.set(x, 0.38, 0);
      coin.current.rotation.z = -x / 0.3;
      coin.current.scale.setScalar(1 - smooth(0.5, 0.6, s));
    }
    const near = Math.exp(-(((x - 0.3) / 0.45) ** 2));
    if (gateGlow.current) gateGlow.current.material.opacity = 0.15 + 0.7 * near;
    if (gate.current) gate.current.material.color.set(near > 0.5 ? C.hi : C.accent);
    // the coins waiting to pay
    stack.current.forEach((c, i) => c && (c.visible = i / 3 >= smooth(0, 0.08, s) * 0.34));
    const r = smooth(0.42, 0.62, s);
    if (receipt.current) {
      receipt.current.position.set(1.6, lerp(0.35, 1.0, r), -0.85);
      receipt.current.scale.setScalar(Math.max(0.001, r));
    }
    const m = smooth(0.6, 1, s);
    if (mail.current) {
      mail.current.position.set(lerp(1.25, 3.4, m), lerp(0.4, 2.1, m) + Math.sin(m * 6) * 0.05, lerp(-0.7, -1.2, m));
      mail.current.scale.setScalar(smooth(0.58, 0.68, s) * (1 - smooth(0.92, 1, s) * 0.8));
      mail.current.rotation.z = m * 0.5;
    }
  });

  return (
    <group>
      <mesh position={[-0.2, 0.05, 0]} material={M.body2}>
        <boxGeometry args={[4.2, 0.06, 0.62]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { stack.current[i] = m; }} position={[-1.95, 0.12 + i * 0.09, 0]} material={M.accent}>
          <cylinderGeometry args={[0.32, 0.32, 0.07, 24]} />
        </mesh>
      ))}
      <mesh ref={coin} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.07, 32]} />
        <meshBasicMaterial color={C.hi} />
      </mesh>
      <mesh ref={gate} position={[0.3, 0.62, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.55, 0.05, 12, 48]} />
        <meshBasicMaterial color={C.accent} />
      </mesh>
      <mesh ref={gateGlow} position={[0.3, 0.62, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.53, 32]} />
        <meshBasicMaterial color={C.accent} transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* the receipt */}
      <group ref={receipt} rotation={[0, -0.35, 0]}>
        <Block size={[0.78, 1.0, 0.03]} material={M.text} edge={false} />
        {[0.32, 0.14, -0.04, -0.22].map((y, i) => (
          <mesh key={i} position={[i === 3 ? 0.14 : 0, y, 0.02]} material={M.accent}>
            <boxGeometry args={[i === 3 ? 0.26 : 0.56, 0.06, 0.01]} />
          </mesh>
        ))}
      </group>
      {/* the email that leaves */}
      <group ref={mail}>
        <Block size={[0.8, 0.5, 0.06]} material={M.body} />
        <mesh position={[0, 0.1, 0.04]} rotation={[0, 0, Math.PI]} material={M.accent}>
          <coneGeometry args={[0.36, 0.22, 3]} />
        </mesh>
        <Glow size={1.6} opacity={0.4} />
      </group>
    </group>
  );
}

// ─── Search: 468 pages light up ──────────────────────────────────
const COLS = 26;
const ROWS = 18;
export const PAGES = COLS * ROWS; // 468, the number of pages Google indexed

export function Search({ mod }) {
  const tiles = useRef();
  const glass = useRef();
  const last = useRef(-1);
  const order = useMemo(() => {
    const a = Array.from({ length: PAGES }, (_, i) => i);
    let seed = 7;
    for (let i = a.length - 1; i > 0; i -= 1) {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      const j = seed % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);
  const rank = useMemo(() => {
    const r = new Array(PAGES);
    order.forEach((idx, k) => {
      r[idx] = k;
    });
    return r;
  }, [order]);

  useEffect(() => {
    const t = tiles.current;
    for (let i = 0; i < PAGES; i += 1) {
      const cx = i % COLS;
      const cz = Math.floor(i / COLS);
      dummy.position.set((cx - (COLS - 1) / 2) * 0.165, 0.05, (cz - (ROWS - 1) / 2) * 0.185);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      t.setMatrixAt(i, dummy.matrix);
      t.setColorAt(i, col.set("#2a2a34"));
    }
    t.instanceMatrix.needsUpdate = true;
    t.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const { s } = mod.current;
    const lit = Math.round(lerp(5, PAGES, smooth(0.04, 0.92, s)));
    if (lit !== last.current && tiles.current) {
      last.current = lit;
      for (let i = 0; i < PAGES; i += 1) {
        const k = rank[i];
        if (k < lit) col.set(C.accent).lerp(tmp.set(C.hi), ((k * 7) % 9) / 40).multiplyScalar(0.7 + ((k * 13) % 6) / 16);
        else col.set("#2a2a34");
        tiles.current.setColorAt(i, col);
      }
      tiles.current.instanceColor.needsUpdate = true;
    }
    if (glass.current) {
      glass.current.position.set(Math.sin(s * 5.2) * 1.6, 0.62, Math.cos(s * 3.7) * 0.95);
    }
  });

  return (
    <group>
      <instancedMesh ref={tiles} args={[null, null, PAGES]}>
        <boxGeometry args={[0.125, 0.03, 0.15]} />
        <meshBasicMaterial />
      </instancedMesh>
      {/* the crawler's magnifying glass */}
      <group ref={glass} rotation={[0.25, 0, 0]}>
        <mesh material={M.hi} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.045, 10, 40]} />
        </mesh>
        <mesh material={M.glass} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 32]} />
        </mesh>
        <mesh material={M.hi} position={[0.36, 0, 0.42]} rotation={[Math.PI / 2, 0, -0.78]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        </mesh>
        <Glow size={1.8} opacity={0.35} />
      </group>
    </group>
  );
}

// ─── Interface: the real site on a screen that powers up ─────────
export function Screen({ mod, image }) {
  const tex = useTexture(IMAGES[image]);
  const face = useRef();
  const halo = useRef();
  const W = 4.1;
  const aspect = tex.image ? tex.image.width / tex.image.height : 1.6;
  const Hh = W / aspect;

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame(() => {
    const { s } = mod.current;
    const on = smooth(0.05, 0.6, s);
    if (face.current) face.current.material.color.setScalar(0.06 + 0.94 * on);
    if (halo.current) halo.current.material.opacity = 0.05 + 0.4 * on;
  });

  const y = 0.62 + Hh / 2;
  return (
    <group>
      <mesh position={[0, 0.06, -0.15]} material={M.body2}>
        <boxGeometry args={[1.9, 0.08, 1.0]} />
      </mesh>
      <mesh position={[0, 0.4, -0.55]} material={M.body}>
        <boxGeometry args={[0.28, 0.75, 0.14]} />
      </mesh>
      <group position={[0, y, -0.4]} rotation={[-0.09, 0, 0]}>
        <Glow ref={halo} size={7} opacity={0.3} position={[0, 0, -0.3]} />
        <RoundedBox args={[W + 0.2, Hh + 0.2, 0.1]} radius={0.06} smoothness={3} material={M.body} />
        <Line points={[[-(W + 0.2) / 2, -(Hh + 0.2) / 2, 0.055], [(W + 0.2) / 2, -(Hh + 0.2) / 2, 0.055], [(W + 0.2) / 2, (Hh + 0.2) / 2, 0.055], [-(W + 0.2) / 2, (Hh + 0.2) / 2, 0.055], [-(W + 0.2) / 2, -(Hh + 0.2) / 2, 0.055]]} color={C.accent} lineWidth={1.6} />
        <mesh ref={face} position={[0, 0, 0.058]}>
          <planeGeometry args={[W, Hh]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
