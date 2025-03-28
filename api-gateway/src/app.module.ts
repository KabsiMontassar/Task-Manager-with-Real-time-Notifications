import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 }, 
      },
      {
        name: 'TASK_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 }, 
      }
    ]),
    AuthModule,
    TaskModule,
    UserModule,
  ],
  providers: [ChatGateway], // Register the WebSocket gateway
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    const ioAdapter = new IoAdapter();
    ioAdapter.createIOServer(3000); 
  }
}