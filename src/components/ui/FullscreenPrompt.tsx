'use client';
/**
 * FullscreenPrompt.tsx — Immersive fullscreen request overlay shown after boot.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

interface Props {
  onComplete: () => void;
}

export default function FullscreenPrompt({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const { toggleFullscreen } = useSettings();

  const handleFullscreen = () => {
    toggleFullscreen();
    setVisible(false);
    setTimeout(onComplete, 500);
  };

  const handleSkip = () => {
    setVisible(false);
    setTimeout(onComplete, 500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(15, 15, 40, 0.98) 0%, rgba(0, 0, 0, 0.99) 100%)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            gap: 32,
          }}
        >
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            style={{ fontSize: 64, lineHeight: 1 }}
          >
            🖥️
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              textAlign: 'center',
            }}
          >
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#e2e8f0',
              letterSpacing: 1.5,
              marginBottom: 8,
            }}>
              IMMERSIVE EXPERIENCE
            </div>
            <div style={{
              fontSize: 13,
              color: '#94a3b8',
              maxWidth: 360,
              lineHeight: 1.6,
            }}>
              For the best experience, enter fullscreen mode.
              <br />
              You can toggle this anytime from Settings.
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex',
              gap: 16,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <button
              onClick={handleFullscreen}
              style={{
                padding: '12px 36px',
                borderRadius: 12,
                border: '1px solid rgba(130, 140, 248, 0.4)',
                background: 'linear-gradient(135deg, rgba(130, 140, 248, 0.2) 0%, rgba(99, 102, 241, 0.3) 100%)',
                color: '#c7d2fe',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                cursor: 'pointer',
                letterSpacing: 1,
                transition: 'all 0.2s',
                boxShadow: '0 0 20px rgba(130, 140, 248, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(130, 140, 248, 0.35) 0%, rgba(99, 102, 241, 0.45) 100%)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(130, 140, 248, 0.3)';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(130, 140, 248, 0.2) 0%, rgba(99, 102, 241, 0.3) 100%)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(130, 140, 248, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ⛶ Enter Fullscreen
            </button>

            <button
              onClick={handleSkip}
              style={{
                padding: '8px 24px',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'transparent',
                color: '#64748b',
                fontSize: 12,
                fontFamily: '"JetBrains Mono", monospace',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748b';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              Continue in Window →
            </button>
          </motion.div>

          {/* Subtle keyboard hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 }}
            style={{
              position: 'absolute',
              bottom: 32,
              fontSize: 10,
              color: '#475569',
              letterSpacing: 1,
            }}
          >
            Press F11 anytime for fullscreen
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
