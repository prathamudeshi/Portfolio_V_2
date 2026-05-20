"use client";
/**
 * HeroWelcomeCard.tsx - Centered welcome card shown after the boot sequence.
 *
 * Keeps onboarding lightweight:
 *   - Default path is instant exploration
 *   - Guided tour is optional
 *   - Theme switching is elevated as a signature interaction
 */

import { motion } from "framer-motion";
import { useGuide } from "@/hooks/useGuide";
import { useSettings } from "@/hooks/useSettings";
import { usePanelManager } from "@/hooks/usePanelManager";

interface Props {
  onDismiss: () => void;
}

const roles = [
  "AI Engineer",
  "Full-Stack-Dev",
  "GenAI and agentic Systems Developer",
];
const quickTips = [
  {
    title: "Open icons",
    detail: "Desktop shortcuts and the dock both open panels.",
  },
  {
    title: "Spatial input",
    detail: "Move your head or pinch with one hand when webcam tracking is enabled.",
  },
  {
    title: "Drag windows",
    detail: "Move panels around like a real workspace.",
  },
  {
    title: "Nexus Bot",
    detail: "The robot assistant stays with you across the whole site.",
  },
  {
    title: "Scroll anytime",
    detail: "Jump straight into the classic portfolio below.",
  },
  {
    title: "Project Lab",
    detail: "Launch interactive demos and case studies from the desktop.",
  },
];
const themePreview = [
  { label: "Indigo", color: "#818cf8" },
  { label: "Emerald", color: "#34d399" },
  { label: "Rose", color: "#fb7185" },
  { label: "Amber", color: "#fbbf24" },
  { label: "Cyan", color: "#22d3ee" },
];

