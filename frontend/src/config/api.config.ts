export const API_BASE_URL = 'http://localhost:3000';
export const WS_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
 //   PROFILE: '/auth/profile',
  },
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    COMMENTS: (id: string) => `/tasks/${id}/comments`,
    ATTACHMENTS: (id: string) => `/tasks/${id}/attachments`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
  },
};
