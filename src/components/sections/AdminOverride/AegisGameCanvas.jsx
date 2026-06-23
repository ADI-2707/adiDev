import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import styles from './AegisGameCanvas.module.css';

// Parallax camera rig tracking mouse pointer
const CameraRig = ({ activeZoom }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 2.5));
  const targetRot = useRef(new THREE.Euler(0, 0, 0));

  useFrame((state) => {
    if (activeZoom === 'terminal') {
      targetPos.current.set(0, -0.05, 0.4);
      targetRot.current.set(0, 0, 0);
    } else {
      // Normal Lookaround
      const px = state.pointer.x * 0.4;
      const py = state.pointer.y * 0.3;
      targetPos.current.set(px * 0.25, py * 0.15, 2.3);
      targetRot.current.set(py * 0.15, -px * 0.2, 0);
    }

    camera.position.lerp(targetPos.current, 0.08);
    const currentRot = new THREE.Quaternion().setFromEuler(camera.rotation);
    const targetQ = new THREE.Quaternion().setFromEuler(targetRot.current);
    currentRot.slerp(targetQ, 0.08);
    camera.rotation.setFromQuaternion(currentRot);
  });

  return null;
};

// Blinking indicator bulb on server racks
const BlinkingLight = ({ position, baseColor = '#10b981', blinkSpeed = 0.5 }) => {
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOn((prev) => !prev);
    }, 1000 * blinkSpeed + Math.random() * 150);
    return () => clearInterval(interval);
  }, [blinkSpeed]);

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={isOn ? baseColor : '#1e293b'} />
    </mesh>
  );
};

// Spinning Server Fan Blades Component
const ServerFan = ({ position }) => {
  const bladesRef = useRef();

  useFrame((state, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z -= delta * 15; // spin blades
    }
  });

  return (
    <group position={position}>
      {/* Fan Case Bezel */}
      <mesh>
        <torusGeometry args={[0.22, 0.015, 8, 32]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>
      
      {/* Rotating Blades */}
      <group ref={bladesRef}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * Math.PI) / 3;
          return (
            <mesh key={i} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.04, 0.4, 0.005]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
          );
        })}
        {/* Central Hub */}
        <mesh>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>
    </group>
  );
};

