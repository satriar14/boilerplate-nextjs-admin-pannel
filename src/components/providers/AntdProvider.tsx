'use client';

import { ConfigProvider, theme, App } from 'antd';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { useEffect, useState } from 'react';
import { setTheme } from '@/lib/redux/slices/uiSlice';
import { getStoredTheme, applyTheme } from '@/utils/theme';
import { loadCustomTheme, applyCustomThemeColors } from '@/utils/customTheme';
import { loadSavedTheme } from '@/lib/redux/slices/themeGeneratorSlice';
import { hexToRgba } from '@/lib/utils/colorUtils';

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.ui.theme);
  const customThemeColors = useAppSelector((state) => state.themeGenerator.colors);
  const isCustomThemeActive = useAppSelector((state) => state.themeGenerator.isCustomThemeActive);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize theme from localStorage on mount
    // Default to 'light' if no theme is saved
    const savedTheme = getStoredTheme();
    dispatch(setTheme(savedTheme));
    applyTheme(savedTheme);
    
    // Load custom theme colors if available
    dispatch(loadSavedTheme());
    const customTheme = loadCustomTheme();
    if (customTheme) {
      applyCustomThemeColors(customTheme);
    }
  }, [dispatch]);

  useEffect(() => {
    if (mounted) {
      // Apply theme class to html element whenever theme changes
      applyTheme(currentTheme);
    }
  }, [currentTheme, mounted]);

  // Use default theme during SSR to prevent hydration mismatch
  const themeToUse = mounted ? currentTheme : 'light';

  // Only use custom primary color for main elements (header, sidebar, button)
  // Keep other colors (text, background) using default theme
  const primaryColor = isCustomThemeActive ? customThemeColors.primary : '#1890ff';
  
  // Default theme colors (not affected by custom theme)
  const textColor = themeToUse === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)';
  const textHeadingColor = themeToUse === 'dark' ? 'rgba(255, 255, 255, 0.85)' : '#111827';
  const bgContainer = themeToUse === 'dark' ? '#141414' : '#ffffff';
  const bgElevated = themeToUse === 'dark' ? '#1f1f1f' : '#ffffff';

  return (
    <ConfigProvider
      theme={{
        algorithm: themeToUse === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: primaryColor, // Only primary color uses custom theme
          colorText: textColor,
          colorTextSecondary: themeToUse === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
          colorTextTertiary: themeToUse === 'dark' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
          colorBgContainer: bgContainer,
          colorBgElevated: bgElevated,
          colorSuccess: '#52c41a',
          colorError: '#ff4d4f',
          colorWarning: '#faad14',
          colorInfo: '#1890ff',
        },
        components: {
          Typography: {
            colorText: textHeadingColor,
            colorTextHeading: textHeadingColor,
            colorTextSecondary: themeToUse === 'dark' ? 'rgba(255, 255, 255, 0.65)' : '#374151',
          },
          Card: {
            colorTextHeading: textHeadingColor,
          },
          Layout: {
            headerBg: themeToUse === 'dark' ? '#101828' : '#ffffff',
            headerColor: textHeadingColor,
            bodyBg: themeToUse === 'dark' ? '#0a0a0a' : '#f9fafb',
          },
          Button: {
            colorPrimary: primaryColor, // Button uses custom primary color
          },
          Menu: {
            itemBg: isCustomThemeActive 
              ? primaryColor
              : undefined,
            itemSelectedBg: isCustomThemeActive 
              ? hexToRgba(primaryColor, 0.2) // 20% opacity of primary color
              : undefined,
            itemSelectedColor: isCustomThemeActive 
              ? primaryColor
              : undefined,
            itemHoverBg: isCustomThemeActive
              ? hexToRgba(primaryColor, 0.1) // 10% opacity of primary color
              : undefined,
            itemActiveBg: isCustomThemeActive
              ? hexToRgba(primaryColor, 0.3) // 30% opacity of primary color
              : undefined,
          },
        },
      }}
    >
      <div suppressHydrationWarning>
        {mounted ? (
          <App>
            {children}
          </App>
        ) : (
          <div suppressHydrationWarning>
            {children}
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

