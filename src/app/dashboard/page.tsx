'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Tag } from 'antd';
import DataTable from '@/components/ui/DataTable';
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/lib/redux/hooks';
import { getEffectiveTheme } from '@/utils/theme';
import dayjs from 'dayjs';
import PageTransition from '@/components/animations/PageTransition';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

const { Title } = Typography;

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const theme = getEffectiveTheme(themeMode);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Mock data for recent activities
  const recentActivities = [
    {
      key: '1',
      action: 'User Created',
      user: 'John Doe',
      time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
      status: 'success',
    },
    {
      key: '2',
      action: 'User Updated',
      user: 'Jane Smith',
      time: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
      status: 'success',
    },
    {
      key: '3',
      action: 'User Deleted',
      user: 'Bob Johnson',
      time: dayjs().subtract(3, 'hours').format('YYYY-MM-DD HH:mm'),
      status: 'error',
    },
  ];

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      ellipsis: true,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      ellipsis: true,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      className: isMobile ? 'hidden' : '', // Hide on mobile
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? 'Success' : 'Error'}
        </Tag>
      ),
    },
  ];

  return (
    <PageTransition>
      <div>
        <Title 
          level={2} 
          className="text-gray-900 dark:text-gray-100"
        >
          Dashboard
        </Title>
        <p 
          className="text-gray-900 dark:text-gray-300 mb-6"
          style={{
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : '#374151',
          }}
        >
          Welcome back, {user?.name || 'User'}!
        </p>

        <StaggerContainer>
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <StaggerItem>
                <Card>
                  <Statistic
                    title="Total Users"
                    value={1128}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </StaggerItem>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StaggerItem>
                <Card>
                  <Statistic
                    title="Active Users"
                    value={893}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </StaggerItem>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StaggerItem>
                <Card>
                  <Statistic
                    title="Completed Tasks"
                    value={234}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </StaggerItem>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StaggerItem>
                <Card>
                  <Statistic
                    title="Pending Tasks"
                    value={45}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </StaggerItem>
            </Col>
          </Row>

          <StaggerItem>
            <DataTable
              columns={columns}
              dataSource={recentActivities}
              pagination={false}
              showColumnVisibility={true}
              showSearch={true}
              searchableColumns={["action", "user"]}
              searchPlaceholder="Search activities..."
              title="Recent Activities"
              className="mt-6"
            />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}

