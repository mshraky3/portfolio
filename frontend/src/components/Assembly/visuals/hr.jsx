import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, lerp, smooth } from "../timeline";
import { Block, C, Glow, M, MID, OFF, basic } from "./common";

// The HR system: a globe of branches, documents that expire, payroll, reports.

const dummy = new THREE.Object3D();
const UP = new THREE.Vector3(0, 1, 0);
const col = new THREE.Color();

// ─── Globe: the company as a planet; 25 branches light up and link to HQ ──
const BRANCHES = 25;
const GR = 2.2; // globe radius
const GY = 2.7; // globe centre height
const ARC = 18; // segments per arc

export function Globe({ mod }) {
  const spin = useRef();
  const pins = useRef();
  const bus = useRef();
  const last = useRef(-1);
  // Branches spread over the globe (a Fibonacci lattice, kept off the poles).
  const spots = useMemo(() => Array.from({ length: BRANCHES }, (_, i) => {
    const y = 0.72 - (i / (BRANCHES - 1)) * 1.3;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996;
    return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
  }), []);
  const hq = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const geo = useMemo(() => {
    const pos = [];
    const p = new THREE.Vector3();
    const q = new THREE.Vector3();
    spots.forEach((s) => {
      for (let k = 0; k < ARC; k += 1) {
        [k, k + 1].forEach((t, j) => {
          const u = t / ARC;
          (j ? q : p).copy(hq).lerp(s, u).normalize().multiplyScalar(GR * (1.02 + 0.28 * Math.sin(u * Math.PI)));
        });
        pos.push(p.x, p.y, p.z, q.x, q.y, q.z);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(new Array(pos.length).fill(0.12), 3));
    return g;
  }, [spots, hq]);

  useEffect(() => {
    const m = pins.current;
    spots.forEach((s, i) => {
      dummy.position.copy(s).multiplyScalar(GR * 1.01);
      dummy.quaternion.setFromUnitVectors(UP, s);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, col.set(OFF));
    });
    m.instanceMatrix.needsUpdate = true;
    m.instanceColor.needsUpdate = true;
  }, [spots]);

  useFrame(() => {
    const { s } = mod.current;
    if (spin.current) spin.current.rotation.y = s * 2.2;
    const lit = Math.round(BRANCHES * smooth(0.05, 0.75, s));
    if (lit !== last.current && pins.current) {
      last.current = lit;
      const c = geo.getAttribute("color");
      for (let i = 0; i < BRANCHES; i += 1) {
        const on = i < lit;
        pins.current.setColorAt(i, col.set(on ? (i % 5 === 0 ? C.hi : C.accent) : OFF));
        col.set(on ? C.accent : "#1e1424");
        for (let k = 0; k < ARC * 2; k += 1) c.setXYZ(i * ARC * 2 + k, col.r, col.g, col.b);
      }
      c.needsUpdate = true;
      pins.current.instanceColor.needsUpdate = true;
    }
    if (bus.current) {
      const a = s * Math.PI * 3.2;
      bus.current.position.set(Math.cos(a) * (GR + 0.75), Math.sin(a) * 0.5, Math.sin(a) * (GR + 0.75));
      bus.current.rotation.y = -a;
      bus.current.visible = s > 0.04;
    }
  });

  return (
    <group position={[0, GY, 0]}>
      <group ref={spin}>
        <mesh material={M.body}>
          <sphereGeometry args={[GR * 0.98, 40, 28]} />
        </mesh>
        <mesh>
          <sphereGeometry args={[GR, 28, 18]} />
          <meshBasicMaterial color={C.deep} wireframe transparent opacity={0.45} />
        </mesh>
        <instancedMesh ref={pins} args={[null, null, BRANCHES]}>
          <cylinderGeometry args={[0.07, 0.07, 0.3, 8]} />
          <meshBasicMaterial />
        </instancedMesh>
        <lineSegments geometry={geo}>
          <lineBasicMaterial vertexColors transparent opacity={0.9} />
        </lineSegments>
        {/* headquarters, where every branch reports */}
        <mesh position={[0, GR * 1.02, 0]} material={M.hi}>
          <sphereGeometry args={[0.16, 16, 16]} />
        </mesh>
        <Glow position={[0, GR * 1.05, 0]} size={1.4} opacity={0.6} />
      </group>
      <Glow size={7} opacity={0.22} />
      {/* the student bus, on its own orbit */}
      <group ref={bus}>
        <Block size={[0.4, 0.18, 0.2]} material={M.body2} />
        <mesh position={[0, 0.03, 0.105]} material={M.hi}>
          <boxGeometry args={[0.3, 0.05, 0.01]} />
        </mesh>
      </group>
      <mesh position={[0, -GY + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.45, 64]} />
        <meshBasicMaterial color={C.accent} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Expiry: documents move towards their expiry date; alerts at 90, 60 and 30 days ──
const MARKS = [-1.15, -0.2, 0.75]; // 90, 60, 30 days before
const TODAY = 1.75;
const CARDS = 5;

export function Expiry({ mod }) {
  const cards = useRef([]);
  const strips = useMemo(() => Array.from({ length: CARDS }, () => basic(OFF)), []);
  const bell = useRef();
  const bellGlow = useRef();
  const marks = useRef([]);

  useFrame(() => {
    const { s } = mod.current;
    let alert = 0;
    const markHit = [0, 0, 0];
    for (let j = 0; j < CARDS; j += 1) {
      const u = clamp01(s * 1.12 - j * 0.15);
      const x = lerp(-2.0 - j * 0.06, TODAY - 0.05, u);
      const c = cards.current[j];
      if (c) c.position.set(x, 0.38, 0.35 - j * 0.015);
      let level = 0;
      MARKS.forEach((m, k) => {
        if (x > m) level = k + 1;
        const hit = Math.exp(-(((x - m) / 0.1) ** 2)) * (u > 0 && u < 1 ? 1 : 0);
        markHit[k] = Math.max(markHit[k], hit);
        alert = Math.max(alert, hit);
      });
      strips[j].color.set([OFF, C.deep, MID, C.hi][level]);
    }
    if (bell.current) bell.current.rotation.z = Math.sin(s * 90) * 0.4 * alert;
    if (bellGlow.current) bellGlow.current.material.opacity = 0.1 + 0.7 * alert;
    marks.current.forEach((m, k) => {
      if (m) m.scale.setScalar(1 + markHit[k] * 0.6);
    });
  });

  return (
    <group>
      {/* the timeline */}
      <mesh position={[-0.1, 0.03, 0.35]} material={M.body2}>
        <boxGeometry args={[4.3, 0.04, 0.62]} />
      </mesh>
      <mesh position={[-0.1, 0.055, 0.35]} material={M.deep}>
        <boxGeometry args={[4.3, 0.01, 0.05]} />
      </mesh>
      {MARKS.map((x, k) => (
        <group key={x} position={[x, 0, -0.1]}>
          <mesh position={[0, 0.5, 0]} material={M.body2}>
            <boxGeometry args={[0.05, 1, 0.05]} />
          </mesh>
          {/* one ring for 90 days, two for 60, three for 30: closer means brighter */}
          <group ref={(m) => { marks.current[k] = m; }} position={[0, 1.05, 0]}>
            {Array.from({ length: k + 1 }, (_, r) => (
              <mesh key={r} position={[0, r * 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]} material={k === 2 ? M.hi : k === 1 ? M.accent : M.deep}>
                <torusGeometry args={[0.13, 0.025, 8, 24]} />
              </mesh>
            ))}
          </group>
        </group>
      ))}
      {/* today, with the alert bell */}
      <group position={[TODAY, 0, -0.1]}>
        <mesh position={[0, 0.7, 0]} material={M.body2}>
          <boxGeometry args={[0.06, 1.4, 0.06]} />
        </mesh>
        <group ref={bell} position={[0, 1.62, 0]}>
          <mesh position={[0, -0.2, 0]} material={M.accent}>
            <cylinderGeometry args={[0.12, 0.28, 0.36, 24, 1, true]} />
          </mesh>
          <mesh position={[0, -0.42, 0]} material={M.hi}>
            <sphereGeometry args={[0.07, 12, 12]} />
          </mesh>
        </group>
        <Glow ref={bellGlow} position={[0, 1.45, 0]} size={1.8} opacity={0.2} />
      </group>
      {Array.from({ length: CARDS }, (_, j) => (
        <group key={j} ref={(m) => { cards.current[j] = m; }}>
          <Block size={[0.44, 0.6, 0.04]} material={M.body} />
          <mesh position={[0, 0.18, 0.025]} material={strips[j]}>
            <boxGeometry args={[0.34, 0.1, 0.01]} />
          </mesh>
          {[0.02, -0.08, -0.18].map((y) => (
            <mesh key={y} position={[-0.03, y, 0.025]} material={M.body2}>
              <boxGeometry args={[0.28, 0.035, 0.01]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── Payroll: a month fills in, day by day, then pay is counted out ──
const DAYS = 35;
const ABSENT = new Set([9, 17, 23]);

export function Payroll({ mod }) {
  const cells = useRef();
  const coins = useRef();
  const last = useRef(-1);

  useEffect(() => {
    const c = cells.current;
    for (let i = 0; i < DAYS; i += 1) {
      const cx = i % 7;
      const cy = Math.floor(i / 7);
      dummy.position.set(-1.05 + cx * 0.35, 0.42 - cy * 0.3, 0.04);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      c.setMatrixAt(i, dummy.matrix);
      c.setColorAt(i, col.set("#1d1d24"));
    }
    c.instanceMatrix.needsUpdate = true;
    c.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    const { s } = mod.current;
    const filled = Math.round(DAYS * smooth(0.04, 0.62, s));
    if (filled !== last.current && cells.current) {
      last.current = filled;
      for (let i = 0; i < DAYS; i += 1) {
        const weekend = i % 7 >= 5;
        let c = "#1d1d24";
        if (i < filled) c = weekend ? "#34343f" : ABSENT.has(i) ? C.deep : C.accent;
        cells.current.setColorAt(i, col.set(c));
      }
      cells.current.instanceColor.needsUpdate = true;
    }
    const k = coins.current;
    if (k) {
      const stackT = smooth(0.62, 0.96, s);
      for (let i = 0; i < 15; i += 1) {
        const stack = i % 3;
        const level = Math.floor(i / 3);
        const on = stackT * 15 > i ? 1 : 0;
        dummy.position.set(1.55 + stack * 0.3 - 0.3, 0.05 + level * 0.075, 0.95 - stack * 0.15);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(Math.max(0.0001, on));
        dummy.updateMatrix();
        k.setMatrixAt(i, dummy.matrix);
      }
      k.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <group position={[-0.35, 1.2, -0.65]} rotation={[-0.08, 0.3, 0]}>
        <Block size={[2.7, 2.1, 0.06]} />
        {/* header band, with a crescent: dates are shown in the Hijri calendar too */}
        <mesh position={[0, 0.82, 0.035]} material={M.deep}>
          <boxGeometry args={[2.5, 0.28, 0.01]} />
        </mesh>
        <mesh position={[1.02, 0.82, 0.045]} material={M.hi}>
          <circleGeometry args={[0.1, 24]} />
        </mesh>
        <mesh position={[1.06, 0.845, 0.05]} material={M.deep}>
          <circleGeometry args={[0.088, 24]} />
        </mesh>
        <instancedMesh ref={cells} args={[null, null, DAYS]}>
          <boxGeometry args={[0.29, 0.24, 0.02]} />
          <meshBasicMaterial />
        </instancedMesh>
      </group>
      <instancedMesh ref={coins} args={[null, null, 15]} material={M.accent}>
        <cylinderGeometry args={[0.13, 0.13, 0.06, 20]} />
      </instancedMesh>
      <Glow position={[1.55, 0.35, 0.8]} size={1.6} opacity={0.3} />
    </group>
  );
}

// ─── Reports: pages print and stack into two piles, PDF and spreadsheet ──
const PAGES = 8;
const SLOT = new THREE.Vector3(-1.35, 0.66, 0.5);
const PILES = [new THREE.Vector3(0.55, 0.02, -0.75), new THREE.Vector3(1.35, 0.02, 0.8)];

export function Reports({ mod }) {
  const pages = useRef([]);
  const slot = useRef();

  useFrame(() => {
    const { s } = mod.current;
    let printing = 0;
    for (let i = 0; i < PAGES; i += 1) {
      const w0 = 0.04 + i * 0.1;
      const u = smooth(w0, w0 + 0.2, s);
      const out = smooth(w0, w0 + 0.05, s);
      printing = Math.max(printing, out * (1 - u));
      const pile = PILES[i % 2];
      const p = pages.current[i];
      if (!p) continue;
      const topY = pile.y + Math.floor(i / 2) * 0.05 + 0.02;
      p.position.set(lerp(SLOT.x, pile.x, u), lerp(SLOT.y, topY, u) + Math.sin(u * Math.PI) * 0.9, lerp(SLOT.z + out * 0.4, pile.z, u));
      p.rotation.set(0, lerp(0, i % 2 ? 0.25 : -0.2, u), Math.sin(u * Math.PI) * 0.3);
      p.visible = out > 0.01;
    }
    if (slot.current) slot.current.material.opacity = 0.3 + 0.7 * printing;
  });

  return (
    <group>
      {/* the printer */}
      <group position={[-1.35, 0.32, 0]}>
        <Block size={[1.3, 0.62, 1.0]} />
        <mesh ref={slot} position={[0, 0.2, 0.505]}>
          <boxGeometry args={[0.9, 0.05, 0.01]} />
          <meshBasicMaterial color={C.hi} transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 0.33, -0.3]} rotation={[-0.5, 0, 0]} material={M.body2}>
          <boxGeometry args={[0.85, 0.02, 0.5]} />
        </mesh>
      </group>
      {PILES.map((p, k) => (
        <mesh key={k} position={[p.x, 0.01, p.z]} material={M.body2}>
          <boxGeometry args={[0.9, 0.02, 1.08]} />
        </mesh>
      ))}
      {Array.from({ length: PAGES }, (_, i) => (
        <group key={i} ref={(m) => { pages.current[i] = m; }}>
          <mesh material={M.text}>
            <boxGeometry args={[0.72, 0.02, 0.92]} />
          </mesh>
          {i % 2 === 0 ? (
            // a PDF: a title band and lines of text
            <>
              <mesh position={[0, 0.012, -0.3]} material={M.accent}>
                <boxGeometry args={[0.56, 0.005, 0.12]} />
              </mesh>
              {[-0.08, 0.06, 0.2].map((z) => (
                <mesh key={z} position={[-0.04, 0.012, z]} material={M.body2}>
                  <boxGeometry args={[0.48, 0.005, 0.05]} />
                </mesh>
              ))}
            </>
          ) : (
            // a spreadsheet: a grid
            <>
              {[-0.24, -0.08, 0.08, 0.24].map((z) => (
                <mesh key={z} position={[0, 0.012, z]} material={M.deep}>
                  <boxGeometry args={[0.6, 0.005, 0.015]} />
                </mesh>
              ))}
              {[-0.15, 0.05].map((x) => (
                <mesh key={x} position={[x, 0.012, 0]} material={M.deep}>
                  <boxGeometry args={[0.015, 0.005, 0.7]} />
                </mesh>
              ))}
            </>
          )}
        </group>
      ))}
    </group>
  );
}
