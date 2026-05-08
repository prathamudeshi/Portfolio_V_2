"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGuide, type GuideVisual } from "@/hooks/useGuide";
import { useThemeColors } from "@/hooks/useThemeColors";

function GuideVisualPreview({ visual }: { visual: GuideVisual }) {
  const colors = useThemeColors();
  const accentGlow = `0 0 24px ${colors.accent}44`;

  const frameStyle: React.CSSProperties = {
    position: "relative",
    height: 110,
    borderRadius: 18,
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    border: `1px solid ${colors.accent}22`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), ${accentGlow}`,
    marginBottom: 18,
  };

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    fontSize: 28,
    lineHeight: 1,
    filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))",
  };

  const screenStyle: React.CSSProperties = {
    position: "absolute",
    inset: "18px 22px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(8, 10, 22, 0.52)",
  };

  switch (visual) {
    case "overview":
      return (
        <div style={frameStyle}>
          <div style={screenStyle} />
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ ...labelStyle, left: 34, top: 34 }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              ...labelStyle,
              left: "50%",
              top: 28,
              transform: "translateX(-50%)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 10px ${colors.accent}88)` }}
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="15" x2="23" y2="15" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="15" x2="4" y2="15" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ y: [0, -6, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ ...labelStyle, right: 32, top: 40 }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </motion.div>
        </div>
      );

    case "head-tracking":
      return (
        <div style={frameStyle}>
          <div style={screenStyle} />
          <motion.div
            animate={{ x: [-24, 24, -24], rotate: [-8, 8, -8] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ ...labelStyle, left: "50%", top: 36, transform: "translateX(-50%)" }}
          >
            🙂
          </motion.div>
          <motion.div
            animate={{ x: [-34, 34, -34], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: 24,
              width: 110,
              height: 62,
              marginLeft: -55,
              borderRadius: 9999,
              border: `1px dashed ${colors.accent}66`,
            }}
          />
        </div>
      );

    case "tracking-status":
      return (
        <div style={frameStyle}>
          <div style={screenStyle} />
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              right: 18,
              padding: "10px 14px",
              borderRadius: 9999,
              background: "rgba(6, 8, 20, 0.82)",
              border: `1px solid ${colors.accent}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              boxShadow: accentGlow,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 10px rgba(34,197,94,0.65)",
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc" }}>
                Spatial Active
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: colors.accent }}>FACE</span>
              <span style={{ color: "#d8dee9" }}>HAND</span>
            </div>
          </motion.div>
        </div>
      );

    case "hand-pinch":
      return (
        <div style={frameStyle}>
          <div style={screenStyle} />
          <motion.div
            animate={{ opacity: [1, 0, 1, 1], scale: [1, 1, 0.88, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.42, 0.7, 1] }}
            style={{ ...labelStyle, left: "50%", top: 36, transform: "translateX(-50%)" }}
          >
            🤚
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 1, 0], scale: [0.82, 1, 1, 0.82] }}
            transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.38, 0.72, 1] }}
            style={{ ...labelStyle, left: "50%", top: 36, transform: "translateX(-50%)" }}
          >
            🤏
          </motion.div>
        </div>
      );

    case "assistant":
      return (
        <div style={frameStyle}>
          <div style={screenStyle} />
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ ...labelStyle, right: 26, top: 34 }}
          >
            🤖
          </motion.div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.96, 1.02, 0.96] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              position: "absolute",
              left: 24,
              top: 34,
              padding: "10px 14px",
              borderRadius: 18,
              background: "rgba(8, 10, 22, 0.62)",
              border: `1px solid ${colors.accent}44`,
              color: "#e8eefc",
              fontSize: 12,
              fontWeight: 600,
              boxShadow: accentGlow,
            }}
          >
            Start tour
          </motion.div>
          <motion.div
            animate={{ x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: 124,
              top: 52,
              color: colors.accent,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            →
          </motion.div>
        </div>
      );

    case "window-expand":
      return (
        <div style={frameStyle}>
          <motion.div
            animate={{ scale: [0.82, 1.06, 0.82] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 72,
              height: 48,
              marginLeft: -36,
              marginTop: -24,
              borderRadius: 14,
              border: `1px solid ${colors.accent}66`,
              background: "rgba(8, 10, 22, 0.58)",
              boxShadow: accentGlow,
            }}
          />
          <motion.div
            animate={{ x: [-6, -26, -6], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            style={{ ...labelStyle, left: "50%", top: 40, marginLeft: -82 }}
          >
            🤏
          </motion.div>
          <motion.div
            animate={{ x: [6, 26, 6], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            style={{ ...labelStyle, right: "50%", top: 40, marginRight: -82 }}
          >
            🤏
          </motion.div>
        </div>
      );

    case "theme-studio":
      return (
        <div style={frameStyle}>
          <div style={screenStyle} />
          {["#818cf8", "#34d399", "#fb7185", "#fbbf24", "#22d3ee"].map(
            (color, index) => (
              <motion.span
                key={color}
                animate={{ y: [0, -12, 0], scale: [0.9, 1.12, 0.9], opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 1.8,
                  delay: index * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: 40,
                  left: `calc(50% - 90px + ${index * 42}px)`,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 18px ${color}88`,
                }}
              />
            ),
          )}
        </div>
      );

    case "scroll":
      return (
        <div style={frameStyle}>
          <div style={screenStyle} />
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ ...labelStyle, left: "50%", top: 22, transform: "translateX(-50%)" }}
          >
            ↓
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            style={{ ...labelStyle, left: "50%", top: 46, transform: "translateX(-50%)" }}
          >
            ↓
          </motion.div>
        </div>
      );
  }
}

