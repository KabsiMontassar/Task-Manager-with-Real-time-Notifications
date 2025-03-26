import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config.ts';
import { Task, TaskStatus, TaskDetails } from '../types/task';

export const taskService = {
  getAllTasks: () => 
    api.get<Task[]>(API_ENDPOINTS.TASKS.BASE),

  getTaskById: (id: string) =>
    api.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id)),

  getTaskDetails: (id: string) =>
    api.get<TaskDetails>(API_ENDPOINTS.TASKS.DETAILS(id)),

  createTask: (task: Partial<Task>) =>
    api.post<Task>(API_ENDPOINTS.TASKS.BASE, task),

  updateTask: (id: string, task: Partial<Task>) =>
    api.patch<Task>(API_ENDPOINTS.TASKS.BY_ID(id), task),

  updateTaskStatus: (id: string, status: TaskStatus) =>
    api.put<Task>(API_ENDPOINTS.TASKS.BY_ID(id), { status }),

  deleteTask: (id: string) =>
    api.delete(API_ENDPOINTS.TASKS.BY_ID(id)),

  addComment: (taskId: string, content: string) =>
    api.post(API_ENDPOINTS.TASKS.COMMENTS(taskId), { content }),

  addAttachment: (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(API_ENDPOINTS.TASKS.ATTACHMENTS(taskId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
