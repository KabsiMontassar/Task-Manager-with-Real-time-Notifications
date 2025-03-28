export const API_BASE_URL = 'http://localhost:3000';
export const WS_BASE_URL = 'ws://localhost:3000'; 

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me',
    PASSWORD: (id: string) => `/users/${id}/password`,
  },
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`, 
    DETAILS: (id: string) => `/tasks/${id}/details`,
    COMMENTS: (id: string) => `/tasks/${id}/comments`,
    STATUS: (id: string) => `/tasks/${id}/status`,
    ATTACHMENTS: (id: string) => `/tasks/${id}/attachments`,
    ORDER: (id: string) => `/tasks/${id}/order`,  

  },
  NOTIFICATIONS: {
    BASE: '/notifications', 
    BY_ID: (id: string) => `/notifications/${id}`,
  },
};
