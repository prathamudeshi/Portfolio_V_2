"use client";
/**
 * Dock.tsx — macOS-style bottom dock with magnification hover effect.
 */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePanelManager, type PanelId } from "@/hooks/usePanelManager";

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
}: {
  item: DockItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { panels, togglePanel } = usePanelManager();
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
      onClick={() => togglePanel(item.id)}
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
    >
      <span>{item.icon}</span>
      {/* Active dot */}
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

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", damping: 20 }}
      style={{
        position: "fixed",
        bottom: 12,
        left: "40%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 18,
        background: "rgba(10, 10, 30, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.12)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
        alignItems: "flex-end",
      }}
    >
      {dockItems.map((item) => (
        <DockIcon key={item.id} item={item} mouseX={mouseX} />
      ))}
    </motion.div>
  );
}
