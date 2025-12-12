import api from './axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
}

// Mock API functions - Replace with real API calls
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    // Mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            createdAt: new Date().toISOString(),
          },
        ]);
      }, 500);
    });
    
    // Real API call example:
    // const response = await api.get<User[]>('/users');
    // return response.data;
  },

  getById: async (id: string): Promise<User> => {
    // Mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
    
    // Real API call example:
    // const response = await api.get<User>(`/users/${id}`);
    // return response.data;
  },

  create: async (data: CreateUserData): Promise<User> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
    
    // Real API call example:
    // const response = await api.post<User>('/users', data);
    // return response.data;
  },

  update: async (id: string, data: UpdateUserData): Promise<User> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: data.name || 'Updated User',
          email: data.email || 'updated@example.com',
          role: data.role || 'user',
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
    
    // Real API call example:
    // const response = await api.put<User>(`/users/${id}`, data);
    // return response.data;
  },

  delete: async (id: string): Promise<void> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
    
    // Real API call example:
    // await api.delete(`/users/${id}`);
  },
};

