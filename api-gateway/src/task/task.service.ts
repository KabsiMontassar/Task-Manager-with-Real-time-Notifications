import {
  Injectable,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { Task } from './models/task.model';
import { CreateTaskDto, UpdateTaskDto } from './dtos/task.dtos';
@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskService: ClientProxy,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = await firstValueFrom(
      this.taskService
        .send<Task>({ cmd: 'createTask' }, { createTaskDto, userId })
        .pipe(
          timeout(5000),
          catchError((err) => {
            console.error('Error creating task:', err);
            throw new ServiceUnavailableException(
              'Task service is unavailable',
            );
          }),
        ),
    );
    return task;
  }

  async findAll(): Promise<Task[]> {
    return this.handleServiceRequest<Task[]>({ cmd: 'findAllTasks' }, {});
  }

  async findOne(id: string) {
    return this.handleServiceRequest({ cmd: 'findOneTask' }, { id });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task: Task = await this.handleServiceRequest<Task>(
      { cmd: 'updateTask' },
      { id, updateTaskDto },
    );
    return task;
  }

  async remove(id: string) {
    const result = await this.handleServiceRequest(
      { cmd: 'removeTask' },
      { id },
    );

    return result;
  }

  async updateTaskStatus(id: string, status: string, userId: string) {
    const task = await this.handleServiceRequest(
      { cmd: 'updateTaskStatus' },
      { id, status, userId },
    );

    return task;
  }

  private async handleServiceRequest<T>(
    pattern: { cmd: string },
    payload: any,
  ): Promise<T> {
    try {
      return await firstValueFrom(
        this.taskService.send<T>(pattern, payload).pipe(
          timeout(5000),
          catchError((err) => {
            console.error(`Error processing request ${pattern.cmd}:`, err);
            throw new ServiceUnavailableException(
              'Task service is unavailable',
            );
          }),
        ),
      );
    } catch (error) {
      console.error(`Service request error for ${pattern.cmd}:`, error);
      throw error;
    }
  }
}
