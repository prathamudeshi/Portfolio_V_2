'use client';
/**
 * Workspace.tsx — Main workspace orchestrator.
 *
 * All 3D-anchored panels are rendered by SceneContent inside the R3F Canvas.
 * The Dock, StatusOverlay, and name header are fixed HTML overlays.
 * Now includes fullscreen prompt after boot and settings integration.
 */

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { useSpatialTracking } from '@/hooks/useSpatialTracking';
import { useGestureDispatch } from '@/hooks/useGestureDispatch';
import { usePanelManager } from '@/hooks/usePanelManager';
import { useSettings } from '@/hooks/useSettings';
import Dock from '@/components/ui/Dock';
import StatusOverlay from '@/components/ui/StatusOverlay';
import BootSequence from '@/components/ui/BootSequence';
import FullscreenPrompt from '@/components/ui/FullscreenPrompt';
import SceneContent from '@/components/3d/SceneContent';
import HandCursor from '@/components/ui/HandCursor';
import DesktopIcons from '@/components/ui/DesktopIcons';
import GuideDialog from '@/components/ui/GuideDialog';
import { useGuide } from '@/hooks/useGuide';

// R3F Canvas wrapper — must be loaded client-side only
const SpatialWorkspace = dynamic(() => import('@/components/3d/SpatialWorkspace'), { ssr: false });

export default function Workspace() {
  const { getSpatialState, webcamActive, faceDetected, handDetected } = useSpatialTracking();
  useGestureDispatch(getSpatialState);
  const { booted, setBoot } = usePanelManager();
  const showStatusOverlay = useSettings(s => s.showStatusOverlay);
  const isFullscreen = useSettings(s => s.isFullscreen);
  const setIsFullscreen = useSettings(s => s.setIsFullscreen);

  const [showBoot, setShowBoot] = useState(true);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);
  const startGuide = useGuide(s => s.startGuide);

  // Sync fullscreen state with browser
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [setIsFullscreen, isFullscreen]);

  const handleBootComplete = useCallback(() => {
    setShowBoot(false);
    setShowFullscreenPrompt(true);
  }, []);

  const handleFullscreenComplete = useCallback(() => {
    setShowFullscreenPrompt(false);
    setReadyToShow(true);
    setBoot(true);
    
    // Start guide after a small delay to let the scene settle
    setTimeout(() => {
      startGuide();
    }, 1500);
  }, [setBoot, startGuide]);

  return (
    <>
      {/* Boot sequence */}
      <AnimatePresence>
        {showBoot && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* Fullscreen prompt (between boot and workspace) */}
      <AnimatePresence>
        {showFullscreenPrompt && <FullscreenPrompt onComplete={handleFullscreenComplete} />}
      </AnimatePresence>

      {/* 3D Canvas with scene content (panels anchored in 3D space) */}
      <SpatialWorkspace getSpatialState={getSpatialState}>
        {booted && <SceneContent />}
      </SpatialWorkspace>

      {/* Fixed UI chrome */}
      {readyToShow && booted && (
        <>
          <HandCursor getSpatialState={getSpatialState} />
          {showStatusOverlay && (
            <StatusOverlay webcamActive={webcamActive} faceDetected={faceDetected} handDetected={handDetected} />
          )}

          {/* Floating name header */}
          <div
            style={{
              position: 'fixed',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              textAlign: 'center',
              pointerEvents: 'none',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', letterSpacing: 2, textTransform: 'uppercase' }}>
              Pratham Udeshi
            </div>
            <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: 4, marginTop: 2 }}>
              AI Engineer · Computer Vision · Full-Stack
            </div>
          </div>

          <DesktopIcons />

          <Dock />

          <GuideDialog />
        </>
      )}
    </>
  );
}
