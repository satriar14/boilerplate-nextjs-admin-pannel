import api from './axios';
import { User } from '@/lib/redux/slices/authSlice';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Mock API functions - Replace with real API calls
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            email: credentials.email,
            name: 'John Doe',
            role: 'admin',
          },
          token: 'mock-jwt-token-' + Date.now(),
        });
      }, 1000);
    });
    
    // Real API call example:
    // const response = await api.post<AuthResponse>('/auth/login', credentials);
    // return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            email: data.email,
            name: data.name,
            role: 'user',
          },
          token: 'mock-jwt-token-' + Date.now(),
        });
      }, 1000);
    });
    
    // Real API call example:
    // const response = await api.post<AuthResponse>('/auth/register', data);
    // return response.data;
  },

  logout: async (): Promise<void> => {
    // Mock API call - replace with actual API
    return Promise.resolve();
    
    // Real API call example:
    // await api.post('/auth/logout');
  },
};

