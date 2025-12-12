'use client';

import { Typography } from 'antd';
import { useAppSelector } from '@/lib/redux/hooks';
import { getEffectiveTheme } from '@/utils/theme';

const { Title: AntTitle } = Typography;

interface PageTitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  style?: React.CSSProperties;
}

export default function PageTitle({
  children,
  level = 2,
  className = '',
  style,
}: PageTitleProps) {
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const { isCustomThemeActive, colors: customColors } = useAppSelector(
    (state) => state.themeGenerator
  );
  const theme = getEffectiveTheme(themeMode);

  // Determine text color based on theme
  const textColor = isCustomThemeActive
    ? customColors.textHeading
    : theme === 'dark'
    ? 'rgba(255, 255, 255, 0.85)'
    : '#111827';

  return (
    <AntTitle
      level={level}
      className={`${className} m-0`}
      style={{
        color: textColor,
        ...style,
      }}
    >
      {children}
    </AntTitle>
  );
}