export default function GuideDialog() {
  const { isActive, currentStep, steps, nextStep, prevStep, stopGuide } =
    useGuide();
  const colors = useThemeColors();
  const [displayedText, setDisplayedText] = useState("");

  const step = steps[currentStep];

  useEffect(() => {
    if (!isActive) return;
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(step.text.slice(0, i + 1));
      i++;
      if (i >= step.text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [currentStep, isActive, step.text]);

  if (!isActive) return null;

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "90%",
        maxWidth: 520,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            background: "rgba(15, 15, 25, 0.78)",
            backdropFilter: "blur(14px)",
            border: `1px solid ${colors.accent}44`,
            borderRadius: 22,
            padding: "22px",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 18px ${colors.accent}22`,
            pointerEvents: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3
              style={{
                margin: 0,
                color: colors.accent,
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: 2,
                fontWeight: 700,
              }}
            >
              {step.title}
            </h3>
            <span
              style={{
                color: "#94a3b8",
                fontSize: 12,
                fontFamily: "monospace",
              }}
            >
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          <GuideVisualPreview visual={step.visual} />

          <div
            style={{
              color: "#e2e8f0",
              fontSize: 15,
              lineHeight: 1.65,
              minHeight: 74,
              marginBottom: 24,
              fontWeight: 400,
            }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{
                display: "inline-block",
                width: 2,
                height: 16,
                background: colors.accent,
                marginLeft: 4,
                verticalAlign: "middle",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={stopGuide}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: 13,
                  padding: "8px 12px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                Skip Tour
              </button>
              {isLastStep && (
                <button
                  onClick={() => {
                    stopGuide();
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#818cf8",
                    cursor: "pointer",
                    fontSize: 13,
                    padding: "8px 12px",
                    fontWeight: 600,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#b0b8ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#818cf8")
                  }
                >
                  View Portfolio
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#f1f5f9",
                    borderRadius: 8,
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: 14,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.05)")
                  }
                >
                  Back
                </button>
              )}
              <button
                onClick={isLastStep ? stopGuide : nextStep}
                style={{
                  background: colors.accent,
                  border: "none",
                  color: "#0f172a",
                  borderRadius: 8,
                  padding: "8px 24px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: `0 0 15px ${colors.accent}44`,
                  transition: "transform 0.1s, opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {isLastStep ? "Finish" : "Next"}
              </button>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: -1,
              right: -1,
              width: 40,
              height: 40,
              borderTop: `2px solid ${colors.accent}`,
              borderRight: `2px solid ${colors.accent}`,
              borderTopRightRadius: 20,
              opacity: 0.5,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
