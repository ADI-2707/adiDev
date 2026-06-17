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

  useFrame((state) => {
    if (!meshRef.current) return;
    const globeEl = document.querySelector('[class*="globeWrapper"]');
    if (globeEl) {
      const rect = globeEl.getBoundingClientRect();
      const currentViewport = state.viewport.getCurrentViewport(state.camera, new THREE.Vector3(0, 0, 0.5));
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * currentViewport.width - currentViewport.width / 2;
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * currentViewport.height + currentViewport.height / 2;
      
      // Calculate globe radius in viewport units:
      // EarthGlobe uses a Sphere of radius 1.2 in a Canvas with camera position [0, 0, 4] and fov: 45
      const globeCanvasHeightUnits = 2 * Math.tan((45 * Math.PI) / 360) * 4; // ~3.3137
      // Core sphere is 1.2 units; we use 1.22 for a slightly padded crop boundary
      const globeRadiusPx = (1.22 / globeCanvasHeightUnits) * rect.height;
      const globeRadiusUnits = (globeRadiusPx / window.innerHeight) * currentViewport.height;

      // Positioned at the exact same depth as the astronaut (z=0.5)
      meshRef.current.position.set(x, y, 0.5);
      meshRef.current.scale.set(globeRadiusUnits, globeRadiusUnits, 1);
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <ringGeometry args={[0, 1.0, 64]} />
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
