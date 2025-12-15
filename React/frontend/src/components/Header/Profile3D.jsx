import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, OrbitControls, useTexture } from '@react-three/drei';
import { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import stage0 from './images/stage_0.png';

// 3D FBX Model Component
function FBXModel({ onLoad }) {
  const groupRef = useRef();
  // Load FBX from public directory
  const fbx = useFBX('/models/Alienware 18_fbx.fbx');
  
  useEffect(() => {
    if (fbx && onLoad) {
      onLoad();
    }
  }, [fbx, onLoad]);
  
  // Animate the 3D model
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation based on time
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Subtle floating effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  if (!fbx) return null;

  // Scale and position the model appropriately
  // You may need to adjust these values based on your model size
  const scale = 0.2; 
  const position = [0, 0, 0];

  return (
    <primitive 
      ref={groupRef}
      object={fbx} 
      scale={scale}
      position={position}
    />
  );
}

// 3D Image Plane Component (fallback/alternative)
function Image3DPlane({ imageUrl, onLoad }) {
  const meshRef = useRef();
  const texture = useTexture(imageUrl);
  
  useEffect(() => {
    if (texture && onLoad) {
      onLoad();
    }
  }, [texture, onLoad]);
  
  // Animate the 3D plane
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation based on time
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Subtle floating effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2.2, 2.32]} />
      <meshStandardMaterial 
        map={texture} 
        emissive={new THREE.Color(0x000000)}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Main 3D Profile Component
export default function Profile3D({ onLoad }) {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      position: 'relative',
      borderRadius: '50%',
      overflow: 'hidden'
    }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <pointLight position={[0, 0, 5]} intensity={0.5} />
        
        {/* 3D FBX Model */}
        <Suspense fallback={null}>
          <FBXModel onLoad={onLoad} />
        </Suspense>
        
        {/* Alternative: 3D Image Plane (uncomment to use image instead) */}
        {/* <Image3DPlane imageUrl={stage0} onLoad={onLoad} /> */}
        
        {/* Optional: Enable mouse controls (you can disable this if you want) */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
