'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { toggleSidebar } from '@/lib/redux/slices/uiSlice';
import { getLuminance } from '@/lib/utils/colorUtils';
import { motion } from 'framer-motion';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: 'Users',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
  {
    key: '/settings/theme',
    icon: <SettingOutlined />,
    label: 'Theme Generator',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, theme } = useAppSelector((state) => state.ui);
  const { isCustomThemeActive, colors: customColors } = useAppSelector(
    (state) => state.themeGenerator
  );
  const isDark = theme === 'dark';

  // Use custom primary color for sidebar background if custom theme is active
  const sidebarBg = isCustomThemeActive 
    ? customColors.primary 
    : isDark 
    ? '#001529' 
    : '#f8f9fa';
  
  // Determine text color based on background brightness
  const getTextColorStyle = () => {
    if (!isCustomThemeActive) {
      return isDark ? 'text-white' : 'text-gray-900';
    }
    const luminance = getLuminance(customColors.primary);
    return luminance > 0.5 ? 'text-gray-900' : 'text-white';
  };
  
  const isLightBg = isCustomThemeActive 
    ? getLuminance(customColors.primary) > 0.5
    : !isDark;

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50 }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={200}
        theme={isLightBg ? 'light' : 'dark'}
        className={`h-screen ${
          isLightBg ? 'border-r border-gray-200 shadow-sm' : ''
        }`}
        style={{
          height: '100vh',
          backgroundColor: sidebarBg,
        }}
      >
      <div 
        className={`flex items-center justify-between p-4 h-16 border-b ${
          isCustomThemeActive 
            ? (getLuminance(customColors.primary) > 0.5 ? 'border-gray-200' : 'border-gray-700')
            : (isLightBg ? 'border-gray-200' : 'border-gray-700')
        }`}
        style={{
          backgroundColor: isCustomThemeActive 
            ? customColors.primary 
            : (isLightBg ? 'transparent' : 'transparent'),
        }}
      >
        {!sidebarCollapsed && (
          <h1 className={`text-lg font-bold m-0 ${getTextColorStyle()}`}>
            Admin Panel
          </h1>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`p-2 rounded transition-colors ${
            isLightBg
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-white hover:bg-gray-700'
          }`}
        >
          {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
      <div 
        style={{ 
          backgroundColor: sidebarBg,
          height: '100%',
        }}
      >
        <Menu
          style={{
            backgroundColor: 'transparent',
          }}
          theme={isLightBg ? 'light' : 'dark'}
          mode="inline"
          selectedKeys={[pathname || '/dashboard']}
          items={menuItems}
          onClick={handleMenuClick}
          className="custom-sidebar-menu"
        />
      </div>
      </Sider>
    </motion.div>
  );
}

