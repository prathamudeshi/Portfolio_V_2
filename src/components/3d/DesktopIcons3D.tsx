"use client";

import { Html } from "@react-three/drei";
import DesktopIcon from "@/components/ui/DesktopIcon";
import { type PanelId } from "@/hooks/usePanelManager";

interface DesktopItem {
  id: PanelId;
  icon: string;
  label: string;
}

const desktopItems: DesktopItem[] = [
  { id: "about", icon: "👤", label: "About" },
  { id: "terminal", icon: "⌨️", label: "Terminal" },
  { id: "experience", icon: "💼", label: "Experience" },
  { id: "projects", icon: "📂", label: "Projects" },
  { id: "skills", icon: "⚡", label: "Skills" },
  { id: "profiles", icon: "🔗", label: "Profiles" },
  { id: "contact", icon: "📧", label: "Contact" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export default function DesktopIcons3D() {
  return (
    <group position={[-8, 3, -10]}>
      {desktopItems.map((item, index) => {
        const col = Math.floor(index / 5);
        const row = index % 5;

        // In 3D space, we use world units.
        // 1.5 units spacing for icons
        const x = col * 1.5;
        const y = -row * 1.5;

        return (
          <group key={item.id} position={[x, y, 0]}>
            <Html
              transform
              distanceFactor={8}
              occlude={false}
              zIndexRange={[0, 0]} // Keep them behind panels
              style={{ pointerEvents: "auto" }}
            >
              <DesktopIcon
                id={item.id}
                icon={item.icon}
                label={item.label}
                // When using Html transform, the child coordinate system is centered.
                // We don't need initialX/initialY if we position the group.
              />
            </Html>
          </group>
        );
      })}
    </group>
  );
}
