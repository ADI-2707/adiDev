import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import styles from './AegisGameCanvas.module.css';

// Parallax camera rig tracking mouse pointer
const CameraRig = ({ activeZoom }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 3));
  const targetRot = useRef(new THREE.Euler(0, 0, 0));

  useFrame((state) => {
    if (activeZoom === 'terminal') {
      targetPos.current.set(0, -0.1, 0.3);
      targetRot.current.set(0, 0, 0);
    } else if (activeZoom === 'relay') {
      targetPos.current.set(-1.1, 0.1, 0.5);
      targetRot.current.set(0, Math.PI / 6, 0);
    } else if (activeZoom === 'satellite') {
      targetPos.current.set(1.1, 0.1, 0.5);
      targetRot.current.set(0, -Math.PI / 6, 0);
    } else {
      // Normal Lookaround
      const px = state.pointer.x * 0.45;
      const py = state.pointer.y * 0.35;
      targetPos.current.set(px * 0.3, py * 0.2, 2.5);
      targetRot.current.set(py * 0.2, -px * 0.25, 0);
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
  const lightRef = useRef();
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOn((prev) => !prev);
    }, 1000 * blinkSpeed + Math.random() * 200);
    return () => clearInterval(interval);
  }, [blinkSpeed]);

  return (
    <mesh position={position} ref={lightRef}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color={isOn ? baseColor : '#1e293b'} />
    </mesh>
  );
};

// Low-poly 3D room mesh models
const ServerRoom = ({ activeZoom, onSelectProp }) => {
  const deskRef = useRef();
  const mainScreenRef = useRef();

  return (
    <group>
      {/* 1. Hacking Desk */}
      <mesh ref={deskRef} position={[0, -1.0, -0.6]}>
        <boxGeometry args={[4.5, 0.15, 1.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* 2. Main Terminal Monitor */}
      <group
        position={[0, -0.1, -1.0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectProp('terminal');
        }}
      >
        {/* Chassis */}
        <mesh>
          <boxGeometry args={[1.5, 1.0, 0.18]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Glowing Screen face */}
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.38, 0.88]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={activeZoom === 'terminal' ? 1.8 : 0.8}
            roughness={0.1}
          />
        </mesh>
        {/* Decorative Grid Lines */}
        <gridHelper args={[1.3, 10, '#22d3ee', '#0891b2']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.11]} />
      </group>

      {/* 3. Left Power Relay Panel */}
      <group
        position={[-1.6, 0.05, -0.8]}
        rotation={[0, Math.PI / 6, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectProp('relay');
        }}
      >
        {/* Chassis */}
        <mesh>
          <boxGeometry args={[1.1, 0.9, 0.15]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Glowing Screen */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[1.0, 0.8]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={activeZoom === 'relay' ? 1.8 : 0.8}
            roughness={0.1}
          />
        </mesh>
        {/* Decorative circuit lines */}
        <gridHelper args={[0.9, 6, '#fbbf24', '#d97706']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.09]} />
      </group>

      {/* 4. Right Satellite Dial Monitor */}
      <group
        position={[1.6, 0.05, -0.8]}
        rotation={[0, -Math.PI / 6, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectProp('satellite');
        }}
      >
        {/* Chassis */}
        <mesh>
          <boxGeometry args={[1.1, 0.9, 0.15]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Glowing Screen */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[1.0, 0.8]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={activeZoom === 'satellite' ? 1.8 : 0.8}
            roughness={0.1}
          />
        </mesh>
        {/* Decorative aligned grids */}
        <gridHelper args={[0.9, 8, '#34d399', '#059669']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.09]} />
      </group>

      {/* 5. Background Server Racks */}
      <group position={[-2.4, 0.5, -2.2]}>
        <mesh>
          <boxGeometry args={[1.0, 3.0, 1.0]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.8} />
        </mesh>
        {/* Server Racks LED arrays */}
        <BlinkingLight position={[0.2, 1.2, 0.51]} baseColor="#ef4444" blinkSpeed={0.8} />
        <BlinkingLight position={[0.2, 1.0, 0.51]} baseColor="#10b981" blinkSpeed={0.4} />
        <BlinkingLight position={[0.2, 0.8, 0.51]} baseColor="#10b981" blinkSpeed={0.5} />
        <BlinkingLight position={[0.2, 0.6, 0.51]} baseColor="#3b82f6" blinkSpeed={1.2} />

        <BlinkingLight position={[0.2, 0.0, 0.51]} baseColor="#ef4444" blinkSpeed={0.9} />
        <BlinkingLight position={[0.2, -0.2, 0.51]} baseColor="#10b981" blinkSpeed={0.3} />
        <BlinkingLight position={[0.2, -0.4, 0.51]} baseColor="#10b981" blinkSpeed={0.6} />
      </group>

      <group position={[2.4, 0.5, -2.2]}>
        <mesh>
          <boxGeometry args={[1.0, 3.0, 1.0]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.8} />
        </mesh>
        <BlinkingLight position={[-0.2, 1.1, 0.51]} baseColor="#ef4444" blinkSpeed={0.7} />
        <BlinkingLight position={[-0.2, 0.9, 0.51]} baseColor="#10b981" blinkSpeed={0.5} />
        <BlinkingLight position={[-0.2, 0.7, 0.51]} baseColor="#3b82f6" blinkSpeed={1.0} />

        <BlinkingLight position={[-0.2, 0.1, 0.51]} baseColor="#10b981" blinkSpeed={0.4} />
        <BlinkingLight position={[-0.2, -0.1, 0.51]} baseColor="#10b981" blinkSpeed={0.5} />
        <BlinkingLight position={[-0.2, -0.3, 0.51]} baseColor="#ef4444" blinkSpeed={1.1} />
      </group>

      {/* 6. Desk accessories (small keyboard blocks) */}
      <mesh position={[0, -0.92, -0.4]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.35]} />
        <meshStandardMaterial color="#1e293b" />
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
        style={{ width: '100%', height: '100%', background: '#020408' }}
      >
        {/* Dynamic Studio/Mainframe lighting setup */}
        <ambientLight intensity={0.15} color="#1d4ed8" />
        
        {/* Spotlights projecting glow and shadows */}
        <spotLight
          position={[0, 3, 2]}
          angle={Math.PI / 3}
          penumbra={0.8}
          intensity={1.2}
          color="#38bdf8"
          castShadow
        />
        <spotLight
          position={[-2.5, 2, -1.0]}
          angle={Math.PI / 4}
          penumbra={0.5}
          intensity={0.8}
          color="#fbbf24"
        />
        <spotLight
          position={[2.5, 2, -1.0]}
          angle={Math.PI / 4}
          penumbra={0.5}
          intensity={0.8}
          color="#34d399"
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
