import axios from 'axios';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { API_ENDPOINTS } from '../config/api.config';


const API_URL = API_ENDPOINTS;

interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  order: number;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
}

class TaskService {
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await axios.get<Task[]>(`${API_URL}/tasks`);
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
      const response = await axios.get<Task>(`${API_URL}/tasks/${id}`);
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
      const response = await axios.post<Task>(`${API_URL}/tasks`, taskData);
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
      const response = await axios.put<Task>(`${API_URL}/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to update task with id ${id}: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to delete task with id ${id}: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    try {
      const response = await axios.put<Task>(`${API_URL}/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to update task status for task with id ${id}: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async updateTaskOrder(id: string, order: number): Promise<Task> {
    try {
      const response = await axios.put<Task>(`${API_URL}/tasks/${id}/order`, { order });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to update task order for task with id ${id}: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    try {
      const response = await axios.get<Task[]>(`${API_URL}/tasks/assignee/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch tasks for assignee with id ${userId}: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}

export const taskService = new TaskService();
