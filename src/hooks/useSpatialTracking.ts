"use client";
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

import { useEffect, useRef, useState, useCallback } from "react";
import { useSettings } from "./useSettings";

const LEFT_EYE = 159;
const RIGHT_EYE = 386;
const BASELINE_EYE_DIST = 0.06;
const MIN_HAND_CONFIDENCE = 0.72;
const DEFAULT_PINCH_THRESHOLD = 0.055;
const DEFAULT_PINCH_RATIO = 0.34;
const GESTURE_DEBOUNCE_FRAMES = 4;

type HandLandmark = { x: number; y: number; z?: number };

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
      if (Date.now() > deadline)
        return reject(new Error(`${name} not available`));
      setTimeout(check, 100);
    };
    check();
  });
}

function loadScript(id: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`${id} failed to load`)),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.dataset.loaded = "false";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`${id} failed to load`));
    document.head.appendChild(script);
  });
}

async function loadMediaPipeScripts() {
  await Promise.all([
    loadScript(
      "mediapipe-camera-utils",
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1640029074/camera_utils.js",
    ),
    loadScript(
      "mediapipe-face-mesh",
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js",
    ),
    loadScript(
      "mediapipe-hands",
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js",
    ),
    loadScript(
      "mediapipe-drawing-utils",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
    ),
  ]);
}

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function distance3D(p1: HandLandmark, p2: HandLandmark) {
  const dz = (p1.z ?? 0) - (p2.z ?? 0);
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + dz * dz,
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function angleDeg(a: HandLandmark, b: HandLandmark, c: HandLandmark) {
  const ab = { x: a.x - b.x, y: a.y - b.y, z: (a.z ?? 0) - (b.z ?? 0) };
  const cb = { x: c.x - b.x, y: c.y - b.y, z: (c.z ?? 0) - (b.z ?? 0) };
  const dot = ab.x * cb.x + ab.y * cb.y + ab.z * cb.z;
  const abLen = Math.sqrt(ab.x * ab.x + ab.y * ab.y + ab.z * ab.z);
  const cbLen = Math.sqrt(cb.x * cb.x + cb.y * cb.y + cb.z * cb.z);
  if (abLen === 0 || cbLen === 0) return 0;
  return (Math.acos(clamp(dot / (abLen * cbLen), -1, 1)) * 180) / Math.PI;
}

function getHandScale(lm: HandLandmark[]) {
  // Palm-scale normalization makes thresholds stable as the hand moves closer/farther.
  return Math.max(
    0.001,
    distance3D(lm[0], lm[9]),
    distance3D(lm[5], lm[17]),
    distance3D(lm[0], lm[5]) * 1.2,
  );
}

function isFingerExtended(
  lm: HandLandmark[],
  tip: number,
  pip: number,
  mcp: number,
  scale: number,
) {
  const wrist = lm[0];
  return (
    distance3D(wrist, lm[tip]) > distance3D(wrist, lm[pip]) + scale * 0.1 &&
    distance3D(wrist, lm[tip]) > distance3D(wrist, lm[mcp]) + scale * 0.22 &&
    angleDeg(lm[mcp], lm[pip], lm[tip]) > 145
  );
}

function isThumbExtended(lm: HandLandmark[], scale: number) {
  return (
    distance3D(lm[0], lm[4]) > distance3D(lm[0], lm[3]) + scale * 0.06 &&
    angleDeg(lm[2], lm[3], lm[4]) > 140
  );
}

function pinchRatioThreshold(rawThreshold: number) {
  return clamp(
    (rawThreshold / DEFAULT_PINCH_THRESHOLD) * DEFAULT_PINCH_RATIO,
    0.18,
    0.58,
  );
}

function analyzeHandPose(
  lm: HandLandmark[],
  pinchThreshold: number,
  pinchReleaseThreshold: number,
) {
  const scale = getHandScale(lm);
  const thumbIndexRatio = distance3D(lm[4], lm[8]) / scale;
  const thumbMiddleRatio = distance3D(lm[4], lm[12]) / scale;
  const indexMiddleRatio = distance3D(lm[8], lm[12]) / scale;

  const indexExt = isFingerExtended(lm, 8, 6, 5, scale);
  const middleExt = isFingerExtended(lm, 12, 10, 9, scale);
  const ringExt = isFingerExtended(lm, 16, 14, 13, scale);
  const pinkyExt = isFingerExtended(lm, 20, 18, 17, scale);
  const thumbExt = isThumbExtended(lm, scale);

  const pinchIsIsolated =
    thumbIndexRatio < thumbMiddleRatio * 0.9 && indexMiddleRatio > 0.14;

  return {
    indexExt,
    middleExt,
    ringExt,
    pinkyExt,
    thumbExt,
    rawPinch: thumbIndexRatio < pinchRatioThreshold(pinchThreshold) && pinchIsIsolated,
    rawRelease: thumbIndexRatio > pinchRatioThreshold(pinchReleaseThreshold),
  };
}

/** Exponential Moving Average */
function ema(current: number, previous: number, alpha: number): number {
  return alpha * current + (1 - alpha) * previous;
}

const DEAD_ZONE = 0.003; // Ignore movements smaller than this (normalized)

export function useSpatialTracking() {
  const trackingRequested = useSettings(
    (s) => s.faceTrackingEnabled || s.handTrackingEnabled,
  );

  const stateRef = useRef<SpatialState>({
    headX: 0,
    headY: 0,
    headZ: 0,
    faceDetected: false,
    handX: 0.5,
    handY: 0.5,
    isPointing: false,
    isPinching: false,
    isOpenPalm: false,
    handDetected: false,
    hand2X: 0.5,
    hand2Y: 0.5,
    isPinching2: false,
    isOpenPalm2: false,
    hand2Detected: false,
    isDoublePinch: false,
    isPeaceSign: false,
    isThumbsUp: false,
    webcamActive: false,
  });

  // Smoothing state — kept in refs for perf (no re-renders)
  const smoothRef = useRef({
    handX: 0.5,
    handY: 0.5,
    pinchFrames: 0, // consecutive frames pinch has been detected
    releasedFrames: 0, // consecutive frames pinch has NOT been detected
    isPinchLocked: false, // debounced pinch state

    hand2X: 0.5,
    hand2Y: 0.5,
    pinchFrames2: 0,
    releasedFrames2: 0,
    isPinchLocked2: false,

    peaceFrames: 0,
    thumbsUpFrames: 0,

    headX: 0,
    headY: 0,
    headZ: 0,
  });

  const [webcamActive, setWebcamActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [handDetected, setHandDetected] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Read settings at mount and subscribe to changes
  const settingsRef = useRef(useSettings.getState());
  useEffect(() => {
    const unsub = useSettings.subscribe((state) => {
      settingsRef.current = state;
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!trackingRequested) {
      stateRef.current.webcamActive = false;
      stateRef.current.faceDetected = false;
      stateRef.current.handDetected = false;
      stateRef.current.hand2Detected = false;
      setWebcamActive(false);
      setFaceDetected(false);
      setHandDetected(false);
      return;
    }

    const video = document.createElement("video");
    video.setAttribute("autoplay", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.style.position = "fixed";
    video.style.bottom = "16px";
    video.style.left = "16px";
    video.style.width = "280px";
    video.style.borderRadius = "12px";
    video.style.border = "2px solid rgba(255,255,255,0.1)";
    video.style.zIndex = "50";
    video.style.transform = "scaleX(-1)"; // Mirror for user
    video.style.opacity = "0";
    video.style.pointerEvents = "none";
    video.style.transition = "opacity 0.2s";
    video.id = "spatial-tracking-video";
    document.body.appendChild(video);
    videoRef.current = video;

    let cleanup = false;

    // Webcam visibility sync interval
    const visInterval = setInterval(() => {
      const v = videoRef.current;
      if (v) {
        const s = settingsRef.current;
        const op = s.showWebcam ? String(s.webcamOpacity) : "0";
        v.style.opacity = op;
        v.style.width = "280px";
      }
    }, 200);

    (async () => {
      try {
        await loadMediaPipeScripts();
        if (cleanup) return;


        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
        if (cleanup) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        video.srcObject = stream;
        await video.play();
        stateRef.current.webcamActive = true;
        setWebcamActive(true);

        /* 
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
        */

      } catch {
        console.error("[spatialTracking] Webcam unavailable");
        setWebcamActive(false);
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const FaceMeshClass = (await waitForGlobal("FaceMesh")) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const HandsClass = (await waitForGlobal("Hands")) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const CameraClass = (await waitForGlobal("Camera")) as any;

        // Initialize FaceMesh
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
            const rawHeadX = (mx - 0.5) * 2 * sensitivity;
            const rawHeadY = (my - 0.5) * 2 * sensitivity;

            // Z
            const eyeDist = distance(le, re);
            const rawHeadZ = (eyeDist - BASELINE_EYE_DIST) / BASELINE_EYE_DIST;

            // Apply EMA smoothing to face coordinates to completely eliminate webcam micro-jitter
            const sm = smoothRef.current;
            const faceAlpha = 0.15; // highly responsive but smooth
            sm.headX = ema(rawHeadX, sm.headX, faceAlpha);
            sm.headY = ema(rawHeadY, sm.headY, faceAlpha);
            sm.headZ = ema(rawHeadZ, sm.headZ, faceAlpha);

            stateRef.current.headX = sm.headX;
            stateRef.current.headY = sm.headY;
            stateRef.current.headZ = sm.headZ;

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
        // Initialize Hands
        const hands = new HandsClass({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`,
        });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hands.onResults((results: any) => {
          const settings = settingsRef.current;

          if (!settings.handTrackingEnabled) {
            stateRef.current.handDetected = false;
            stateRef.current.hand2Detected = false;
            stateRef.current.isPinching = false;
            stateRef.current.isPointing = false;
            stateRef.current.isOpenPalm = false;
            stateRef.current.isPeaceSign = false;
            stateRef.current.isThumbsUp = false;
            stateRef.current.isDoublePinch = false;
            if (handDetected) setHandDetected(false);
            return;
          }

          const detectedHands = (results.multiHandLandmarks ?? [])
            .map((landmarks: HandLandmark[], index: number) => ({
              landmarks,
              score: results.multiHandedness?.[index]?.score ?? 1,
            }))
            .filter((hand: { landmarks: HandLandmark[]; score: number }) => hand.score >= MIN_HAND_CONFIDENCE);

          if (detectedHands.length > 0) {
            const sm = smoothRef.current;
            const alpha = settings.handSmoothingFactor; // lower = smoother

            // ── Hand 1 Process ──
            const lm1 = detectedHands[0].landmarks;
            const rawX = 1 - lm1[8].x;
            const rawY = lm1[8].y;

            const newX = ema(rawX, sm.handX, alpha);
            const newY = ema(rawY, sm.handY, alpha);
            if (
              Math.abs(newX - sm.handX) > DEAD_ZONE ||
              Math.abs(newY - sm.handY) > DEAD_ZONE
            ) {
              sm.handX = newX;
              sm.handY = newY;
            }
            stateRef.current.handX = sm.handX;
            stateRef.current.handY = sm.handY;

            const hand1Pose = analyzeHandPose(
              lm1,
              settings.pinchThreshold,
              settings.pinchReleaseThreshold,
            );

            if (hand1Pose.rawPinch) {
              sm.pinchFrames++;
              sm.releasedFrames = 0;
            } else {
              sm.releasedFrames++;
              if (hand1Pose.rawRelease) sm.pinchFrames = 0;
            }

            if (
              !sm.isPinchLocked &&
              sm.pinchFrames >= settings.pinchDebounceFrames
            )
              sm.isPinchLocked = true;
            else if (
              sm.isPinchLocked &&
              hand1Pose.rawRelease &&
              sm.releasedFrames >= 3
            )
              sm.isPinchLocked = false;

            stateRef.current.isPinching = sm.isPinchLocked;

            stateRef.current.isPointing =
              hand1Pose.indexExt &&
              !hand1Pose.middleExt &&
              !hand1Pose.ringExt &&
              !hand1Pose.pinkyExt &&
              !stateRef.current.isPinching;
            stateRef.current.isOpenPalm =
              hand1Pose.indexExt &&
              hand1Pose.middleExt &&
              hand1Pose.ringExt &&
              hand1Pose.pinkyExt &&
              !stateRef.current.isPinching;

            const rawPeaceSign =
              hand1Pose.indexExt &&
              hand1Pose.middleExt &&
              !hand1Pose.ringExt &&
              !hand1Pose.pinkyExt &&
              !stateRef.current.isPinching;
            const rawThumbsUp =
              hand1Pose.thumbExt &&
              !hand1Pose.indexExt &&
              !hand1Pose.middleExt &&
              !hand1Pose.ringExt &&
              !hand1Pose.pinkyExt &&
              lm1[4].y < lm1[2].y;

            sm.peaceFrames = rawPeaceSign ? sm.peaceFrames + 1 : 0;
            sm.thumbsUpFrames = rawThumbsUp ? sm.thumbsUpFrames + 1 : 0;
            stateRef.current.isPeaceSign =
              sm.peaceFrames >= GESTURE_DEBOUNCE_FRAMES;
            stateRef.current.isThumbsUp =
              sm.thumbsUpFrames >= GESTURE_DEBOUNCE_FRAMES;

            if (!stateRef.current.handDetected) {
              stateRef.current.handDetected = true;
              setHandDetected(true);
            }

            // ── Hand 2 Process ──
            if (detectedHands.length > 1) {
              const lm2 = detectedHands[1].landmarks;
              const rawX2 = 1 - lm2[8].x;
              const rawY2 = lm2[8].y;

              const newX2 = ema(rawX2, sm.hand2X, alpha);
              const newY2 = ema(rawY2, sm.hand2Y, alpha);
              if (
                Math.abs(newX2 - sm.hand2X) > DEAD_ZONE ||
                Math.abs(newY2 - sm.hand2Y) > DEAD_ZONE
              ) {
                sm.hand2X = newX2;
                sm.hand2Y = newY2;
              }
              stateRef.current.hand2X = sm.hand2X;
              stateRef.current.hand2Y = sm.hand2Y;

              const hand2Pose = analyzeHandPose(
                lm2,
                settings.pinchThreshold,
                settings.pinchReleaseThreshold,
              );

              if (hand2Pose.rawPinch) {
                sm.pinchFrames2++;
                sm.releasedFrames2 = 0;
              } else {
                sm.releasedFrames2++;
                if (hand2Pose.rawRelease) sm.pinchFrames2 = 0;
              }

              if (
                !sm.isPinchLocked2 &&
                sm.pinchFrames2 >= settings.pinchDebounceFrames
              )
                sm.isPinchLocked2 = true;
              else if (
                sm.isPinchLocked2 &&
                hand2Pose.rawRelease &&
                sm.releasedFrames2 >= 3
              )
                sm.isPinchLocked2 = false;

              stateRef.current.isPinching2 = sm.isPinchLocked2;

              stateRef.current.isOpenPalm2 =
                hand2Pose.indexExt &&
                hand2Pose.middleExt &&
                hand2Pose.ringExt &&
                hand2Pose.pinkyExt &&
                !stateRef.current.isPinching2;

              stateRef.current.hand2Detected = true;
            } else {
              stateRef.current.hand2Detected = false;
              stateRef.current.isPinching2 = false;
              stateRef.current.isOpenPalm2 = false;
              stateRef.current.isDoublePinch = false;
              sm.isPinchLocked2 = false;
              sm.pinchFrames2 = 0;
              sm.releasedFrames2 = 0;
            }

            // ── Combined Gestures ──
            stateRef.current.isDoublePinch =
              stateRef.current.isPinching && stateRef.current.isPinching2;
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
              sm.peaceFrames = 0;
              sm.thumbsUpFrames = 0;

              sm.isPinchLocked2 = false;
              sm.pinchFrames2 = 0;
              sm.releasedFrames2 = 0;
              stateRef.current.isPinching = false;
              stateRef.current.isPinching2 = false;
              stateRef.current.isPointing = false;
              stateRef.current.isOpenPalm = false;
              stateRef.current.isOpenPalm2 = false;
              stateRef.current.isPeaceSign = false;
              stateRef.current.isThumbsUp = false;
              stateRef.current.isDoublePinch = false;
            }
          }
        });

        if (cleanup) return;

        // Shared camera instance sends frames to both models concurrently
        let isProcessing = false;
        const cam = new CameraClass(video, {
          onFrame: async () => {
            if (cleanup || isProcessing) return;
            isProcessing = true;
            try {
              const s = settingsRef.current;
              if (s.faceTrackingEnabled) {
                await faceMesh.send({ image: video });
              }
              if (s.handTrackingEnabled) {
                await hands.send({ image: video });
              }
            } catch (err) {
              console.error("[spatialTracking] Frame processing error:", err);
            } finally {
              isProcessing = false;
            }
          },
          width: 640,
          height: 480,
        });
        cam.start();
      } catch (err) {
        console.error("[spatialTracking] MediaPipe init failed:", err);
      }
    })();

    return () => {
      cleanup = true;
      clearInterval(visInterval);
      const trackingWindow = window as Window & {
        _snapshotInterval?: ReturnType<typeof setInterval>;
      };
      if (trackingWindow._snapshotInterval)
        clearInterval(trackingWindow._snapshotInterval);
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
      video.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingRequested]);

  const getSpatialState = useCallback(() => stateRef.current, []);

  return { getSpatialState, webcamActive, faceDetected, handDetected };
}
