import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  async getNotifications() {
    return this.notificationClient.send({ cmd: 'get_notifications' }, {});
  }

  async createNotification(notification: any) {
    return this.notificationClient.send({ cmd: 'create_notification' }, notification);
  }

  async sendNotification(notification: any) {
    return this.notificationClient.emit('notification_created', notification);
  }
}
