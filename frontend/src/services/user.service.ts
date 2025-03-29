import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { User } from '../types/user';

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.ME);
      
      // Update stored user data with latest from server
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching profile:', (error as any)?.response?.data || (error as Error)?.message);
      throw error;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.BASE}/all`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching users:', (error as any)?.response?.data || (error as Error)?.message);
      throw error;
    }
  },

  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.BY_ID(userId));
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching user by ID:', (error as any)?.response?.data || (error as Error)?.message);
      throw error;
    }
  },

  getUserByEmail: async (email: string): Promise<User> => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.BASE}/email/${email}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching user by email:', (error as any)?.response?.data || (error as Error)?.message);
      throw error;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const user = localStorage.getItem('user');
      if (!user) throw new Error('No user found');
      
      const { _id } = JSON.parse(user); // Fix: Use 'id' instead of '_id'
      const response = await api.put(API_ENDPOINTS.USERS.BY_ID(_id), data);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: unknown) {
      console.error('Error updating profile:', (error as any)?.response?.data || (error as Error)?.message);
      throw error;
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      const user = localStorage.getItem('user');
      if (!user) throw new Error('No user found');
      
      const { _id } = JSON.parse(user);
      await api.put(API_ENDPOINTS.USERS.PASSWORD(_id), {
        currentPassword,
        newPassword
      });
    } catch (error: unknown) {
      console.error('Error updating password:', (error as any)?.response?.data || (error as Error)?.message);
      throw error;
    }
  },

  updateUser: async (user: User): Promise<User> => {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.BY_ID(user.id), user);
      return response.data;
    } catch (error: unknown) {
      console.error('Error updating user:', (error as any)?.response?.data || (error as Error)?.message);
      throw error;
    }
  },
};
