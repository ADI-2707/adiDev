import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const Tether = ({ astronautRef }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current || !astronautRef.current) return;

    // Get astronaut's world position
    const start = new THREE.Vector3();
    astronautRef.current.getWorldPosition(start);

    // Dynamic attachment offset relative to the astronaut's orientation (backpack position)
    const localOffset = new THREE.Vector3(-0.05, 0.15, -0.32);
    localOffset.applyQuaternion(astronautRef.current.quaternion);
    start.add(localOffset);

    // Anchor off-screen right
    const end = new THREE.Vector3(viewport.width / 2 + 1.2, -1.2, -0.5);

    // Mid point creating a natural catenary sag/curve in space
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2 + 0.2,
      Math.min(start.y, end.y) - 1.2,
      (start.z + end.z) / 2 - 0.2
    );

    // Generate path and rebuild geometry
    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    const nextGeometry = new THREE.TubeGeometry(curve, 32, 0.032, 8, false);

    // Clean up old geometry to prevent memory leaks
    if (meshRef.current.geometry) {
      meshRef.current.geometry.dispose();
    }
    meshRef.current.geometry = nextGeometry;

    // Subtle pulsing animation on the emissive cyber-glow
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.25 + Math.sin(state.clock.getElapsedTime() * 2.5) * 0.12;
    }
  });

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial
        ref={materialRef}
        color="#151728"
        roughness={0.4}
        metalness={0.7}
        emissive="#33c2cc"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
};
