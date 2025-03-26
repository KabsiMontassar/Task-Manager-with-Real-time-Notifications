import { IsString, IsEnum, IsObject, IsOptional, IsBoolean } from 'class-validator';
import { NotificationType } from '../schemas/notification.schema';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class UpdateNotificationDto {
  @IsBoolean()
  read: boolean;
}
