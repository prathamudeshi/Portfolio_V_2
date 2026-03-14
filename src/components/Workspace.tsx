'use client';
/**
 * Workspace.tsx — Main workspace orchestrator.
 *
 * All 3D-anchored panels are rendered by SceneContent inside the R3F Canvas.
 * The Dock, StatusOverlay, and name header are fixed HTML overlays.
 */

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { useSpatialTracking } from '@/hooks/useSpatialTracking';
import { useGestureDispatch } from '@/hooks/useGestureDispatch';
import { usePanelManager } from '@/hooks/usePanelManager';
import Dock from '@/components/ui/Dock';
import StatusOverlay from '@/components/ui/StatusOverlay';
import BootSequence from '@/components/ui/BootSequence';
import SceneContent from '@/components/3d/SceneContent';
import HandCursor from '@/components/ui/HandCursor';

// R3F Canvas wrapper — must be loaded client-side only
const SpatialWorkspace = dynamic(() => import('@/components/3d/SpatialWorkspace'), { ssr: false });

export default function Workspace() {
  const { getSpatialState, webcamActive, faceDetected, handDetected } = useSpatialTracking();
  useGestureDispatch(getSpatialState);
  const { booted, setBoot } = usePanelManager();
  const [showBoot, setShowBoot] = useState(true);

  const handleBootComplete = useCallback(() => {
    setShowBoot(false);
    setBoot(true);
  }, [setBoot]);

  return (
    <>
      {/* Boot sequence */}
      <AnimatePresence>
        {showBoot && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* 3D Canvas with scene content (panels anchored in 3D space) */}
      <SpatialWorkspace getSpatialState={getSpatialState}>
        {booted && <SceneContent />}
      </SpatialWorkspace>

      {/* Fixed UI chrome */}
      {booted && (
        <>
          <HandCursor getSpatialState={getSpatialState} />
          <StatusOverlay webcamActive={webcamActive} faceDetected={faceDetected} handDetected={handDetected} />

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
            <div style={{ fontSize: 11, color: '#818cf8', letterSpacing: 4, marginTop: 2 }}>
              AI Engineer · Computer Vision · Full-Stack
            </div>
          </div>

          <Dock />
        </>
      )}
    </>
  );
}
