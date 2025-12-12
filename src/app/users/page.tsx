"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  App,
  Popconfirm,
  Typography,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DataTable from "@/components/ui/DataTable";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setLoading } from "@/lib/redux/slices/uiSlice";
import { getEffectiveTheme } from "@/utils/theme";
import {
  usersApi,
  User,
  CreateUserData,
  UpdateUserData,
} from "@/lib/api/users";
import dayjs from "dayjs";
import PageTransition from "@/components/animations/PageTransition";

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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Initialize filtered users when users change
  useEffect(() => {
    if (users.length > 0) {
      applyFilters(users, roleFilter);
    } else {
      setFilteredUsers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLocalLoading(true);
      dispatch(setLoading({ loading: true, message: "Loading users..." }));
      const data = await usersApi.getAll();
      setUsers(data);
      applyFilters(data, roleFilter);
      dispatch(setLoading({ loading: false }));
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      message.error("Failed to fetch users");
    } finally {
      setLocalLoading(false);
    }
  };

  // Apply filters to users
  const applyFilters = (userList: User[], role?: string) => {
    let filtered = [...userList];

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    setFilteredUsers(filtered);
  };

  // Handle role filter change
  const handleRoleFilterChange = (role: string | undefined) => {
    setRoleFilter(role);
    applyFilters(users, role);
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
      dispatch(setLoading({ loading: true, message: "Deleting user..." }));
      await usersApi.delete(id);
      dispatch(setLoading({ loading: false }));
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      message.error("Failed to delete user");
    }
  };

  const handleSubmit = async (values: CreateUserData | UpdateUserData) => {
    try {
      dispatch(
        setLoading({
          loading: true,
          message: editingUser ? "Updating user..." : "Creating user...",
        })
      );

      if (editingUser) {
        await usersApi.update(editingUser.id, values);
        message.success("User updated successfully");
      } else {
        await usersApi.create(values as CreateUserData);
        message.success("User created successfully");
      }

      dispatch(setLoading({ loading: false }));
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (error: any) {
      dispatch(setLoading({ loading: false }));
      message.error(
        editingUser ? "Failed to update user" : "Failed to create user"
      );
    }
  };

  const allColumns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      className: isMobile ? "hidden" : "",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <span className="capitalize">{role}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No">
            <Tooltip title="Delete">
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter options for DataTable
  const filterOptions = [
    {
      key: "admin",
      label: "Admin",
      value: "admin",
      filterFn: (user: User) => user.role === "admin",
    },
    {
      key: "user",
      label: "User",
      value: "user",
      filterFn: (user: User) => user.role === "user",
    },
    {
      key: "moderator",
      label: "Moderator",
      value: "moderator",
      filterFn: (user: User) => user.role === "moderator",
    },
  ];

  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Title level={2} className="text-gray-900 dark:text-gray-100 m-0">
            Users Management
          </Title>
          <Space className="flex-wrap">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              className="w-full sm:w-auto">
              <span className="hidden sm:inline">Add User</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Space>
        </div>

        <DataTable
          columns={allColumns}
          dataSource={users}
          filteredDataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          showFilter={true}
          filterOptions={filterOptions}
          onFilterChange={(value) => handleRoleFilterChange(value)}
          showColumnVisibility={true}
          showSearch={true}
          searchableColumns={["name", "email", "role"]}
          searchPlaceholder="Search users by name, email, or role..."
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
            responsive: true,
            showLessItems: true,
          }}
        />

        <Modal
          title={editingUser ? "Edit User" : "Create User"}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={600}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input name!" }]}>
              <Input placeholder="Enter name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}>
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role!" }]}>
              <Select placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
                <Option value="moderator">Moderator</Option>
              </Select>
            </Form.Item>

            <Form.Item className="mb-0">
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingUser ? "Update" : "Create"}
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                  }}>
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
