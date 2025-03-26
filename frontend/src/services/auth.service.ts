import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Sending login request with:', credentials);
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('Received login response:', response.data);

      const { access_token, user } = response.data;
      
      if (!access_token || !user) {
        console.error('Missing token or user in response:', response.data);
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Stored token and user:', { access_token, user });
      return response.data;
    } catch (error) {
      console.error('Login error in auth service:', error);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      const { access_token, user } = response.data;

      if (access_token && user) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return false;
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
};
