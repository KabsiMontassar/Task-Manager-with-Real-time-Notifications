import api from './api.service';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  order: number;
  dueDate?: Date;
 
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  status?: TaskStatus;
  order?: number;
  dueDate?: Date;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class TaskService {
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>(API_ENDPOINTS.TASKS.BASE);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch tasks: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const response = await api.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch task with id ${id}: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
      const response = await api.post<Task>(API_ENDPOINTS.TASKS.BASE, taskData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to create task: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async updateTask(id: string, taskData: UpdateTaskDto): Promise<Task> {
    try {
      const response = await api.patch<Task>(API_ENDPOINTS.TASKS.BY_ID(id), taskData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to update task: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.TASKS.BY_ID(id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to delete task: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    try {
      const response = await api.put<Task>(API_ENDPOINTS.TASKS.STATUS(id), { status : status });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to update task status: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async updateTaskActive(id: string): Promise<Task> {
    try {
      const response = await api.put<Task>(API_ENDPOINTS.TASKS.ACTIVE(id));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to update task status: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async updateTaskOrder(id: string, order: number): Promise<Task> {
    try {
      const response = await api.put<Task>(API_ENDPOINTS.TASKS.ORDER(id), { order : order });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to update task order: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async updateTaskOrders(tasks: { id: string; order: number }[]): Promise<void> {
    try {
      await api.put(API_ENDPOINTS.TASKS.BATCH_UPDATE_ORDERS, { tasks });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update task orders: ${error.message}`);
      } else {
        throw new Error('Failed to update task orders: An unknown error occurred.');
      }
    }
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>(`${API_ENDPOINTS.TASKS.BASE}?assignedTo=${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch tasks for user ${userId}: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}

export const taskService = new TaskService();
