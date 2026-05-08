'use client';
/**
 * useThemeColors.ts — Reads CSS custom properties and provides hex colors
 * for Three.js components that can't use CSS variables directly.
 *
 * Re-reads when the theme changes in the settings store.
 */

import { useMemo } from 'react';
import { useSettings } from '@/hooks/useSettings';

export interface ThemeColors {
  accent: string;
  accentMid: string;
  accentDeep: string;
  accentR: number;
  accentG: number;
  accentB: number;
}

const themeMap: Record<string, ThemeColors> = {
  indigo: {
    accent: '#818cf8', accentMid: '#6366f1', accentDeep: '#4f46e5',
    accentR: 129, accentG: 140, accentB: 248,
  },
  emerald: {
    accent: '#34d399', accentMid: '#10b981', accentDeep: '#059669',
    accentR: 52, accentG: 211, accentB: 153,
  },
  rose: {
    accent: '#fb7185', accentMid: '#f43f5e', accentDeep: '#e11d48',
    accentR: 251, accentG: 113, accentB: 133,
  },
  amber: {
    accent: '#fbbf24', accentMid: '#f59e0b', accentDeep: '#d97706',
    accentR: 251, accentG: 191, accentB: 36,
  },
  cyan: {
    accent: '#22d3ee', accentMid: '#06b6d4', accentDeep: '#0891b2',
    accentR: 34, accentG: 211, accentB: 238,
  },
};

export function useThemeColors(): ThemeColors {
  const theme = useSettings((s) => s.theme);
  return useMemo(() => themeMap[theme] ?? themeMap.indigo, [theme]);
}

/**
 * Non-hook helper to get theme colors by name (for data files, etc.)
 */
export function getThemeColors(theme: string): ThemeColors {
  return themeMap[theme] ?? themeMap.indigo;
}
