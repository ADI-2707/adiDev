import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './ShootingStars.module.css';

const ShootingStars = ({ shootingStarRef }) => {
  const { viewport } = useThree();
  const [activeStar, setActiveStar] = useState(null);
  // Spawn the first star after 5 seconds
  const nextSpawnTime = useRef(Date.now() + 5000);

  useFrame((state, delta) => {
    const now = Date.now();

    // 1. Spawn a new shooting star
    if (!activeStar && now >= nextSpawnTime.current) {
      const fromLeft = Math.random() > 0.5;
      const width = viewport.width;
      const height = viewport.height;

      // Spawn slightly off-screen on the left/right
      const spawnX = fromLeft ? -width / 2 - 2 : width / 2 + 2;
      // Spawn in the upper half of the screen
      const spawnY = (Math.random() * 0.3 + 0.2) * height;
      const spawnZ = 0.2; // Spawn slightly in front of the galaxy background (z=-10) but behind or at astronaut level (z=0)

      // Angle of diagonal descent (approx 20-30 degrees downward)
      const angle = fromLeft ? -Math.PI / 8 : -7 * Math.PI / 8;
      const speed = 10 + Math.random() * 5; // Rapid transit speed

      setActiveStar({
        x: spawnX,
        y: spawnY,
        z: spawnZ,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        length: 2.0 + Math.random() * 1.5,
      });

      if (shootingStarRef) {
        shootingStarRef.current = null;
      }
    }

    // 2. Update the active shooting star
    if (activeStar) {
      const star = { ...activeStar };
      star.x += star.vx * delta;
      star.y += star.vy * delta;

      const width = viewport.width;
      const height = viewport.height;

      // Check if it has exited the viewport boundary
      const isOffScreen =
        star.vx > 0
          ? star.x > width / 2 + 3
          : star.x < -width / 2 - 3 || star.y < -height / 2 - 3;

      if (isOffScreen) {
        setActiveStar(null);
        if (shootingStarRef) {
          shootingStarRef.current = null;
        }
        // Schedule the next star in 7 to 14 seconds
        nextSpawnTime.current = now + 7000 + Math.random() * 7000;
      } else {
        setActiveStar(star);
        if (shootingStarRef) {
          // Write the 3D position to the shared ref for the astronaut to track
          if (!shootingStarRef.current) {
            shootingStarRef.current = new THREE.Vector3();
          }
          shootingStarRef.current.set(star.x, star.y, star.z);
        }
      }
    }
  });

  if (!activeStar) return null;

  return (
    <group
      position={[activeStar.x, activeStar.y, activeStar.z]}
      rotation={[0, 0, activeStar.angle]}
    >
      {/* Outer Glow Trail (Aqua/Purple) */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[-activeStar.length / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.005, 0.05, activeStar.length, 8]} />
        <meshBasicMaterial
          color="#33c2cc"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Streak (White hot center) */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[-activeStar.length / 3, 0, 0]}
      >
        <cylinderGeometry args={[0.002, 0.02, activeStar.length * 0.7, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Bright Core Head */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

export default ShootingStars;
