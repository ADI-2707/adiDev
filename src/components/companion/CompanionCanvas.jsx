/* eslint-disable no-unused-vars */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import styles from './CompanionCanvas.module.css';

// A single satellite dot moving along an orbit
const Satellite = ({ radius, speed, color, inclination = 0 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    // Calculate orbital position
    const t = state.clock.getElapsedTime() * speed;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    
    // Apply inclination rotation
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

// Wireframe Globe Component
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
      // Interpolate position and scale based on active stage
      // Stage 1 (Dossier) and Stage 8 (Report): Right-side hero placement
      // Stage 2 (Evaluation) and Stage 7 (Operations): Background central alignment
      // Other stages: Faded out or tucked away
      let targetPos = [1.3, 0, 0];
      let targetScale = 1.0;
      let targetOpacity = 0.85;

      const isMobile = window.innerWidth < 768;

      if (activeStage === 0) {
        // Boot: hidden
        targetOpacity = 0.0;
        targetScale = 0.1;
      } else if (activeStage === 1 || activeStage === 8) {
        // Dossier and Report: right panel
        targetPos = isMobile ? [0, -0.6, 0] : [viewport.width * 0.22, 0, 0];
        targetScale = isMobile ? 0.55 : viewport.width * 0.13;
        targetOpacity = 0.85;
      } else if (activeStage === 2) {
        // Evaluation: Central background, smaller
        targetPos = [0, 0, -2];
        targetScale = 1.5;
        targetOpacity = 0.25;
      } else if (activeStage === 7) {
        // Operations: Central background
        targetPos = [0, 0, -2.5];
        targetScale = 1.8;
        targetOpacity = 0.15;
      } else {
        // Hidden/highly faded for skills, projects, experience, philosophy
        targetPos = [0, 0, -5];
        targetScale = 0.8;
        targetOpacity = 0.05;
      }

      // Smooth lerp
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPos[0], 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPos[1], 0.05);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPos[2], 0.05);
      
      const currentScale = groupRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
      groupRef.current.scale.set(nextScale, nextScale, nextScale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base wireframe sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.0, 30, 30]} />
        <meshBasicMaterial 
          color="#3A86FF" 
          wireframe={true} 
          transparent={true} 
          opacity={0.12} 
        />
      </mesh>
      
      {/* Outer orbit rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.003, 8, 64]} />
        <meshBasicMaterial color="#6EE7FF" transparent={true} opacity={0.25} />
      </mesh>

      <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
        <torusGeometry args={[1.3, 0.002, 8, 64]} />
        <meshBasicMaterial color="#3A86FF" transparent={true} opacity={0.15} />
      </mesh>
      
      {/* Moving dots (telemetry satellites) */}
      <Satellite radius={1.2} speed={0.4} color="#6EE7FF" inclination={Math.PI / 4} />
      <Satellite radius={1.3} speed={-0.3} color="#3A86FF" inclination={-Math.PI / 4} />
      <Satellite radius={1.1} speed={0.5} color="#34D399" inclination={0} />
    </group>
  );
};

const CompanionCanvas = ({ activeStage }) => {
  const zIndex = (activeStage === 1 || activeStage === 8) ? 15 : 2;

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
