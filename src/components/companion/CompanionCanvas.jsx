
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import styles from './CompanionCanvas.module.css';


const Satellite = ({ radius, speed, color, inclination = 0 }) => {
  const meshRef = useRef();

  useFrame((state) => {
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


const GlobeMesh = ({ activeStage }) => {
  const groupRef = useRef();
  const sphereRef = useRef();
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.05;
      sphereRef.current.rotation.x += delta * 0.02;
    }

    if (groupRef.current) {
      const isDesktop = window.innerWidth >= 1200;
      let targetScale = 1.4;
      let targetPos = [0, 0, -2.5];

      if (activeStage === 0) {
        targetScale = 0.1;
        targetPos = [0, 0, 0];
      } else {
        const isRightAligned = [1, 3, 5, 6, 8].includes(activeStage);
        if (isRightAligned && isDesktop) {
          targetPos = [viewport.width * 0.42, 0, -2.5];
        } else {
          targetPos = [0, 0, -2.5];
        }
      }

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPos[0], 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPos[1], 0.05);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPos[2], 0.05);

      const currentScale = groupRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
      groupRef.current.scale.set(nextScale, nextScale, nextScale);
    }
  });

  const isDesktop = window.innerWidth >= 1200;
  const wireframeOpacity = isDesktop ? 0.12 : 0.22;
  const ring1Opacity = isDesktop ? 0.25 : 0.40;
  const ring2Opacity = isDesktop ? 0.15 : 0.28;

  return (
    <group ref={groupRef}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.0, 30, 30]} />
        <meshBasicMaterial
          color="#3A86FF"
          wireframe={true}
          transparent={true}
          opacity={wireframeOpacity}
        />
      </mesh>

      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.003, 8, 64]} />
        <meshBasicMaterial color="#6EE7FF" transparent={true} opacity={ring1Opacity} />
      </mesh>

      <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
        <torusGeometry args={[1.3, 0.002, 8, 64]} />
        <meshBasicMaterial color="#3A86FF" transparent={true} opacity={ring2Opacity} />
      </mesh>

      <Satellite radius={1.2} speed={0.4} color="#6EE7FF" inclination={Math.PI / 4} />
      <Satellite radius={1.3} speed={-0.3} color="#3A86FF" inclination={-Math.PI / 4} />
      <Satellite radius={1.1} speed={0.5} color="#34D399" inclination={0} />
    </group>
  );
};

const CompanionCanvas = ({ activeStage }) => {
  const zIndex = 2;

  return (
    <div className={styles.canvasContainer} style={{ zIndex }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 2]} intensity={1.0} color="#6EE7FF" />

        <Suspense fallback={null}>
          <GlobeMesh activeStage={activeStage} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CompanionCanvas;
