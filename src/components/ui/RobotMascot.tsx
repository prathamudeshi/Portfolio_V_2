"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useGuide } from "@/hooks/useGuide";
import { usePanelManager } from "@/hooks/usePanelManager";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  ROBOT_MODEL_URL,
  findRobotAnimation,
  tintRobotMaterials,
} from "@/components/3d/robotModel";

type MascotAction = "idle" | "wave" | "punch" | "cheer" | "talk";

const actionPresets: Record<
  MascotAction,
  {
    names: readonly string[];
    loop: THREE.AnimationActionLoopStyles;
    repetitions: number;
    speed: number;
  }
> = {
  idle: {
    names: ["Idle", "Standing"],
    loop: THREE.LoopRepeat,
    repetitions: Infinity,
    speed: 1,
  },
  wave: {
    names: ["Wave", "ThumbsUp", "Yes"],
    loop: THREE.LoopOnce,
    repetitions: 1,
    speed: 1,
  },
  punch: {
    names: ["Punch", "Wave"],
    loop: THREE.LoopOnce,
    repetitions: 1,
    speed: 0.82,
  },
  cheer: {
    names: ["ThumbsUp", "Dance", "Yes"],
    loop: THREE.LoopOnce,
    repetitions: 1,
    speed: 1,
  },
  talk: {
    names: ["Talking", "Yes", "No"],
    loop: THREE.LoopRepeat,
    repetitions: Infinity,
    speed: 1.04,
  },
};

const heroTips = [
  "Head tracking feels best with subtle movement, not exaggerated motion.",
  "A thumb-and-index pinch is the main gesture to test when hand tracking is live.",
  "The dock and the desktop shortcuts open the same windows, so use whichever feels faster.",
];

const portfolioTips = [
  "I stay with you outside the hero, so the spatial layer is still one tap away.",
  "Use me to jump back to the Nexus OS if you want to demo the interactive side of the portfolio.",
  "Theme Studio is still useful down here because it recolors the whole experience, not just the hero.",
];

function nextPseudoRandom(seedRef: MutableRefObject<number>) {
  seedRef.current = (seedRef.current * 1664525 + 1013904223) >>> 0;
  return seedRef.current / 4294967296;
}

function RobotMascotModel({ action }: { action: MascotAction }) {
  const group = useRef<THREE.Group>(null!);
  const colors = useThemeColors();
  const { scene, animations } = useGLTF(ROBOT_MODEL_URL);
  const mascotScene = useMemo(() => clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    tintRobotMaterials(mascotScene, colors.accent);
  }, [colors.accent, mascotScene]);

  useEffect(() => {
    if (!actions) return;

    const preset = actionPresets[action] ?? actionPresets.idle;
    const actionName = findRobotAnimation(names, preset.names);
    if (!actionName) return;

    const currentAction = actions[actionName];
    if (!currentAction) return;

    Object.values(actions).forEach((candidate) => {
      if (candidate && candidate !== currentAction) {
        candidate.fadeOut(0.16);
      }
    });

    currentAction.reset();
    currentAction.setLoop(preset.loop, preset.repetitions);
    currentAction.setEffectiveTimeScale(preset.speed);
    currentAction.fadeIn(0.18);
    currentAction.play();

    return () => {
      currentAction.fadeOut(0.15);
    };
  }, [action, actions, names]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.18;
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.5) * 0.08 - 1.2;
  });

  return (
    <group ref={group} scale={0.5} position={[0, -1.2, 0]}>
      <primitive object={mascotScene} />
      <ambientLight intensity={1.6} />
      <directionalLight
        position={[2, 4, 3]}
        intensity={1.6}
        color={colors.accent}
      />
      <pointLight position={[-2, 1.5, 2]} intensity={1.1} color="#ffffff" />
    </group>
  );
}

interface RobotMascotProps {
  enabled: boolean;
  heroVisible: boolean;
  webcamActive: boolean;
  faceDetected: boolean;
  handDetected: boolean;
}

