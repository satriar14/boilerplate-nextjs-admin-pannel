"use client";

import { useRouter } from "next/navigation";
import { Layout, Switch, Dropdown, Avatar, Space } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { toggleTheme } from "@/lib/redux/slices/uiSlice";
import { getLuminance } from "@/lib/utils/colorUtils";

const { Header: AntHeader } = Layout;

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);
  const { isCustomThemeActive, colors: customColors } = useAppSelector(
    (state) => state.themeGenerator
  );

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
      <div className="flex-1" />
      <Space size="middle" align="center">
        <Space size="small" align="center">
          <Switch
            checked={theme === "dark"}
            onChange={() => dispatch(toggleTheme())}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            size="default"
          />
          
        </Space>
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
