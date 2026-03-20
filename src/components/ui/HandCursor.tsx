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

  const cursor2Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    let wasPinching = false;
    let wasPinching2 = false;

    const loop = () => {
      const state = getSpatialState();
      const settings = useSettings.getState();

      if (cursorRef.current && ringRef.current && cursor2Ref.current && ring2Ref.current) {
          if (!state.handDetected || !settings.handTrackingEnabled) {
          cursorRef.current.style.opacity = '0';
          ringRef.current.style.opacity = '0';
        } else {
          const px = state.handX * window.innerWidth;
          const py = state.handY * window.innerHeight;
          const size = settings.cursorSize;

          cursorRef.current.style.width = `${size}px`;
          cursorRef.current.style.height = `${size}px`;

          cursorRef.current.style.opacity = '1';
          cursorRef.current.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(${state.isPinching ? 0.8 : 1})`;
          
          if (state.isPinching) {
            cursorRef.current.style.backgroundColor = '#22c55e';
            cursorRef.current.style.boxShadow = '0 0 16px #22c55e';
          } else {
            cursorRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            cursorRef.current.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
          }

          if (state.isPinching && !wasPinching) {
            ringRef.current.style.transition = 'none';
            ringRef.current.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(0.5)`;
            ringRef.current.style.opacity = '1';
            void ringRef.current.offsetWidth;
            ringRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            ringRef.current.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(2.5)`;
            ringRef.current.style.opacity = '0';
          }

          wasPinching = state.isPinching;
        }

        // --- HAND 2 ---
        if (!state.hand2Detected || !settings.handTrackingEnabled) {
          cursor2Ref.current.style.opacity = '0';
          ring2Ref.current.style.opacity = '0';
        } else {
          const px2 = state.hand2X * window.innerWidth;
          const py2 = state.hand2Y * window.innerHeight;
          const size2 = settings.cursorSize;

          cursor2Ref.current.style.width = `${size2}px`;
          cursor2Ref.current.style.height = `${size2}px`;

          cursor2Ref.current.style.opacity = '1';
          cursor2Ref.current.style.transform = `translate(${px2}px, ${py2}px) translate(-50%, -50%) scale(${state.isPinching2 ? 0.8 : 1})`;
          
          if (state.isPinching2) {
            cursor2Ref.current.style.backgroundColor = '#22c55e';
            cursor2Ref.current.style.boxShadow = '0 0 16px #22c55e';
          } else {
            cursor2Ref.current.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            cursor2Ref.current.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
          }

          if (state.isPinching2 && !wasPinching2) {
            ring2Ref.current.style.transition = 'none';
            ring2Ref.current.style.transform = `translate(${px2}px, ${py2}px) translate(-50%, -50%) scale(0.5)`;
            ring2Ref.current.style.opacity = '1';
            void ring2Ref.current.offsetWidth;
            ring2Ref.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            ring2Ref.current.style.transform = `translate(${px2}px, ${py2}px) translate(-50%, -50%) scale(2.5)`;
            ring2Ref.current.style.opacity = '0';
          }

          wasPinching2 = state.isPinching2;
        }
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [getSpatialState]);

  return (
    <>
      {/* Hand 1 */}
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

      {/* Hand 2 */}
      <div
        ref={ring2Ref}
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
        ref={cursor2Ref}
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
