'use client';

import { Spin } from 'antd';
import { useAppSelector } from '@/lib/redux/hooks';
import { getEffectiveTheme } from '@/utils/theme';

export default function LoadingSpinner() {
  const { loading, loadingMessage } = useAppSelector((state) => state.ui);
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const { isCustomThemeActive, colors: customColors } = useAppSelector(
    (state) => state.themeGenerator
  );
  const theme = getEffectiveTheme(themeMode);

  if (!loading) return null;

  // Determine background colors based on theme
  const overlayBg = theme === 'dark' 
    ? 'rgba(0, 0, 0, 0.75)' 
    : 'rgba(0, 0, 0, 0.5)';
  
  const cardBg = isCustomThemeActive
    ? (theme === 'dark' ? customColors.surface : customColors.background)
    : theme === 'dark'
    ? '#1f1f1f'
    : '#ffffff';

  const textColor = isCustomThemeActive
    ? (theme === 'dark' ? customColors.textBody : customColors.textHeading)
    : theme === 'dark'
    ? 'rgba(255, 255, 255, 0.85)'
    : '#374151';

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: overlayBg }}
    >
      <div 
        className="p-6 rounded-lg shadow-lg text-center"
        style={{ 
          backgroundColor: cardBg,
          color: textColor,
        }}
      >
        <Spin size="large" />
        {loadingMessage && (
          <p className="mt-4" style={{ color: textColor }}>
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
}

