import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.NOTIFICATION_SERVICE_PORT || "3003"),
        },
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: 'NOTIFICATION_CLIENT',
      useExisting: 'NOTIFICATION_SERVICE', // Use the existing NOTIFICATION_SERVICE client
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
