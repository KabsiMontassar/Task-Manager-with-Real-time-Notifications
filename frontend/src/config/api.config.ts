export const API_BASE_URL = 'http://localhost:3000';
export const WS_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me',
  },
  TASKS: {
    BASE: '/task-service/tasks',
    BY_ID: (id: string) => `/task-service/tasks/${id}`,
    DETAILS: (id: string) => `/task-service/tasks/${id}/details`,
    COMMENTS: (id: string) => `/task-service/tasks/${id}/comments`,
    ATTACHMENTS: (id: string) => `/task-service/tasks/${id}/attachments`,
  },
  NOTIFICATIONS: {
    BASE: '/notification-service/notifications',
    BY_ID: (id: string) => `/notification-service/notifications/${id}`,
  },
};