import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

const MODEL_URL = new URL("./3D/dpglb.glb", import.meta.url).href;
const MODEL_SCALE = 0.07;

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
    <div className="profile-3d profile-3d--compact">
      <Canvas
        // move camera closer and use tighter FOV so the model appears larger
        camera={{ position: [8, 4, 2], fov: 38 }}
        shadows
        onCreated={({ gl }) => {
          // set a clear color so the canvas area is visually distinct during testing
          gl.setClearColor('#0b2440');
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.1}
          castShadow
        />
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#C147E9" wireframe />
          </mesh>
        }>
          <DesktopModel />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          // disable scroll-to-zoom to prevent page scrolling confusion
          enableZoom={false}
          zoomSpeed={0.7}
          minDistance={4}
          maxDistance={30}
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

