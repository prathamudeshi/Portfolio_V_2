'use client';
/**
 * HandCursor.tsx — Visual overlay for MediaPipe hand tracking.
 *
 * Performance notes:
 * - Loop is throttled to ~30fps (every 2nd frame) — cursor movement is smooth
 *   enough at 30fps and halves the JS work.
 * - When no hand is detected, we only clear opacity once then stop doing work
 *   each frame via the `wasHiddenRef` early-exit.
 */

import { useEffect, useRef } from 'react';
import { type SpatialState } from '@/hooks/useSpatialTracking';
import { useSettings } from '@/hooks/useSettings';

export default function HandCursor({ getSpatialState }: { getSpatialState: () => SpatialState }) {
  const cursorRef  = useRef<HTMLDivElement>(null);
  const ringRef    = useRef<HTMLDivElement>(null);
  const cursor2Ref = useRef<HTMLDivElement>(null);
  const ring2Ref   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    let frameCount = 0;
    let wasPinching  = false;
    let wasPinching2 = false;
    // Track whether we already set opacity=0 so we don't thrash the DOM every frame
    let hand1Hidden = true;
    let hand2Hidden = true;

    const loop = () => {
      frameId = requestAnimationFrame(loop);
      frameCount++;
      // Throttle to ~30fps — cursor smoothness is imperceptible above 30fps
      if (frameCount % 2 !== 0) return;

      const state    = getSpatialState();
      const settings = useSettings.getState();

      const c  = cursorRef.current;
      const r  = ringRef.current;
      const c2 = cursor2Ref.current;
      const r2 = ring2Ref.current;
      if (!c || !r || !c2 || !r2) return;

      // ── Hand 1 ──────────────────────────────────────────────────
      if (!state.handDetected || !settings.handTrackingEnabled) {
        if (!hand1Hidden) {
          c.style.opacity = '0';
          r.style.opacity = '0';
          hand1Hidden = true;
        }
        // Nothing else to do — skip DOM work this frame
      } else {
        hand1Hidden = false;
        const px   = state.handX * window.innerWidth;
        const py   = state.handY * window.innerHeight;
        const size = settings.cursorSize;

        c.style.width  = `${size}px`;
        c.style.height = `${size}px`;
        c.style.opacity = '1';
        c.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%) scale(${state.isPinching ? 0.8 : 1})`;

        if (state.isPinching) {
          c.style.backgroundColor = '#22c55e';
          c.style.boxShadow = '0 0 16px #22c55e';
        } else {
          c.style.backgroundColor = 'rgba(255,255,255,0.9)';
          c.style.boxShadow = '0 0 8px rgba(255,255,255,0.5)';
        }

        if (state.isPinching && !wasPinching) {
          r.style.transition = 'none';
          r.style.transform  = `translate(${px}px,${py}px) translate(-50%,-50%) scale(0.5)`;
          r.style.opacity    = '1';
          void r.offsetWidth; // force reflow for transition restart
          r.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
          r.style.transform  = `translate(${px}px,${py}px) translate(-50%,-50%) scale(2.5)`;
          r.style.opacity    = '0';
        }
        wasPinching = state.isPinching;
      }

      // ── Hand 2 ──────────────────────────────────────────────────
      if (!state.hand2Detected || !settings.handTrackingEnabled) {
        if (!hand2Hidden) {
          c2.style.opacity = '0';
          r2.style.opacity = '0';
          hand2Hidden = true;
        }
      } else {
        hand2Hidden = false;
        const px2   = state.hand2X * window.innerWidth;
        const py2   = state.hand2Y * window.innerHeight;
        const size2 = settings.cursorSize;

        c2.style.width  = `${size2}px`;
        c2.style.height = `${size2}px`;
        c2.style.opacity = '1';
        c2.style.transform = `translate(${px2}px,${py2}px) translate(-50%,-50%) scale(${state.isPinching2 ? 0.8 : 1})`;

        if (state.isPinching2) {
          c2.style.backgroundColor = '#22c55e';
          c2.style.boxShadow = '0 0 16px #22c55e';
        } else {
          c2.style.backgroundColor = 'rgba(255,255,255,0.9)';
          c2.style.boxShadow = '0 0 8px rgba(255,255,255,0.5)';
        }

        if (state.isPinching2 && !wasPinching2) {
          r2.style.transition = 'none';
          r2.style.transform  = `translate(${px2}px,${py2}px) translate(-50%,-50%) scale(0.5)`;
          r2.style.opacity    = '1';
          void r2.offsetWidth;
          r2.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
          r2.style.transform  = `translate(${px2}px,${py2}px) translate(-50%,-50%) scale(2.5)`;
          r2.style.opacity    = '0';
        }
        wasPinching2 = state.isPinching2;
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [getSpatialState]);

  return (
    <>
      {/* Hand 1 */}
      <div ref={ringRef} style={{ position:'fixed', top:0, left:0, width:24, height:24, borderRadius:'50%', border:'2px solid #22c55e', pointerEvents:'none', zIndex:9998, opacity:0 }} />
      <div ref={cursorRef} style={{ position:'fixed', top:0, left:0, width:16, height:16, borderRadius:'50%', pointerEvents:'none', zIndex:9999, opacity:0, transition:'background-color 0.15s, box-shadow 0.15s, width 0.2s, height 0.2s, transform 0.06s linear' }} />
      {/* Hand 2 */}
      <div ref={ring2Ref} style={{ position:'fixed', top:0, left:0, width:24, height:24, borderRadius:'50%', border:'2px solid #22c55e', pointerEvents:'none', zIndex:9998, opacity:0 }} />
      <div ref={cursor2Ref} style={{ position:'fixed', top:0, left:0, width:16, height:16, borderRadius:'50%', pointerEvents:'none', zIndex:9999, opacity:0, transition:'background-color 0.15s, box-shadow 0.15s, width 0.2s, height 0.2s, transform 0.06s linear' }} />
    </>
  );
}
