'use client';

import { Card, Typography, Switch, Space, Divider, Radio } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { FaLaptop } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setTheme, setSidebarCollapsed } from '@/lib/redux/slices/uiSlice';
import { getEffectiveTheme } from '@/utils/theme';
import PageTransition from '@/components/animations/PageTransition';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

const { Title, Text } = Typography;

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { theme: themeMode, sidebarCollapsed } = useAppSelector((state) => state.ui);
  const effectiveTheme = getEffectiveTheme(themeMode);

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
          <div>
            <div className="mb-3">
              <Text strong className="text-gray-900 dark:text-gray-100">Theme</Text>
              <br />
              <Text className="text-gray-600 dark:text-gray-400">
                Choose your preferred theme. System theme follows your device settings.
              </Text>
            </div>
            <Radio.Group
              value={themeMode}
              onChange={(e) => dispatch(setTheme(e.target.value))}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                <Radio value="light">
                  <Space>
                    <SunOutlined />
                    <span>Light Mode</span>
                  </Space>
                </Radio>
                <Radio value="dark">
                  <Space>
                    <MoonOutlined />
                    <span>Dark Mode</span>
                  </Space>
                </Radio>
                <Radio value="system">
                  <Space>
                    <FaLaptop />
                    <span>System Theme {effectiveTheme === 'dark' ? '(Dark)' : '(Light)'}</span>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
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

