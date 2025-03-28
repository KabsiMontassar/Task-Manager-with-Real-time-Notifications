import { IsEnum } from 'class-validator';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
