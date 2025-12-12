/**
 * Theme utility functions
 */

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Get system theme preference (light or dark)
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Get effective theme (resolves 'system' to actual light/dark)
 */
export const getEffectiveTheme = (theme: ThemeMode): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored as ThemeMode;
  }
  
  // Default to system theme
  return 'system';
};

export const setStoredTheme = (theme: ThemeMode): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
};

export const applyTheme = (theme: ThemeMode): void => {
  if (typeof window === 'undefined') return;
  
  const effectiveTheme = getEffectiveTheme(theme);
  
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Listen to system theme changes
 */
export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches ? 'dark' : 'light');
  };
  
  // Call immediately with current value
  handleChange(mediaQuery);
  
  // Listen for changes
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }
};