// Low-poly 3D room mesh models
const ServerRoom = ({ activeZoom, onSelectProp }) => {
  const deskRef = useRef();
  const screenGroupRef = useRef();

  // Floating effect for the main hologram screen
  useFrame((state) => {
    if (screenGroupRef.current && activeZoom !== 'terminal') {
      const t = state.clock.getElapsedTime();
      screenGroupRef.current.position.y = -0.05 + Math.sin(t * 1.5) * 0.03;
    } else if (screenGroupRef.current) {
      screenGroupRef.current.position.y = -0.05;
    }
  });

  return (
    <group>
      {/* 1. Cyber Hacking Desk with Neon Conduits */}
      <group position={[0, -0.9, -0.6]}>
        {/* Desk top */}
        <mesh ref={deskRef}>
          <boxGeometry args={[4.2, 0.1, 1.6]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.8} metalness={0.8} />
        </mesh>

        {/* Left/Right desk legs */}
        <mesh position={[-1.9, -0.4, 0]}>
          <boxGeometry args={[0.1, 0.8, 1.2]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[1.9, -0.4, 0]}>
          <boxGeometry args={[0.1, 0.8, 1.2]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Emissive Neon conduits running along the desk */}
        <mesh position={[0, 0.052, -0.6]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 3.8]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, 0.052, 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 3.8]} />
          <meshStandardMaterial color="#3a86ff" emissive="#3a86ff" emissiveIntensity={1.0} />
        </mesh>

        {/* Decorative Keypad controller blocks */}
        <mesh position={[-1.1, 0.06, 0.1]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.25]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[1.1, 0.06, 0.1]} rotation={[0, -0.1, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.25]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* 2. Floating Holographic Terminal Screen */}
      <group
        ref={screenGroupRef}
        position={[0, -0.05, -0.9]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectProp('terminal');
        }}
      >
        {/* Hologram Frame/Border */}
        <mesh>
          <boxGeometry args={[1.56, 1.16, 0.03]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        {/* Glowing glass terminal screen */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.48, 1.08]} />
          <meshStandardMaterial
            color="#091b33"
            emissive="#0891b2"
            emissiveIntensity={activeZoom === 'terminal' ? 1.5 : 0.6}
            transparent={true}
            opacity={0.88}
            roughness={0.1}
          />
        </mesh>
        {/* Tech Corner brackets */}
        <mesh position={[-0.74, 0.54, 0.03]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[0.74, 0.54, 0.03]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[-0.74, -0.54, 0.03]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[0.74, -0.54, 0.03]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>

        {/* Small lock icon or target cursor helper */}
        {activeZoom !== 'terminal' && (
          <mesh position={[0, 0, 0.03]}>
            <ringGeometry args={[0.1, 0.12, 16]} />
            <meshBasicMaterial color="#06b6d4" transparent={true} opacity={0.6} />
          </mesh>
        )}
      </group>

      {/* 3. Detailed Background Server Towers with Spinning Fans */}
      {/* Server Tower Left */}
      <group position={[-2.2, 0.4, -2.0]}>
        <mesh>
          <boxGeometry args={[0.9, 2.6, 0.9]} />
          <meshStandardMaterial color="#080c14" roughness={0.8} />
        </mesh>
        {/* Server Door outline panels */}
        <mesh position={[0, 0, 0.455]}>
          <boxGeometry args={[0.7, 2.4, 0.02]} />
          <meshStandardMaterial color="#111827" roughness={0.7} />
        </mesh>
        {/* Spinning Fans */}
        <ServerFan position={[0, 0.7, 0.47]} />
        <ServerFan position={[0, -0.7, 0.47]} />
        {/* Server status LEDs */}
        <BlinkingLight position={[0.25, 0.1, 0.47]} baseColor="#ef4444" blinkSpeed={0.8} />
        <BlinkingLight position={[0.25, 0.0, 0.47]} baseColor="#10b981" blinkSpeed={0.4} />
        <BlinkingLight position={[0.25, -0.1, 0.47]} baseColor="#3b82f6" blinkSpeed={1.0} />
      </group>

      {/* Server Tower Right */}
      <group position={[2.2, 0.4, -2.0]}>
        <mesh>
          <boxGeometry args={[0.9, 2.6, 0.9]} />
          <meshStandardMaterial color="#080c14" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.455]}>
          <boxGeometry args={[0.7, 2.4, 0.02]} />
          <meshStandardMaterial color="#111827" roughness={0.7} />
        </mesh>
        <ServerFan position={[0, 0.7, 0.47]} />
        <ServerFan position={[0, -0.7, 0.47]} />
        <BlinkingLight position={[-0.25, 0.1, 0.47]} baseColor="#10b981" blinkSpeed={0.6} />
        <BlinkingLight position={[-0.25, 0.0, 0.47]} baseColor="#ef4444" blinkSpeed={0.9} />
        <BlinkingLight position={[-0.25, -0.1, 0.47]} baseColor="#3b82f6" blinkSpeed={0.8} />
      </group>

      {/* 4. Hanging conduits / fiber cables in background */}
      {/* Left-to-center curved cables */}
      <mesh position={[-1.1, 1.2, -1.5]} rotation={[0, 0.1, -0.1]}>
        <cylinderGeometry args={[0.008, 0.008, 2.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      <mesh position={[1.1, 1.2, -1.5]} rotation={[0, -0.1, 0.1]}>
        <cylinderGeometry args={[0.008, 0.008, 2.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
    </group>
  );
};

const AegisGameCanvas = ({ activeZoom, onSelectProp }) => {
  return (
    <div className={styles.canvasContainer}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 2.5], fov: 60 }}
        style={{ width: '100%', height: '100%', background: '#020407' }}
      >
        {/* Dynamic Studio/Mainframe lighting setup */}
        <ambientLight intensity={0.12} color="#1d4ed8" />
        
        {/* Spotlights projecting glow and shadows */}
        <spotLight
          position={[0, 3, 2.5]}
          angle={Math.PI / 3.5}
          penumbra={0.9}
          intensity={1.5}
          color="#38bdf8"
          castShadow
        />
        
        {/* Left Server glowing reflection spotlight */}
        <spotLight
          position={[-2.0, 2.0, -1.0]}
          angle={Math.PI / 4}
          penumbra={0.7}
          intensity={1.0}
          color="#06b6d4"
        />
        
        {/* Right Server glowing reflection spotlight */}
        <spotLight
          position={[2.0, 2.0, -1.0]}
          angle={Math.PI / 4}
          penumbra={0.7}
          intensity={1.0}
          color="#3b82f6"
        />

        <Suspense fallback={null}>
          <ServerRoom activeZoom={activeZoom} onSelectProp={onSelectProp} />
          <CameraRig activeZoom={activeZoom} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AegisGameCanvas;
