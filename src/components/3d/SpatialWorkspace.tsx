'use client';
/**
 * SpatialWorkspace.tsx — R3F Canvas with immersive 3D environment and head-tracked camera.
 *
 * Background features:
 * - Animated grid floor with pulse wave (theme-colored)
 * - Enhanced particle field with varied sizes, gentle drift, and color variety
 * - Constellation lines connecting nearby particles
 * - Aurora-like gradient wash planes for atmospheric color
 * - Floating wireframe geometry accents
 * - Subtle directional light beam
 *
 * All colors read from the theme via useThemeColors hook.
 */

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { useThemeColors, type ThemeColors } from '@/hooks/useThemeColors';

// ── Helper: hex → normalized RGB ────────────────────────────────
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
  const [cr, cg, cb] = hexToNorm(colors.accent);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const verts: number[] = [];
    const size = 50;
    const divisions = 50;
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
    if (!ref.current) return;
    const posAttr = geo.getAttribute('position');
    const colorAttr = geo.getAttribute('color');
    const positions = posAttr.array as Float32Array;
    const colorData = colorAttr.array as Float32Array;
    const t = timeRef.current;

    for (let i = 0; i < positions.length / 3; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const dist = Math.sqrt(x * x + z * z);
      const wave = Math.sin(dist * 0.3 - t * 1.2) * 0.5 + 0.5;
      const intensity = 0.04 + wave * 0.10;
      colorData[i * 3] = cr * intensity * 3;
      colorData[i * 3 + 1] = cg * intensity * 3;
      colorData[i * 3 + 2] = cb * intensity * 3;
    }
    colorAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={ref} geometry={geo} position={[0, -3.5, -5]}>
      <lineBasicMaterial vertexColors transparent opacity={0.6} />
    </lineSegments>
  );
}

// ── Enhanced Floating Particles with Constellation Lines ────────
function ParticleField({ colors, count = 350 }: { colors: ThemeColors; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const timeRef = useRef(0);
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
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      ph[i * 3] = Math.random() * Math.PI * 2;
      ph[i * 3 + 1] = Math.random() * Math.PI * 2;
      ph[i * 3 + 2] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, basePositions: base, phases: ph };
  }, [count]);

  // Per-particle colors — mix accent + accent-mid for variety
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

  const lineGeo = useMemo(() => {
    const maxLines = 600;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(maxLines * 6), 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(maxLines * 6), 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  useFrame((_, dt) => {
    timeRef.current += dt;
    const t = timeRef.current;

    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = basePositions[i * 3]     + Math.sin(t * 0.15 + phases[i * 3]) * 0.5;
      arr[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(t * 0.1 + phases[i * 3 + 1]) * 0.3;
      arr[i * 3 + 2] = basePositions[i * 3 + 2] + Math.cos(t * 0.12 + phases[i * 3 + 2]) * 0.4;
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += dt * 0.008;

    // Constellation lines
    if (!linesRef.current) return;
    const linePos = lineGeo.getAttribute('position') as THREE.BufferAttribute;
    const lineCol = lineGeo.getAttribute('color') as THREE.BufferAttribute;
    const lp = linePos.array as Float32Array;
    const lc = lineCol.array as Float32Array;
    let lineCount = 0;
    const threshold = 4.5;
    const maxLines = 600;

    for (let i = 0; i < count && lineCount < maxLines; i++) {
      for (let j = i + 1; j < count && lineCount < maxLines; j++) {
        const dx = arr[i * 3] - arr[j * 3];
        const dy = arr[i * 3 + 1] - arr[j * 3 + 1];
        const dz = arr[i * 3 + 2] - arr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          const idx = lineCount * 6;
          lp[idx]     = arr[i * 3];
          lp[idx + 1] = arr[i * 3 + 1];
          lp[idx + 2] = arr[i * 3 + 2];
          lp[idx + 3] = arr[j * 3];
          lp[idx + 4] = arr[j * 3 + 1];
          lp[idx + 5] = arr[j * 3 + 2];

          const alpha = 1 - dist / threshold;
          const intensity = alpha * 0.15;
          lc[idx]     = cr * intensity;
          lc[idx + 1] = cg * intensity;
          lc[idx + 2] = cb * intensity;
          lc[idx + 3] = cr * intensity;
          lc[idx + 4] = cg * intensity;
          lc[idx + 5] = cb * intensity;
          lineCount++;
        }
      }
    }
    lineGeo.setDrawRange(0, lineCount * 2);
    linePos.needsUpdate = true;
    lineCol.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[particleColors, 3]} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </>
  );
}

// ── Aurora Washes — subtle gradient planes ───────────────────────
function AuroraWash({
  position,
  rotation,
  color,
  scale,
  speed,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale: [number, number];
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.015 + Math.sin(t + phase) * 0.008;
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 1;
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.3) * 0.05;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.015}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function AuroraField({ colors }: { colors: ThemeColors }) {
  return (
    <>
      <AuroraWash position={[-5, 3, -16]} rotation={[0.3, 0.2, 0.4]} color={colors.accent} scale={[18, 6]} speed={0.15} />
      <AuroraWash position={[6, -1, -20]} rotation={[-0.2, -0.3, -0.3]} color={colors.accentMid} scale={[20, 8]} speed={0.1} />
      <AuroraWash position={[0, 5, -24]} rotation={[0.1, 0, 0.6]} color={colors.accentDeep} scale={[22, 5]} speed={0.08} />
    </>
  );
}

// ── Subtle Ambient Light Beam ───────────────────────────────────
function AmbientBeam({ colors }: { colors: ThemeColors }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.05) * 0.1;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.012 + Math.sin(t * 0.2) * 0.004;
  });

  return (
    <mesh ref={ref} position={[0, 6, -10]} rotation={[0, 0, 0.2]}>
      <planeGeometry args={[15, 25]} />
      <meshBasicMaterial
        color={colors.accent}
        transparent
        opacity={0.012}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Floating Geometric Accents ──────────────────────────────────
function FloatingGeometry({ colors }: { colors: ThemeColors }) {
  const items = useMemo(() => {
    const geometries = [
      new THREE.OctahedronGeometry(0.3),
      new THREE.TetrahedronGeometry(0.25),
      new THREE.IcosahedronGeometry(0.2),
      new THREE.OctahedronGeometry(0.15),
      new THREE.TetrahedronGeometry(0.2),
    ];
    return geometries.map((geo) => ({
      geo: new THREE.EdgesGeometry(geo),
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        -8 - Math.random() * 12,
      ] as [number, number, number],
      rotSpeed: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      driftSpeed: 0.05 + Math.random() * 0.1,
    }));
  }, []);

  return (
    <group>
      {items.map((item, i) => (
        <FloatingShape key={i} {...item} color={colors.accent} />
      ))}
    </group>
  );
}

