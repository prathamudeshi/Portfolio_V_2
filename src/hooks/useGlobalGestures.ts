'use client';
import { useEffect } from 'react';
import { usePanelManager, type PanelId } from './usePanelManager';
import { useSettings, type ThemeName } from './useSettings';

export function useGlobalGestures(booted: boolean) {
  useEffect(() => {
    if (!booted) return;

    const findTopPanel = () => {
      const { panels } = usePanelManager.getState();
      const openPanels = Object.entries(panels).filter(([_, p]) => p.isOpen && !p.isMinimized && !p.isMaximized);
      if (openPanels.length === 0) return null;
      return openPanels.sort((a, b) => b[1].zIndex - a[1].zIndex)[0][0] as PanelId;
    };

    let baseSize: [number, number] | null = null;
    let targetPanel: PanelId | null = null;

    const handleResizeStart = () => {
      targetPanel = findTopPanel();
      if (targetPanel) {
        baseSize = [...usePanelManager.getState().panels[targetPanel].size];
      }
    };

    const handleResizeMove = (e: any) => {
      if (targetPanel && baseSize) {
        const scale = e.detail.scale;
        const newW = baseSize[0] * scale;
        const newH = baseSize[1] * scale;
        usePanelManager.getState().resizePanel(targetPanel, newW, newH);
      }
    };

    const handleResizeEnd = () => {
      targetPanel = null;
      baseSize = null;
    };

    const handleMaximize = () => {
      const top = findTopPanel();
      if (top) usePanelManager.getState().maximizePanel(top);
    };

    const handleMinimize = () => {
      // Minimize all
      const { panels, minimizePanel } = usePanelManager.getState();
      Object.entries(panels).forEach(([id, p]) => {
        if (p.isOpen && !p.isMinimized) minimizePanel(id as PanelId);
      });
    };

    window.addEventListener('gesture-resizestart', handleResizeStart);
    // @ts-ignore custom event
    window.addEventListener('gesture-resizemove', handleResizeMove);
    window.addEventListener('gesture-resizeend', handleResizeEnd);
    window.addEventListener('gesture-maximize', handleMaximize);
    window.addEventListener('gesture-minimize', handleMinimize);

    return () => {
      window.removeEventListener('gesture-resizestart', handleResizeStart);
      // @ts-ignore custom event
      window.removeEventListener('gesture-resizemove', handleResizeMove);
      window.removeEventListener('gesture-resizeend', handleResizeEnd);
      window.removeEventListener('gesture-maximize', handleMaximize);
      window.removeEventListener('gesture-minimize', handleMinimize);
    };
  }, [booted]);
}
