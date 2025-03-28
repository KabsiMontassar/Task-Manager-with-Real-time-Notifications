import io from 'socket.io-client';

class ChatService {
  private socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // Connect to the API Gateway
  }

  onMessage(callback: (message: any) => void) {
    this.socket.on('message', callback);
  }

  onUserConnected(callback: (user: any) => void) {
    this.socket.on('userConnected', callback);
  }

  onUserDisconnected(callback: (user: any) => void) {
    this.socket.on('userDisconnected', callback);
  }

  getActiveUsers(callback: (users: any[]) => void) {
    this.socket.emit('get_active_users', null, callback);
  }

  sendMessage(message: { sender: string; content: string }) {
    return new Promise((resolve, reject) => {
      this.socket.emit('send_message', message, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  onError(callback: (error: any) => void) {
    this.socket.on('connect_error', callback);
    this.socket.on('error', callback);
  }
}

export const chatService = new ChatService();
