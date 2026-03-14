/**
 * commands.ts — Terminal command definitions.
 *
 * ✏️  You can add custom commands here.
 *     Each command has a name, description, and handler that returns output lines.
 */

import about from './about';
import projects from './projects';
import experience from './experience';
import profiles from './profiles';

export interface CommandResult {
  lines: { text: string; color?: string }[];
  action?: 'open-panel' | 'open-url' | 'clear' | 'theme';
  actionPayload?: string;
}

export type CommandHandler = (args: string[]) => CommandResult;

function line(text: string, color?: string) {
  return { text, color };
}

const commands: Record<string, { description: string; handler: CommandHandler }> = {
  help: {
    description: 'Show available commands',
    handler: () => ({
      lines: [
        line('Available commands:', '#818cf8'),
        line(''),
        ...Object.entries(commands).map(([name, cmd]) =>
          line(`  ${name.padEnd(20)} ${cmd.description}`, '#94a3b8')
        ),
        line(''),
        line('Tip: Use ↑/↓ arrows for command history', '#64748b'),
      ],
    }),
  },

  whoami: {
    description: 'Display identity info',
    handler: () => ({
      lines: [
        line(`  ${about.fullName}`, '#22d3ee'),
        line(`  ${about.title}`, '#818cf8'),
        line(`  ${about.subtitle}`, '#94a3b8'),
        line(`  ${about.location}`, '#64748b'),
        line(''),
        line(`  ${about.bio}`, '#cbd5e1'),
      ],
    }),
  },

  'ls': {
    description: 'List items (usage: ls projects | ls experience | ls profiles)',
    handler: (args) => {
      const target = args[0];
      if (target === 'projects') {
        return {
          lines: [
            line('📂 Projects:', '#818cf8'),
            line(''),
            ...projects.map((p) =>
              line(`  ${p.featured ? '★' : '○'} ${p.id.padEnd(24)} ${p.description}`, p.featured ? '#22d3ee' : '#94a3b8')
            ),
          ],
          action: 'open-panel',
          actionPayload: 'projects',
        };
      }
      if (target === 'experience') {
        return {
          lines: [
            line('📋 Experience:', '#818cf8'),
            line(''),
            ...experience.map((e) =>
              line(`  ${e.period.padEnd(24)} ${e.role} @ ${e.company}`, '#94a3b8')
            ),
          ],
          action: 'open-panel',
          actionPayload: 'experience',
        };
      }
      if (target === 'profiles') {
        return {
          lines: [
            line('🔗 Profiles:', '#818cf8'),
            line(''),
            ...profiles.map((p) =>
              line(`  ${p.icon} ${p.platform.padEnd(16)} ${p.username}`, '#94a3b8')
            ),
          ],
          action: 'open-panel',
          actionPayload: 'profiles',
        };
      }
      return {
        lines: [
          line('Usage: ls [projects|experience|profiles]', '#f59e0b'),
        ],
      };
    },
  },

  cat: {
    description: 'View details (usage: cat project <id>)',
    handler: (args) => {
      if (args[0] === 'project' && args[1]) {
        const proj = projects.find((p) => p.id === args[1]);
        if (!proj) return { lines: [line(`Project "${args[1]}" not found.`, '#ef4444')] };
        return {
          lines: [
            line(`╔═══ ${proj.title} ═══╗`, '#22d3ee'),
            line(''),
            line(proj.longDescription || proj.description, '#cbd5e1'),
            line(''),
            line(`Tech: ${proj.techStack.join(' · ')}`, '#818cf8'),
            ...(proj.githubUrl ? [line(`GitHub: ${proj.githubUrl}`, '#64748b')] : []),
            ...(proj.liveUrl ? [line(`Live: ${proj.liveUrl}`, '#64748b')] : []),
          ],
          action: 'open-panel',
          actionPayload: 'projects',
        };
      }
      return { lines: [line('Usage: cat project <id>', '#f59e0b')] };
    },
  },

  open: {
    description: 'Open a panel or URL (usage: open github | open linkedin | open <panel>)',
    handler: (args) => {
      const target = args[0]?.toLowerCase();
      const profile = profiles.find((p) => p.id === target || p.platform.toLowerCase() === target);
      if (profile) {
        return {
          lines: [line(`Opening ${profile.platform}...`, '#22d3ee')],
          action: 'open-url',
          actionPayload: profile.url,
        };
      }
      const panels = ['about', 'terminal', 'experience', 'projects', 'skills', 'profiles', 'contact'];
      if (panels.includes(target)) {
        return {
          lines: [line(`Opening ${target}...`, '#22d3ee')],
          action: 'open-panel',
          actionPayload: target,
        };
      }
      return { lines: [line(`Unknown target: "${target}"`, '#ef4444')] };
    },
  },

  skills: {
    description: 'Show skills constellation',
    handler: () => ({
      lines: [line('Opening skills constellation...', '#22d3ee')],
      action: 'open-panel',
      actionPayload: 'skills',
    }),
  },

  contact: {
    description: 'Open contact panel',
    handler: () => ({
      lines: [line('Opening contact...', '#22d3ee')],
      action: 'open-panel',
      actionPayload: 'contact',
    }),
  },

  theme: {
    description: 'Switch theme (usage: theme cyberpunk|midnight|matrix|ocean)',
    handler: (args) => {
      const themes = ['cyberpunk', 'midnight', 'matrix', 'ocean'];
      const t = args[0]?.toLowerCase();
      if (!t || !themes.includes(t)) {
        return { lines: [line(`Available themes: ${themes.join(', ')}`, '#f59e0b')] };
      }
      return {
        lines: [line(`Switching to ${t} theme...`, '#22d3ee')],
        action: 'theme',
        actionPayload: t,
      };
    },
  },

  clear: {
    description: 'Clear terminal output',
    handler: () => ({ lines: [], action: 'clear' }),
  },

  neofetch: {
    description: 'System info (easter egg)',
    handler: () => ({
      lines: [
        line(''),
        line('    ╔══╗  ╔══╗     ', '#818cf8'),
        line('    ║  ║  ║  ║     ', '#818cf8'),
        line('    ║  ╠══╣  ║     OS:     Nexus v2.1.0', '#818cf8'),
        line('    ║  ║  ║  ║     Host:   Browser / WebGL', '#818cf8'),
        line('    ╚══╝  ╚══╝     Kernel: React Three Fiber', '#818cf8'),
        line('                   Shell:  nexus-terminal', '#94a3b8'),
        line(`                   User:   ${about.fullName}`, '#94a3b8'),
        line('                   Engine: Three.js r160', '#94a3b8'),
        line('                   Track:  MediaPipe Face Mesh', '#94a3b8'),
        line('                   UI:     Framer Motion + Zustand', '#94a3b8'),
        line('                   Theme:  Cyberpunk', '#94a3b8'),
        line(''),
      ],
    }),
  },

  'sudo': {
    description: '🤫',
    handler: (args) => {
      if (args.join(' ').toLowerCase() === 'hire me') {
        return {
          lines: [
            line(''),
            line('  ✅ PERMISSION GRANTED', '#22c55e'),
            line(''),
            line('  Excellent decision.', '#22d3ee'),
            line(`  Reach me at: ${about.email}`, '#818cf8'),
            line('  Or download my resume from the About panel.', '#94a3b8'),
            line(''),
          ],
        };
      }
      return { lines: [line(`sudo: command not found: ${args.join(' ')}`, '#ef4444')] };
    },
  },
};

export default commands;
