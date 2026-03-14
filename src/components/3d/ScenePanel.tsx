"use client";
/**
 * ScenePanel.tsx — Renders React children at a mutable 3D position.
 *
 * Uses drei's <Html> so the content is pinned to world-space.
 * The zIndex prop controls stacking order — focused panels render on top.
 */

import { Html } from "@react-three/drei";
import { type ReactNode } from "react";

interface ScenePanelProps {
  position: [number, number, number];
  children: ReactNode;
  visible: boolean;
  zIndex: number;
}

export default function ScenePanel({
  position,
  children,
  visible,
  zIndex,
}: ScenePanelProps) {
  if (!visible) return null;
  return (
    <group position={position}>
      <Html
        center
        distanceFactor={3}
        transform
        occlude={false}
        zIndexRange={[zIndex, zIndex]}
        style={{ pointerEvents: "auto", zIndex }}
      >
        {children}
      </Html>
    </group>
  );
}
