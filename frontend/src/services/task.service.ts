import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config.ts';
import { Task, TaskStatus, TaskDetails } from '../types/task';

export const taskService = {
  getAllTasks: () => 
    api.get<{ data: Task[] }>(API_ENDPOINTS.TASKS.BASE).then(res => res.data),

  getTaskById: (id: string) =>
    api.get<{ data: Task }>(API_ENDPOINTS.TASKS.BY_ID(id)).then(res => res.data),

  getTaskDetails: (id: string) =>
    api.get<{ data: TaskDetails }>(API_ENDPOINTS.TASKS.DETAILS(id)).then(res => res.data),

  createTask: (task: Partial<Task>) =>
    api.post<{ data: Task }>(API_ENDPOINTS.TASKS.BASE, task).then(res => res.data),

  updateTask: (id: string, task: Partial<Task>) =>
    api.patch<{ data: Task }>(API_ENDPOINTS.TASKS.BY_ID(id), task).then(res => res.data),

  updateTaskStatus: (id: string, status: TaskStatus) =>
    api.patch<{ data: Task }>(API_ENDPOINTS.TASKS.BY_ID(id), { status }).then(res => res.data),

  deleteTask: (id: string) =>
    api.delete(API_ENDPOINTS.TASKS.BY_ID(id)),

  addComment: (taskId: string, content: string) =>
    api.post<{ data: any }>(API_ENDPOINTS.TASKS.COMMENTS(taskId), { content }).then(res => res.data),

  addAttachment: (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ data: any }>(API_ENDPOINTS.TASKS.ATTACHMENTS(taskId), formData).then(res => res.data);
  },
};
