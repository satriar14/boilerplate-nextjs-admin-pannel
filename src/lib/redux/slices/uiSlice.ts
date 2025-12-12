import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setStoredTheme, applyTheme } from '@/utils/theme';

interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  loadingMessage?: string;
}

// Always start with 'light' theme for SSR consistency
// Theme will be updated on client-side after hydration
const initialState: UiState = {
  sidebarCollapsed: false,
  theme: 'light',
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
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      setStoredTheme(action.payload);
      applyTheme(action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      setStoredTheme(newTheme);
      applyTheme(newTheme);
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

