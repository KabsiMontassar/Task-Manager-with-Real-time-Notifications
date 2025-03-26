import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      client.join(`user_${payload.sub}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
  }

  @SubscribeMessage('joinTask')
  handleJoinTask(client: Socket, taskId: string) {
    client.join(`task_${taskId}`);
  }

  @SubscribeMessage('leaveTask')
  handleLeaveTask(client: Socket, taskId: string) {
    client.leave(`task_${taskId}`);
  }

  // Emit task updates to all connected clients in the task room
  emitTaskUpdate(taskId: string, data: any) {
    this.server.to(`task_${taskId}`).emit('taskUpdate', data);
  }

  // Emit notifications to specific user
  emitNotification(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification', notification);
  }
}
