/**
 * usePanelManager.ts — Zustand store for panel states, positions, and sizes.
 */

import { create } from 'zustand';

export type PanelId = 'about' | 'terminal' | 'experience' | 'projects' | 'skills' | 'profiles' | 'contact';

export interface PanelState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  // Mutable 3D position (x, y, z)
  position: [number, number, number];
  // Mutable size (width, height in CSS pixels)
  size: [number, number];
}

interface PanelManagerState {
  panels: Record<PanelId, PanelState>;
  nextZIndex: number;
  theme: string;
  booted: boolean;

  openPanel: (id: PanelId) => void;
  closePanel: (id: PanelId) => void;
  minimizePanel: (id: PanelId) => void;
  maximizePanel: (id: PanelId) => void;
  restorePanel: (id: PanelId) => void;
  focusPanel: (id: PanelId) => void;
  togglePanel: (id: PanelId) => void;
  setTheme: (theme: string) => void;
  setBoot: (booted: boolean) => void;
  movePanel: (id: PanelId, dx: number, dy: number) => void;
  resizePanel: (id: PanelId, w: number, h: number) => void;
}

const defaultPanels: Record<PanelId, PanelState> = {
  terminal:   { isOpen: true,  isMinimized: false, isMaximized: false, zIndex: 2, position: [  0,    0.2, -3  ], size: [520, 340] },
  about:      { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, position: [ -3.2,  1.2, -4  ], size: [360, 400] },
  experience: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 3, position: [  3.2,  1.0, -4.5], size: [480, 420] },
  projects:   { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 4, position: [  0,   -1.5, -5  ], size: [560, 440] },
  skills:     { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5, position: [ -3.5, -1.0, -5.5], size: [480, 380] },
  profiles:   { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 6, position: [  3.5, -0.8, -4  ], size: [420, 360] },
  contact:    { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 7, position: [  0,    2.2, -6  ], size: [360, 320] },
};

export const usePanelManager = create<PanelManagerState>((set) => ({
  panels: defaultPanels,
  nextZIndex: 10,
  theme: 'cyberpunk',
  booted: false,

  openPanel: (id) =>
    set((s) => ({
      panels: { ...s.panels, [id]: { ...s.panels[id], isOpen: true, isMinimized: false, zIndex: s.nextZIndex } },
      nextZIndex: s.nextZIndex + 1,
    })),

  closePanel: (id) =>
    set((s) => ({
      panels: { ...s.panels, [id]: { ...s.panels[id], isOpen: false, isMinimized: false, isMaximized: false } },
    })),

  minimizePanel: (id) =>
    set((s) => ({
      panels: { ...s.panels, [id]: { ...s.panels[id], isMinimized: true } },
    })),

  maximizePanel: (id) =>
    set((s) => ({
      panels: { ...s.panels, [id]: { ...s.panels[id], isMaximized: true, isMinimized: false, zIndex: s.nextZIndex } },
      nextZIndex: s.nextZIndex + 1,
    })),

  restorePanel: (id) =>
    set((s) => ({
      panels: { ...s.panels, [id]: { ...s.panels[id], isMaximized: false, isMinimized: false, zIndex: s.nextZIndex } },
      nextZIndex: s.nextZIndex + 1,
    })),

  focusPanel: (id) =>
    set((s) => ({
      panels: { ...s.panels, [id]: { ...s.panels[id], isOpen: true, isMinimized: false, zIndex: s.nextZIndex } },
      nextZIndex: s.nextZIndex + 1,
    })),

  togglePanel: (id) =>
    set((s) => {
      const panel = s.panels[id];
      if (panel.isOpen && !panel.isMinimized) {
        return { panels: { ...s.panels, [id]: { ...panel, isMinimized: true } } };
      }
      return {
        panels: { ...s.panels, [id]: { ...panel, isOpen: true, isMinimized: false, zIndex: s.nextZIndex } },
        nextZIndex: s.nextZIndex + 1,
      };
    }),

  /**
   * Move a panel in 3D space by a delta.
   * dx/dy are screen-pixel deltas; we convert them to world units
   * using a depth-based scaling factor.
   */
  movePanel: (id, dx, dy) =>
    set((s) => {
      const p = s.panels[id];
      const depth = 5 - p.position[2]; // camera z=5, panel z is negative → distance
      // Scale: at depth=6, 1px ≈ 0.006 world units (tuned for FOV 50)
      const scale = depth * 0.0018;
      const newPos: [number, number, number] = [
        p.position[0] + dx * scale,
        p.position[1] - dy * scale, // invert Y (screen Y is down)
        p.position[2],
      ];
      return { panels: { ...s.panels, [id]: { ...p, position: newPos } } };
    }),

  resizePanel: (id, w, h) =>
    set((s) => {
      const p = s.panels[id];
      return {
        panels: { ...s.panels, [id]: { ...p, size: [Math.max(280, w), Math.max(200, h)] } },
      };
    }),

  setTheme: (theme) => set({ theme }),
  setBoot: (booted) => set({ booted }),
}));
