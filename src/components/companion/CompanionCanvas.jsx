import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, ContactShadows } from '@react-three/drei';
import { Astronaut } from './Astronaut';
import StarField from '../three/StarField';
import styles from './CompanionCanvas.module.css';

const CompanionCanvas = ({ activeSection }) => {
  const isHero = activeSection === 'hero';

  return (
    <div
      className={`${styles.canvasContainer} ${
        isHero ? styles.heroState : styles.companionState
      }`}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 2]} intensity={1.5} color="#a0c4ff" />
        <pointLight position={[-2, -2, 2]} intensity={0.5} color="#7a57db" />

        <Suspense fallback={null}>
          <Astronaut activeSection={activeSection} />
          {isHero && <StarField />}
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
