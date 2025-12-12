'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Spin } from 'antd';
import { useAppSelector } from '@/lib/redux/hooks';
import { getEffectiveTheme } from '@/utils/theme';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from '../ui/LoadingSpinner';

const { Content } = Layout;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { sidebarCollapsed, theme: themeMode } = useAppSelector((state) => state.ui);
  const { isCustomThemeActive, colors: customColors } = useAppSelector(
    (state) => state.themeGenerator
  );
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Get effective theme (resolves 'system' to actual light/dark)
  const theme = getEffectiveTheme(themeMode);

  // User is loaded in ClientInit component

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Check authentication after a brief moment to allow state to sync
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const hasToken = token || localStorage.getItem('token');
        const isAuthPage = pathname?.startsWith('/auth');
        
        if (hasToken && isAuthPage) {
          // If authenticated and on auth page, redirect to dashboard
          const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
          router.replace(redirectTo);
        } else if (!hasToken && !isAuthPage) {
          // If not authenticated and on protected page, redirect to login
          router.replace('/auth/login');
        }
        setIsChecking(false);
      }
    };

    // Small delay to ensure Redux state is synced
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, token, router, pathname, mounted]);

  // Don't render protected layout for auth pages
  if (pathname?.startsWith('/auth')) {
    return <>{children}</>;
  }

  // Don't render protected layout for not-found page
  // Define all valid routes in the application (exact matches only, no sub-routes)
  const validExactRoutes = [
    '/dashboard',
    '/users',
    '/settings',
    '/settings/theme',
  ];
  
  // Check if current pathname is a valid exact route
  const isValidExactRoute = pathname && validExactRoutes.includes(pathname);
  
  // Root route (/) redirects to dashboard, so we allow it but it will redirect
  const isRootRoute = pathname === '/';
  
  // If pathname exists but is not a valid exact route and not root and not auth, it's 404
  // Render children without ProtectedLayout (this will show not-found page)
  // Only check after mounted to avoid SSR issues
  if (mounted && pathname && !isValidExactRoute && !isRootRoute && !pathname.startsWith('/auth')) {
    // This is a 404 - render without layout
    return <>{children}</>;
  }

  // During SSR, render empty div to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900" suppressHydrationWarning>
        <div />
      </div>
    );
  }

  // Show loading while checking authentication (only on client after mount)
  if (isChecking || (!isAuthenticated && !token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-500 dark:bg-gray-900">
      <Sidebar />
      <Layout
        className="bg-gray-50 dark:bg-gray-900 h-screen"
        style={{
          marginLeft: sidebarCollapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header />
        <Content 
          className="p-6 text-gray-900 dark:text-gray-100"
          style={{
            backgroundColor: 'transparent',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isCustomThemeActive 
                ? (theme === 'dark' ? customColors.surface : customColors.background)
                : theme === 'dark' 
                ? '#f9fafb' 
                : '#f9fafb',
              filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none',
              zIndex: 0,
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <LoadingSpinner />
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

