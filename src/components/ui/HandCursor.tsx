'use client';
/**
 * HandCursor.tsx — Visual overlay for MediaPipe hand tracking.
 * Reads hand position/state from useSpatialTracking every frame.
 * Cursor size is configurable via settings.
 */

import { useEffect, useRef } from 'react';
import { type SpatialState } from '@/hooks/useSpatialTracking';
import { useSettings } from '@/hooks/useSettings';

export default function HandCursor({ getSpatialState }: { getSpatialState: () => SpatialState }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    let wasPinching = false;

    const loop = () => {
      const state = getSpatialState();
      const settings = useSettings.getState();

      if (cursorRef.current && ringRef.current) {
        if (!state.handDetected || !settings.handTrackingEnabled) {
          cursorRef.current.style.opacity = '0';
          ringRef.current.style.opacity = '0';
        } else {
          const px = state.handX * window.innerWidth;
          const py = state.handY * window.innerHeight;
          const size = settings.cursorSize;

          // Update cursor size dynamically
          cursorRef.current.style.width = `${size}px`;
          cursorRef.current.style.height = `${size}px`;

          // Main cursor dot
          cursorRef.current.style.opacity = '1';
          cursorRef.current.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(${state.isPinching ? 0.8 : 1})`;
          
          if (state.isPinching) {
            cursorRef.current.style.backgroundColor = '#22c55e'; // Green for dragging/clicking
            cursorRef.current.style.boxShadow = '0 0 16px #22c55e';
          } else if (state.isOpenPalm) {
            cursorRef.current.style.backgroundColor = '#38bdf8'; // Blue for scrolling
            cursorRef.current.style.boxShadow = '0 0 16px #38bdf8';
          } else {
            cursorRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            cursorRef.current.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
          }

          // Pinch click ripple effect
          if (state.isPinching && !wasPinching) {
            // Reset ring animation
            ringRef.current.style.transition = 'none';
            ringRef.current.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(0.5)`;
            ringRef.current.style.opacity = '1';
            
            // Force reflow
            void ringRef.current.offsetWidth;
            
            // Animate out
            ringRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            ringRef.current.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(2.5)`;
            ringRef.current.style.opacity = '0';
          }

          wasPinching = state.isPinching;
        }
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [getSpatialState]);

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 24, height: 24,
          borderRadius: '50%',
          border: '2px solid #22c55e',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0,
        }}
      />
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 16, height: 16,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          transition: 'background-color 0.15s, box-shadow 0.15s, width 0.2s, height 0.2s, transform 0.06s linear',
        }}
      />
    </>
  );
}
