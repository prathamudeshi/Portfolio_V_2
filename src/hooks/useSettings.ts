'use client';
/**
 * useSettings.ts — Zustand store for all user-configurable settings.
 */

import { create } from 'zustand';

export type ThemeName = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan';

export interface SettingsState {
  // Theme
  theme: ThemeName;

  // Hand tracking
  handTrackingEnabled: boolean;
  handSmoothingFactor: number;
  pinchThreshold: number;
  pinchReleaseThreshold: number;
  pinchDebounceFrames: number;
  cursorSize: number;

  // Face tracking
  faceTrackingEnabled: boolean;
  faceSensitivity: number;

  // Display
  showWebcam: boolean;
  webcamOpacity: number;
  showStatusOverlay: boolean;

  // Fullscreen
  isFullscreen: boolean;

  // Actions
  setTheme: (v: ThemeName) => void;
  setHandTrackingEnabled: (v: boolean) => void;
  setHandSmoothingFactor: (v: number) => void;
  setPinchThreshold: (v: number) => void;
  setCursorSize: (v: number) => void;
  setFaceTrackingEnabled: (v: boolean) => void;
  setFaceSensitivity: (v: number) => void;
  setShowWebcam: (v: boolean) => void;
  setWebcamOpacity: (v: number) => void;
  setShowStatusOverlay: (v: boolean) => void;
  setIsFullscreen: (v: boolean) => void;
  toggleFullscreen: () => void;
  resetAll: () => void;
}

const defaults = {
  theme: 'indigo' as ThemeName,
  handTrackingEnabled: true,
  handSmoothingFactor: 0.35,
  pinchThreshold: 0.055,
  pinchReleaseThreshold: 0.075,
  pinchDebounceFrames: 3,
  cursorSize: 16,
  faceTrackingEnabled: true,
  faceSensitivity: 1.0,
  showWebcam: false,
  webcamOpacity: 0.7,
  showStatusOverlay: true,
  isFullscreen: false,
};

function applyTheme(theme: ThemeName) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
  }
}

export const useSettings = create<SettingsState>((set) => ({
  ...defaults,

  setTheme: (v) => {
    applyTheme(v);
    set({ theme: v });
  },
  setHandTrackingEnabled: (v) => set({ handTrackingEnabled: v }),
  setHandSmoothingFactor: (v) => set({ handSmoothingFactor: Math.max(0.1, Math.min(0.9, v)) }),
  setPinchThreshold: (v) => {
    const clamped = Math.max(0.03, Math.min(0.08, v));
    set({ pinchThreshold: clamped, pinchReleaseThreshold: clamped + 0.02 });
  },
  setCursorSize: (v) => set({ cursorSize: Math.max(8, Math.min(32, v)) }),
  setFaceTrackingEnabled: (v) => set({ faceTrackingEnabled: v }),
  setFaceSensitivity: (v) => set({ faceSensitivity: Math.max(0.5, Math.min(3.0, v)) }),
  setShowWebcam: (v) => set({ showWebcam: v }),
  setWebcamOpacity: (v) => set({ webcamOpacity: Math.max(0.3, Math.min(1.0, v)) }),
  setShowStatusOverlay: (v) => set({ showStatusOverlay: v }),
  setIsFullscreen: (v) => set({ isFullscreen: v }),

  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => set({ isFullscreen: true })).catch(() => {});
    } else {
      document.exitFullscreen().then(() => set({ isFullscreen: false })).catch(() => {});
    }
  },

  resetAll: () => {
    applyTheme(defaults.theme);
    set(defaults);
  },
}));
