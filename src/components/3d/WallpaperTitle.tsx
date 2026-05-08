'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';

/**
 * WallpaperTitle.tsx — A 3D-anchored title that acts as a desktop wallpaper.
 * It sits deep in the background and responds to head-tracking parallax.
 */
export default function WallpaperTitle() {
  return (
    <group position={[0, 0, -12]}>
      <Html
        center
        transform
        distanceFactor={6}
        occlude={false}
        zIndexRange={[0, 0]} // Keep it at the lowest layer
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          width: 'max-content',
          textAlign: 'center',
        }}
      >
        <div style={{ textAlign: 'center', width: '100vw' }}>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--md-font-display)',
              fontSize: 'clamp(60px, 15vw, 120px)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-4px',
              lineHeight: 0.8,
              textShadow: '0 0 50px rgba(176, 184, 255, 0.3), 0 0 100px rgba(176, 184, 255, 0.15)',
              whiteSpace: 'nowrap',
            }}
          >
            Pratham Udeshi
          </motion.div>
          
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--md-font-body)',
              fontSize: 'clamp(14px, 3vw, 24px)',
              color: '#b0b8ff',
              letterSpacing: '8px',
              marginTop: 32,
              fontWeight: 600,
              textTransform: 'uppercase',
              opacity: 0.6,
              textShadow: '0 0 30px rgba(176, 184, 255, 0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            AI Engineer · Spatial Computing · Full-Stack
          </motion.div>
        </div>
      </Html>
    </group>
  );
}
