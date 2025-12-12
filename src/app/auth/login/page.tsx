'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCredentials } from '@/lib/redux/slices/authSlice';
import { authApi } from '@/lib/api/auth';
import { setLoading } from '@/lib/redux/slices/uiSlice';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loading, setLocalLoading] = useState(false);

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Get redirect parameter from URL or default to dashboard
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect') || '/dashboard';
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLocalLoading(true);
      dispatch(setLoading({ loading: true, message: 'Logging in...' }));

      const response = await authApi.login(values);
      
      dispatch(setCredentials({ user: response.user, token: response.token }));
      dispatch(setLoading({ loading: false }));
      
      message.success('Login successful!');
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      message.error(error?.message || 'Login failed. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2}>Admin Panel</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text type="secondary">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}

