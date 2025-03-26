import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
      global: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
      {
        name: 'TASK_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: { port: 3003 },
      },
    ]),
    AuthModule,
    TaskModule,
    UserModule,
    NotificationModule,
  ],
  providers: [WebsocketGateway],
})
export class AppModule {}
