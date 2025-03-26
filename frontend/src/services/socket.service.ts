import { io, Socket } from 'socket.io-client';
import { WS_BASE_URL } from '../config/api.config';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found, skipping socket connection');
      return;
    }

    this.socket = io(WS_BASE_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (error.message === 'jwt expired') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onTaskUpdate(callback: (task: any) => void) {
    this.socket?.on('taskUpdate', callback);
  }

  onNewNotification(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  offTaskUpdate(callback: (task: any) => void) {
    this.socket?.off('taskUpdate', callback);
  }

  offNewNotification(callback: (notification: any) => void) {
    this.socket?.off('notification', callback);
  }
}

export const socketService = new SocketService();
