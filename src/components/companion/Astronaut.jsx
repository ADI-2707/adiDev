import { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Astronaut = ({ activeSection, shootingStarRef }) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/model/Astronaut.glb');
  const { actions, names } = useAnimations(animations, group);

  // Responsive state tracking inside canvas frame
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse coordinates globally on the window to bypass Canvas pointer-events: none
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Section-specific transitions
  const isHero = activeSection === 'hero';
  const isSkills = activeSection === 'skills';

  // Base state values (corner companion state - pushed far right to avoid content overlap)
  let targetScale = 0.45;
  let targetPosition = isMobile ? [0.9, -1.2, 0] : [2.4, -1.0, 0];
  let targetRotX = 0.15;
  let targetRotY = 0.2;
  let targetRotZ = -0.25;

  if (isHero) {
    targetScale = isMobile ? 0.7 : 0.95;
    targetPosition = isMobile ? [0, -0.8, 0] : [1.3, -0.6, 0];
    targetRotX = 0.15;
    targetRotY = 0.2;
    targetRotZ = -0.25;
  } else if (isSkills) {
    targetScale = isMobile ? 0.6 : 0.75;
    // Pushed left to X: -2.2 and lowered to Y: -0.4 to keep head in camera frustum
    targetPosition = isMobile ? [0, 1.2, 0] : [-2.2, -0.4, 0];
    targetRotX = 0.1;              // Lean slightly forward
    targetRotY = 1.3;              // Face right towards the solar system planets
    targetRotZ = -0.2;             // Slanted slightly towards them
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

  // Smooth full 3D layout LERPs and mouse target following
  useFrame(({ viewport }) => {
    if (!group.current) return;

    // Smoothly transition scale
    group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.05);
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, targetScale, 0.05);
    group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, targetScale, 0.05);

    // Smoothly transition full 3D position (X, Y, Z)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetPosition[0], 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetPosition[1], 0.05);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetPosition[2], 0.05);

    // Determine the target coordinates to look at (shooting star takes priority over mouse)
    const activeStar = shootingStarRef?.current;
    let targetX, targetY, targetZ;
    let isTrackingStar = false;

    if (activeStar) {
      targetX = activeStar.x;
      targetY = activeStar.y;
      targetZ = activeStar.z;
      isTrackingStar = true;
    } else {
      const mouse = mouseRef.current;
      targetX = (mouse.x * viewport.width) / 2;
      targetY = (mouse.y * viewport.height) / 2;
      targetZ = 3.5; // Estimated mouse interaction depth in front of the model
    }

    // Calculate direction vector from astronaut's current position to the target
    const dx = targetX - group.current.position.x;
    const dy = targetY - group.current.position.y;
    
    // We virtualize dz when tracking the star to keep the angle math smooth and prevent extreme snapping
    const dz = isTrackingStar 
      ? Math.max(1.8, targetZ - group.current.position.z) 
      : 3.5;

    // Calculate rotation angle to look at target
    const lookAngleY = Math.atan2(dx, dz);
    const lookAngleX = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));

    // Constrain the tracking angles so the body rotation looks natural
    // We allow a slightly wider look range and faster response when tracking the meteor
    const maxTurnY = isTrackingStar ? 1.1 : 0.7;
    const maxTurnX = isTrackingStar ? 0.55 : 0.35;
    const lerpSpeed = isTrackingStar ? 0.08 : 0.05;

    const constrainedTurnY = Math.max(-maxTurnY, Math.min(maxTurnY, lookAngleY));
    const constrainedTurnX = Math.max(-maxTurnX, Math.min(maxTurnX, lookAngleX));

    // Combine base section rotation with dynamic look angles
    const currentRotX = targetRotX + constrainedTurnX;
    const currentRotY = targetRotY + constrainedTurnY;
    const currentRotZ = targetRotZ + constrainedTurnY * 0.12; // subtle body tilt on look direction

    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, currentRotX, lerpSpeed);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, currentRotY, lerpSpeed);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, currentRotZ, lerpSpeed);
  });

  return (
    <Float
      speed={1.4}
      rotationIntensity={1.8} // High rotation wobble
      floatIntensity={1.5}    // High vertical floating drift
      floatingRange={[-0.15, 0.15]} // Wider floating distance
    >
      <group ref={group} scale={targetScale} dispose={null}>
        <primitive object={scene} />
      </group>
    </Float>
  );
};

useGLTF.preload('/model/Astronaut.glb');
