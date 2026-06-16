import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Astronaut = ({ activeSection }) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/model/Astronaut.glb');
  const { actions, names } = useAnimations(animations, group);

  // Determine target scale and position based on section
  const isHero = activeSection === 'hero';
  const targetScale = isHero ? 1.15 : 0.75;
  const targetY = isHero ? -1.4 : -1.0;

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

    // Subtle rotation tilt toward mouse
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.x * 0.35,
      0.03
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -mouse.y * 0.15,
      0.03
    );
  });

  return (
    <Float
      speed={1.4}
      rotationIntensity={1.8} // High rotation wobble
      floatIntensity={1.5}    // High vertical floating drift
      floatingRange={[-0.15, 0.15]} // Wider floating distance
    >
      <group ref={group} position={[0, targetY, 0]} scale={targetScale} dispose={null}>
        {/* Added a default slanted rotation so it looks like it is floating naturally at an angle */}
        <primitive object={scene} rotation={[0.15, 0.2, -0.25]} />
      </group>
    </Float>
  );
};

useGLTF.preload('/model/Astronaut.glb');
