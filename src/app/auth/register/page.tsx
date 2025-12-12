'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCredentials } from '@/lib/redux/slices/authSlice';
import { authApi } from '@/lib/api/auth';
import { setLoading } from '@/lib/redux/slices/uiSlice';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loading, setLocalLoading] = useState(false);

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setLocalLoading(true);
      dispatch(setLoading({ loading: true, message: 'Creating account...' }));

      const response = await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      dispatch(setCredentials({ user: response.user, token: response.token }));
      dispatch(setLoading({ loading: false }));

      message.success('Registration successful!');
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      message.error(error?.message || 'Registration failed. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2}>Create Account</Title>
          <Text type="secondary">Sign up for a new account</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Full Name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text type="secondary">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}

