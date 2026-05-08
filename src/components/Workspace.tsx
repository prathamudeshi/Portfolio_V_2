"use client";
/**
 * Workspace.tsx — Main workspace orchestrator scoped to the hero section.
 *
 * UX flow after boot:
 *   1. BootSequence plays (~2 s terminal animation)
 *   2. HeroWelcomeCard appears with a lightweight onboarding layer
 *   3. After welcome dismissed: dock + theme spotlight + scroll cue are shown
 *
 * Visual changes:
 *   - Multi-colour CSS radial gradient behind the canvas (visible before WebGL loads)
 *   - Prominent action cue explains the three main paths: open, drag, scroll
 *   - Name bar uses Outfit font + glow text-shadow
 */

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useSpatialTracking } from "@/hooks/useSpatialTracking";
import { useGestureDispatch } from "@/hooks/useGestureDispatch";
import { useGlobalGestures } from "@/hooks/useGlobalGestures";
import { usePanelManager } from "@/hooks/usePanelManager";
import { useSettings } from "@/hooks/useSettings";
import Dock from "@/components/ui/Dock";
import StatusOverlay from "@/components/ui/StatusOverlay";
import BootSequence from "@/components/ui/BootSequence";
import SceneContent from "@/components/3d/SceneContent";
import HandCursor from "@/components/ui/HandCursor";
import GuideDialog from "@/components/ui/GuideDialog";
import SystemBar from "@/components/ui/SystemBar";
import HeroWelcomeCard from "@/components/ui/HeroWelcomeCard";
import RobotMascot from "@/components/ui/RobotMascot";

// R3F Canvas wrapper — must be loaded client-side only
const SpatialWorkspace = dynamic(
  () => import("@/components/3d/SpatialWorkspace"),
  { ssr: false },
);

export default function Workspace() {
  const { getSpatialState, webcamActive, faceDetected, handDetected } =
    useSpatialTracking();
  useGestureDispatch(getSpatialState);
  const { booted, setBoot } = usePanelManager();
  useGlobalGestures(booted);
  const showStatusOverlay = useSettings((s) => s.showStatusOverlay);

  const [showBoot, setShowBoot] = useState(true);
  const [readyToShow, setReadyToShow] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Ref + IntersectionObserver to pause canvas when hero is off-screen
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const handleBootComplete = useCallback(() => {
    setShowBoot(false);
    setReadyToShow(true);
    setBoot(true);
    // Small delay so the 3D scene has time to render before welcome card appears
    setTimeout(() => setShowWelcome(true), 600);
  }, [setBoot]);

  const handleWelcomeDismiss = useCallback(() => {
    setShowWelcome(false);
  }, []);

  return (
    <div
      id="hero"
      ref={heroRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        // Multi-colour gradient visible immediately — before WebGL initialises
        background: [
          "radial-gradient(ellipse 90% 60% at 15% 25%, rgba(99, 102, 241, 0.22) 0%, transparent 55%)",
          "radial-gradient(ellipse 70% 50% at 85% 75%, rgba(34, 211, 238, 0.12) 0%, transparent 50%)",
          "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 65%)",
          "#05050f",
        ].join(", "),
      }}
    >
      {/* Boot sequence */}
      <AnimatePresence>
        {showBoot && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* 3D Canvas — paused while off-screen */}
      {heroVisible && (
        <SpatialWorkspace getSpatialState={getSpatialState}>
          {booted && <SceneContent />}
        </SpatialWorkspace>
      )}

      {/* ── UI chrome — rendered only after boot ── */}
      {readyToShow && booted && (
        <>
          <HandCursor getSpatialState={getSpatialState} />
          {showStatusOverlay && (
            <StatusOverlay
              webcamActive={webcamActive}
              faceDetected={faceDetected}
              handDetected={handDetected}
            />
          )}

          {/* Floating name header — hidden while welcome card is open */}
          <AnimatePresence></AnimatePresence>

          <SystemBar />
          <Dock />
          <RobotMascot
            enabled={readyToShow && !showWelcome}
            heroVisible={heroVisible}
            webcamActive={webcamActive}
            faceDetected={faceDetected}
            handDetected={handDetected}
          />

          {/* Welcome card — shown once per session after boot */}
          <AnimatePresence>
            {showWelcome && (
              <>
                {/* Dim backdrop so 3D panels don't distract */}
                <motion.div
                  key="welcome-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(5, 5, 15, 0.72)",
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                    zIndex: 55,
                  }}
                />
                <HeroWelcomeCard onDismiss={handleWelcomeDismiss} />
              </>
            )}
          </AnimatePresence>

          {/* Guide dialog — starts only when user explicitly chooses the quick tour */}
          <GuideDialog />
        </>
      )}

      {/* ── Scroll cue — prominent, labeled, visible after welcome dismissed ── */}
      <AnimatePresence>
        {readyToShow && !showWelcome && (
          <motion.div
            key="scroll-cue"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              position: "absolute",
              bottom: 84,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            {/* Label */}
            <span
              style={{
                fontFamily: "var(--md-font-body)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "2px",
                color: "rgba(176, 184, 255, 0.65)",
                textTransform: "uppercase",
              }}
            >
              Open windows, drag them around, or scroll down
            </span>

            <span
              style={{
                fontFamily: "var(--md-font-body)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.2px",
                color: "rgba(228, 225, 236, 0.62)",
              }}
            >
              Spatial tip: the bot on the right can restart the tour and guide people back into Nexus OS
            </span>

            {/* Animated chevrons */}
            <a
              href="#about"
              style={{
                pointerEvents: "auto",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {[0, 1].map((i) => (
                <motion.svg
                  key={i}
                  width="20"
                  height="12"
                  viewBox="0 0 20 12"
                  fill="none"
                  animate={{ y: [0, 5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.6,
                    delay: i * 0.25,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    d="M1 1L10 10L19 1"
                    stroke="rgba(176,184,255,0.8)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              ))}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
