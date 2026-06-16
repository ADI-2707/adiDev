import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Animation map per section
const SECTION_ANIMATIONS = {
  hero: null,         // uses idle float from <Float>
  about: null,
  skills: null,
  experience: null,
  projects: null,
  contact: null,
  game: null,
};

export const Astronaut = ({ activeSection, scale = 1.8, position = [0, -1.2, 0] }) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/model/Astronaut.glb');
  const { actions, names } = useAnimations(animations, group);

  // Play the first (idle) animation by default
  useEffect(() => {
    if (names.length > 0) {
      const idle = actions[names[0]];
      if (idle) {
        idle.reset().fadeIn(0.5).play();
      }
    }
    return () => {
      names.forEach((name) => actions[name]?.fadeOut(0.3));
    };
  }, [actions, names]);

  // Gentle head / body tilt toward mouse
  useFrame(({ clock, mouse }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    // Subtle idle sway
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.x * 0.3,
      0.03
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -mouse.y * 0.1,
      0.03
    );
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.05, 0.05]}
    >
      <group ref={group} position={position} scale={scale} dispose={null}>
        <primitive object={scene} />
      </group>
    </Float>
  );
};

useGLTF.preload('/model/Astronaut.glb');
