import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { CONNECTIONS, POSES, lerpCurl, poseHand } from "./handPose";
import { clamp01, lerp, smooth } from "../timeline";
import { Block, C, Glow, M } from "./common";

const dummy = new THREE.Object3D();
const TIPS = [4, 8, 12, 16, 20];

// ─── Camera: a webcam looks at a frame, a scan line sweeps it ────
export function Webcam({ mod }) {
  const scan = useRef();
  const frame = useRef();
  const beam = useRef();

  useFrame(() => {
    const { s } = mod.current;
    if (scan.current) scan.current.position.y = lerp(-0.78, 0.78, (s * 2.2) % 1);
    if (frame.current) frame.current.scale.setScalar(0.6 + 0.4 * smooth(0, 0.3, s));
    if (beam.current) beam.current.material.opacity = 0.05 + 0.1 * smooth(0, 0.2, s);
  });

  const corners = (w, h, k = 0.28) => [
    [[-w, h - k, 0], [-w, h, 0], [-w + k, h, 0]],
    [[w - k, h, 0], [w, h, 0], [w, h - k, 0]],
    [[w, -h + k, 0], [w, -h, 0], [w - k, -h, 0]],
    [[-w + k, -h, 0], [-w, -h, 0], [-w, -h + k, 0]],
  ];

  return (
    <group>
      <group position={[0, 0.5, -1.6]}>
        <Block size={[1.5, 0.66, 0.6]} />
        <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]} material={M.body2}>
          <cylinderGeometry args={[0.27, 0.27, 0.1, 28]} />
        </mesh>
        <mesh position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]} material={M.hi}>
          <cylinderGeometry args={[0.13, 0.13, 0.04, 24]} />
        </mesh>
        <Glow position={[0, 0, 0.45]} size={1} opacity={0.6} />
        <mesh position={[0, -0.5, 0]} material={M.body2}>
          <boxGeometry args={[0.16, 0.36, 0.16]} />
        </mesh>
      </group>
      {/* the beam */}
      <mesh ref={beam} position={[0, 0.85, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.25, 3.4, 4, 1, true]} />
        <meshBasicMaterial color={C.accent} transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* the frame being analysed */}
      <group ref={frame} position={[0, 0.98, 1.55]}>
        {corners(1.15, 0.78).map((pts, i) => (
          <Line key={i} points={pts} color={C.hi} lineWidth={2.2} />
        ))}
        <mesh ref={scan} position={[0, 0, 0]} material={M.accent}>
          <boxGeometry args={[2.2, 0.025, 0.02]} />
        </mesh>
        {[[-0.55, 0.35], [0.5, 0.42], [0.05, -0.2], [-0.3, -0.5], [0.6, -0.45]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0]} material={M.deep}>
            <sphereGeometry args={[0.05, 8, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── Hand: 21 landmarks appear, join up, then follow poses ───────
function curlAt(s) {
  const t = smooth(0.34, 0.98, s) * 3;
  const k = Math.min(2, Math.floor(t));
  return lerpCurl(POSES[k % 3].curl, POSES[(k + 1) % 3].curl, smooth(0, 1, t - k));
}

export function Hand({ mod }) {
  const pts = useRef([]);
  const box = useRef();
  const ring = useRef();
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(CONNECTIONS.length * 6), 3));
    return g;
  }, []);

  useFrame(() => {
    const { s } = mod.current;
    const p = poseHand(s < 0.34 ? POSES[0].curl : curlAt(s));
    const shown = Math.round(21 * smooth(0.02, 0.32, s));
    const order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    order.forEach((idx, k) => {
      const m = pts.current[idx];
      if (!m) return;
      m.position.set(p[idx][0], p[idx][1], p[idx][2]);
      m.scale.setScalar(k < shown ? 1 : 0.0001);
    });
    const arr = geometry.attributes.position.array;
    CONNECTIONS.forEach(([a, b], i) => {
      const ok = a < shown && b < shown;
      arr.set(ok ? p[a] : p[0], i * 6);
      arr.set(ok ? p[b] : p[0], i * 6 + 3);
    });
    geometry.attributes.position.needsUpdate = true;
    if (box.current) {
      let minX = 9, maxX = -9, minY = 9, maxY = -9;
      p.forEach((v) => {
        minX = Math.min(minX, v[0]); maxX = Math.max(maxX, v[0]);
        minY = Math.min(minY, v[1]); maxY = Math.max(maxY, v[1]);
      });
      box.current.position.set((minX + maxX) / 2, (minY + maxY) / 2, 0);
      box.current.scale.set(maxX - minX + 0.3, maxY - minY + 0.3, 1);
      box.current.visible = s > 0.3;
    }
    if (ring.current) ring.current.rotation.z = s * Math.PI * 4;
  });

  return (
    <group>
      <mesh ref={ring} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.56, 64, 1]} />
        <meshBasicMaterial color={C.deep} side={THREE.DoubleSide} />
      </mesh>
      <group position={[0, 0.2, 0]} scale={0.76} rotation={[-0.12, 0.25, 0]}>
        <lineSegments geometry={geometry}>
          <lineBasicMaterial color={C.hi} />
        </lineSegments>
        {Array.from({ length: 21 }, (_, i) => (
          <mesh key={i} ref={(m) => { pts.current[i] = m; }} material={TIPS.includes(i) ? M.hi : M.text}>
            <sphereGeometry args={[TIPS.includes(i) ? 0.075 : 0.05, 12, 10]} />
          </mesh>
        ))}
        <mesh ref={box}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={C.accent} transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Face: landmarks bloom over a head that looks around ─────────
