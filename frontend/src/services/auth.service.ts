import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Clear any existing auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const { access_token, user } = response.data;

      if (!access_token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store token
      localStorage.setItem('token', access_token);

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error: unknown) {
      console.error('Login error:', error);
      // Clean up any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // Clear any existing auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      const { access_token, user } = response.data;

      if (!access_token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store token
      localStorage.setItem('token', access_token);

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error: unknown) {
      console.error('Register error:', error);
      // Clean up any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!userStr || !token) {
        return null;
      }

      // Check token validity
      if (!authService.isAuthenticated()) {
        authService.logout();
        return null;
      }

      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error getting current user:', error);
      authService.logout();
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded || !decoded.exp) {
        return false;
      }

      const isValid = decoded.exp * 1000 > Date.now();
      if (!isValid) {
        authService.logout();
      }

      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      authService.logout();
      return false;
    }
  }
};
