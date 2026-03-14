'use client';
/**
 * useTerminal.ts — Terminal state hook.
 *
 * Manages command history, input, output, and command execution.
 */

import { useState, useCallback, useRef } from 'react';
import commands, { type CommandResult } from '@/data/commands';
import { usePanelManager } from './usePanelManager';

interface TerminalLine {
  text: string;
  color?: string;
  isInput?: boolean;
}

export function useTerminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'NEXUS Terminal v2.1.0', color: '#818cf8' },
    { text: 'Type "help" for available commands.', color: '#64748b' },
    { text: '' },
  ]);
  const [input, setInput] = useState('');
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  const { openPanel, focusPanel, setTheme } = usePanelManager();

  const executeCommand = useCallback((rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    commandHistory.current.unshift(trimmed);
    historyIndex.current = -1;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const inputLine: TerminalLine = { text: `❯ ${trimmed}`, color: '#22d3ee', isInput: true };

    const handler = commands[cmd];
    let result: CommandResult;

    if (handler) {
      result = handler.handler(args);
    } else {
      result = {
        lines: [{ text: `Command not found: ${cmd}. Type "help" for available commands.`, color: '#ef4444' }],
      };
    }

    // Handle actions
    if (result.action === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (result.action === 'open-panel' && result.actionPayload) {
      const panelId = result.actionPayload;
      // Use setTimeout so the panel opens after render
      setTimeout(() => {
        openPanel(panelId as Parameters<typeof openPanel>[0]);
        focusPanel(panelId as Parameters<typeof focusPanel>[0]);
      }, 300);
    }

    if (result.action === 'open-url' && result.actionPayload) {
      setTimeout(() => window.open(result.actionPayload, '_blank'), 300);
    }

    if (result.action === 'theme' && result.actionPayload) {
      setTheme(result.actionPayload);
    }

    setHistory((prev) => [...prev, inputLine, ...result.lines, { text: '' }]);
    setInput('');
  }, [openPanel, focusPanel, setTheme]);

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    const cmds = commandHistory.current;
    if (cmds.length === 0) return;

    if (direction === 'up') {
      const next = Math.min(historyIndex.current + 1, cmds.length - 1);
      historyIndex.current = next;
      setInput(cmds[next]);
    } else {
      const next = historyIndex.current - 1;
      if (next < 0) {
        historyIndex.current = -1;
        setInput('');
      } else {
        historyIndex.current = next;
        setInput(cmds[next]);
      }
    }
  }, []);

  const getAutocomplete = useCallback((partial: string): string | null => {
    const matches = Object.keys(commands).filter((c) => c.startsWith(partial.toLowerCase()));
    return matches.length === 1 ? matches[0] : null;
  }, []);

  return { history, input, setInput, executeCommand, navigateHistory, getAutocomplete };
}
