import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { clockAt, focusAt, outroAt, overviewAt, playAt, showAt, smooth } from "./timeline";
import { GAP, RIGS } from "./rigs";
import { DECOR } from "./decor";
import { C, M, TRAY, TRAY_T } from "./visuals/common";
import { VISUALS } from "./visuals";
import { prefersReducedMotion } from "../../utils/capabilities";

const FOV = 35;
const H = {
  pos: new THREE.Vector3(),
  look: new THREE.Vector3(),
  ovPos: new THREE.Vector3(),
  ovLook: new THREE.Vector3(),
};

// Phones get a lower pixel-ratio ceiling; every device steps down further if
// frames get slow while scrolling (see Driver).
const COARSE = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
const MAX_DPR = COARSE ? 1.5 : 1.75;
const START_DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, MAX_DPR) : 1;

// The canvas renders on demand: only when the page scrolls, resizes or becomes
// visible, and for as long as the eased motion is still catching up. A still
// page costs no GPU time at all.
function Invalidator({ visible }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    // two frames: the second one sees the scroll position read in this frame
    const kick = () => invalidate(2);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [invalidate, visible]);
  return null;
}

// Computes every number the scene needs from scroll, once per frame, before any
// child draws (priority -1). The rig decides where modules and the camera go.
function Driver({ progress, state, n, cys, timing, rig, ctx }) {
  const eased = useRef(0);
  const perf = useRef({ sum: 0, frames: 0 });
  const setDpr = useThree((s) => s.setDpr);

  useFrame((three, rawDt) => {
    // After an idle pause the first delta is long; cap it so the easing still glides.
    const dt = Math.min(rawDt, 1 / 30);
    eased.current += (progress.current - eased.current) * (1 - Math.exp(-dt * 8));
    if (Math.abs(progress.current - eased.current) > 0.0004) three.invalidate();
    else eased.current = progress.current;

    // Adaptive resolution: measure only back-to-back frames (while scrolling).
    if (rawDt < 0.2) {
      const pf = perf.current;
      pf.sum += rawDt;
      pf.frames += 1;
      if (pf.frames >= 45) {
        const dpr = three.viewport.dpr;
        if (pf.sum / pf.frames > 1 / 40 && dpr > 1) setDpr(Math.max(1, dpr - 0.25));
        pf.sum = 0;
        pf.frames = 0;
      }
    }
    const p = eased.current;
    const st = state.current;
    st.time = three.clock.elapsedTime;
    // Some rigs drift on their own at rest (the hero's floating tower).
    if (rig.idle && rig.idle(st)) three.invalidate();
    const T = clockAt(p, n, timing);
    st.p = p;
    st.T = T;
    st.outro = outroAt(p, timing);
    st.gs = 1 + 0.75 * st.outro;
    st.f = focusAt(T, n);
    st.ov = overviewAt(T, n);
    for (let i = 0; i < n; i += 1) {
      const m = st.mods[i];
      m.land = rig.land(T, i, st);
      m.s = playAt(T, i);
      m.show = rig === RIGS.stack ? showAt(T, i) : 1;
      m.active = Math.max(0, 1 - Math.abs(st.f - i) * 1.4) * (1 - st.ov);
    }

    const { width, height } = three.size;
    const asp = width / height;
    const wide = asp > 1.1;
    const tanH = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
    H.n = n;
    H.cys = cys;
    H.wide = wide;
    st.narrow = !wide;
    H.distFor = (needW, needH) => Math.max(needW / (2 * tanH * asp), needH / (2 * tanH));
    rig.camera(st, ctx, H);

    const cam = three.camera;
    cam.position.lerpVectors(H.pos, H.ovPos, st.ov);
    H.look.lerp(H.ovLook, st.ov);
    cam.lookAt(H.look);
    // Put the subject on the right of a wide screen (text is on the left), or in
    // the upper part of a phone (text is at the bottom).
    if (wide) cam.setViewOffset(width, height, -width * 0.17, 0, width, height);
    else cam.setViewOffset(width, height, 0, height * 0.17, width, height);
    cam.updateProjectionMatrix();

    const light = three.scene.getObjectByName("key-light");
    if (light) light.position.set(H.look.x + 1.5, H.look.y + 3.5, H.look.z + 6);
  }, -1);

  return null;
}

