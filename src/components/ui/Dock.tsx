"use client";
/**
 * Dock.tsx - macOS-style bottom dock with magnification hover effect.
 */

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePanelManager, type PanelId } from "@/hooks/usePanelManager";
import { useSettings } from "@/hooks/useSettings";

interface DockItem {
  id: PanelId;
  icon: string;
  label: string;
}

const dockItems: DockItem[] = [
  { id: "about", icon: "👤", label: "About" },
  { id: "terminal", icon: "⌨️", label: "Terminal" },
  { id: "experience", icon: "💼", label: "Experience" },
  { id: "projects", icon: "📂", label: "Projects" },
  { id: "skills", icon: "⚡", label: "Skills" },
  { id: "profiles", icon: "🔗", label: "Profiles" },
  { id: "contact", icon: "📧", label: "Contact" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

function DockIcon({
  item,
  mouseX,
  onActivate,
  highlightTheme,
}: {
  item: DockItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onActivate: (id: PanelId) => void;
  highlightTheme: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const panels = usePanelManager((s) => s.panels);
  const panel = panels[item.id];

  const distance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 150;
    return val - rect.x - rect.width / 2;
  });

  const size = useSpring(useTransform(distance, [-100, 0, 100], [48, 64, 48]), {
    damping: 20,
    stiffness: 200,
  });

  return (
    <motion.button
      ref={ref}
      onClick={() => onActivate(item.id)}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        background:
          panel.isOpen && !panel.isMinimized
            ? "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25)"
            : "rgba(255, 255, 255, 0.06)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        cursor: "pointer",
        fontSize: 22,
        position: "relative",
        transition: "background 0.2s",
      }}
      whileHover={{ background: "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.2)" }}
      title={item.label}
      aria-label={item.label}
    >
      {highlightTheme && (
        <>
          <motion.span
            aria-hidden="true"
            animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.1, 0.45] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: 16,
              border: "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.45)",
              boxShadow: "0 0 18px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.28)",
            }}
          />
          <AnimatePresence>
            <motion.span
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                bottom: 74,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "7px 12px",
                borderRadius: 9999,
                background: "rgba(8, 10, 24, 0.94)",
                border: "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.26)",
                color: "#eef2ff",
                fontFamily: "var(--md-font-body)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
              }}
            >
              Try live themes
            </motion.span>
          </AnimatePresence>
        </>
      )}

      <span>{item.icon}</span>

      {panel.isOpen && (
        <span
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "var(--accent)",
          }}
        />
      )}
    </motion.button>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const togglePanel = usePanelManager((s) => s.togglePanel);
  const settingsOpen = usePanelManager((s) => s.panels.settings.isOpen);
  const currentTheme = useSettings((s) => s.theme);
  const [initialTheme] = useState(currentTheme);
  const [spotlightReady, setSpotlightReady] = useState(false);
  const [spotlightDismissed, setSpotlightDismissed] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSpotlightReady(true), 1200);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleActivate = (id: PanelId) => {
    if (id === "settings") {
      setSpotlightDismissed(true);
    }
    togglePanel(id);
  };

  const showThemeSpotlight =
    spotlightReady &&
    !spotlightDismissed &&
    !settingsOpen &&
    currentTheme === initialTheme;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 20 }}
        style={{
          display: "flex",
          gap: 5,
          padding: "5px 8px",
          borderRadius: 16,
          background: "rgba(10, 10, 30, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.12)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
          alignItems: "flex-end",
        }}
      >
        {dockItems.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            onActivate={handleActivate}
            highlightTheme={showThemeSpotlight && item.id === "settings"}
          />
        ))}
      </motion.div>
    </div>
  );
}
