'use client';
/**
 * useFaceTracking.ts — React hook for webcam face tracking via MediaPipe Face Mesh.
 *
 * Returns normalised head position { x, y, z }:
 *   x, y  — in range −1…+1 (horizontal / vertical)
 *   z     — depth estimate from inter-eye distance:
 *           0 = default distance, positive = closer, negative = farther
 */

import { useEffect, useRef, useState, useCallback } from 'react';

const LEFT_EYE  = 159;
const RIGHT_EYE = 386;
const BASELINE_EYE_DIST = 0.06; // ~normalised eye distance at "default" distance from camera

interface FaceTrackingState {
  headX: number;
  headY: number;
  headZ: number;
  webcamActive: boolean;
  faceDetected: boolean;
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

export function useFaceTracking() {
  const stateRef = useRef<FaceTrackingState>({
    headX: 0,
    headY: 0,
    headZ: 0,
    webcamActive: false,
    faceDetected: false,
  });
  const [webcamActive, setWebcamActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
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
    video.style.transform = 'scaleX(-1)';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    video.style.transition = 'opacity 0.2s';
    video.id = 'face-tracking-video';
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
        console.error('[faceTracking] Webcam unavailable');
        setWebcamActive(false);
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const FaceMeshClass = await waitForGlobal('FaceMesh') as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const CameraClass = await waitForGlobal('Camera') as any;

        const faceMesh = new FaceMeshClass({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        faceMesh.onResults((results: any) => {
          if (results.multiFaceLandmarks?.length > 0) {
            const lm = results.multiFaceLandmarks[0];
            const le = lm[LEFT_EYE];
            const re = lm[RIGHT_EYE];

            // X/Y — position on screen
            const mx = (le.x + re.x) / 2;
            const my = (le.y + re.y) / 2;
            stateRef.current.headX = -(mx - 0.5) * 2;
            stateRef.current.headY = -(my - 0.5) * 2;

            // Z — depth from inter-eye distance
            const dx = le.x - re.x;
            const dy = le.y - re.y;
            const eyeDist = Math.sqrt(dx * dx + dy * dy);
            // Positive = closer than baseline, negative = farther
            stateRef.current.headZ = (eyeDist - BASELINE_EYE_DIST) / BASELINE_EYE_DIST;

            if (!stateRef.current.faceDetected) {
              stateRef.current.faceDetected = true;
              setFaceDetected(true);
            }
          } else {
            if (stateRef.current.faceDetected) {
              stateRef.current.faceDetected = false;
              setFaceDetected(false);
            }
          }
        });

        if (cleanup) return;

        const cam = new CameraClass(video, {
          onFrame: async () => { await faceMesh.send({ image: video }); },
          width: 640,
          height: 480,
        });
        cam.start();
      } catch (err) {
        console.error('[faceTracking] MediaPipe init failed:', err);
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

  const getHeadPosition = useCallback(() => ({
    x: stateRef.current.headX,
    y: stateRef.current.headY,
    z: stateRef.current.headZ,
  }), []);

  const showDebugVideo = useCallback((show: boolean) => {
    if (videoRef.current) {
      videoRef.current.style.opacity = show ? '0.85' : '0';
    }
  }, []);

  return { getHeadPosition, webcamActive, faceDetected, showDebugVideo };
}