// What a module stands on: a square tray, a round disc, or nothing.
const trayEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(TRAY, TRAY_T, TRAY));
function Platform({ kind, edge }) {
  if (kind === "none") return null;
  if (kind === "disc") {
    return (
      <group>
        <mesh material={M.body}>
          <cylinderGeometry args={[2.75, 2.85, TRAY_T, 64]} />
        </mesh>
        <mesh ref={edge} position={[0, TRAY_T / 2 + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.62, 2.75, 64]} />
          <meshBasicMaterial color={C.accent} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, TRAY_T / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.6, 64]} />
          <meshBasicMaterial color="#101015" />
        </mesh>
      </group>
    );
  }
  return (
    <group>
      <RoundedBox args={[TRAY, TRAY_T, TRAY]} radius={0.06} smoothness={3} material={M.body} />
      <lineSegments ref={edge} geometry={trayEdges}>
        <lineBasicMaterial color={C.accent} transparent opacity={0.6} />
      </lineSegments>
      <mesh position={[0, TRAY_T / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TRAY - 0.3, TRAY - 0.3]} />
        <meshBasicMaterial color="#101015" />
      </mesh>
    </group>
  );
}

// One module: its platform, and the visual that plays on it.
function Module({ index, visual, image, state, rig, ctx }) {
  const group = useRef();
  const inner = useRef();
  const edge = useRef();
  const mod = useRef({ s: 0 });
  const Visual = VISUALS[visual].Component;
  const kind = rig.platform(index);

  useFrame(() => {
    const st = state.current;
    const m = st.mods[index];
    mod.current = m;
    const g = group.current;
    if (!g) return;
    st.groups[index] = g;
    const yaw = rig.place(index, st, ctx, g);
    if (inner.current) {
      inner.current.rotation.y = yaw;
      inner.current.visible = m.land > 0.35 || st.ov > 0.3;
    }
    if (edge.current) {
      edge.current.material.opacity = 0.35 + 0.55 * m.active + 0.2 * m.land;
      edge.current.material.color.set(m.active > 0.3 ? C.hi : C.accent);
    }
  });

  return (
    <group ref={group}>
      <Platform kind={kind} edge={edge} />
      <group ref={inner} position={[0, kind === "none" ? 0 : TRAY_T / 2, 0]}>
        <Visual mod={mod} image={image} />
      </group>
    </group>
  );
}

// Stack only: four posts join the trays, like standoffs in a stack of boards.
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

// Stack only: faint outlines where the pieces will go.
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
      // Only the outline of the part that is about to land, not all of them.
      const vis = (1 - st.mods[i].land) * smooth(i - 0.85, i - 0.45, st.T) * 0.9;
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

export default function AssemblyScene({ layers, progress, visible, timing, turn = 0, rig: rigName = "stack" }) {
  const rig = RIGS[rigName] || RIGS.stack;
  const n = layers.length;
  const cys = useMemo(() => layers.map((l) => VISUALS[l.visual].cy), [layers]);
  const ctx = useMemo(() => rig.setup(n, { turn }), [rig, n, turn]);
  const state = useRef({
    p: 0,
    T: -0.5,
    gs: 1,
    f: 0,
    ov: 1,
    outro: 0,
    time: 0,
    reduced: prefersReducedMotion(),
    groups: [],
    mods: Array.from({ length: n }, () => ({ land: 0, s: 0, show: 1, active: 0 })),
  });
  const Decor = DECOR[rig.extras];

  return (
    <Canvas
      className="as-gl"
      flat
      frameloop={visible ? "demand" : "never"}
      dpr={START_DPR}
      camera={{ fov: FOV, near: 0.1, far: 160, position: [8, 8, 18] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={[C.bg, ...rig.fog]} />
      <ambientLight intensity={1.1} />
      <directionalLight name="key-light" position={[4, 8, 8]} intensity={2.4} color="#f4e8ff" />
      <pointLight position={[-6, 3, 4]} intensity={40} color={C.accent} distance={30} />
      <Invalidator visible={visible} />
      <Driver progress={progress} state={state} n={n} cys={cys} timing={timing} rig={rig} ctx={ctx} />
      <gridHelper args={[140, 140, C.deep, "#191921"]} position={[0, rig.floor, 0]} />
      {rig.extras === "stack" ? (
        <>
          <Ghosts n={n} state={state} />
          <Posts n={n} state={state} />
        </>
      ) : null}
      {Decor ? <Decor state={state} ctx={ctx} n={n} /> : null}
      {layers.map((l, i) => (
        <Module key={l.name} index={i} visual={l.visual} image={l.image} state={state} rig={rig} ctx={ctx} />
      ))}
    </Canvas>
  );
}
