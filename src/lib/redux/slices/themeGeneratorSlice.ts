import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateColorHarmony } from '@/lib/utils/colorUtils';
import { saveCustomTheme, loadCustomTheme, applyCustomThemeColors, clearCustomTheme } from '@/utils/customTheme';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textHeading: string;
  textBody: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export type ThemeType = 'light' | 'dark' | 'modern' | 'corporate' | 'vibrant' | 'minimal' | 'custom';

export interface ThemeGeneratorState {
  colors: ThemeColors;
  harmonyType: 'complementary' | 'analogous' | 'triadic';
  autoGenerate: boolean;
  isCustomThemeActive: boolean;
  themeType: ThemeType;
}

const defaultColors: ThemeColors = {
  primary: '#1890ff',
  secondary: '#52c41a',
  accent: '#faad14',
  background: '#ffffff',
  surface: '#f5f5f5',
  textHeading: '#111827',
  textBody: '#374151',
  success: '#52c41a',
  error: '#ff4d4f',
  warning: '#faad14',
  info: '#1890ff',
};

// Theme presets
export const themePresets: Record<ThemeType, ThemeColors> = {
  light: {
    primary: '#1890ff',
    secondary: '#52c41a',
    accent: '#faad14',
    background: '#ffffff',
    surface: '#f5f5f5',
    textHeading: '#111827',
    textBody: '#374151',
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    info: '#1890ff',
  },
  dark: {
    primary: '#1890ff',
    secondary: '#52c41a',
    accent: '#faad14',
    background: '#0a0a0a',
    surface: '#141414',
    textHeading: '#ffffff',
    textBody: 'rgba(255, 255, 255, 0.85)',
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#faad14',
    info: '#1890ff',
  },
  modern: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#ffffff',
    surface: '#f8fafc',
    textHeading: '#0f172a',
    textBody: '#475569',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  corporate: {
    primary: '#1e40af',
    secondary: '#64748b',
    accent: '#0ea5e9',
    background: '#ffffff',
    surface: '#f1f5f9',
    textHeading: '#0f172a',
    textBody: '#334155',
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
    info: '#0284c7',
  },
  vibrant: {
    primary: '#f59e0b',
    secondary: '#ec4899',
    accent: '#8b5cf6',
    background: '#ffffff',
    surface: '#fef3c7',
    textHeading: '#1f2937',
    textBody: '#4b5563',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  minimal: {
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#9ca3af',
    background: '#ffffff',
    surface: '#f9fafb',
    textHeading: '#111827',
    textBody: '#6b7280',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#6b7280',
  },
  custom: defaultColors,
};

// Load saved custom theme or use defaults
// Note: This runs on both server and client, but applyCustomThemeColors will be called
// in loadSavedTheme reducer which only runs on client
const savedTheme = typeof window !== 'undefined' ? loadCustomTheme() : null;
const initialColors = savedTheme || defaultColors;

const initialState: ThemeGeneratorState = {
  colors: initialColors,
  harmonyType: 'complementary',
  autoGenerate: true,
  isCustomThemeActive: !!savedTheme, // Only active if there's a saved theme
  themeType: 'custom',
};

const themeGeneratorSlice = createSlice({
  name: 'themeGenerator',
  initialState,
  reducers: {
    setColor: (
      state,
      action: PayloadAction<{ key: keyof ThemeColors; value: string }>
    ) => {
      state.colors[action.payload.key] = action.payload.value;
      // When manually changing colors, set theme type to custom
      state.themeType = 'custom';

      // Auto-generate harmony colors if enabled
      if (state.autoGenerate && action.payload.key === 'primary') {
        const harmony = generateColorHarmony(
          action.payload.value,
          state.harmonyType
        );
        state.colors.secondary = harmony.secondary;
        state.colors.accent = harmony.accent;
      }
    },
    setColors: (state, action: PayloadAction<Partial<ThemeColors>>) => {
      state.colors = { ...state.colors, ...action.payload };
      // When manually changing colors, set theme type to custom
      state.themeType = 'custom';
    },
    setHarmonyType: (
      state,
      action: PayloadAction<'complementary' | 'analogous' | 'triadic'>
    ) => {
      state.harmonyType = action.payload;
      if (state.autoGenerate) {
        const harmony = generateColorHarmony(
          state.colors.primary,
          action.payload
        );
        state.colors.secondary = harmony.secondary;
        state.colors.accent = harmony.accent;
      }
    },
    setAutoGenerate: (state, action: PayloadAction<boolean>) => {
      state.autoGenerate = action.payload;
    },
    resetColors: (state) => {
      state.colors = defaultColors;
      state.isCustomThemeActive = false;
      state.autoGenerate = true; // Reset to default
      state.harmonyType = 'complementary'; // Reset to default
      state.themeType = 'custom'; // Reset to default
      if (typeof window !== 'undefined') {
        // Clear saved theme from localStorage and apply default colors
        clearCustomTheme();
        applyCustomThemeColors(defaultColors);
      }
    },
    saveTheme: (state) => {
      if (typeof window !== 'undefined') {
        saveCustomTheme(state.colors);
        applyCustomThemeColors(state.colors);
        state.isCustomThemeActive = true;
      }
    },
    loadSavedTheme: (state) => {
      if (typeof window !== 'undefined') {
        const saved = loadCustomTheme();
        if (saved) {
          state.colors = saved;
          state.isCustomThemeActive = true;
          applyCustomThemeColors(saved);
        } else {
          // If no saved theme, apply default colors (same as reset)
          state.colors = defaultColors;
          state.isCustomThemeActive = false;
          state.autoGenerate = true;
          state.harmonyType = 'complementary';
          state.themeType = 'custom';
          applyCustomThemeColors(defaultColors);
        }
      }
    },
    setThemeType: (state, action: PayloadAction<ThemeType>) => {
      state.themeType = action.payload;
      if (action.payload !== 'custom') {
        const preset = themePresets[action.payload];
        state.colors = { ...preset };
        if (typeof window !== 'undefined') {
          applyCustomThemeColors(preset);
        }
      }
    },
  },
});

export const {
  setColor,
  setColors,
  setHarmonyType,
  setAutoGenerate,
  resetColors,
  saveTheme,
  loadSavedTheme,
  setThemeType,
} = themeGeneratorSlice.actions;
export default themeGeneratorSlice.reducer;

