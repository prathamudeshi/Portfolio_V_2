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
    palmX: 0,
    isDoublePinch: false,
    pinchDist: 0,
    isPeaceSign: false,
    isThumbsUp: false,
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


      // --- DOUBLE PINCH (RESIZE) ---
      if (state.isDoublePinch) {
        const dx = state.handX - state.hand2X;
        const dy = state.handY - state.hand2Y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (!lastState.current.isDoublePinch) {
           lastState.current.pinchDist = dist;
           window.dispatchEvent(new CustomEvent('gesture-resizestart'));
        } else {
           const scale = dist / lastState.current.pinchDist;
           window.dispatchEvent(new CustomEvent('gesture-resizemove', { detail: { scale } }));
        }
      } else if (lastState.current.isDoublePinch) {
        window.dispatchEvent(new CustomEvent('gesture-resizeend'));
      }
      lastState.current.isDoublePinch = state.isDoublePinch;

      // --- DISCRETE GESTURES ---
      if (state.isThumbsUp && !lastState.current.isThumbsUp) {
        window.dispatchEvent(new CustomEvent('gesture-maximize'));
      }
      lastState.current.isThumbsUp = state.isThumbsUp;

      if (state.isPeaceSign && !lastState.current.isPeaceSign) {
        window.dispatchEvent(new CustomEvent('gesture-minimize'));
      }
      lastState.current.isPeaceSign = state.isPeaceSign;

      lastState.current.isPinching = isPinching;

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [getSpatialState]);
}
