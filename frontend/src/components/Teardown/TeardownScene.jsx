import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { IMAGES } from "../../data/images";
import { drawPlate, PLATE_H, PLATE_W } from "./plateTexture";
import { explodeAt, focusAt, lerp, overviewAt } from "./timeline";
import { HandRig, HeadRig } from "../NeuroLink/Rigs";

const RIGS = { hand: HandRig, head: HeadRig };

export const PW = 4.4;
export const PH = 2.75;
const PT = 0.07;
const GAP = 3.0;
const A_GAP = 0.1;
const FOV = 35;
const BG = "#0c2246";
const LINE = "#9fc0ea";
const HOT = "#ffc21a";

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _ovPos = new THREE.Vector3();
const _ovLook = new THREE.Vector3();

// Reads scroll progress, eases it, and publishes the numbers every plate needs.
function Driver({ progress, rig, n }) {
  const eased = useRef(0);

  useFrame((state, dt) => {
    eased.current += (progress.current - eased.current) * (1 - Math.exp(-dt * 9));
    const p = eased.current;
    const e = explodeAt(p);
    const ov = overviewAt(p);
    const f = focusAt(p, n);
    const gap = lerp(A_GAP, GAP, e);
    rig.current = { p, e, ov, f, gap };

    const asp = state.size.width / state.size.height;
    const wide = asp > 1.15;
    const tanH = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
    const dist = Math.max(4.8, PW / (2 * tanH * (wide ? asp * 0.5 : asp * 0.94)));
    const visW = 2 * tanH * dist * asp;
    const camX = wide ? -0.235 * visW : 0;
    const camY = wide ? 0.12 : -1.05;
    const dz = -f * gap;

    _pos.set(camX, camY, dz + dist);
    _look.set(camX, camY - 0.12, dz);

    const sc = wide ? 1 : 1.9;
    const cz = (-gap * (n - 1)) / 2;
    _ovLook.set(wide ? -3.7 : 0, wide ? 0.1 : -0.8, cz);
    _ovPos.set(_ovLook.x + 8.2 * sc, 4.4 * sc, cz + 19 * sc);

    state.camera.position.lerpVectors(_pos, _ovPos, ov);
    _look.lerp(_ovLook, ov);
    state.camera.lookAt(_look);
  });
  return null;
}

const OUTLINE = [
  [-PW / 2, -PH / 2, PT / 2 + 0.006],
  [PW / 2, -PH / 2, PT / 2 + 0.006],
  [PW / 2, PH / 2, PT / 2 + 0.006],
  [-PW / 2, PH / 2, PT / 2 + 0.006],
  [-PW / 2, -PH / 2, PT / 2 + 0.006],
];

