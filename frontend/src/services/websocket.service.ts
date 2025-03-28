import { io, Socket } from 'socket.io-client';
import { Task } from '../types/task';

class WebSocketService {
  private socket: Socket | null = null;
  private taskUpdateCallbacks: ((task: Task) => void)[] = [];
  private taskDeleteCallbacks: ((taskId: string) => void)[] = [];

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:3000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('taskUpdated', (task: Task) => {
        this.taskUpdateCallbacks.forEach(callback => callback(task));
      });

      this.socket.on('taskDeleted', (taskId: string) => {
        this.taskDeleteCallbacks.forEach(callback => callback(taskId));
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      this.socket.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onTaskUpdate(callback: (task: Task) => void) {
    this.taskUpdateCallbacks.push(callback);
    return () => {
      this.taskUpdateCallbacks = this.taskUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  onTaskDelete(callback: (taskId: string) => void) {
    this.taskDeleteCallbacks.push(callback);
    return () => {
      this.taskDeleteCallbacks = this.taskDeleteCallbacks.filter(cb => cb !== callback);
    };
  }
}

export const webSocketService = new WebSocketService();
