import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

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
})
export class AppModule {}