import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { clockAt, focusAt, landAt, lerp, outroAt, overviewAt, playAt, showAt, smooth } from "./timeline";
import { C, M, TRAY, TRAY_T } from "./visuals/common";
import { VISUALS } from "./visuals";

const FOV = 35;
const GAP = 2.15; // distance between trays once assembled
const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _ovPos = new THREE.Vector3();
const _ovLook = new THREE.Vector3();

// Where each module floats before it is placed: a slow helix around the stack.
function scatterOf(i, n) {
  const a = 0.9 + (i / n) * Math.PI * 1.7;
  const r = 6.2 - (i % 2) * 1.2;
  return new THREE.Vector3(Math.cos(a) * r, 2.2 + (i % 3) * 0.7, Math.sin(a) * r * 0.7 - 1);
}

// Computes every number the scene needs from scroll, once per frame, before any
// child draws (priority -1). Everything else only reads `state`.
function Driver({ progress, state, n, cys }) {
  const eased = useRef(0);

  useFrame((three, dt) => {
    eased.current += (progress.current - eased.current) * (1 - Math.exp(-dt * 8));
    const p = eased.current;
    const T = clockAt(p, n);
    const outro = outroAt(p);
    const gs = 1 + 0.75 * outro;
    const f = focusAt(T, n);
    const ov = overviewAt(T, n);

    state.current.p = p;
    state.current.T = T;
    state.current.gs = gs;
    state.current.f = f;
    state.current.ov = ov;
    state.current.outro = outro;
    for (let i = 0; i < n; i += 1) {
      const m = state.current.mods[i];
      m.land = landAt(T, i);
      m.s = playAt(T, i);
      m.show = showAt(T, i);
      m.active = Math.max(0, 1 - Math.abs(f - i) * 1.4) * (1 - ov);
    }

    const { width, height } = three.size;
    const asp = width / height;
    const wide = asp > 1.1;
    const tanH = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
    const distFor = (needW, needH) => Math.max(needW / (2 * tanH * asp), needH / (2 * tanH));

    // camera at a module
    const fl = Math.min(n - 2 < 0 ? 0 : n - 2, Math.floor(f));
    const fr = f - fl;
    const y0 = fl * GAP * gs + cys[fl];
    const y1 = Math.min(n - 1, fl + 1) * GAP * gs + cys[Math.min(n - 1, fl + 1)];
    const yF = lerp(y0, y1, n > 1 ? fr : 0);
    const dist = distFor(wide ? 12.6 : 8.4, wide ? 8.4 : 7.6);
    const az = 0.42 + f * 0.2;
    const el = 0.42;
    _look.set(0, yF, 0);
    _pos.set(Math.sin(az) * Math.cos(el) * dist, yF + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist);

    // camera at the whole stack
    const heroW = 1 - smooth(-0.45, -0.05, T);
    const mid = lerp(((n - 1) * GAP * gs) / 2 + 1.7, 3.5, heroW);
    const ovDist = distFor(wide ? 22 : 13, (wide ? 14 : 13) + 8.5 * outro);
    const ovAz = 0.6 + outro * 0.55;
    const ovEl = 0.4;
    _ovLook.set(0, mid, 0);
    _ovPos.set(Math.sin(ovAz) * Math.cos(ovEl) * ovDist, mid + Math.sin(ovEl) * ovDist, Math.cos(ovAz) * Math.cos(ovEl) * ovDist);

    const cam = three.camera;
    cam.position.lerpVectors(_pos, _ovPos, ov);
    _look.lerp(_ovLook, ov);
    cam.lookAt(_look);
    // Put the subject on the right of a wide screen (text is on the left), or in
    // the upper part of a phone (text is at the bottom).
    if (wide) cam.setViewOffset(width, height, -width * 0.17, 0, width, height);
    else cam.setViewOffset(width, height, 0, height * 0.17, width, height);
    cam.updateProjectionMatrix();

    const light = three.scene.getObjectByName("key-light");
    if (light) light.position.set(_look.x + 1.5, _look.y + 3.5, _look.z + 6);
  }, -1);

  return null;
}

// A tray with its outline; the visual sits on top of it.
function Tray({ index, visual, image, state, scatter }) {
  const group = useRef();
  const edge = useRef();
  const mod = useRef({ s: 0 });
  const spec = VISUALS[visual];
  const Visual = spec.Component;
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(TRAY, TRAY_T, TRAY)), []);
  const inner = useRef();

  useFrame(() => {
    const st = state.current;
    const m = st.mods[index];
    mod.current = m;
    const g = group.current;
    if (!g) return;
    const L = easeOutBack(m.land);
    const slot = index * GAP * st.gs;
    const sc = scatter;
    g.position.set(lerp(sc.x, 0, L), lerp(sc.y + slot * 0.45, slot, L), lerp(sc.z, 0, L));
    g.rotation.set((1 - L) * 0.5, (1 - L) * 1.1, (1 - L) * -0.3);
    const size = lerp(0.62, 1, m.land) * m.show;
    g.scale.setScalar(Math.max(0.0001, size));
    g.visible = m.show > 0.01;
    if (edge.current) {
      edge.current.material.opacity = 0.35 + 0.55 * m.active + 0.2 * m.land;
      edge.current.material.color.set(m.active > 0.3 ? C.hi : C.accent);
    }
    if (inner.current) inner.current.visible = m.land > 0.5 || st.ov > 0.3;
  });

  return (
    <group ref={group}>
      <RoundedBox args={[TRAY, TRAY_T, TRAY]} radius={0.06} smoothness={3} material={M.body} />
      <lineSegments ref={edge} geometry={edges}>
        <lineBasicMaterial color={C.accent} transparent opacity={0.6} />
      </lineSegments>
      <mesh position={[0, TRAY_T / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRAY - 0.3, TRAY - 0.3]} />
        <meshBasicMaterial color="#101015" />
      </mesh>
      <group ref={inner} position={[0, TRAY_T / 2, 0]}>
        <Visual mod={mod} image={image} />
      </group>
    </group>
  );
}

