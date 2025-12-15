import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

const MODEL_URL = new URL("./3D/dpglb.glb", import.meta.url).href;
const MODEL_SCALE = 0.1;

function DesktopModel() {
  const { scene } = useGLTF(MODEL_URL);
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    cloned.scale.setScalar(MODEL_SCALE);
    cloned.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  return <primitive object={clonedScene} />;
}

useGLTF.preload(MODEL_URL);

function ProfileModel() {
  return (
    <div className="profile-3d">
      <Canvas camera={{ position: [20, 10.5, 3.5], fov: 45 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.1}
          castShadow
        />
        <Suspense fallback={null}>
          <DesktopModel />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

export default ProfileModel;

