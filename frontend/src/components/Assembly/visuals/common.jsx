import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

// The 3D palette is the site's: near-black graphite bodies, magenta light.
export const C = {
  bg: "#0a0a0c",
  body: "#17171d",
  body2: "#22222b",
  dim: "#34343f",
  accent: "#C147E9",
  hi: "#eeb0ff",
  deep: "#6a1b9a",
  text: "#f2f2f5",
};

export const M = {
  body: new THREE.MeshStandardMaterial({ color: C.body, metalness: 0.5, roughness: 0.45 }),
  body2: new THREE.MeshStandardMaterial({ color: C.body2, metalness: 0.45, roughness: 0.5 }),
  accent: new THREE.MeshBasicMaterial({ color: C.accent }),
  hi: new THREE.MeshBasicMaterial({ color: C.hi }),
  deep: new THREE.MeshBasicMaterial({ color: C.deep }),
  text: new THREE.MeshBasicMaterial({ color: C.text }),
  glass: new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, opacity: 0.16, depthWrite: false }),
  wire: new THREE.MeshBasicMaterial({ color: C.accent, wireframe: true, transparent: true, opacity: 0.55 }),
};

let glowTexture = null;
// A soft radial dot, used as an additive glow behind bright things.
export function getGlow() {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glowTexture = new THREE.CanvasTexture(c);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}

export function Glow({ color = C.accent, size = 1, opacity = 0.5, ...props }) {
  const mat = useMemo(
    () => new THREE.SpriteMaterial({ map: getGlow(), color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }),
    [color, opacity],
  );
  return <sprite material={mat} scale={[size, size, size]} {...props} />;
}

// A graphite block with a thin magenta outline, the building block of every icon.
export function Block({ size = [1, 1, 1], radius = 0.04, edge = true, material = M.body, ...props }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size]);
  return (
    <group {...props}>
      <RoundedBox args={size} radius={radius} smoothness={2} material={material} />
      {edge ? (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={C.accent} transparent opacity={0.85} />
        </lineSegments>
      ) : null}
    </group>
  );
}

export const TRAY = 4.7;
export const TRAY_T = 0.14;
