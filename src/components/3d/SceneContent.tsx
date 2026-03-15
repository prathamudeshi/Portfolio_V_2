'use client';
/**
 * SceneContent.tsx — All 3D-anchored panels rendered inside the R3F Canvas.
 *
 * Reads panel positions from the Zustand store (updated by drag).
 */

import ScenePanel from '@/components/3d/ScenePanel';
import PanelWindow from '@/components/ui/PanelWindow';
import { usePanelManager, type PanelId } from '@/hooks/usePanelManager';

import TerminalPanel from '@/components/panels/TerminalPanel';
import AboutPanel from '@/components/panels/AboutPanel';
import ExperiencePanel from '@/components/panels/ExperiencePanel';
import ProjectsPanel from '@/components/panels/ProjectsPanel';
import SkillsPanel from '@/components/panels/SkillsPanel';
import ProfilesPanel from '@/components/panels/ProfilesPanel';
import ContactPanel from '@/components/panels/ContactPanel';
import SettingsPanel from '@/components/panels/SettingsPanel';

interface PanelConfig {
  id: PanelId;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const panelConfigs: PanelConfig[] = [
  { id: 'terminal',   title: 'terminal.sh',    icon: '⌨️', content: <TerminalPanel /> },
  { id: 'about',      title: 'about.exe',      icon: '👤', content: <AboutPanel /> },
  { id: 'experience', title: 'experience.log',  icon: '💼', content: <ExperiencePanel /> },
  { id: 'projects',   title: 'projects.dir',    icon: '📂', content: <ProjectsPanel /> },
  { id: 'skills',     title: 'skills.graph',    icon: '⚡', content: <SkillsPanel /> },
  { id: 'profiles',   title: 'profiles.link',   icon: '🔗', content: <ProfilesPanel /> },
  { id: 'contact',    title: 'contact.form',    icon: '📧', content: <ContactPanel /> },
  { id: 'settings',   title: 'settings.cfg',    icon: '⚙️', content: <SettingsPanel /> },
];

export default function SceneContent() {
  const { panels } = usePanelManager();

  return (
    <>
      {panelConfigs.map(({ id, title, icon, content }) => {
        const panel = panels[id];
        return (
          <ScenePanel
            key={id}
            position={panel.position}
            visible={panel.isOpen && !panel.isMinimized}
            zIndex={panel.zIndex}
          >
            <PanelWindow id={id} title={title} icon={icon}>
              {content}
            </PanelWindow>
          </ScenePanel>
        );
      })}
    </>
  );
}
