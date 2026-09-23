import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, lerp, smooth } from "../timeline";
import { Block, C, Envelope, Frame, Glow, M, MID, OFF, basic } from "./common";

// The shared email gateway: three projects, one door, a fair quota, a memory
// for addresses that bounce, and the tests that hold it together.

const dummy = new THREE.Object3D();
const col = new THREE.Color();
const v = new THREE.Vector3();
const SHADES = [C.accent, C.hi, MID]; // one per project
const SHADE_M = SHADES.map((c) => basic(c));

function Project({ kind, ...props }) {
  return (
    <group {...props}>
      <mesh position={[0, 0.04, 0]} material={M.body2}>
        <cylinderGeometry args={[0.38, 0.42, 0.08, 24]} />
      </mesh>
      {kind === 0 ? <Block size={[0.46, 0.46, 0.46]} position={[0, 0.33, 0]} /> : null}
      {kind === 1 ? (
        <mesh position={[0, 0.33, 0]} material={M.body}>
          <cylinderGeometry args={[0.24, 0.24, 0.46, 24]} />
        </mesh>
      ) : null}
      {kind === 2 ? (
        <mesh position={[0, 0.33, 0]} material={M.body}>
          <coneGeometry args={[0.3, 0.5, 3]} />
        </mesh>
      ) : null}
      <mesh position={[0, 0.62, 0]} material={SHADE_M[kind]}>
        <sphereGeometry args={[0.06, 10, 10]} />
      </mesh>
    </group>
  );
}

// ─── Sources: three projects post through one door; a stranger is turned away ──
const SRC = [new THREE.Vector3(-1.85, 0.7, -1.15), new THREE.Vector3(-1.85, 0.7, 0), new THREE.Vector3(-1.85, 0.7, 1.15)];
const DOOR_IN = new THREE.Vector3(-0.2, 0.85, 0);
const DOOR_OUT = new THREE.Vector3(0.65, 0.85, 0);
const STRANGER = new THREE.Vector3(-0.9, 0.75, -1.95);
const MAILS = 9;

export function Sources({ mod }) {
  const mails = useRef([]);
  const rogue = useRef();
  const shield = useRef();
  const glow = useRef();

  useFrame(() => {
    const { s } = mod.current;
    let through = 0;
    for (let j = 0; j < MAILS; j += 1) {
      const m = mails.current[j];
      if (!m) continue;
      const t = (s * 2 + j / MAILS) % 1;
      const src = SRC[j % 3];
      if (t < 0.5) m.position.lerpVectors(src, DOOR_IN, t * 2);
      else {
        const u = (t - 0.5) * 2;
        v.set(2.15, 1.3 + (j % 3) * 0.2, (j % 3 - 1) * 0.7);
        m.position.lerpVectors(DOOR_OUT, v, u);
        through = Math.max(through, 1 - u);
      }
      m.rotation.y = -Math.PI / 2 + 0.3;
      m.scale.setScalar(s > 0.03 ? 1.3 * (1 - smooth(0.85, 1, t)) : 0);
    }
    const go = smooth(0.25, 0.5, s);
    const back = smooth(0.5, 0.72, s);
    if (rogue.current) {
      rogue.current.position.lerpVectors(STRANGER, DOOR_IN, go * 0.92);
      rogue.current.position.x -= back * 1.1;
      rogue.current.position.y += back * 0.4 - back * back * 1.2;
      rogue.current.rotation.z = back * 2.4;
      rogue.current.visible = s > 0.24 && back < 0.98;
    }
    const hit = Math.exp(-(((s - 0.5) / 0.05) ** 2));
    if (shield.current) shield.current.material.opacity = 0.05 + 0.55 * hit;
    if (glow.current) glow.current.material.opacity = 0.15 + 0.35 * through;
  });

  return (
    <group>
      {SRC.map((p, k) => (
        <Project key={k} kind={k} position={[p.x, 0, p.z]} />
      ))}
      <group position={[STRANGER.x, 0, STRANGER.z]}>
        <mesh position={[0, 0.3, 0]} material={M.wire}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
        </mesh>
      </group>
      {/* the gateway */}
      <group position={[0.22, 0, 0]}>
        <Block size={[0.55, 1.35, 1.25]} position={[0.05, 0.68, 0]} />
        <mesh position={[-0.36, 0.85, 0]} rotation={[0, Math.PI / 2, 0]} material={M.accent}>
          <torusGeometry args={[0.42, 0.045, 10, 40]} />
        </mesh>
        <mesh ref={shield} position={[-0.42, 0.85, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.4, 32]} />
          <meshBasicMaterial color={C.hi} transparent opacity={0.05} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <Glow ref={glow} position={[0.2, 0.9, 0]} size={3} opacity={0.2} />
      </group>
      {Array.from({ length: MAILS }, (_, j) => (
        <Envelope key={j} ref={(m) => { mails.current[j] = m; }} flap={j % 3 === 1 ? M.hi : M.accent} />
      ))}
      <Envelope ref={rogue} material={M.body2} flap={M.deep} scale={1.3} />
    </group>
  );
}