export default function HeroWelcomeCard({ onDismiss }: Props) {
  const startGuide = useGuide((s) => s.startGuide);
  const setFaceTrackingEnabled = useSettings((s) => s.setFaceTrackingEnabled);
  const setHandTrackingEnabled = useSettings((s) => s.setHandTrackingEnabled);
  const openPanel = usePanelManager((s) => s.openPanel);

  const handleStartExploring = () => {
    onDismiss();
  };

  const handleTour = () => {
    setFaceTrackingEnabled(true);
    setHandTrackingEnabled(true);
    onDismiss();
    setTimeout(() => startGuide(), 400);
  };

  const handleTryThemes = () => {
    onDismiss();
    setTimeout(() => openPanel("settings"), 240);
  };

  const handleViewPortfolio = () => {
    onDismiss();
    setTimeout(() => {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.55, ease: [0.2, 0, 0, 1] }}
      className="welcome-card-root"
      style={{
        position: "absolute",
        inset: 0,
        margin: "auto",
        zIndex: 60,
        width: "min(92vw, 620px)",
        height: "fit-content",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "rgba(8, 8, 22, 0.88)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border:
          "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.18)",
        borderRadius: 28,
        padding: "clamp(20px, 4vh, 44px) clamp(20px, 4vw, 40px)",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.06), 0 0 60px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.08)",
        textAlign: "center",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 14px",
          background:
            "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.1)",
          border:
            "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.22)",
          borderRadius: 9999,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "1.5px",
          color: "var(--md-primary)",
          marginBottom: 22,
          fontFamily: "var(--md-font-body)",
          textTransform: "uppercase",
        }}
      >
        Interactive Portfolio
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        style={{
          fontFamily: "var(--md-font-display)",
          fontSize: "clamp(22px, 5vw, 46px)",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.5px",
          lineHeight: 1.1,
          marginBottom: 8,
          textShadow:
            "0 0 50px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.35)",
        }}
      >
        Pratham Udeshi
      </motion.h1>



      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        {roles.map((role) => (
          <span
            key={role}
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "3px 10px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#c5c4d9",
              fontFamily: "var(--md-font-body)",
            }}
          >
            {role}
          </span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.45 }}
        className="welcome-card-desc"
        style={{
          fontFamily: "var(--md-font-body)",
          fontSize: 13,
          lineHeight: 1.65,
          color: "#a8a8c3",
          maxWidth: 470,
          margin: "0 auto 16px",
        }}
      >
        Step into a spatial-computing-inspired workspace that redefines how you
        explore a professional portfolio. Interact with dynamic panels,
        customize your digital environment, and discover a seamless blend of
        creative design and full-stack engineering.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.4 }}
        className="welcome-card-tips"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 8,
          textAlign: "left",
          marginBottom: 16,
        }}
      >
        {quickTips.map((tip) => (
          <div
            key={tip.title}
            style={{
              padding: "10px 12px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--md-font-body)",
                fontSize: 11,
                fontWeight: 700,
                color: "#f8f7ff",
                marginBottom: 3,
              }}
            >
              {tip.title}
            </div>
            <div
              style={{
                fontFamily: "var(--md-font-body)",
                fontSize: 11,
                lineHeight: 1.4,
                color: "#9ea3ba",
              }}
            >
              {tip.detail}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="welcome-card-theme"
        style={{
          marginBottom: 18,
          padding: "12px 16px",
          borderRadius: 18,
          background:
            "linear-gradient(135deg, rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.16), rgba(255,255,255,0.03))",
          border:
            "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.22)",
          textAlign: "left",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
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
          <span
            style={{
              fontFamily: "var(--md-font-body)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "var(--md-primary)",
              textTransform: "uppercase",
            }}
          >
            Theme Spotlight
          </span>
          <span
            style={{
              fontFamily: "var(--md-font-body)",
              fontSize: 11,
              fontWeight: 600,
              color: "#eef2ff",
              padding: "4px 10px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Live
          </span>
        </div>

        <p
          style={{
            fontFamily: "var(--md-font-body)",
            fontSize: 13,
            lineHeight: 1.6,
            color: "#d4d8ea",
            marginBottom: 12,
          }}
        >
          The settings panel recolors the whole workspace instantly, so visitors
          can change the mood of the scene in one click.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {themePreview.map((theme, index) => (
            <motion.div
              key={theme.label}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.28 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 9999,
                background: "rgba(5, 8, 20, 0.36)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: theme.color,
                  boxShadow: `0 0 16px ${theme.color}88`,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--md-font-body)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#edf0ff",
                }}
              >
                {theme.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.68, duration: 0.4 }}
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <button
          onClick={handleStartExploring}
          style={{
            padding: "11px 24px",
            borderRadius: 9999,
            background: "var(--md-primary)",
            color: "var(--md-on-primary)",
            fontFamily: "var(--md-font-body)",
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.1px",
            boxShadow: "0 4px 24px rgba(176, 184, 255, 0.32)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 8px 32px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow =
              "0 4px 24px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.32)";
          }}
        >
          Start Exploring
        </button>

        <button
          onClick={handleTryThemes}
          style={{
            padding: "11px 24px",
            borderRadius: 9999,
            background:
              "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.1)",
            border:
              "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)",
            color: "#e4e1ec",
            fontFamily: "var(--md-font-body)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s ease, border-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.16)";
            e.currentTarget.style.borderColor =
              "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.34)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.1)";
            e.currentTarget.style.borderColor =
              "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)";
          }}
        >
          Try Themes
        </button>

        <button
          onClick={toggleFullscreen}
          style={{
            padding: "11px 24px",
            borderRadius: 9999,
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#e4e1ec",
            fontFamily: "var(--md-font-body)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          Fullscreen
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.76, duration: 0.35 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleTour}
          style={{
            background: "transparent",
            border: "none",
            color: "#b7c0de",
            fontFamily: "var(--md-font-body)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Take the spatial tour
        </button>
        <button
          onClick={handleViewPortfolio}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--md-primary)",
            fontFamily: "var(--md-font-body)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          View Portfolio
        </button>
      </motion.div>

      <div
        style={{
          position: "absolute",
          top: -1,
          left: -1,
          width: 48,
          height: 48,
          borderTop:
            "1.5px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.35)",
          borderLeft:
            "1.5px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.35)",
          borderTopLeftRadius: 32,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          width: 48,
          height: 48,
          borderBottom:
            "1.5px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.35)",
          borderRight:
            "1.5px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.35)",
          borderBottomRightRadius: 32,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
