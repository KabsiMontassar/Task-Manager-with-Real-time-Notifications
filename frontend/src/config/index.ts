export const API_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    PROFILE: `${API_URL}/auth/profile`,
  },
  USERS: {
    BASE: `${API_URL}/users`,
    PROFILE: `${API_URL}/users/profile`,
    AVATAR: `${API_URL}/users/avatar`,
  },
  TASKS: {
    BASE: `${API_URL}/tasks`,
    BY_ID: (id: string) => `${API_URL}/tasks/${id}`,
    DETAILS: (id: string) => `${API_URL}/tasks/${id}/details`,
    STATUS: (id: string) => `${API_URL}/tasks/${id}/status`,
    COMMENTS: (id: string) => `${API_URL}/tasks/${id}/comments`,
    ATTACHMENTS: (id: string) => `${API_URL}/tasks/${id}/attachments`,
  },
  COMMENTS: {
    BASE: `${API_URL}/comments`,
    BY_ID: (id: string) => `${API_URL}/comments/${id}`,
  },
};
