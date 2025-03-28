import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Allow requests from the frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private chatClient: ClientProxy;

  constructor() {
    this.chatClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001, // WebSocket server port
      },
    });
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() message: { sender: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Forward the message to the WebSocket server
      const response = await this.chatClient.send('message', message).toPromise();
      this.server.emit('message', response); // Broadcast the response to all clients
    } catch (error) {
      console.error('Error forwarding message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('get_active_users')
  async handleGetActiveUsers(@ConnectedSocket() client: Socket) {
    try {
      // Request active users from the WebSocket server
      const activeUsers = await this.chatClient.send('getActiveUsers', {}).toPromise();
      client.emit('activeUsers', activeUsers);
    } catch (error) {
      console.error('Error fetching active users:', error);
      client.emit('error', { message: 'Failed to fetch active users' });
    }
  }
}
