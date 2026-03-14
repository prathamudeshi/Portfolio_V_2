'use client';
/**
 * SpatialWorkspace.tsx — R3F Canvas with 3D environment and head-tracked camera.
 *
 * Camera now responds to headZ (depth) — moving closer/farther from the
 * webcam zooms the entire scene in/out.
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

// ── Grid floor ──────────────────────────────────────────────────
function GridFloor() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const verts: number[] = [];
    const size = 40;
    const divisions = 40;
    const half = size / 2;
    const step = size / divisions;
    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      verts.push(-half, 0, pos, half, 0, pos);
      verts.push(pos, 0, -half, pos, 0, half);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return g;
  }, []);

  return (
    <lineSegments geometry={geo} position={[0, -3, -5]}>
      <lineBasicMaterial color="#818cf8" transparent opacity={0.08} />
    </lineSegments>
  );
}

// ── Floating particles ────────────────────────────────────────────
function Particles({ count = 200 }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#818cf8" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// ── Wireframe room ────────────────────────────────────────────────
function WireframeRoom() {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(14, 8, 16)), []);
  return (
    <lineSegments geometry={geo} position={[0, 0, -6]}>
      <lineBasicMaterial color="#818cf8" transparent opacity={0.06} />
    </lineSegments>
  );
}

// ── Head-tracked camera with DEPTH ZOOM ──────────────────────────
import { type SpatialState } from '@/hooks/useSpatialTracking';

function HeadTrackedCamera({ getSpatialState }: { getSpatialState: () => SpatialState }) {
  const smoothX = useRef(0);
  const smoothY = useRef(0);
  const smoothZ = useRef(0);
  const { camera } = useThree();

  useFrame(() => {
    const { headX: x, headY: y, headZ: z } = getSpatialState();
    smoothX.current += (x - smoothX.current) * 0.1;
    smoothY.current += (y - smoothY.current) * 0.1;
    smoothZ.current += (z - smoothZ.current) * 0.08; // slightly slower lerp for depth

    // X/Y — lateral and vertical offset
    camera.position.x = smoothX.current * 2;
    camera.position.y = smoothY.current * 1.5;

    // Z — depth zoom: closer face = camera moves forward, farther = moves back
    // Clamp to prevent going through the scene or too far away
    const baseZ = 5;
    const zoomRange = 2; // ±2 units of zoom
    camera.position.z = baseZ - Math.max(-zoomRange, Math.min(zoomRange, smoothZ.current * 3));

    camera.lookAt(0, 0, -3);
  });

  return null;
}

// ── Main canvas ─────────────────────────────────────────────────
interface SpatialWorkspaceProps {
  getSpatialState: () => SpatialState;
  children?: ReactNode;
}

export default function SpatialWorkspace({ getSpatialState, children }: SpatialWorkspaceProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 5] }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#05050f' }}
      >
        <fog attach="fog" args={['#05050f', 8, 30]} />
        <ambientLight intensity={0.3} />
        <HeadTrackedCamera getSpatialState={getSpatialState} />
        <GridFloor />
        <WireframeRoom />
        <Particles />
        {children}
      </Canvas>
    </div>
  );
}
