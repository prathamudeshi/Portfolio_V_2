"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../ui/CanvasLoader";

const Earth = () => {
  const earth = useGLTF("/models/earth/compressed.glb");
  const ref = useRef<THREE.Group>(null!);

  // Manual rotation instead of autoRotate in OrbitControls
  // This gives us more control and we can easily stop it if needed
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <primitive ref={ref} object={earth.scene} scale={3} position-y={0} rotation-y={0} />
  );
};

export default function EarthCanvas() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance: Only render when in view
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {isVisible && (
        <Canvas
          // Disabled shadows as they weren't being used by any lights
          frameloop="always" // Switched to always but wrapped in isVisible
          dpr={[1, 1]} // Capped at 1.0 for performance
          gl={{ 
            preserveDrawingBuffer: false, // Changed to false for better perf
            antialias: false,
            powerPreference: "high-performance"
          }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [0, 3, 6],
          }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
            <Earth />
            <Preload all />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
