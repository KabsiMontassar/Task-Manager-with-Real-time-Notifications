import axios from 'axios';
import { User, UserProfile } from '@/types';
import { API_URL } from '@/config';

class UserService {
  async getAllUsers(): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  }

  async getProfile(): Promise<UserProfile> {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axios.patch(`${API_URL}/users/profile`, data);
    return response.data;
  }

  async updateAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axios.post(`${API_URL}/users/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const userService = new UserService();
