import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setStoredTheme, applyTheme, getSystemTheme } from '@/utils/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UiState {
  sidebarCollapsed: boolean;
  theme: ThemeMode;
  loading: boolean;
  loadingMessage?: string;
}

// Always start with 'light' theme for SSR consistency
// Theme will be updated on client-side after hydration
const initialState: UiState = {
  sidebarCollapsed: false,
  theme: 'system',
  loading: false,
  loadingMessage: undefined,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      setStoredTheme(action.payload);
      applyTheme(action.payload);
    },
    toggleTheme: (state) => {
      // Cycle through: system -> light -> dark -> system
      if (state.theme === 'system') {
        state.theme = 'light';
      } else if (state.theme === 'light') {
        state.theme = 'dark';
      } else {
        state.theme = 'system';
      }
      setStoredTheme(state.theme);
      applyTheme(state.theme);
    },
    setLoading: (state, action: PayloadAction<{ loading: boolean; message?: string }>) => {
      state.loading = action.payload.loading;
      state.loadingMessage = action.payload.message;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  toggleTheme,
  setLoading,
} = uiSlice.actions;
export default uiSlice.reducer;

