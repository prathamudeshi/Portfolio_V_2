'use client';
/**
 * BootSequence.tsx — Shortened terminal-style OS boot loading screen.
 * Reduced to ~2s total for portfolio hero context.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const bootLines = [
  { text: 'NEXUS OS v2.0.0', delay: 150 },
  { text: '─────────────────────────────', delay: 80 },
  { text: '[OK] Initializing WebGL pipeline...', delay: 280 },
  { text: '[OK] Loading face mesh model...', delay: 350 },
  { text: '[OK] Mounting workspace...', delay: 220 },
  { text: '─────────────────────────────', delay: 80 },
  { text: 'Welcome, visitor.', delay: 400 },
];

export default function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let idx = 0;

    const showNext = () => {
      if (idx >= bootLines.length) {
        timeoutRef.current = setTimeout(() => setDone(true), 400);
        return;
      }
      const line = bootLines[idx];
      idx++;
      setVisibleLines((prev) => [...prev, line.text]);
      timeoutRef.current = setTimeout(showNext, line.delay);
    };

    timeoutRef.current = setTimeout(showNext, 200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 300);
      return () => clearTimeout(t);
    }
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
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
                transition={{ duration: 0.12 }}
                style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: line.startsWith('[OK]')
                    ? '#22c55e'
                    : line.startsWith('NEXUS')
                      ? 'var(--accent)'
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
              style={{ display: 'inline-block', color: 'var(--accent)', fontSize: 14 }}
            >
              █
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
