"use client";

import { useRouter, usePathname } from "next/navigation";
import { Layout, Switch, Dropdown, Avatar, Space, Segmented, Breadcrumb } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { setTheme, toggleTheme } from "@/lib/redux/slices/uiSlice";
import { getEffectiveTheme } from "@/utils/theme";
import { getLuminance } from "@/lib/utils/colorUtils";
import { FaLaptop } from "react-icons/fa";

const { Header: AntHeader } = Layout;

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const { isCustomThemeActive, colors: customColors } = useAppSelector(
    (state) => state.themeGenerator
  );
  
  // Get effective theme (resolves 'system' to actual light/dark)
  const theme = getEffectiveTheme(themeMode);

  // Generate breadcrumb items from pathname
  const getBreadcrumbItems = () => {
    if (!pathname) return [];
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const items = [
      {
        title: (
          <a 
            href="/dashboard" 
            onClick={(e) => { e.preventDefault(); router.push('/dashboard'); }}
            style={{ color: getTextColor(), opacity: 0.7 }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          >
            <HomeOutlined /> Home
          </a>
        ),
      },
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Format segment name
      const segmentName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      items.push({
        title: isLast ? (
          <span style={{ color: getTextColor() }}>{segmentName}</span>
        ) : (
          <a 
            href={currentPath} 
            onClick={(e) => { e.preventDefault(); router.push(currentPath); }}
            style={{ color: getTextColor(), opacity: 0.7 }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          >
            {segmentName}
          </a>
        ),
      });
    });

    return items;
  };

  // Use custom primary color for header background if custom theme is active
  const headerBg = isCustomThemeActive 
    ? customColors.primary 
    : theme === "dark" 
    ? "#101828" 
    : "#ffffff";
  
  // Determine text color based on background brightness
  const getTextColor = () => {
    if (!isCustomThemeActive) {
      return theme === "dark" ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.88)";
    }
    // If using custom primary color, check luminance to determine text color
    const luminance = getLuminance(customColors.primary);
    return luminance > 0.5 ? "rgba(0, 0, 0, 0.88)" : "rgba(255, 255, 255, 0.85)";
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "theme",
      label: (
        <div 
          className="w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Segmented
            value={themeMode}
            onChange={(value) => dispatch(setTheme(value as "light" | "dark" | "system"))}
            options={[
              {
                label: (
                  <div className="flex items-center gap-1 px-1">
                    <SunOutlined />
                    <span className="hidden sm:inline">Light</span>
                  </div>
                ),
                value: "light",
              },
              {
                label: (
                  <div className="flex items-center gap-1 px-1">
                    <MoonOutlined />
                    <span className="hidden sm:inline">Dark</span>
                  </div>
                ),
                value: "dark",
              },
              {
                label: (
                  <div className="flex items-center gap-1 px-1">
                    <FaLaptop />
                    <span className="hidden sm:inline">System</span>
                  </div>
                ),
                value: "system",
              },
            ]}
            size="small"
            className="w-full"
          />
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => {
        // Navigate to profile page
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Don't show breadcrumb on auth pages
  const showBreadcrumb = pathname && !pathname.startsWith('/auth');

  return (
    <AntHeader
      className="border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between shadow-sm backdrop-blur-sm"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: headerBg,
        color: getTextColor(),
      }}>
      {showBreadcrumb && (
        <Breadcrumb
          items={getBreadcrumbItems()}
          className="flex-1"
          style={{
            color: getTextColor(),
          }}
        />
      )}
      {!showBreadcrumb && <div className="flex-1" />}
      <Space size="middle" align="center">
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <span
              className="hidden sm:inline font-medium"
              style={{
                color: getTextColor(),
              }}>
              {user?.name || "User"}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
