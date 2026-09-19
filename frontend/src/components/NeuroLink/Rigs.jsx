import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CONNECTIONS, POSES, lerpCurl, poseHand } from "./handPose";
import { T, smooth } from "../Teardown/timeline";

// Both rigs are pure functions of scroll progress: nothing moves on its own.
const LINE = "#9fc0ea";
const TIP = "#ffc21a";
const TIPS = [4, 8, 12, 16, 20];

function curlAt(p) {
  const t = smooth(T.diveStart, T.diveEnd, p) * 3;
  const k = Math.min(2, Math.floor(t));
  const a = POSES[k % POSES.length].curl;
  const b = POSES[(k + 1) % POSES.length].curl;
  return lerpCurl(a, b, smooth(0, 1, t - k));
}

// The 21-landmark hand model, floating in front of the "camera and landmarks" plate.
export function HandRig({ rig }) {
  const pts = useRef([]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(CONNECTIONS.length * 6), 3));
    return g;
  }, []);

  useFrame(() => {
    const p = poseHand(curlAt(rig.current.p));
    p.forEach((v, i) => pts.current[i]?.position.set(v[0], v[1], v[2]));
    const arr = geometry.attributes.position.array;
    CONNECTIONS.forEach(([a, b], i) => {
      arr.set(p[a], i * 6);
      arr.set(p[b], i * 6 + 3);
    });
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[1.5, -1.05, 0.4]} rotation={[-0.25, 0.4, 0]} scale={0.62}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={LINE} />
      </lineSegments>
      {Array.from({ length: 21 }, (_, i) => (
        <mesh key={i} ref={(m) => { pts.current[i] = m; }}>
          <sphereGeometry args={[TIPS.includes(i) ? 0.07 : 0.05, 12, 10]} />
          <meshBasicMaterial color={TIPS.includes(i) ? TIP : "#e6eefb"} />
        </mesh>
      ))}
    </group>
  );
}

// Head pose (yaw, pitch, roll) and gaze, floating in front of the "features" plate.
export function HeadRig({ rig }) {
  const head = useRef();
  useFrame(() => {
    const { p } = rig.current;
    const s = smooth(T.diveStart, T.diveEnd, p) * Math.PI * 6;
    if (head.current) head.current.rotation.set(Math.sin(s * 0.9 + 1) * 0.28, Math.sin(s * 0.6) * 0.75, Math.sin(s * 0.5 + 2) * 0.16);
  });
  return (
    <group position={[1.5, 0.05, 0.5]} scale={0.62}>
      <group ref={head}>
        <mesh scale={[0.85, 1.05, 0.9]}>
          <sphereGeometry args={[1, 18, 14]} />
          <meshBasicMaterial color={LINE} wireframe transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -0.05, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.13, 0.32, 10]} />
          <meshBasicMaterial color="#e6eefb" />
        </mesh>
        {[-0.32, 0.32].map((x) => (
          <mesh key={x} position={[x, 0.22, 0.78]}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshBasicMaterial color={TIP} />
          </mesh>
        ))}
        <mesh position={[0, 0.22, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 1.5, 6]} />
          <meshBasicMaterial color={TIP} transparent opacity={0.75} />
        </mesh>
      </group>
    </group>
  );
}
