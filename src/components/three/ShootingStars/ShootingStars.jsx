import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './ShootingStars.module.css';

const ShootingStars = ({ shootingStarRef, active }) => {
  const { viewport } = useThree();
  const [activeStar, setActiveStar] = useState(null);
  // Spawn the first star after 5 seconds
  const nextSpawnTime = useRef(Date.now() + 5000);

  useFrame((state, delta) => {
    const now = Date.now();

    // 1. Spawn a new shooting star (only if active)
    if (!activeStar && active && now >= nextSpawnTime.current) {
      const fromLeft = Math.random() > 0.5;
      const width = viewport.width;
      const height = viewport.height;

      // Spawn slightly off-screen on the left/right
      const spawnX = fromLeft ? -width / 2 - 2 : width / 2 + 2;
      // Spawn in the upper half of the screen
      const spawnY = (Math.random() * 0.3 + 0.2) * height;
      const spawnZ = 0.2; // Spawn slightly in front of the galaxy background (z=-10)

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
        length: 1.0 + Math.random() * 0.8, // Reduced size length (previously 2.0 to 3.5)
        opacity: 1.0,
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

      // If active section changes and stars are no longer allowed, fade out quickly
      if (!active) {
        star.opacity = Math.max(0, star.opacity - delta * 3.0); // fade out over ~0.3s
      }

      const width = viewport.width;
      const height = viewport.height;

      // Check if it has exited the viewport boundary or fully faded out
      const isOffScreen =
        star.vx > 0
          ? star.x > width / 2 + 3
          : star.x < -width / 2 - 3 || star.y < -height / 2 - 3;
      
      const isFadedOut = star.opacity <= 0;

      if (isOffScreen || isFadedOut) {
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
          // If the star is fading out, clear tracking early so head sweeps back smoothly
          if (star.opacity < 0.5) {
            shootingStarRef.current = null;
          } else {
            if (!shootingStarRef.current) {
              shootingStarRef.current = new THREE.Vector3();
            }
            shootingStarRef.current.set(star.x, star.y, star.z);
          }
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
      {/* Outer Glow Trail (Aqua/Purple) - Reduced width */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[-activeStar.length / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.003, 0.03, activeStar.length, 8]} />
        <meshBasicMaterial
          color="#33c2cc"
          transparent
          opacity={0.35 * activeStar.opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Streak (White hot center) - Reduced width */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[-activeStar.length / 3, 0, 0]}
      >
        <cylinderGeometry args={[0.001, 0.012, activeStar.length * 0.7, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8 * activeStar.opacity}
        />
      </mesh>

      {/* Bright Core Head - Reduced radius to 0.02 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={activeStar.opacity}
        />
      </mesh>
    </group>
  );
};

export default ShootingStars;
