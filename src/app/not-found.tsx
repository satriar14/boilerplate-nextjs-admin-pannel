'use client';

import { useRouter } from 'next/navigation';
import { Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/lib/redux/hooks';
import { getEffectiveTheme } from '@/utils/theme';

export default function NotFound() {
  const router = useRouter();
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const { isCustomThemeActive, colors: customColors } = useAppSelector(
    (state) => state.themeGenerator
  );
  const theme = getEffectiveTheme(themeMode);

  const bgColor = isCustomThemeActive
    ? (theme === 'dark' ? customColors.background : customColors.surface)
    : theme === 'dark'
    ? '#0a0a0a'
    : '#f9fafb';

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button 
            type="primary" 
            icon={<HomeOutlined />}
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
}

