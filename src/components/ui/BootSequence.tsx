'use client';
/**
 * BootSequence.tsx — Terminal-style OS boot loading screen.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const bootLines = [
  { text: 'NEXUS OS v2.1.0', delay: 200 },
  { text: '─────────────────────────────', delay: 100 },
  { text: '[OK] Initializing WebGL pipeline...', delay: 400 },
  { text: '[OK] Loading Three.js renderer...', delay: 300 },
  { text: '[OK] Loading face mesh model...', delay: 600 },
  { text: '[OK] Calibrating spatial tracking...', delay: 400 },
  { text: '[OK] Mounting panel system...', delay: 200 },
  { text: '[OK] Loading workspace data...', delay: 300 },
  { text: '─────────────────────────────', delay: 100 },
  { text: 'Welcome, visitor.', delay: 500 },
  { text: 'Entering workspace...', delay: 800 },
];

export default function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let idx = 0;
    let totalDelay = 300;

    const showNext = () => {
      if (idx >= bootLines.length) {
        timeoutRef.current = setTimeout(() => setDone(true), 600);
        return;
      }
      const line = bootLines[idx];
      totalDelay = line.delay;
      idx++;
      setVisibleLines((prev) => [...prev, line.text]);
      timeoutRef.current = setTimeout(showNext, totalDelay);
    };

    timeoutRef.current = setTimeout(showNext, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          }}
        >
          <div style={{ maxWidth: 520, width: '90%' }}>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: line.startsWith('[OK]')
                    ? '#22c55e'
                    : line.startsWith('NEXUS')
                    ? '#818cf8'
                    : line.startsWith('─')
                    ? '#334155'
                    : '#94a3b8',
                }}
              >
                {line}
              </motion.div>
            ))}
            {/* Blinking cursor */}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ display: 'inline-block', color: '#818cf8', fontSize: 14 }}
            >
              █
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
