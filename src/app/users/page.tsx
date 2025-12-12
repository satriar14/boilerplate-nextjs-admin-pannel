'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  App,
  Popconfirm,
  Card,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setLoading } from '@/lib/redux/slices/uiSlice';
import { usersApi, User, CreateUserData, UpdateUserData } from '@/lib/api/users';
import dayjs from 'dayjs';
import PageTransition from '@/components/animations/PageTransition';

const { Title } = Typography;
const { Option } = Select;

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLocalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLocalLoading(true);
      dispatch(setLoading({ loading: true, message: 'Loading users...' }));
      const data = await usersApi.getAll();
      setUsers(data);
      dispatch(setLoading({ loading: false }));
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      message.error('Failed to fetch users');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ loading: true, message: 'Deleting user...' }));
      await usersApi.delete(id);
      dispatch(setLoading({ loading: false }));
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      message.error('Failed to delete user');
    }
  };

  const handleSubmit = async (values: CreateUserData | UpdateUserData) => {
    try {
      dispatch(
        setLoading({
          loading: true,
          message: editingUser ? 'Updating user...' : 'Creating user...',
        })
      );

      if (editingUser) {
        await usersApi.update(editingUser.id, values);
        message.success('User updated successfully');
      } else {
        await usersApi.create(values as CreateUserData);
        message.success('User created successfully');
      }

      dispatch(setLoading({ loading: false }));
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      message.error(
        editingUser ? 'Failed to update user' : 'Failed to create user'
      );
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span className="capitalize">{role}</span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageTransition>
      <div>
        <div className="flex justify-between items-center mb-6">
          <Title 
            level={2} 
            className="text-gray-900 dark:text-gray-100"
          >
            Users Management
          </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add User
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Create User'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input name!' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="moderator">Moderator</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update' : 'Create'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </PageTransition>
  );
}

