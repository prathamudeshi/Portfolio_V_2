'use client';
/**
 * SpatialWorkspace.tsx — R3F Canvas with immersive 3D environment and head-tracked camera.
 *
 * Performance optimized:
 * - Single useFrame for all Auroras.
 * - Single useFrame for all Floating Shapes.
 * - Grid vertex density reduced.
 * - Particle updates throttled.
 * - Capped DPR and disabled expensive GL features.
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { useThemeColors, type ThemeColors } from '@/hooks/useThemeColors';

function hexToNorm(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

// ── Animated Grid Floor ─────────────────────────────────────────
function AnimatedGridFloor({ colors }: { colors: ThemeColors }) {
  const ref = useRef<THREE.LineSegments>(null!);
  const timeRef = useRef(0);
  const frameSkip = useRef(0);
  const [cr, cg, cb] = hexToNorm(colors.accent);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const verts: number[] = [];
    const size = 50;
    const divisions = 30; 
    const half = size / 2;
    const step = size / divisions;
    for (let i = 0; i <= divisions; i++) {
      const pos = -half + i * step;
      verts.push(-half, 0, pos, half, 0, pos);
      verts.push(pos, 0, -half, pos, 0, half);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    const vertCount = verts.length / 3;
    const colorArr = new Float32Array(vertCount * 3);
    g.setAttribute('color', new THREE.Float32BufferAttribute(colorArr, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    timeRef.current += dt;
    frameSkip.current++;
    if (frameSkip.current % 3 !== 0) return;
    if (!ref.current) return;
    const colorAttr = geo.getAttribute('color');
    const positions = geo.getAttribute('position').array as Float32Array;
    const colorData = colorAttr.array as Float32Array;
    const t = timeRef.current;

    for (let i = 0; i < positions.length / 3; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const dist = Math.sqrt(x * x + z * z);
      const wave = Math.sin(dist * 0.3 - t * 1.2) * 0.5 + 0.5;
      const intensity = 0.04 + wave * 0.18;
      colorData[i * 3]     = cr * intensity * 3;
      colorData[i * 3 + 1] = cg * intensity * 3;
      colorData[i * 3 + 2] = cb * intensity * 3;
    }
    colorAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={ref} geometry={geo} position={[0, -3.5, -5]} renderOrder={-10}>
      <lineBasicMaterial vertexColors transparent opacity={0.6} depthWrite={false} />
    </lineSegments>
  );
}

// ── Throttled Particle Field ─────────────────────────────────────
function ParticleField({ colors, count = 60 }: { colors: ThemeColors; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const timeRef = useRef(0);
  const frameSkip = useRef(0);
  const [cr, cg, cb] = hexToNorm(colors.accent);
  const [mr, mg, mb] = hexToNorm(colors.accentMid);

  const { positions, basePositions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const ph = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 30 - 5;
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z;
      ph[i * 3] = Math.random() * Math.PI * 2;
      ph[i * 3 + 1] = Math.random() * Math.PI * 2;
      ph[i * 3 + 2] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, basePositions: base, phases: ph };
  }, [count]);

  const particleColors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const mix = Math.random();
      cols[i * 3] = cr * (1 - mix) + mr * mix;
      cols[i * 3 + 1] = cg * (1 - mix) + mg * mix;
      cols[i * 3 + 2] = cb * (1 - mix) + mb * mix;
    }
    return cols;
  }, [count, cr, cg, cb, mr, mg, mb]);

  useFrame((_, dt) => {
    timeRef.current += dt;
    frameSkip.current++;
    if (frameSkip.current % 2 !== 0) return;
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const arr = posAttr.array as Float32Array;
    const t = timeRef.current;
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = basePositions[i * 3]     + Math.sin(t * 0.15 + phases[i * 3]) * 0.5;
      arr[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(t * 0.1  + phases[i * 3 + 1]) * 0.3;
      arr[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.12 + phases[i * 3 + 2]) * 0.4;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += dt * 0.005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[particleColors, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ── Optimized Aurora Field (Single useFrame for all planes) ──────
function AuroraField({ colors }: { colors: ThemeColors }) {
  const group = useRef<THREE.Group>(null!);
  const config = useMemo(() => [
    { pos: [-5, 3, -16] as [number,number,number], rot: [0.3, 0.2, 0.4] as [number,number,number], color: colors.accent, scale: [22, 8] as [number,number], speed: 0.15, phase: Math.random() * 5 },
    { pos: [6, -1, -20] as [number,number,number], rot: [-0.2, -0.3, -0.3] as [number,number,number], color: colors.accentMid, scale: [24, 10] as [number,number], speed: 0.1, phase: Math.random() * 5 },
    { pos: [0, 6, -14] as [number,number,number], rot: [0.15, 0, -0.18] as [number,number,number], color: "#22d3ee", scale: [28, 9] as [number,number], speed: 0.12, phase: Math.random() * 5 }
  ], [colors]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const et = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const c = config[i];
      const t = et * c.speed;
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t + c.phase) * 0.02;
      child.position.y = c.pos[1] + Math.sin(t * 0.5 + c.phase) * 1;
      child.rotation.z = c.rot[2] + Math.sin(t * 0.3) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {config.map((c, i) => (
        <mesh key={i} position={c.pos} rotation={c.rot}>
          <planeGeometry args={c.scale} />
          <meshBasicMaterial color={c.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// ── Optimized Floating Geometry (Single useFrame) ────────────────
function FloatingGeometry({ colors }: { colors: ThemeColors }) {
  const group = useRef<THREE.Group>(null!);
  const items = useMemo(() => {
    const geometries = [
      new THREE.OctahedronGeometry(0.3),
      new THREE.TetrahedronGeometry(0.25),
      new THREE.IcosahedronGeometry(0.2),
    ];
    return geometries.map((geo) => ({
      geo: new THREE.EdgesGeometry(geo),
      pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, -8 - Math.random() * 12] as [number,number,number],
      rotSpeed: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      driftSpeed: 0.05 + Math.random() * 0.1,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const item = items[i];
      child.rotation.x = t * item.rotSpeed;
      child.rotation.y = t * item.rotSpeed * 0.7;
      child.position.y = item.pos[1] + Math.sin(t * item.driftSpeed + item.phase) * 1.5;
      child.position.x = item.pos[0] + Math.cos(t * item.driftSpeed * 0.8 + item.phase) * 0.8;
    });
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <lineSegments key={i} geometry={item.geo} position={item.pos}>
          <lineBasicMaterial color={colors.accent} transparent opacity={0.25} />
        </lineSegments>
      ))}
    </group>
  );
}

// ── Head-tracked camera ──────────────────────────────────────────
import { type SpatialState } from '@/hooks/useSpatialTracking';

function HeadTrackedCamera({ getSpatialState }: { getSpatialState: () => SpatialState }) {
  const smoothX = useRef(0);
  const smoothY = useRef(0);
  const smoothZ = useRef(0);
  const { camera } = useThree();

  useFrame(() => {
    const state = getSpatialState();
    
    // Smoothly glide camera back to default center if face is not active
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    if (state.faceDetected) {
      targetX = state.headX;
      targetY = state.headY;
      targetZ = state.headZ;
    }

    smoothX.current += (targetX - smoothX.current) * 0.08;
    smoothY.current += (targetY - smoothY.current) * 0.08;
    smoothZ.current += (targetZ - smoothZ.current) * 0.06;

    camera.position.x = smoothX.current * 2;
    camera.position.y = smoothY.current * 1.5;
    const baseZ = 5;
    const zoomRange = 2;
    camera.position.z = baseZ - Math.max(-zoomRange, Math.min(zoomRange, smoothZ.current * 3));
    camera.lookAt(0, 0, -3);
  });

  return null;
}

export default function SpatialWorkspace({ getSpatialState, children }: { getSpatialState: () => SpatialState; children?: ReactNode }) {
  const colors = useThemeColors();
  
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 0, 5] }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={1}
        performance={{ min: 0.5 }}
        style={{ background: '#05050f' }}
      >
        <fog attach="fog" args={['#05050f', 10, 35]} />
        <ambientLight intensity={0.4} />
        <HeadTrackedCamera getSpatialState={getSpatialState} />
        <AuroraField colors={colors} />
        <AnimatedGridFloor colors={colors} />
        <ParticleField colors={colors} count={50} />
        <FloatingGeometry colors={colors} />
        {children}
      </Canvas>
    </div>
  );
}
