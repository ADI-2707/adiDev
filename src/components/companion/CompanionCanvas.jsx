import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Astronaut } from './Astronaut';
import StarField from '../three/StarField';
import ShootingStars from '../three/ShootingStars/ShootingStars';
import styles from './CompanionCanvas.module.css';

// Invisible flat disc that writes to the WebGL stencil buffer at the exact screen coordinates of the globe
const StencilMask = () => {
  const meshRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;
    const globeEl = document.querySelector('[class*="globeWrapper"]');
    if (globeEl) {
      const rect = globeEl.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * viewport.width - viewport.width / 2;
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * viewport.height + viewport.height / 2;
      // Positioned slightly in front of the astronaut (which is at z=0.5 in contact section)
      meshRef.current.position.set(x, y, 0.65);
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={1}>
      <ringGeometry args={[0, 1.25, 64]} />
      <meshBasicMaterial
        colorWrite={false}
        depthWrite={false}
        stencilWrite={true}
        stencilRef={1}
        stencilFunc={THREE.AlwaysStencilFunc}
        stencilFail={THREE.ReplaceStencilOp}
        stencilZFail={THREE.ReplaceStencilOp}
        stencilZPass={THREE.ReplaceStencilOp}
      />
    </mesh>
  );
};

const CompanionCanvas = ({ activeSection }) => {
  const isCompanionCorner = activeSection !== 'hero' && activeSection !== 'skills';
  const shootingStarRef = useRef(null);

  return (
    <div className={styles.canvasContainer}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, stencil: true }}
        style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 2]} intensity={1.5} color="#a0c4ff" />
        <pointLight position={[-2, -2, 2]} intensity={0.5} color="#7a57db" />

        <Suspense fallback={null}>
          <Astronaut activeSection={activeSection} shootingStarRef={shootingStarRef} />
          <ShootingStars shootingStarRef={shootingStarRef} active={isCompanionCorner} />
          
          {/* Dynamically mount the stencil mask only in the contact section */}
          {activeSection === 'contact' && <StencilMask />}

          <StarField />
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
