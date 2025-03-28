import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Task, TaskStatus } from '../types/task';

export const taskService = {
  getAllTasks: () =>
    api.get<Task[]>(API_ENDPOINTS.TASKS.BASE).then(res => res.data),

  getTaskById: (id: string) =>
    api.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id)).then(res => res.data),

  createTask: (task: Partial<Task>) =>
    api.post<Task>(API_ENDPOINTS.TASKS.BASE, task).then(res => res.data),

  updateTask: (id: string, task: Partial<Task>) =>
    api.put<Task>(API_ENDPOINTS.TASKS.BY_ID(id), task).then(res => res.data),

  updateTaskStatus: (id: string, status: TaskStatus) =>
    api.put<Task>(API_ENDPOINTS.TASKS.STATUS(id), { status: { status } }).then(res => res.data),

  updateTaskOrder: (id: string, newOrder: number) =>
    api.put<Task>(API_ENDPOINTS.TASKS.ORDER(id), { order: newOrder }).then(res => res.data),

  deleteTask: (id: string) =>
    api.delete(API_ENDPOINTS.TASKS.BY_ID(id)).then(res => res.data),
};
