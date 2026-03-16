'use client';

import DesktopIcon from './DesktopIcon';
import { type PanelId } from '@/hooks/usePanelManager';

interface DesktopItem {
  id: PanelId;
  icon: string;
  label: string;
}

const desktopItems: DesktopItem[] = [
  { id: 'about', icon: '👤', label: 'About' },
  { id: 'terminal', icon: '⌨️', label: 'Terminal' },
  { id: 'experience', icon: '💼', label: 'Experience' },
  { id: 'projects', icon: '📂', label: 'Projects' },
  { id: 'skills', icon: '⚡', label: 'Skills' },
  { id: 'profiles', icon: '🔗', label: 'Profiles' },
  { id: 'contact', icon: '📧', label: 'Contact' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function DesktopIcons() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 100,
        left: 40,
        right: 40,
        bottom: 150,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      {desktopItems.map((item, index) => {
        // Calculate a nice spread-out initial position
        // e.g., 2 columns on the left
        const col = Math.floor(index / 5);
        const row = index % 5;
        const initialX = col * 120;
        const initialY = row * 120;

        return (
          <div key={item.id} style={{ pointerEvents: 'auto' }}>
            <DesktopIcon
              id={item.id}
              icon={item.icon}
              label={item.label}
              initialX={initialX}
              initialY={initialY}
            />
          </div>
        );
      })}
    </div>
  );
}
