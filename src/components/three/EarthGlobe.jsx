import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const EarthGlobe = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group>
        
        <Sphere ref={meshRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#161a31"
            distort={0.25}
            speed={1.5}
            roughness={0.6}
            metalness={0.4}
          />
        </Sphere>

        
        <Sphere args={[1.38, 64, 64]}>
          <meshBasicMaterial
            color="#33c2cc"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </Sphere>

        
        <Sphere args={[1.55, 32, 32]}>
          <meshBasicMaterial
            color="#5c33cc"
            transparent
            opacity={0.03}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </Float>
  );
};

export default EarthGlobe;
