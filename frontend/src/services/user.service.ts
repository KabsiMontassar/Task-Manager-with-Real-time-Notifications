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
    } catch (error: any) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      throw error;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const user = localStorage.getItem('user');
      if (!user) throw new Error('No user found');
      
      const { _id } = JSON.parse(user);
      const response = await api.put(API_ENDPOINTS.USERS.BY_ID(_id), data);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', error.response?.data || error.message);
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
    } catch (error: any) {
      console.error('Error updating password:', error.response?.data || error.message);
      throw error;
    }
  }
};