function Face({ layer, index, total, narrow, faceMat }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = PLATE_W;
    c.height = PLATE_H;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  useEffect(() => {
    let img = null;
    const redraw = () => {
      drawPlate(tex.image, layer, index, total, img, { narrow });
      tex.needsUpdate = true;
    };
    if (layer.image) {
      img = new Image();
      img.onload = redraw;
      img.src = IMAGES[layer.image];
    }
    redraw();
    if (document.fonts) {
      document.fonts.load('700 40px "Bricolage Grotesque"').then(redraw).catch(() => {});
      document.fonts.load('400 30px "IBM Plex Mono"').then(redraw).catch(() => {});
      document.fonts.ready.then(redraw);
    }
    return () => tex.dispose();
  }, [tex, layer, index, total, narrow]);

  return (
    <mesh position={[0, 0, PT / 2 + 0.003]}>
      <planeGeometry args={[PW, PH]} />
      <meshBasicMaterial ref={faceMat} map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

function Plate({ layer, index, total, rig, hot, extra, narrow }) {
  const group = useRef();
  const faceMat = useRef();
  const bodyMat = useRef();
  const outline = useRef();

  useFrame(() => {
    const { e, ov, f, gap } = rig.current;
    const g = group.current;
    if (!g) return;
    g.position.z = -index * gap;

    const ahead = index >= f ? lerp(1, 0.3, clamp01(index - f)) : clamp01(1 - (f - index) / 0.6);
    const o = lerp(1, ahead, (1 - ov) * e);
    g.visible = o > 0.02;
    if (faceMat.current) faceMat.current.opacity = o;
    if (bodyMat.current) bodyMat.current.opacity = o;
    if (outline.current) outline.current.material.opacity = o;
  });

  return (
    <group ref={group}>
      <RoundedBox args={[PW + 0.1, PH + 0.1, PT]} radius={0.05} smoothness={3}>
        <meshStandardMaterial ref={bodyMat} color="#0a1c3a" metalness={0.55} roughness={0.4} transparent />
      </RoundedBox>
      <Face layer={layer} index={index} total={total} narrow={narrow} faceMat={faceMat} />
      <Line ref={outline} points={OUTLINE} color={hot ? HOT : LINE} lineWidth={hot ? 2.6 : 1.4} transparent />
      {extra}
    </group>
  );
}

// A rail beside the stack with one node per layer and a glowing packet at the
// layer the camera is at, so the order of the stack reads as a path.
function Rail({ n, rig, hotIndex }) {
  const scaleGroup = useRef();
  const packet = useRef();
  const halo = useRef();
  const nodes = useRef([]);
  const x = -PW / 2 - 0.5;

  useFrame(() => {
    const { e, f, gap, ov } = rig.current;
    // The rail only shows in the overview; while flying through, the dots
    // in the page carry that job and the 3D markers would crowd the text.
    const show = e > 0.02 && ov > 0.3;
    if (scaleGroup.current) {
      scaleGroup.current.scale.z = gap;
      scaleGroup.current.visible = show;
    }
    nodes.current.forEach((m, i) => {
      if (!m) return;
      m.position.z = -i * gap;
      m.visible = show;
    });
    if (packet.current) {
      packet.current.position.z = -f * gap;
      packet.current.visible = show;
    }
    if (halo.current) {
      halo.current.position.z = -f * gap;
      halo.current.visible = show;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      <group ref={scaleGroup}>
        <Line points={[[0, 0, 0], [0, 0, -(n - 1)]]} color={LINE} lineWidth={1.2} transparent opacity={0.6} />
      </group>
      {Array.from({ length: n }, (_, i) => (
        <mesh key={i} ref={(m) => { nodes.current[i] = m; }}>
          <sphereGeometry args={[i === hotIndex ? 0.1 : 0.07, 12, 10]} />
          <meshBasicMaterial color={i === hotIndex ? HOT : LINE} />
        </mesh>
      ))}
      <mesh ref={packet}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshBasicMaterial color={HOT} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshBasicMaterial color={HOT} transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Faint corner lines that show the plates are one aligned stack.
function Beams({ n, rig }) {
  const g = useRef();
  useFrame(() => {
    if (!g.current) return;
    const { gap, e } = rig.current;
    g.current.scale.z = gap;
    g.current.visible = e > 0.05;
  });
  const cs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  return (
    <group ref={g}>
      {cs.map(([sx, sy], i) => (
        <Line key={i} points={[[(sx * PW) / 2, (sy * PH) / 2, 0], [(sx * PW) / 2, (sy * PH) / 2, -(n - 1)]]} color={LINE} lineWidth={1} transparent opacity={0.22} />
      ))}
    </group>
  );
}

export default function TeardownScene({ layers, progress, visible, hotIndex, extras }) {
  const rig = useRef({ p: 0, e: 0, ov: 0, f: 0, gap: A_GAP });
  const n = layers.length;

  return (
    <Canvas
      className="td-gl"
      flat
      frameloop={visible ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: FOV, near: 0.1, far: 90, position: [0, 0, 10] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 16, 50]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} />
      <Driver progress={progress} rig={rig} n={n} />
      <Beams n={n} rig={rig} />
      <Rail n={n} rig={rig} hotIndex={hotIndex} />
      {layers.map((layer, i) => {
        const Rig = extras && RIGS[extras[i]];
        const extra = Rig ? <Rig rig={rig} /> : null;
        return (
          <Plate key={layer.name} layer={layer} index={i} total={n} rig={rig} hot={hotIndex === i} extra={extra} narrow={Boolean(extra)} />
        );
      })}
    </Canvas>
  );
}