function FloatingShape({
  geo,
  position,
  rotSpeed,
  phase,
  driftSpeed,
  color,
}: {
  geo: THREE.EdgesGeometry;
  position: [number, number, number];
  rotSpeed: number;
  phase: number;
  driftSpeed: number;
  color: string;
}) {
  const ref = useRef<THREE.LineSegments>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * rotSpeed;
    ref.current.rotation.y = t * rotSpeed * 0.7;
    ref.current.position.y = position[1] + Math.sin(t * driftSpeed + phase) * 1.5;
    ref.current.position.x = position[0] + Math.cos(t * driftSpeed * 0.8 + phase) * 0.8;
  });

  return (
    <lineSegments ref={ref} geometry={geo} position={position}>
      <lineBasicMaterial color={color} transparent opacity={0.12} />
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
    smoothZ.current += (z - smoothZ.current) * 0.08;

    camera.position.x = smoothX.current * 2;
    camera.position.y = smoothY.current * 1.5;

    const baseZ = 5;
    const zoomRange = 2;
    camera.position.z = baseZ - Math.max(-zoomRange, Math.min(zoomRange, smoothZ.current * 3));

    camera.lookAt(0, 0, -3);
  });

  return null;
}

// ── Scene content wrapper that reads theme ──────────────────────
function SceneBackground({ colors }: { colors: ThemeColors }) {
  return (
    <>
      <AuroraField colors={colors} />
      <AmbientBeam colors={colors} />
      <AnimatedGridFloor colors={colors} />
      <ParticleField colors={colors} />
      <FloatingGeometry colors={colors} />
    </>
  );
}

// ── Bridge component (inside Canvas, reads theme from a prop) ───
function SceneBackgroundBridge() {
  const colors = useThemeColors();
  return <SceneBackground colors={colors} />;
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
        <fog attach="fog" args={['#05050f', 10, 35]} />
        <ambientLight intensity={0.3} />
        <HeadTrackedCamera getSpatialState={getSpatialState} />
        <SceneBackgroundBridge />
        {children}
      </Canvas>
    </div>
  );
}
