/**
 * Custom theme utilities for saving and applying generated themes
 */

import { ThemeColors } from '@/lib/redux/slices/themeGeneratorSlice';

const CUSTOM_THEME_KEY = 'customTheme';

export interface SavedCustomTheme {
  colors: ThemeColors;
  savedAt: string;
}

/**
 * Save custom theme to localStorage
 */
export function saveCustomTheme(colors: ThemeColors): void {
  if (typeof window === 'undefined') return;

  const themeData: SavedCustomTheme = {
    colors,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(themeData));
}

/**
 * Load custom theme from localStorage
 */
export function loadCustomTheme(): ThemeColors | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CUSTOM_THEME_KEY);
  if (!stored) return null;

  try {
    const themeData: SavedCustomTheme = JSON.parse(stored);
    return themeData.colors;
  } catch {
    return null;
  }
}

/**
 * Clear custom theme
 */
export function clearCustomTheme(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CUSTOM_THEME_KEY);
}

/**
 * Apply custom theme colors to document root CSS variables
 */
export function applyCustomThemeColors(colors: ThemeColors): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--custom-primary', colors.primary);
  root.style.setProperty('--custom-secondary', colors.secondary);
  root.style.setProperty('--custom-accent', colors.accent);
  root.style.setProperty('--custom-background', colors.background);
  root.style.setProperty('--custom-surface', colors.surface);
  root.style.setProperty('--custom-text-heading', colors.textHeading);
  root.style.setProperty('--custom-text-body', colors.textBody);
  root.style.setProperty('--custom-success', colors.success);
  root.style.setProperty('--custom-error', colors.error);
  root.style.setProperty('--custom-warning', colors.warning);
  root.style.setProperty('--custom-info', colors.info);
}