// ─── Quota: 100 a day, shared by three; when it is spent, mail takes the second road ──
const CELLS = 100;

export function Quota({ mod }) {
  const cells = useRef();
  const mails = useRef([]);
  const last = useRef(-1);
  const pipeA = useMemo(() => basic(C.accent, { transparent: true, opacity: 0.9 }), []);
  const pipeB = useMemo(() => basic(C.deep, { transparent: true, opacity: 0.9 }), []);
  const owner = useMemo(() => Array.from({ length: CELLS }, (_, i) => (i * 7 + Math.floor(i / 3)) % 3), []);

  useEffect(() => {
    const c = cells.current;
    for (let i = 0; i < CELLS; i += 1) {
      dummy.position.set(-0.99 + (i % 10) * 0.22, 0.1 + Math.floor(i / 10) * 0.2, 0.04);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      c.setMatrixAt(i, dummy.matrix);
      c.setColorAt(i, col.set(OFF));
    }
    c.instanceMatrix.needsUpdate = true;
    c.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const { s } = mod.current;
    const used = Math.round(CELLS * smooth(0.04, 0.6, s));
    if (used !== last.current && cells.current) {
      last.current = used;
      for (let i = 0; i < CELLS; i += 1) cells.current.setColorAt(i, col.set(i < used ? SHADES[owner[i]] : OFF));
      cells.current.instanceColor.needsUpdate = true;
    }
    const full = smooth(0.6, 0.68, s);
    pipeA.color.set(C.accent).lerp(col.set("#3a2346"), full);
    pipeB.color.set(C.deep).lerp(col.set(C.hi), full);
    for (let j = 0; j < 6; j += 1) {
      const m = mails.current[j];
      if (!m) continue;
      const t = (s * 2.2 + j / 6) % 1;
      m.position.set(lerp(-2.05, 2.05, t), 0.62, lerp(0.75, 1.6, full));
      m.rotation.set(0, 0, 0);
      m.scale.setScalar(s > 0.03 ? 0.75 * (1 - smooth(0.9, 1, t)) * smooth(0, 0.08, t) : 0);
    }
  });

  return (
    <group>
      <group position={[-0.15, 0.2, -0.85]} rotation={[0, 0.28, 0]}>
        <Block size={[2.4, 2.2, 0.06]} position={[0, 1.0, -0.04]} />
        <group position={[0, 0, 0]}>
          <instancedMesh ref={cells} args={[null, null, CELLS]}>
            <boxGeometry args={[0.18, 0.16, 0.03]} />
            <meshBasicMaterial />
          </instancedMesh>
        </group>
      </group>
      {/* the main road and the fallback road */}
      <mesh position={[0, 0.35, 0.75]} rotation={[0, 0, Math.PI / 2]} material={pipeA}>
        <cylinderGeometry args={[0.07, 0.07, 4.2, 12]} />
      </mesh>
      <mesh position={[0, 0.35, 1.6]} rotation={[0, 0, Math.PI / 2]} material={pipeB}>
        <cylinderGeometry args={[0.07, 0.07, 4.2, 12]} />
      </mesh>
      {Array.from({ length: 6 }, (_, j) => (
        <Envelope key={j} ref={(m) => { mails.current[j] = m; }} />
      ))}
    </group>
  );
}

// ─── Suppress: a bounce comes back signed; that address is closed off ──
const BOXES = [-1.35, -0.45, 0.45, 1.35];
const GW = new THREE.Vector3(-1.35, 0.8, 0);
const boxAt = (k) => new THREE.Vector3(1.45, 0.85, BOXES[k]);

