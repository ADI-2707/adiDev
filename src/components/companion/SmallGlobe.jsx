import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

const Satellite = ({ radius, speed, color, inclination = 0 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (document.hidden) return;
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime() * speed;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;

    const pos = new THREE.Vector3(x, 0, z);
    pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination);

    meshRef.current.position.copy(pos);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const SmallGlobeMesh = () => {
  const sphereRef = useRef();

  useFrame((state, delta) => {
    if (document.hidden) return;
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.05;
      sphereRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group scale={[1.1, 1.1, 1.1]} position={[0, 0, 0]}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.0, 14, 14]} />
        <meshBasicMaterial
          color="#3A86FF"
          wireframe={true}
          transparent={true}
          opacity={0.28}
        />
      </mesh>

      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.003, 8, 64]} />
        <meshBasicMaterial color="#6EE7FF" transparent={true} opacity={0.38} />
      </mesh>

      <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
        <torusGeometry args={[1.3, 0.002, 8, 64]} />
        <meshBasicMaterial color="#3A86FF" transparent={true} opacity={0.28} />
      </mesh>

      <Satellite radius={1.2} speed={0.4} color="#6EE7FF" inclination={Math.PI / 4} />
      <Satellite radius={1.3} speed={-0.3} color="#3A86FF" inclination={-Math.PI / 4} />
      <Satellite radius={1.1} speed={0.5} color="#34D399" inclination={0} />
    </group>
  );
};

const SmallGlobe = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 2]} intensity={1.0} color="#6EE7FF" />
      <Suspense fallback={null}>
        <SmallGlobeMesh />
      </Suspense>
    </Canvas>
  );
};

export default SmallGlobe;