const FACE_PTS = 96;

export function Face({ mod }) {
  const head = useRef();
  const dots = useRef();
  const gaze = useRef();
  const pts = useMemo(() => {
    const out = [];
    for (let i = 0; i < FACE_PTS; i += 1) {
      const y = 1 - (i / (FACE_PTS - 1)) * 1.8 - 0.05;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = i * 2.399963;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      out.push([x * 0.85, y * 1.05, z * 0.9]);
    }
    return out;
  }, []);

  useEffect(() => {
    const d = dots.current;
    pts.forEach((p, i) => {
      dummy.position.set(...p);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      d.setMatrixAt(i, dummy.matrix);
    });
    d.instanceMatrix.needsUpdate = true;
  }, [pts]);

  useFrame(() => {
    const { s } = mod.current;
    const shown = Math.round(FACE_PTS * smooth(0.02, 0.4, s));
    pts.forEach((p, i) => {
      dummy.position.set(...p);
      dummy.scale.setScalar(i < shown ? (p[2] > 0.1 ? 1.15 : 0.7) : 0.0001);
      dummy.updateMatrix();
      dots.current.setMatrixAt(i, dummy.matrix);
    });
    dots.current.instanceMatrix.needsUpdate = true;
    const t = smooth(0.3, 1, s) * Math.PI * 4;
    if (head.current) head.current.rotation.set(Math.sin(t * 0.9 + 1) * 0.3, Math.sin(t * 0.6) * 0.8, Math.sin(t * 0.5 + 2) * 0.16);
    if (gaze.current) gaze.current.material.opacity = 0.75 * smooth(0.3, 0.45, s);
  });

  return (
    <group position={[0, 1.08, 0]} scale={0.84}>
      <group ref={head}>
        <mesh scale={[0.85, 1.05, 0.9]}>
          <sphereGeometry args={[0.97, 20, 14]} />
          <meshBasicMaterial color={C.deep} wireframe transparent opacity={0.4} />
        </mesh>
        <instancedMesh ref={dots} args={[null, null, FACE_PTS]} material={M.hi}>
          <sphereGeometry args={[0.035, 8, 6]} />
        </instancedMesh>
        <mesh position={[0, -0.05, 0.98]} rotation={[Math.PI / 2, 0, 0]} material={M.text}>
          <coneGeometry args={[0.1, 0.26, 10]} />
        </mesh>
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.2, 0.8]} material={M.accent}>
            <sphereGeometry args={[0.08, 10, 8]} />
          </mesh>
        ))}
        <mesh ref={gaze} position={[0, 0.2, 1.9]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 2, 6]} />
          <meshBasicMaterial color={C.accent} transparent opacity={0.7} />
        </mesh>
      </group>
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.95, 48]} />
        <meshBasicMaterial color={C.deep} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Protocol: six timed blocks, drawn to scale (185 seconds) ────
const BLOCKS = [20, 40, 30, 40, 25, 30];
const TOTAL = BLOCKS.reduce((a, b) => a + b, 0);
const SPAN = 4.2;

export function Protocol({ mod }) {
  const bars = useRef([]);
  const head = useRef();
  const icons = useRef([]);
  const layout = useMemo(() => {
    let x = -SPAN / 2;
    return BLOCKS.map((sec) => {
      const w = (sec / TOTAL) * SPAN;
      const item = { x0: x, w, cx: x + w / 2 };
      x += w;
      return item;
    });
  }, []);

  useFrame(() => {
    const { s } = mod.current;
    const at = smooth(0.08, 0.96, s);
    if (head.current) head.current.position.x = -SPAN / 2 + at * SPAN;
    layout.forEach((b, i) => {
      const reached = clamp01((at * SPAN + SPAN / 2 - (b.x0 + SPAN / 2)) / b.w);
      const bar = bars.current[i];
      if (bar) {
        bar.scale.y = 0.35 + reached * 0.65;
        bar.position.y = 0.09 + (0.35 + reached * 0.65) * 0.21;
        bar.material.color.set(reached >= 1 ? C.accent : reached > 0 ? C.hi : C.dim);
      }
      const ic = icons.current[i];
      if (ic) {
        ic.position.y = 0.9 + reached * 0.25;
        ic.scale.setScalar(0.2 + 0.8 * smooth(0, 0.3, reached));
        ic.rotation.y = reached * 3;
      }
    });
  });

  return (
    <group>
      {layout.map((b, i) => (
        <group key={i}>
          <mesh ref={(m) => { bars.current[i] = m; }} position={[b.cx, 0.2, 0]}>
            <boxGeometry args={[b.w - 0.07, 0.42, 1.2]} />
            <meshStandardMaterial color={C.dim} metalness={0.3} roughness={0.5} />
          </mesh>
          <group ref={(m) => { icons.current[i] = m; }} position={[b.cx, 0.9, 0]}>
            <BlockIcon kind={i} />
          </group>
        </group>
      ))}
      <group ref={head} position={[-SPAN / 2, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.025, 0.85, 1.4]} />
          <meshBasicMaterial color={C.hi} transparent opacity={0.45} depthWrite={false} />
        </mesh>
        <Glow position={[0, 0.65, 0]} size={1.4} opacity={0.4} />
      </group>
    </group>
  );
}