export default function RobotMascot({
  enabled,
  heroVisible,
  webcamActive,
  faceDetected,
  handDetected,
}: RobotMascotProps) {
  const colors = useThemeColors();
  const { isActive, startGuide } = useGuide();
  const openPanel = usePanelManager((s) => s.openPanel);
  const [expanded, setExpanded] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [currentAction, setCurrentAction] = useState<MascotAction>("idle");
  const revertTimeoutRef = useRef<number | null>(null);
  const ambientTimeoutRef = useRef<number | null>(null);
  const introCollapseTimeoutRef = useRef<number | null>(null);
  const seedRef = useRef(23);

  const triggerAction = useCallback(
    (action: MascotAction, revertAfter = 1800) => {
      if (revertTimeoutRef.current) {
        window.clearTimeout(revertTimeoutRef.current);
      }

      setCurrentAction(action);

      if (action !== "idle") {
        revertTimeoutRef.current = window.setTimeout(() => {
          setCurrentAction("idle");
        }, revertAfter);
      }
    },
    [],
  );

  const runAtHero = useCallback((callback: () => void, delay = 750) => {
    const hero = document.getElementById("hero");
    if (!hero) {
      callback();
      return;
    }

    const rect = hero.getBoundingClientRect();
    const heroAlreadyVisible =
      rect.top < window.innerHeight * 0.4 &&
      rect.bottom > window.innerHeight * 0.35;

    if (heroAlreadyVisible) {
      callback();
      return;
    }

    hero.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(callback, delay);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!enabled || isActive) return;

    if (introCollapseTimeoutRef.current) {
      window.clearTimeout(introCollapseTimeoutRef.current);
    }
    introCollapseTimeoutRef.current = window.setTimeout(() => {
      setExpanded(false);
    }, 5000);

    const scheduleAmbientAction = () => {
      const wait = 4800 + Math.floor(nextPseudoRandom(seedRef) * 3600);
      ambientTimeoutRef.current = window.setTimeout(() => {
        const actions: MascotAction[] = heroVisible
          ? ["wave", "talk", "cheer"]
          : ["wave", "cheer", "talk"];
        const nextAction =
          actions[Math.floor(nextPseudoRandom(seedRef) * actions.length)] ??
          "wave";
        triggerAction(nextAction, nextAction === "talk" ? 2200 : 1700);
        scheduleAmbientAction();
      }, wait);
    };

    scheduleAmbientAction();

    return () => {
      if (ambientTimeoutRef.current) {
        window.clearTimeout(ambientTimeoutRef.current);
      }
      if (revertTimeoutRef.current) {
        window.clearTimeout(revertTimeoutRef.current);
      }
      if (introCollapseTimeoutRef.current) {
        window.clearTimeout(introCollapseTimeoutRef.current);
      }
    };
  }, [enabled, heroVisible, isActive, triggerAction]);

  const primaryTip = useMemo(() => {
    if (!heroVisible) {
      return "I stay with you across the full site. Jump back to the hero whenever you want to demo the spatial OS again.";
    }
    if (!webcamActive) {
      return "Allow webcam access to unlock the real Nexus experience: head tracking, hand gestures, and live spatial feedback.";
    }
    if (!faceDetected) {
      return "Camera is live. Center your face in frame and move a little to activate the parallax head-tracking layer.";
    }
    if (!handDetected) {
      return "Head tracking is active. Raise one hand toward the webcam and pinch thumb plus index finger to try the gesture layer.";
    }
    return "Spatial input is live. Open a panel, drag it around, and test the workspace like a playful operating system.";
  }, [faceDetected, handDetected, heroVisible, webcamActive]);

  const secondaryTip = heroVisible
    ? heroTips[tipIndex % heroTips.length]
    : portfolioTips[tipIndex % portfolioTips.length];

  const statusItems = [
    {
      label: "Cam",
      active: webcamActive,
      activeLabel: "On",
      inactiveLabel: "Off",
    },
    {
      label: "Face",
      active: faceDetected,
      activeLabel: "Locked",
      inactiveLabel: webcamActive ? "Searching" : "Idle",
    },
    {
      label: "Hand",
      active: handDetected,
      activeLabel: "Ready",
      inactiveLabel: webcamActive ? "Raise one" : "Idle",
    },
  ];

  const tertiaryAction = heroVisible
    ? {
        label: "View Portfolio",
        onClick: () => {
          triggerAction("talk", 2000);
          scrollToSection("about");
        },
      }
    : {
        label: "Back to Hero",
        onClick: () => {
          triggerAction("wave");
          scrollToSection("hero");
        },
      };

  if (!enabled || isActive) {
    return null;
  }

  return (
    <motion.div
      animate={{ bottom: heroVisible ? 202 : 24 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      style={{
        position: "fixed",
        right: "clamp(200px, 0.3vw, 6px)",
        zIndex: 1100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            style={{
              width: "min(88vw, 336px)",
              padding: "16px 16px 14px",
              borderRadius: 24,
              background: "rgba(10, 12, 26, 0.92)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: `1px solid rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.25)`,
              boxShadow: `0 18px 40px rgba(0,0,0,0.35), 0 0 24px rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.14)`,
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.accent,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Spatial Assistant
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#f8fafc",
                    marginTop: 2,
                  }}
                >
                  Nexus Bot
                </div>
              </div>
              <button
                onClick={() => setExpanded(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                x
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {statusItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "7px 10px",
                    borderRadius: 9999,
                    background: item.active
                      ? `rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.14)`
                      : "rgba(255,255,255,0.05)",
                    border: item.active
                      ? `1px solid rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.28)`
                      : "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: item.active ? colors.accent : "#64748b",
                      boxShadow: item.active
                        ? `0 0 10px rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.7)`
                        : "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#f8fafc",
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: 11, color: "#b7c3da" }}>
                    {item.active ? item.activeLabel : item.inactiveLabel}
                  </span>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "#dbe4ff",
                marginBottom: 8,
              }}
            >
              {primaryTip}
            </p>

            <p
              style={{
                fontSize: 11,
                lineHeight: 1.55,
                color: "#9fb0cf",
                marginBottom: 14,
              }}
            >
              {secondaryTip}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button
                onClick={() => {
                  triggerAction("wave");
                  runAtHero(() => startGuide());
                }}
                style={{
                  padding: "9px 12px",
                  borderRadius: 9999,
                  border: "none",
                  background: colors.accent,
                  color: "#08111f",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Spatial Tour
              </button>
              <button
                onClick={() => {
                  triggerAction("cheer");
                  runAtHero(() => openPanel("settings"));
                }}
                style={{
                  padding: "9px 12px",
                  borderRadius: 9999,
                  border: `1px solid rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.3)`,
                  background: `rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.12)`,
                  color: "#ecf2ff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Theme Studio
              </button>
              <button
                onClick={tertiaryAction.onClick}
                style={{
                  padding: "9px 12px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#cbd5e1",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {tertiaryAction.label}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          setExpanded((prev) => !prev);
          setTipIndex((prev) => prev + 1);
          triggerAction("punch", 1200);
        }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          pointerEvents: "auto",
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          filter: `drop-shadow(0 16px 28px rgba(0,0,0,0.38)) drop-shadow(0 0 22px rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.18))`,
        }}
        aria-label="Open Nexus Bot assistant"
      >
        <div
          style={{
            position: "relative",
            width: "clamp(160px, 18vw, 320px)",
            height: "clamp(240px, 28vw, 340px)",
            overflow: "visible",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              bottom: 8,
              width: "78%",
              height: "22%",
              transform: "translateX(-50%)",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.24) 0%, rgba(${colors.accentR}, ${colors.accentG}, ${colors.accentB}, 0.08) 42%, transparent 76%)`,
              filter: "blur(10px)",
            }}
          />
          <Canvas
            camera={{ fov: 32, position: [0, 0.4, 5.5] }}
            dpr={window.devicePixelRatio || 1}
            gl={{ antialias: true, alpha: true }}
            style={{ overflow: "visible" }}
          >
            <Suspense fallback={null}>
              <RobotMascotModel action={currentAction} />
            </Suspense>
          </Canvas>
        </div>
      </motion.button>
    </motion.div>
  );
}

useGLTF.preload(ROBOT_MODEL_URL);