function easeOutBack(t) {
  const c1 = 1.25;
  const c3 = c1 + 1;
  const x = Math.min(1, Math.max(0, t));
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

// Four posts that join the trays, like the standoffs in a stack of circuit boards.
function Posts({ n, state }) {
  const posts = useRef([]);
  const packets = useRef([]);
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  useFrame(() => {
    const st = state.current;
    for (let i = 1; i < n; i += 1) {
      const land = st.mods[i].land;
      const gap = GAP * st.gs;
      corners.forEach((_, c) => {
        const k = (i - 1) * 4 + c;
        const rod = posts.current[k];
        if (rod) {
          rod.visible = land > 0.7;
          rod.position.y = (i - 1) * gap + gap / 2;
          rod.scale.y = gap - TRAY_T;
        }
        const pk = packets.current[k];
        if (pk) {
          pk.visible = land > 0.7;
          const t = (st.T * 0.9 + c * 0.25 + i * 0.17) % 1;
          pk.position.y = (i - 1) * gap + TRAY_T / 2 + t * (gap - TRAY_T);
        }
      });
    }
  });
  const half = TRAY / 2 - 0.16;
  return (
    <group>
      {Array.from({ length: (n - 1) * 4 }, (_, k) => {
        const [sx, sz] = corners[k % 4];
        return (
          <group key={k} position={[sx * half, 0, sz * half]}>
            <mesh ref={(m) => { posts.current[k] = m; }} material={M.body2}>
              <boxGeometry args={[0.06, 1, 0.06]} />
            </mesh>
            <mesh ref={(m) => { packets.current[k] = m; }} material={M.hi}>
              <sphereGeometry args={[0.09, 10, 10]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Faint outlines where the pieces will go.
function Ghosts({ n, state }) {
  const lines = useRef([]);
  const s = TRAY / 2;
  const pts = [
    [-s, 0, -s],
    [s, 0, -s],
    [s, 0, s],
    [-s, 0, s],
    [-s, 0, -s],
  ];
  useFrame(() => {
    const st = state.current;
    lines.current.forEach((g, i) => {
      if (!g) return;
      g.position.y = i * GAP * st.gs;
      const vis = (1 - st.mods[i].land) * 0.9;
      g.visible = vis > 0.03;
      g.children[0].material.opacity = vis * 0.6;
    });
  });
  return (
    <group>
      {Array.from({ length: n }, (_, i) => (
        <group key={i} ref={(g) => { lines.current[i] = g; }}>
          <Line points={pts} color={C.deep} lineWidth={1.2} dashed dashSize={0.25} gapSize={0.2} transparent opacity={0.5} />
        </group>
      ))}
    </group>
  );
}

export default function AssemblyScene({ layers, progress, visible }) {
  const n = layers.length;
  const cys = useMemo(() => layers.map((l) => VISUALS[l.visual].cy), [layers]);
  const scatter = useMemo(() => layers.map((_, i) => scatterOf(i, n)), [layers, n]);
  const state = useRef({
    p: 0,
    T: -0.5,
    gs: 1,
    f: 0,
    ov: 1,
    outro: 0,
    mods: Array.from({ length: n }, () => ({ land: 0, s: 0, show: 1, active: 0 })),
  });

  return (
    <Canvas
      className="as-gl"
      flat
      frameloop={visible ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: FOV, near: 0.1, far: 120, position: [8, 8, 18] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={[C.bg, 22, 70]} />
      <ambientLight intensity={1.1} />
      <directionalLight name="key-light" position={[4, 8, 8]} intensity={2.4} color="#f4e8ff" />
      <pointLight position={[-6, 3, 4]} intensity={40} color={C.accent} distance={30} />
      <Driver progress={progress} state={state} n={n} cys={cys} />
      <gridHelper args={[90, 90, C.deep, "#191921"]} position={[0, -1.4, 0]} />
      <Ghosts n={n} state={state} />
      <Posts n={n} state={state} />
      {layers.map((l, i) => (
        <Tray key={l.name} index={i} visual={l.visual} image={l.image} state={state} scatter={scatter[i]} />
      ))}
    </Canvas>
  );
}

