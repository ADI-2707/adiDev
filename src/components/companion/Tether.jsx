import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const Tether = ({ astronautRef }) => {
  const coreRef = useRef();
  const sheathRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    if (!coreRef.current || !sheathRef.current || !astronautRef.current) return;

    // Get astronaut's world position
    const start = new THREE.Vector3();
    astronautRef.current.getWorldPosition(start);

    // Local offset of the backpack on the unscaled model
    const localOffset = new THREE.Vector3(0.0, 1.65, -0.32);
    
    // Scale the offset relative to the group's active scale
    localOffset.multiply(astronautRef.current.scale);
    
    // Rotate the offset to match the astronaut's orientation (backpack is at negative Z)
    localOffset.applyQuaternion(astronautRef.current.quaternion);
    
    // Position start at backpack world coordinates
    start.add(localOffset);

    // End point: off-screen right
    const end = new THREE.Vector3(viewport.width / 2 + 1.2, -1.2, -0.5);

    // Mid point creating a natural catenary sag/curve in space
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2 + 0.2,
      Math.min(start.y, end.y) - 1.2,
      (start.z + end.z) / 2 - 0.2
    );

    // Generate path and rebuild geometries
    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    const geomCore = new THREE.TubeGeometry(curve, 32, 0.016, 8, false);
    const geomSheath = new THREE.TubeGeometry(curve, 32, 0.045, 8, false);

    // Clean up old geometries to prevent memory leaks
    if (coreRef.current.geometry) coreRef.current.geometry.dispose();
    if (sheathRef.current.geometry) sheathRef.current.geometry.dispose();

    coreRef.current.geometry = geomCore;
    sheathRef.current.geometry = geomSheath;

    // Subtle pulsing animation on the emissive cyber-glow
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.3 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.15;
    }
  });

  return (
    <group>
      {/* Outer translucent metallic protective sheath */}
      <mesh ref={sheathRef}>
        <meshStandardMaterial
          color="#1e2238"
          roughness={0.15}
          metalness={0.85}
          transparent={true}
          opacity={0.65}
        />
      </mesh>

      {/* Inner glowing energy core */}
      <mesh ref={coreRef}>
        <meshStandardMaterial
          ref={materialRef}
          color="#00ffff"
          emissive="#33c2cc"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
};
