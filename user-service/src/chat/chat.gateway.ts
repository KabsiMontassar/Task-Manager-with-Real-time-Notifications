import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers: Set<string> = new Set();

  handleConnection(client: Socket): void {
    const username = client.handshake.query.username as string;
    if (username) {
      this.activeUsers.add(username);
      this.server.emit('userConnected', { username });
    }
  }

  handleDisconnect(client: Socket): void {
    const username = client.handshake.query.username as string;
    if (username) {
      this.activeUsers.delete(username);
      this.server.emit('userDisconnected', { username });
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: { sender: string; content: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('message', message);
  }

  @SubscribeMessage('getActiveUsers')
  handleGetActiveUsers(@ConnectedSocket() client: Socket): void {
    client.emit('activeUsers', Array.from(this.activeUsers));
  }
}
