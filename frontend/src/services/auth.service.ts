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

      // Store token first
      localStorage.setItem('token', access_token);
      
      // Validate token before storing user
      const decoded = jwtDecode(access_token);
      if (!decoded || !decoded.exp || decoded.exp * 1000 <= Date.now()) {
        throw new Error('Invalid token received');
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Successfully stored token and user');
      return response.data;
    } catch (error: any) {
      console.error('Login error in auth service:', error);
      // Clean up any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('Sending registration request with:', data);
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      console.log('Received registration response:', response.data);

      const { access_token, user } = response.data;

      if (!access_token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store token first
      localStorage.setItem('token', access_token);
      
      // Validate token
      const decoded = jwtDecode(access_token);
      if (!decoded || !decoded.exp || decoded.exp * 1000 <= Date.now()) {
        throw new Error('Invalid token received');
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
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
  },

  getCurrentUser: (): User | null => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return null;

      const token = localStorage.getItem('token');
      if (!token) {
        // Token missing but user exists - clean up
        localStorage.removeItem('user');
        return null;
      }

      // Validate token
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp || decoded.exp * 1000 <= Date.now()) {
        // Token invalid - clean up
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }

      return JSON.parse(user);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const decoded = jwtDecode(token);
      if (!decoded || !decoded.exp) return false;

      const isValid = decoded.exp * 1000 > Date.now();
      if (!isValid) {
        // Clean up expired token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      // Clean up invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  }
};
