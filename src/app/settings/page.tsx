'use client';

import { Card, Typography, Switch, Space, Divider } from 'antd';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setTheme, setSidebarCollapsed } from '@/lib/redux/slices/uiSlice';
import PageTransition from '@/components/animations/PageTransition';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

const { Title, Text } = Typography;

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { theme, sidebarCollapsed } = useAppSelector((state) => state.ui);

  return (
    <PageTransition>
      <div>
        <Title 
          level={2} 
          className="text-gray-900 dark:text-gray-100"
        >
          Settings
        </Title>

        <StaggerContainer>
          <StaggerItem>
            <Card title="Appearance" className="mb-4">
        <Space direction="vertical" className="w-full">
          <div className="flex justify-between items-center">
            <div>
              <Text strong className="text-gray-900 dark:text-gray-100">Theme</Text>
              <br />
              <Text className="text-gray-600 dark:text-gray-400">Switch between light and dark mode</Text>
            </div>
            <Switch
              checked={theme === 'dark'}
              onChange={(checked) =>
                dispatch(setTheme(checked ? 'dark' : 'light'))
              }
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </div>

          <Divider />

          <div className="flex justify-between items-center">
            <div>
              <Text strong className="text-gray-900 dark:text-gray-100">Sidebar</Text>
              <br />
              <Text className="text-gray-600 dark:text-gray-400">Toggle sidebar collapsed state</Text>
            </div>
            <Switch
              checked={!sidebarCollapsed}
              onChange={(checked) => dispatch(setSidebarCollapsed(!checked))}
              checkedChildren="Expanded"
              unCheckedChildren="Collapsed"
            />
            </div>
          </Space>
        </Card>
        </StaggerItem>

        <StaggerItem>
          <Card title="Account">
            <Space direction="vertical" className="w-full">
              <div>
                <Text strong className="text-gray-900 dark:text-gray-100">Account Information</Text>
                <br />
                <Text className="text-gray-600 dark:text-gray-400">Manage your account settings</Text>
              </div>
            </Space>
          </Card>
        </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}

