import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      console.log('Fetching user profile');
      const response = await api.get(API_ENDPOINTS.USERS.ME);
      console.log('Profile response:', response.data);
      
      // Update stored user data with latest from server
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      throw error;
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const user = localStorage.getItem('user');
      if (!user) throw new Error('No user found');
      
      const { id } = JSON.parse(user);
      const response = await api.put(API_ENDPOINTS.USERS.BY_ID(id), data);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', error.response?.data || error.message);
      throw error;
    }
  }
};
