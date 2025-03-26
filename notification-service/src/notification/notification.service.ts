import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/notification.dto';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDto);
    const savedNotification = await notification.save();
    
    // Emit the notification to the specific user
    this.server.to(createNotificationDto.userId).emit('notification', savedNotification);
    
    return savedNotification;
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnread(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId, read: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();

    if (!updatedNotification) {
      throw new Error(`Notification with id ${id} not found`);
    }

    return updatedNotification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel
      .updateMany(
        { userId, read: false },
        { read: true }
      )
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(id).exec();
  }

  async handleConnection(client: any) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(userId);
    }
  }

  async handleDisconnect(client: any) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.leave(userId);
    }
  }
}
