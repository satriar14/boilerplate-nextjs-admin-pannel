/**
 * Theme utility functions
 */

export const getStoredTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  // Default to light mode
  return 'light';
};

export const setStoredTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
};

export const applyTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') return;
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

