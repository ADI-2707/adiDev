import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Astronaut = ({ activeSection }) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/model/Astronaut.glb');
  const { actions, names } = useAnimations(animations, group);

  // Section-specific transitions
  const isHero = activeSection === 'hero';
  const isSkills = activeSection === 'skills';

  // Base state values (corner companion state)
  let targetScale = 0.75;
  let targetY = -1.0;
  let targetRotX = 0.15;
  let targetRotY = 0.2;
  let targetRotZ = -0.25;

  if (isHero) {
    targetScale = 1.15;
    targetY = -1.4;
    targetRotX = 0.15;
    targetRotY = 0.2;
    targetRotZ = -0.25;
  } else if (isSkills) {
    targetScale = 1.1;             // Bring closer
    targetY = -0.4;                // Center vertically next to orbit ring
    targetRotX = 0.3;              // Lean forward in space
    targetRotY = 1.4;              // Face right towards the solar system planets
    targetRotZ = -0.45;            // Angle slant pointing at the planets
  }

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

  // Gentle head / body tilt toward mouse and section transition LERPs
  useFrame(({ mouse }) => {
    if (!group.current) return;

    // Smoothly transition scale
    group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.05);
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, targetScale, 0.05);
    group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, targetScale, 0.05);

    // Smoothly transition position Y
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.05);

    // Apply mouse influence on top of the section-specific target rotations
    const currentRotX = targetRotX - mouse.y * 0.15;
    const currentRotY = targetRotY + mouse.x * 0.35;
    const currentRotZ = targetRotZ;

    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, currentRotX, 0.05);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, currentRotY, 0.05);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, currentRotZ, 0.05);
  });

  return (
    <Float
      speed={1.4}
      rotationIntensity={1.8} // High rotation wobble
      floatIntensity={1.5}    // High vertical floating drift
      floatingRange={[-0.15, 0.15]} // Wider floating distance
    >
      <group ref={group} position={[0, targetY, 0]} scale={targetScale} dispose={null}>
        {/* Render model */}
        <primitive object={scene} />
      </group>
    </Float>
  );
};

useGLTF.preload('/model/Astronaut.glb');