export function Suppress({ mod }) {
  const bounce = useRef();
  const seal = useRef();
  const barrier = useRef();
  const blocked = useRef();
  const normal = useRef([]);
  const twins = useRef([]);
  const lid = useMemo(() => basic(C.accent), []);

  useFrame(() => {
    const { s } = mod.current;
    const go = smooth(0.02, 0.2, s);
    const ret = smooth(0.22, 0.4, s);
    const target = boxAt(1);
    if (bounce.current) {
      if (ret <= 0) bounce.current.position.lerpVectors(GW, target, go);
      else bounce.current.position.lerpVectors(target, GW, ret);
      bounce.current.position.y += Math.sin(ret * Math.PI) * 0.6;
      bounce.current.rotation.y = ret > 0 ? Math.PI / 2 : -Math.PI / 2;
      bounce.current.visible = s > 0.02 && ret < 0.98;
    }
    if (seal.current) seal.current.visible = ret > 0.02;
    const close = smooth(0.4, 0.52, s);
    lid.color.set(C.accent).lerp(col.set("#2a2a33"), close);
    if (barrier.current) {
      barrier.current.scale.y = Math.max(0.001, close);
      barrier.current.visible = close > 0.01;
    }
    for (let j = 0; j < 3; j += 1) {
      const m = normal.current[j];
      if (!m) continue;
      const t = clamp01((s - 0.52 - j * 0.07) / 0.2);
      m.position.lerpVectors(GW, boxAt([0, 2, 3][j]), t);
      m.position.y += Math.sin(t * Math.PI) * 0.3;
      m.rotation.y = -Math.PI / 2;
      m.visible = t > 0.01 && t < 0.99;
    }
    const w = smooth(0.62, 0.8, s);
    if (blocked.current) {
      blocked.current.position.set(lerp(GW.x, 0.9, w), 0.85, lerp(0, BOXES[1], w));
      blocked.current.rotation.y = -Math.PI / 2;
      blocked.current.visible = w > 0.01;
      blocked.current.scale.setScalar(1 - smooth(0.82, 0.9, s));
    }
    // the same message sent twice becomes one
    const m2 = smooth(0.84, 0.98, s);
    twins.current.forEach((t, k) => {
      if (!t) return;
      t.position.set(-1.35, 1.95, (k ? 0.55 : -0.55) * (1 - m2));
      t.visible = s > 0.82;
      if (k) t.scale.setScalar(Math.max(0.001, 1 - smooth(0.9, 0.98, s)));
    });
  });

  return (
    <group>
      <Block size={[0.6, 1.3, 1.5]} position={[GW.x - 0.3, 0.65, 0]} />
      <Glow position={[GW.x, 1.0, 0]} size={2.2} opacity={0.3} />
      {BOXES.map((z, k) => (
        <group key={z} position={[1.45, 0, z]}>
          <mesh position={[0, 0.32, 0]} material={M.body2}>
            <boxGeometry args={[0.07, 0.64, 0.07]} />
          </mesh>
          <Block size={[0.46, 0.34, 0.36]} position={[0, 0.8, 0]} material={M.body} />
          <mesh position={[-0.24, 0.8, 0]} rotation={[0, -Math.PI / 2, 0]} material={k === 1 ? lid : M.accent}>
            <planeGeometry args={[0.3, 0.08]} />
          </mesh>
        </group>
      ))}
      {/* the barrier in front of the address that bounced */}
      <group position={[1.05, 0.25, BOXES[1]]}>
        <group ref={barrier}>
          <Frame w={0.62} h={1.05} t={0.05} material={M.hi} rotation={[0, Math.PI / 2, 0]} />
          <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} material={M.glass}>
            <planeGeometry args={[0.58, 1.0]} />
          </mesh>
        </group>
      </group>
      <group ref={bounce}>
        <Envelope />
        {/* the seal: the bounce report is signed */}
        <mesh ref={seal} position={[0, -0.04, 0.05]} material={M.hi}>
          <circleGeometry args={[0.07, 16]} />
        </mesh>
      </group>
      {[0, 1, 2].map((j) => (
        <Envelope key={j} ref={(m) => { normal.current[j] = m; }} />
      ))}
      <Envelope ref={blocked} />
      {[0, 1].map((k) => (
        <Envelope key={k} ref={(m) => { twins.current[k] = m; }} flap={M.hi} />
      ))}
    </group>
  );
}

// ─── Tests: 35 tiles turn over, one by one, each showing a check ──
const TESTS = 35;

export function Tests({ mod }) {
  const tiles = useRef([]);
  const face = useMemo(() => Array.from({ length: TESTS }, () => basic(OFF)), []);

  useFrame(() => {
    const { s } = mod.current;
    for (let i = 0; i < TESTS; i += 1) {
      const t0 = 0.04 + i * (0.78 / TESTS);
      const f = smooth(t0, t0 + 0.08, s);
      const g = tiles.current[i];
      if (g) g.rotation.y = f * Math.PI;
      face[i].color.set(f > 0.5 ? (i % 6 === 0 ? C.hi : C.accent) : OFF);
    }
  });

  return (
    <group position={[0, 1.25, -0.4]} rotation={[0, 0.3, 0]}>
      <Block size={[3.5, 2.55, 0.05]} position={[0, 0, -0.12]} />
      {Array.from({ length: TESTS }, (_, i) => (
        <group key={i} ref={(m) => { tiles.current[i] = m; }} position={[-1.38 + (i % 7) * 0.46, 0.92 - Math.floor(i / 7) * 0.46, 0]}>
          <mesh material={face[i]}>
            <boxGeometry args={[0.38, 0.38, 0.04]} />
          </mesh>
          {/* the check sits on the back and comes round as the tile turns */}
          <group position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
            <mesh position={[-0.06, -0.03, 0]} rotation={[0, 0, Math.PI / 4]} material={M.ink}>
              <boxGeometry args={[0.035, 0.12, 0.01]} />
            </mesh>
            <mesh position={[0.04, 0.02, 0]} rotation={[0, 0, -Math.PI / 5]} material={M.ink}>
              <boxGeometry args={[0.035, 0.24, 0.01]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
