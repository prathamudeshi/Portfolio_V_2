'use client';
/**
 * useGestureDispatch.ts — Bridges MediaPipe physical hand gestures to DOM events.
 * Dispatches synthetic PointerEvents so existing React drag/drop/click logic works.
 */

import { useEffect, useRef } from 'react';
import { type SpatialState } from './useSpatialTracking';

export function useGestureDispatch(getSpatialState: () => SpatialState) {
  const lastState = useRef({
    isPinching: false,
    isOpenPalm: false,
    palmY: 0,
  });

  useEffect(() => {
    let frameId: number;
    let targetElement: Element | null = null;

    const loop = () => {
      const state = getSpatialState();

      if (!state.handDetected) {
        if (lastState.current.isPinching && targetElement) {
          // Track lost mid-drag -> dispatch pointerup
          targetElement.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
          targetElement = null;
        }
        lastState.current.isPinching = false;
        frameId = requestAnimationFrame(loop);
        return;
      }

      const px = state.handX * window.innerWidth;
      const py = state.handY * window.innerHeight;

      const isPinching = state.isPinching;
      const wasPinching = lastState.current.isPinching;

      // --- PINCH TO CLICK / DRAG ---
      if (isPinching && !wasPinching) {
        // Pinch started -> pointerdown
        const el = document.elementFromPoint(px, py);
        if (el) {
          targetElement = el;
          const event = new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: px, clientY: py, pointerId: 1, isPrimary: true });
          el.dispatchEvent(event);
        }
      } else if (isPinching && wasPinching) {
        // Pinch holding -> pointermove
        if (targetElement) {
          // We dispatch to window/document as well to handle dragging outside the start element
          const event = new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: px, clientY: py, pointerId: 1, isPrimary: true });
          targetElement.dispatchEvent(event);
        }
      } else if (!isPinching && wasPinching) {
        // Pinch released -> pointerup
        if (targetElement) {
          const event = new PointerEvent('pointerup', { bubbles: true, cancelable: true, clientX: px, clientY: py, pointerId: 1, isPrimary: true });
          targetElement.dispatchEvent(event);
          
          // Also fire a click event just in case standard click handlers are expected
          targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: px, clientY: py }));
          targetElement = null;
        }
      }

      // --- OPEN PALM SCROLL ---
      // Experimental scroll: maps raw vertical hand movement to wheel events
      const isOpenPalm = state.isOpenPalm;
      const wasOpenPalm = lastState.current.isOpenPalm;
      
      if (isOpenPalm) {
        if (wasOpenPalm) {
          const deltaY = (state.handY - lastState.current.palmY) * window.innerHeight;
          if (Math.abs(deltaY) > 2) {
             const el = document.elementFromPoint(px, py);
             if (el) {
                el.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: deltaY * 2 }));
             }
          }
        }
        lastState.current.palmY = state.handY;
      }

      lastState.current.isPinching = isPinching;
      lastState.current.isOpenPalm = isOpenPalm;

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [getSpatialState]);
}
