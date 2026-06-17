import { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

export const Astronaut = ({ activeSection, shootingStarRef }) => {
  const group = useRef();
  const coreRef = useRef();
  const sheathRef = useRef();
  const materialRef = useRef();
  const { scene, animations } = useGLTF('/model/Astronaut.glb');
  const { actions, names } = useAnimations(animations, group);

  const { camera } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const isClickAnimatingRef = useRef(false);

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
  const currentTargetRef = useRef(new THREE.Vector3(0, 0, 3.5));

  // Handle click to trigger interactive backflip and spin
  const handleClick = () => {
    if (isClickAnimatingRef.current) return;
    isClickAnimatingRef.current = true;

    // Pop scale bounce
    const baseScale = group.current.scale.x;
    gsap.to(group.current.scale, {
      x: baseScale * 1.25,
      y: baseScale * 1.25,
      z: baseScale * 1.25,
      duration: 0.25,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    });

    // 360 backflip (rotation.x) and spin (rotation.y)
    gsap.to(group.current.rotation, {
      x: group.current.rotation.x + Math.PI * 2,
      y: group.current.rotation.y + Math.PI * 2,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        // Normalize rotation to prevent winding issues
        group.current.rotation.x = Math.atan2(Math.sin(group.current.rotation.x), Math.cos(group.current.rotation.x));
        group.current.rotation.y = Math.atan2(Math.sin(group.current.rotation.y), Math.cos(group.current.rotation.y));
        group.current.rotation.z = Math.atan2(Math.sin(group.current.rotation.z), Math.cos(group.current.rotation.z));
        isClickAnimatingRef.current = false;
      },
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (group.current) {
        const mouseVec = new THREE.Vector2(mouseRef.current.x, mouseRef.current.y);
        const raycaster = raycasterRef.current;
        raycaster.setFromCamera(mouseVec, camera);
        const intersects = raycaster.intersectObjects(group.current.children, true);

        if (intersects.length > 0) {
          document.body.style.cursor = 'pointer';
        } else if (document.body.style.cursor === 'pointer') {
          document.body.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (document.body.style.cursor === 'pointer') {
        document.body.style.cursor = 'default';
      }
    };
  }, [camera]);

  // Click listener with manual raycasting
  useEffect(() => {
    const handleClickWindow = (e) => {
      // Ignore click on inputs/buttons/anchors
      if (e.target.closest('input, textarea, button, a')) return;

      const mouseVec = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = raycasterRef.current;
      raycaster.setFromCamera(mouseVec, camera);

      if (group.current) {
        const intersects = raycaster.intersectObjects(group.current.children, true);
        if (intersects.length > 0) {
          handleClick();
        }
      }
    };

    window.addEventListener('click', handleClickWindow);
    return () => window.removeEventListener('click', handleClickWindow);
  }, [camera]);

  // Section-specific transitions
  const isHero = activeSection === 'hero';
  const isSkills = activeSection === 'skills';
  const isContact = activeSection === 'contact';

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
    // Pushed right to X: 1.75 and lowered to Y: -0.4
    targetPosition = isMobile ? [0, 1.2, 0] : [1.75, -0.4, 0];
    targetRotX = 0.1;              // Lean slightly forward
    targetRotY = -1.3;             // Face left towards the skills orbital rings
    targetRotZ = 0.2;              // Slanted slightly towards them
  } else if (isContact) {
    targetScale = isMobile ? 0.45 : 0.55;
    targetPosition = [0, 0, 0.5];
    targetRotX = 0.15;
    targetRotY = 0.0;
    targetRotZ = 0.0;
  }

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.stencilWrite = isContact;
        child.material.stencilRef = 1;
        child.material.stencilFunc = THREE.EqualStencilFunc;
      }
    });
  }, [scene, isContact]);

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

  useFrame((state) => {
    if (!group.current) return;

    const { viewport, camera } = state;

    let currentTargetScale = targetScale;
    let currentTargetPosition = [...targetPosition];

    if (isContact) {
      const globeEl = document.querySelector('[class*="globeWrapper"]');
      if (globeEl) {
        const rect = globeEl.getBoundingClientRect();
        const currentViewport = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0.5));

        const x = ((rect.left + rect.width / 2) / window.innerWidth) * currentViewport.width - currentViewport.width / 2;
        const y_globe_center = -((rect.top + rect.height / 2) / window.innerHeight) * currentViewport.height + currentViewport.height / 2;

        const globeCanvasHeightUnits = 2 * Math.tan((45 * Math.PI) / 360) * 4;
        const globeRadiusPx = (1.2 / globeCanvasHeightUnits) * rect.height;
        const globeRadiusUnits = (globeRadiusPx / window.innerHeight) * currentViewport.height;

        currentTargetScale = globeRadiusUnits * (isMobile ? 0.9 : 0.82);
        const yOffset = -1.7 * currentTargetScale;
        const y = y_globe_center + yOffset;

        currentTargetPosition = [x, y, 0.5];
      }
    }

    if (isClickAnimatingRef.current) {
      // Continue to update position (so it follows scroll/globe position)
      // but skip scale and rotation updates to let GSAP animate them.
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, currentTargetPosition[0], 0.05);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, currentTargetPosition[1], 0.05);
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, currentTargetPosition[2], 0.05);
      return;
    }

    group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, currentTargetScale, 0.05);
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, currentTargetScale, 0.05);
    group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, currentTargetScale, 0.05);

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, currentTargetPosition[0], 0.05);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, currentTargetPosition[1], 0.05);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, currentTargetPosition[2], 0.05);

    // Determine the desired target coordinate to look at (shooting star takes priority over mouse)
    const activeStar = shootingStarRef?.current;
    const desiredTarget = new THREE.Vector3();
    let isTrackingStar = false;

    if (activeStar) {
      desiredTarget.set(activeStar.x, activeStar.y, activeStar.z);
      isTrackingStar = true;
    } else {
      const mouse = mouseRef.current;
      const mouseX3D = (mouse.x * viewport.width) / 2;
      const mouseY3D = (mouse.y * viewport.height) / 2;
      desiredTarget.set(mouseX3D, mouseY3D, 3.5);
    }

    // Smoothly transition the look-at target itself to prevent snapping on changeover
    // Slower LERP when returning to mouse (0.04) for cushioning, faster LERP when locking onto star (0.08)
    const targetLerpSpeed = isTrackingStar ? 0.08 : 0.04;
    currentTargetRef.current.lerp(desiredTarget, targetLerpSpeed);

    // Calculate direction vector from astronaut's current position to the smoothed target
    const dx = currentTargetRef.current.x - group.current.position.x;
    const dy = currentTargetRef.current.y - group.current.position.y;

    // We virtualize dz relative to currentTargetRef to keep angle calculations smooth
    const dz = isTrackingStar
      ? Math.max(1.8, currentTargetRef.current.z - group.current.position.z)
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

    // Update dynamic 3D space tether in sync with the astronaut's position/rotation
    if (coreRef.current && sheathRef.current && group.current) {
      // Get backpack world position
      const start = new THREE.Vector3();
      group.current.getWorldPosition(start);

      // Local offset of the backpack on the unscaled model
      const localOffset = new THREE.Vector3(0.0, 1.62, -0.22);

      // Scale and rotate the offset using group's scale and quaternion
      localOffset.multiply(group.current.scale);
      localOffset.applyQuaternion(group.current.quaternion);
      start.add(localOffset);

      // End point: off-screen right
      const end = new THREE.Vector3(viewport.width / 2 + 1.2, -1.2, -0.5);

      // Mid point with natural sag
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2 + 0.2,
        Math.min(start.y, end.y) - 1.2,
        (start.z + end.z) / 2 - 0.2
      );

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const geomCore = new THREE.TubeGeometry(curve, 32, 0.016, 8, false);
      const geomSheath = new THREE.TubeGeometry(curve, 32, 0.045, 8, false);

      if (coreRef.current.geometry) coreRef.current.geometry.dispose();
      if (sheathRef.current.geometry) sheathRef.current.geometry.dispose();

      coreRef.current.geometry = geomCore;
      sheathRef.current.geometry = geomSheath;

      if (materialRef.current) {
        materialRef.current.emissiveIntensity = 0.3 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.15;
      }
    }
  });

  return (
    <group>
      <Float
        speed={isContact ? 0 : 1.4}
        rotationIntensity={isContact ? 0 : 1.8}
        floatIntensity={isContact ? 0 : 1.5}
        floatingRange={[-0.15, 0.15]}
      >
        <group ref={group} scale={targetScale} dispose={null}>
          <primitive object={scene} />
        </group>
      </Float>

      {/* Dynamic 3D space tether */}
      <group>
        {/* Outer translucent protective sheath */}
        <mesh ref={sheathRef}>
          <meshStandardMaterial
            color="#1e2238"
            roughness={0.15}
            metalness={0.85}
            transparent={true}
            opacity={0.65}
          />
        </mesh>

        {/* Inner glowing cyber core */}
        <mesh ref={coreRef}>
          <meshStandardMaterial
            ref={materialRef}
            color="#00ffff"
            emissive="#33c2cc"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>
    </group>
  );
};

useGLTF.preload('/model/Astronaut.glb');
