import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { User } from '../types/user';

interface ApiError {
  response?: {
    data?: {
      message: string;
    };
  };
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.response?.data?.message || 'Unknown API error';
  }
  return 'Unknown error occurred';
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>(API_ENDPOINTS.USERS.ME);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', getErrorMessage(error));
      throw error;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>(`${API_ENDPOINTS.USERS.BASE}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', getErrorMessage(error));
      throw error;
    }
  },

  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await api.get<User>(API_ENDPOINTS.USERS.BY_ID(userId));
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', getErrorMessage(error));
      throw error;
    }
  },

  getUserByEmail: async (email: string): Promise<User> => {
    try {
      const response = await api.get<User>(`${API_ENDPOINTS.USERS.BASE}/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', getErrorMessage(error));
      throw error;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) throw new Error('No user found');
      
      const user: User = JSON.parse(userJson);
      const response = await api.put<User>(API_ENDPOINTS.USERS.BY_ID(user.id), data);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', getErrorMessage(error));
      throw error;
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) throw new Error('No user found');
      
      const user: User = JSON.parse(userJson);
      await api.put(API_ENDPOINTS.USERS.PASSWORD(user.id), {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Error updating password:', getErrorMessage(error));
      throw error;
    }
  },

  updateUser: async (user: User): Promise<User> => {
    try {
      const response = await api.put<User>(API_ENDPOINTS.USERS.BY_ID(user.id), user);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', getErrorMessage(error));
      throw error;
    }
  },
};