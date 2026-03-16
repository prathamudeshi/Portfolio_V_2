"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGuide } from "@/hooks/useGuide";

// stable public character model with built-in animations
const AVATAR_URL =
  "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb";

export default function Avatar() {
  const group = useRef<THREE.Group>(null!);
  const { isActive, currentStep, steps } = useGuide();
  const [loadError, setLoadError] = React.useState(false);

  // Loading model with animations built-in
  const { scene, animations: anims } = useGLTF(
    AVATAR_URL,
    undefined,
    undefined,
    (error) => {
      console.error("Failed to load Avatar model:", error);
      setLoadError(true);
    },
  );

  const { actions, names } = useAnimations(anims, group);
  const step = steps[currentStep];

  // Map our animations to the RobotExpressive animation names
  // Typical names for this model: "Idle", "Talking", "Wave", "Jump", "Yes", "No", "Punch", "Running"
  useEffect(() => {
    if (!isActive || !actions) return;

    const animConfig: Record<string, { name: string; loop?: any; clamp?: boolean; speed?: number }> = {
      idle: { name: 'Idle', speed: 1 },
      talking: { name: 'Talking', speed: 1.2 }, // Talk a bit faster
      pointing: { name: 'Punch', loop: THREE.LoopOnce, clamp: true, speed: 0.5 }, // Slow down punch to look like pointing and hold it
      waving: { name: 'Wave', speed: 1 }
    };

    const config = animConfig[step.animation] || { name: 'Idle', speed: 1 };
    const actionName = names.find((n) => n === config.name) || names[0];
    const action = actions[actionName];
    
    if (action) {
      action.reset();
      action.fadeIn(0.5);
      
      // Apply custom config
      if (config.loop !== undefined) action.setLoop(config.loop, Infinity);
      if (config.clamp !== undefined) action.clampWhenFinished = config.clamp;
      if (config.speed !== undefined) action.setEffectiveTimeScale(config.speed);
      
      action.play();
      
      return () => {
        action.fadeOut(0.5);
      };
    }
  }, [currentStep, isActive, actions, names, step.animation]);

  // Smooth movement and rotation
  useFrame((state) => {
    if (!group.current) return;

    if (isActive) {
      // Lerp position
      const targetPos = new THREE.Vector3(...step.position);
      group.current.position.lerp(targetPos, 0.1);

      // Lerp rotation
      const targetRot = new THREE.Euler(...step.rotation);
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetRot.x,
        0.1,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRot.y,
        0.1,
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        targetRot.z,
        0.1,
      );

      // Floating effect
      group.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.05;
    } else {
      // Move away when not active
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y,
        -10,
        0.05,
      );
    }
  });

  // Setup materials
  useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          mat.emissiveIntensity = 0.5;
          mat.emissive = new THREE.Color("#818cf8");
        }
      }
    });
  }, [scene]);

  if (loadError) {
    return (
      <group position={[0, 0, -2]}>
        <mesh>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#818cf8"
            emissiveIntensity={2}
            wireframe
          />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={group} dispose={null} scale={0.4} position={[0, -10, 0]}>
      <primitive object={scene} />
      <pointLight position={[0, 2, 2]} intensity={1} color="#818cf8" />
    </group>
  );
}

// Preload assets
useGLTF.preload(AVATAR_URL);
