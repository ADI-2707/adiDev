import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, ContactShadows } from '@react-three/drei';
import { Astronaut } from './Astronaut';

const CompanionCanvas = ({ activeSection }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        right: '0',
        width: '160px',
        height: '220px',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 2]} intensity={1.2} color="#a0c4ff" />
        <pointLight position={[-2, -2, 2]} intensity={0.4} color="#7a57db" />

        <Suspense fallback={null}>
          <Astronaut activeSection={activeSection} />
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.25}
            scale={2}
            blur={2}
            color="#5c33cc"
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CompanionCanvas;
