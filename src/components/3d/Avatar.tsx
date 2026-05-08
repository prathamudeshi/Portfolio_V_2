"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useGuide } from "@/hooks/useGuide";
import {
  ROBOT_MODEL_URL,
  findRobotAnimation,
  tintRobotMaterials,
} from "@/components/3d/robotModel";
import { useThemeColors } from "@/hooks/useThemeColors";

const guideAnimationMap: Record<
  string,
  { names: readonly string[]; loop: THREE.AnimationActionLoopStyles; repetitions: number; speed: number }
> = {
  idle: {
    names: ["Idle", "Standing"],
    loop: THREE.LoopRepeat,
    repetitions: Infinity,
    speed: 1,
  },
  talking: {
    names: ["Talking", "Yes", "No"],
    loop: THREE.LoopRepeat,
    repetitions: Infinity,
    speed: 1.05,
  },
  pointing: {
    names: ["Punch", "Wave", "ThumbsUp"],
    loop: THREE.LoopOnce,
    repetitions: 1,
    speed: 0.6,
  },
  waving: {
    names: ["Wave", "ThumbsUp", "Yes"],
    loop: THREE.LoopOnce,
    repetitions: 1,
    speed: 1,
  },
};

export default function Avatar() {
  const group = useRef<THREE.Group>(null!);
  const { isActive, currentStep, steps } = useGuide();
  const colors = useThemeColors();
  const [loadError, setLoadError] = useState(false);

  const targetPos = useRef(new THREE.Vector3());
  const targetRot = useRef(new THREE.Euler());

  const { scene, animations } = useGLTF(
    ROBOT_MODEL_URL,
    undefined,
    undefined,
    (error) => {
      console.error("Failed to load Avatar model:", error);
      setLoadError(true);
    },
  );

  const avatarScene = useMemo(() => clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);
  const step = steps[currentStep];

  useEffect(() => {
    tintRobotMaterials(avatarScene, colors.accent);
  }, [avatarScene, colors.accent]);

  useEffect(() => {
    if (!actions) return;

    if (!isActive) {
      Object.values(actions).forEach((action) => {
        action?.fadeOut(0.2);
      });
      return;
    }

    const config = guideAnimationMap[step.animation] ?? guideAnimationMap.idle;
    const actionName = findRobotAnimation(names, config.names);
    if (!actionName) return;

    const action = actions[actionName];
    if (!action) return;

    Object.values(actions).forEach((candidate) => {
      if (candidate && candidate !== action) {
        candidate.fadeOut(0.2);
      }
    });

    action.reset();
    action.setLoop(config.loop, config.repetitions);
    action.setEffectiveTimeScale(config.speed);
    action.fadeIn(0.4);
    action.play();

    return () => {
      action.fadeOut(0.25);
    };
  }, [actions, isActive, names, step.animation]);

  useFrame((state) => {
    if (!group.current) return;

    if (!isActive) {
      if (group.current.position.y > -9) {
        group.current.position.y = THREE.MathUtils.lerp(
          group.current.position.y,
          -10,
          0.05,
        );
      }
      return;
    }

    targetPos.current.set(step.position[0], step.position[1], step.position[2]);
    group.current.position.lerp(targetPos.current, 0.1);

    targetRot.current.set(step.rotation[0], step.rotation[1], step.rotation[2]);
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRot.current.x,
      0.1,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRot.current.y,
      0.1,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetRot.current.z,
      0.1,
    );

    group.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  if (loadError) {
    return (
      <group position={[0, 0, -2]}>
        <mesh>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.accent}
            emissiveIntensity={2}
            wireframe
          />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={group} dispose={null} scale={0.4} position={[0, -10, 0]}>
      <primitive object={avatarScene} />
      <pointLight position={[0, 2, 2]} intensity={1} color={colors.accent} />
    </group>
  );
}

useGLTF.preload(ROBOT_MODEL_URL);
