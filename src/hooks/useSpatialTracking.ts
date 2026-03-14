'use client';
/**
 * useSpatialTracking.ts — Unified React hook for webcam Face & Hand tracking.
 * uses MediaPipe Face Mesh + Hands on a single shared video stream.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

const LEFT_EYE  = 159;
const RIGHT_EYE = 386;
const BASELINE_EYE_DIST = 0.06;

export interface SpatialState {
  // Face
  headX: number;
  headY: number;
  headZ: number;
  faceDetected: boolean;
  
  // Hand
  handX: number; // 0 to 1 (normalized to viewport, where 0,0 is top-left)
  handY: number;
  isPointing: boolean;
  isPinching: boolean;
  isOpenPalm: boolean;
  handDetected: boolean;
  
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

export function useSpatialTracking() {
  const stateRef = useRef<SpatialState>({
    headX: 0, headY: 0, headZ: 0, faceDetected: false,
    handX: 0.5, handY: 0.5, isPointing: false, isPinching: false, isOpenPalm: false, handDetected: false,
    webcamActive: false,
  });
  
  const [webcamActive, setWebcamActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
          if (results.multiFaceLandmarks?.length > 0) {
            const lm = results.multiFaceLandmarks[0];
            const le = lm[LEFT_EYE];
            const re = lm[RIGHT_EYE];
            
            // X/Y
            const mx = (le.x + re.x) / 2;
            const my = (le.y + re.y) / 2;
            stateRef.current.headX = -(mx - 0.5) * 2;
            stateRef.current.headY = -(my - 0.5) * 2;
            
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
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hands.onResults((results: any) => {
          if (results.multiHandLandmarks?.length > 0) {
            const lm = results.multiHandLandmarks[0];
            
            // Webcam is mirrored via CSS scaleX(-1). 
            // In MediaPipe, x=0 is left of the image (right side of user).
            // To map to screen where 0 is left, 1 is right, we take 1 - x.
            stateRef.current.handX = 1 - lm[8].x; 
            stateRef.current.handY = lm[8].y;

            // Pinch: distance between thumb tip (4) and index tip (8)
            const pinchDist = distance(lm[4], lm[8]);
            stateRef.current.isPinching = pinchDist < 0.05;

            // Fingers distance from wrist (0) compared to their MCP joints
            const indexExt = distance(lm[8], lm[0]) > distance(lm[5], lm[0]);
            const middleExt = distance(lm[12], lm[0]) > distance(lm[9], lm[0]);
            const ringExt = distance(lm[16], lm[0]) > distance(lm[13], lm[0]);
            const pinkyExt = distance(lm[20], lm[0]) > distance(lm[17], lm[0]);

            // Pointing: Index extended, Middle, Ring, Pinky curled
            stateRef.current.isPointing = indexExt && !middleExt && !ringExt && !pinkyExt;

            // Open Palm: All four extended
            stateRef.current.isOpenPalm = indexExt && middleExt && ringExt && pinkyExt && !stateRef.current.isPinching;

            if (!stateRef.current.handDetected) {
              stateRef.current.handDetected = true;
              setHandDetected(true);
            }
          } else if (stateRef.current.handDetected) {
            stateRef.current.handDetected = false;
            setHandDetected(false);
          }
        });

        if (cleanup) return;

        // Shared camera instance sends frames to both models
        const cam = new CameraClass(video, {
          onFrame: async () => {
            if (cleanup) return;
            await faceMesh.send({ image: video });
            await hands.send({ image: video });
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
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
      video.remove();
    };
  }, []);

  const getSpatialState = useCallback(() => stateRef.current, []);

  const showDebugVideo = useCallback((show: boolean) => {
    if (videoRef.current) {
      videoRef.current.style.opacity = show ? '0.85' : '0';
    }
  }, []);

  return { getSpatialState, webcamActive, faceDetected, handDetected, showDebugVideo };
}
