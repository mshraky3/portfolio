import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { lerp, smooth } from "../timeline";
import { Block, C, Envelope, Glow, M, basic } from "./common";
import { Screen } from "./sqb";

// Client sites: a contact form reaches the office, the map shows where, and a
// search engine finds the page.

const HI = new THREE.Color(C.hi);

// A smaller screen than SQB's, so two of them can sit on consecutive trays
// without reaching through the tray above.
export function SiteScreen(props) {
  return <Screen {...props} w={2.7} base={0.3} />;
}

const bounce = (t) => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
};

export function Reach({ mod }) {
  const mail = useRef();
  const pin = useRef();
  const ripple = useRef();
  const glass = useRef();
  const button = useMemo(() => basic(C.accent), []);
  const results = useMemo(() => [0, 1, 2].map(() => basic("#2a2a33")), []);
  const grid = useMemo(() => {
    const out = [];
    for (let i = 0; i <= 6; i += 1) {
      const x = -0.9 + i * 0.3;
      out.push([[x, 0.03, -0.75], [x, 0.03, 0.75]]);
    }
    for (let i = 0; i <= 5; i += 1) {
      const z = -0.75 + i * 0.3;
      out.push([[-0.9, 0.03, z], [0.9, 0.03, z]]);
    }
    return out;
  }, []);

  useFrame(() => {
    const { s } = mod.current;
    const send = smooth(0.06, 0.36, s);
    button.color.set(C.accent).lerp(HI, Math.exp(-(((s - 0.06) / 0.04) ** 2)));
    if (mail.current) {
      mail.current.position.set(lerp(-1.25, 0.3, send), lerp(0.55, 2.5, send) + Math.sin(send * Math.PI) * 0.3, lerp(0.1, -1.4, send));
      mail.current.rotation.set(0, 0.3, send * 0.6);
      mail.current.scale.setScalar(s > 0.05 ? 1 - smooth(0.3, 0.38, s) : 0);
    }
    const drop = smooth(0.34, 0.6, s);
    if (pin.current) {
      pin.current.position.set(1.05, lerp(2.4, 0.02, bounce(drop)), 0.6);
      pin.current.visible = s > 0.33;
    }
    const r = smooth(0.46, 0.66, s);
    if (ripple.current) {
      ripple.current.scale.setScalar(0.2 + r * 1.6);
      ripple.current.material.opacity = 0.8 * (1 - r) * (r > 0 ? 1 : 0);
    }
    const look = smooth(0.62, 0.96, s);
    if (glass.current) {
      glass.current.position.set(lerp(-0.55, 0.65, look), 1.55 + Math.sin(look * 9) * 0.12, -0.95);
      glass.current.visible = s > 0.6;
    }
    results.forEach((m, i) => m.color.set(look > 0.25 + i * 0.25 ? (i === 0 ? C.hi : C.accent) : "#2a2a33"));
  });

  return (
    <group>
      {/* the contact form */}
      <group position={[-1.3, 1.0, -0.1]} rotation={[0, 0.35, 0]}>
        <Block size={[1.2, 1.65, 0.05]} />
        {[0.5, 0.22, -0.06].map((y) => (
          <mesh key={y} position={[0, y, 0.03]} material={M.body2}>
            <boxGeometry args={[0.95, 0.16, 0.01]} />
          </mesh>
        ))}
        <mesh position={[0, -0.34, 0.03]} material={M.body2}>
          <boxGeometry args={[0.95, 0.3, 0.01]} />
        </mesh>
        <mesh position={[0.18, -0.64, 0.035]} material={button}>
          <boxGeometry args={[0.52, 0.16, 0.02]} />
        </mesh>
      </group>
      <Envelope ref={mail} />
      {/* the map */}
      <group position={[1.05, 0, 0.6]}>
        <mesh position={[0, 0.012, 0]} material={M.body2}>
          <boxGeometry args={[1.9, 0.02, 1.6]} />
        </mesh>
        {grid.map((pts, i) => (
          <Line key={i} points={pts} color={C.deep} lineWidth={1} transparent opacity={0.7} />
        ))}
        <Line points={[[-0.9, 0.035, 0.5], [-0.2, 0.035, 0.1], [0.1, 0.035, -0.05], [0.9, 0.035, -0.6]]} color={C.accent} lineWidth={2.4} />
        <mesh ref={ripple} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial color={C.hi} transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      <group ref={pin}>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI, 0, 0]} material={M.accent}>
          <coneGeometry args={[0.12, 0.36, 16]} />
        </mesh>
        <mesh position={[0, 0.44, 0]} material={M.hi}>
          <sphereGeometry args={[0.14, 16, 16]} />
        </mesh>
        <Glow position={[0, 0.44, 0]} size={1.1} opacity={0.5} />
      </group>
      {/* the search results, and the crawler's glass */}
      <group position={[0.1, 1.55, -1.25]} rotation={[0, 0.2, 0]}>
        <Block size={[1.9, 1.1, 0.05]} material={M.body} />
        {[0.3, 0, -0.3].map((y, i) => (
          <mesh key={y} position={[-0.1, y, 0.03]} material={results[i]}>
            <boxGeometry args={[1.4, 0.14, 0.01]} />
          </mesh>
        ))}
      </group>
      <group ref={glass} rotation={[0, 0.2, 0]}>
        <group position={[0, 0, 0]}>
          <mesh material={M.hi}>
            <torusGeometry args={[0.28, 0.035, 10, 36]} />
          </mesh>
          <mesh material={M.glass}>
            <circleGeometry args={[0.28, 28]} />
          </mesh>
          <mesh material={M.hi} position={[0.28, -0.28, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.06, 0.34, 0.04]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
