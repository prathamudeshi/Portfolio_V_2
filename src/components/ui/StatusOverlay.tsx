'use client';

import { motion } from 'framer-motion';

/**
 * StatusOverlay.tsx — iOS "Dynamic Island" style status pill.
 * Displays webcam and tracking status in a compact, premium format.
 */

interface Props {
  webcamActive: boolean;
  faceDetected: boolean;
  handDetected: boolean;
}

export default function StatusOverlay({ webcamActive, faceDetected, handDetected }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        left: 20,
        zIndex: 100,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="ios-pill"
        style={{ pointerEvents: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: webcamActive ? '#22c55e' : '#f59e0b',
              boxShadow: webcamActive ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none',
            }}
          />
          <span style={{ 
            fontSize: 12, 
            fontWeight: 600, 
            color: '#fff', 
            fontFamily: 'system-ui, -apple-system, sans-serif' 
          }}>
            {webcamActive ? 'Spatial Active' : 'Initializing...'}
          </span>
        </div>

        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />

        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#94a3b8', fontFamily: '"JetBrains Mono", monospace' }}>
          <span style={{ color: faceDetected ? '#818cf8' : 'inherit' }}>
            FACE {faceDetected ? '✓' : '—'}
          </span>
          <span style={{ color: handDetected ? '#818cf8' : 'inherit' }}>
            HAND {handDetected ? '✓' : '—'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