// One small shape per block: calibrate, look at faces, respond to name, point, wave, pop bubbles.
function BlockIcon({ kind }) {
  switch (kind) {
    case 0:
      return (
        <mesh material={M.hi}>
          <torusGeometry args={[0.16, 0.03, 8, 24]} />
        </mesh>
      );
    case 1:
      return (
        <group>
          {[-0.14, 0.14].map((x) => (
            <mesh key={x} position={[x, 0, 0]} material={M.accent}>
              <sphereGeometry args={[0.11, 12, 10]} />
            </mesh>
          ))}
        </group>
      );
    case 2:
      return (
        <group>
          {[0.1, 0.2].map((r) => (
            <mesh key={r} material={M.accent}>
              <torusGeometry args={[r, 0.015, 6, 24]} />
            </mesh>
          ))}
        </group>
      );
    case 3:
      return (
        <mesh material={M.hi} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.11, 0.34, 10]} />
        </mesh>
      );
    case 4:
      return (
        <mesh material={M.accent}>
          <boxGeometry args={[0.32, 0.22, 0.04]} />
        </mesh>
      );
    default:
      return (
        <group>
          {[[-0.13, -0.04], [0.1, 0.06], [0, -0.14]].map(([x, y], j) => (
            <mesh key={j} position={[x, y, 0]} material={M.glass}>
              <sphereGeometry args={[0.1 + j * 0.02, 12, 10]} />
            </mesh>
          ))}
        </group>
      );
  }
}

// ─── Physician view: only what changed, and the doctor decides ───
const RECORD = [0.55, 0.7, 0.45, 0.62, 0.5];
const TODAY = [0.55, 0.74, 1.05, 0.62, 0.3];

export function Physician({ mod }) {
  const today = useRef([]);
  const call = useRef();
  const pick = useRef([]);

  useFrame(() => {
    const { s } = mod.current;
    const grow = smooth(0.05, 0.55, s);
    TODAY.forEach((v, i) => {
      const m = today.current[i];
      if (!m) return;
      const h = lerp(0.06, v, grow);
      m.scale.y = h / 0.5;
      m.position.y = h / 2;
    });
    if (call.current) call.current.material.opacity = 0.05 + 0.4 * smooth(0.5, 0.7, s);
    pick.current.forEach((b, i) => {
      if (!b) return;
      b.scale.setScalar(1 + (i === 0 ? 0.12 * smooth(0.75, 0.95, s) : 0));
      b.position.y = 0.3 + (i === 0 ? 0.06 * smooth(0.75, 0.95, s) : 0);
    });
  });

  return (
    <group>
      <group position={[0, 1.15, -0.5]} rotation={[-0.08, 0, 0]}>
        <Block size={[3.3, 1.75, 0.08]} />
        <mesh ref={call} position={[0, 0, -0.06]}>
          <planeGeometry args={[3.6, 2.05]} />
          <meshBasicMaterial color={C.accent} transparent opacity={0.1} depthWrite={false} />
        </mesh>
        <group position={[-1.2, -0.62, 0.06]}>
          {RECORD.map((v, i) => (
            <group key={i} position={[i * 0.5, 0, 0]}>
              <mesh position={[0, v / 2, 0]}>
                <boxGeometry args={[0.32, v, 0.03]} />
                <meshBasicMaterial color="#4a4a58" />
              </mesh>
              <mesh
                ref={(m) => { today.current[i] = m; }}
                position={[0.08, 0.15, 0.03]}
                scale={[1, 0.3, 1]}
                material={TODAY[i] !== RECORD[i] && (i === 2 || i === 4) ? M.hi : M.deep}
              >
                <boxGeometry args={[0.16, 0.5, 0.03]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
      {/* the doctor's three choices */}
      <group position={[0, 0, 0.9]}>
        {[-0.95, 0, 0.95].map((x, i) => (
          <mesh key={x} ref={(m) => { pick.current[i] = m; }} position={[x, 0.3, 0]} material={i === 0 ? M.accent : M.body2}>
            <boxGeometry args={[0.8, 0.22, 0.4]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
