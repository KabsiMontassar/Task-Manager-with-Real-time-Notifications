import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Inject as NestInject } from '@nestjs/common';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject('NOTIFICATION_CLIENT') private readonly notificationClient: any, // Inject the notification client
  ) {}

  @Get()
  async getNotifications(userId?: string) {
    const payload = userId ? { cmd: 'get_user_notifications', userId } : { cmd: 'get_notifications' };
    return this.notificationClient.send(payload, {}); // Ensure the second argument is passed as an empty object
  }

  @Get('user')
  async getUserNotifications(@Req() req: any) {
    const userId = req.user.userId;
    return this.notificationService.getNotifications();
  }

  @Post()
  async createNotification(@Body() notification: any) {
    return this.notificationService.createNotification(notification);
  }
}
function Inject(token: string): ParameterDecorator {
  return NestInject(token);
}

