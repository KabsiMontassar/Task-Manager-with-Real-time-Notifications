import { IsString, IsEnum, IsUUID, IsOptional, IsArray, IsDate, IsNumber } from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsUUID()
  assignedTo: string;



  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsNumber()
  @IsOptional()
  order?: number;

  
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsNumber()
  @IsOptional()
  order?: number;
}
