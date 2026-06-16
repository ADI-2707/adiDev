import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import { Astronaut } from '../companion/Astronaut';
import StarField from './StarField';

const FloatingAstronaut = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#a0c4ff" />
      <pointLight position={[-3, 2, -2]} intensity={0.8} color="#7a57db" />
      <pointLight position={[3, -2, 2]} intensity={0.4} color="#33c2cc" />

      <Suspense fallback={null}>
        <Astronaut scale={2.2} position={[0, -1.4, 0]} />
        <StarField />
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
};

export default FloatingAstronaut;
