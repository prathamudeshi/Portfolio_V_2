'use client';
/**
 * useGestureDispatch.ts — Bridges MediaPipe physical hand gestures to DOM events.
 * Dispatches synthetic PointerEvents so existing React drag/drop/click logic works.
 *
 * Performance: runs at full 60fps only while a pinch-drag is active.
 * When no hand is detected, uses a coarse 15fps poll.
 * When hand is detected but not pinching, uses 30fps.
 */

import { useEffect, useRef } from 'react';
import { type SpatialState } from './useSpatialTracking';

const DRAG_START_THRESHOLD_PX = 12;
const CLICK_MOVE_TOLERANCE_PX = 15;
const CLICK_MAX_DURATION_MS = 850;

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
    pinchStartX: 0,
    pinchStartY: 0,
    pinchStartTime: 0,
    isDraggingActive: false,
  });

  useEffect(() => {
    let frameId: number;
    let targetElement: Element | null = null;
    let frameCount = 0;

    const loop = () => {
      frameId = requestAnimationFrame(loop);
      frameCount++;

      const state = getSpatialState();

      // ── Adaptive throttle ──────────────────────────────────────
      // Full 60fps only while actively dragging (pinching + element targeted).
      // 30fps when hand is detected but idle.
      // 15fps (every 4th frame) when no hand — just needs to catch hand-lost events.
      const isDragging = state.isPinching && targetElement !== null;
      if (isDragging) {
        // No skip — run every frame for smooth drag
      } else if (!state.handDetected) {
        if (frameCount % 4 !== 0) return; // ~15fps
      } else {
        if (frameCount % 2 !== 0) return; // ~30fps
      }

      if (!state.handDetected) {
        if (lastState.current.isPinching && targetElement) {
          targetElement.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
          targetElement = null;
        }
        lastState.current.isPinching = false;
        lastState.current.isDoublePinch = false;
        lastState.current.isPeaceSign = false;
        lastState.current.isThumbsUp = false;
        return;
      }

      const px = state.handX * window.innerWidth;
      const py = state.handY * window.innerHeight;

      const isPinching  = state.isPinching;
      const wasPinching = lastState.current.isPinching;

      // ── PINCH TO CLICK / DRAG ────────────────────────────────────
      if (isPinching && !wasPinching) {
        const el = document.elementFromPoint(px, py);
        if (el) {
          targetElement = el;
          lastState.current.pinchStartX = px;
          lastState.current.pinchStartY = py;
          lastState.current.pinchStartTime = performance.now();
          lastState.current.isDraggingActive = false; // Reset drag flag at start of pinch
          el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: px, clientY: py, pointerId: 1, isPrimary: true }));
        }
      } else if (isPinching && wasPinching) {
        if (targetElement) {
          const dx = px - lastState.current.pinchStartX;
          const dy = py - lastState.current.pinchStartY;
          const movedPx = Math.sqrt(dx * dx + dy * dy);

          // Drag activates if we have already activated it, or if we moved past the threshold
          if (lastState.current.isDraggingActive || movedPx > DRAG_START_THRESHOLD_PX) {
            lastState.current.isDraggingActive = true;
            targetElement.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: px, clientY: py, pointerId: 1, isPrimary: true }));
          }
        }
      } else if (!isPinching && wasPinching) {
        if (targetElement) {
          targetElement.dispatchEvent(new PointerEvent('pointerup',  { bubbles: true, cancelable: true, clientX: px, clientY: py, pointerId: 1, isPrimary: true }));
          const dx = px - lastState.current.pinchStartX;
          const dy = py - lastState.current.pinchStartY;
          const movedPx = Math.sqrt(dx * dx + dy * dy);
          const heldMs = performance.now() - lastState.current.pinchStartTime;

          // A click is registered if we did NOT start dragging, and we fit in the time window
          if (!lastState.current.isDraggingActive && movedPx <= CLICK_MOVE_TOLERANCE_PX && heldMs <= CLICK_MAX_DURATION_MS) {
            targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: px, clientY: py }));
          }
          targetElement = null;
        }
      }

      // ── DOUBLE PINCH (RESIZE) ─────────────────────────────────────
      if (state.isDoublePinch) {
        const dx   = state.handX - state.hand2X;
        const dy   = state.handY - state.hand2Y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (!lastState.current.isDoublePinch) {
          lastState.current.pinchDist = dist;
          window.dispatchEvent(new CustomEvent('gesture-resizestart'));
        } else {
          window.dispatchEvent(new CustomEvent('gesture-resizemove', { detail: { scale: dist / lastState.current.pinchDist } }));
        }
      } else if (lastState.current.isDoublePinch) {
        window.dispatchEvent(new CustomEvent('gesture-resizeend'));
      }
      lastState.current.isDoublePinch = state.isDoublePinch;

      // ── DISCRETE GESTURES ────────────────────────────────────────
      if (state.isThumbsUp && !lastState.current.isThumbsUp) {
        window.dispatchEvent(new CustomEvent('gesture-maximize'));
      }
      lastState.current.isThumbsUp = state.isThumbsUp;

      if (state.isPeaceSign && !lastState.current.isPeaceSign) {
        window.dispatchEvent(new CustomEvent('gesture-minimize'));
      }
      lastState.current.isPeaceSign = state.isPeaceSign;

      lastState.current.isPinching = isPinching;
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [getSpatialState]);
}
