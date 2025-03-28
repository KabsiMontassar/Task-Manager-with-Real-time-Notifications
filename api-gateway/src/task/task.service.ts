import { Injectable, Inject, ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskService: ClientProxy,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async create(createTaskDto: any, userId: string) {
    try {
      const task = await firstValueFrom(
        this.taskService.send({ cmd: 'createTask' }, { createTaskDto, userId })
          .pipe(
            timeout(5000),
            catchError(err => {
              console.error('Error creating task:', err);
              throw new ServiceUnavailableException('Task service is unavailable');
            })
          )
      );
      
      if (task.assignedTo) {
        this.websocketGateway.emitNotification(task.assignedTo, {
          type: 'TASK_ASSIGNED',
          taskId: task.id,
          title: task.title,
        });
      }

      return task;
    } catch (error) {
      console.error('Task creation error:', error);
      throw error;
    }
  }

  async findAll() {
    return this.handleServiceRequest({ cmd: 'findAllTasks' }, {});
  }

  async findOne(id: string) {
    return this.handleServiceRequest({ cmd: 'findOneTask' }, { id });
  }

  async update(id: string, updateTaskDto: any) {
    const task = await this.handleServiceRequest({ cmd: 'updateTask' }, { id, updateTaskDto });
  
    if (updateTaskDto.status || updateTaskDto.assignedTo) {
      this.websocketGateway.emitTaskUpdate(id, {
        type: 'TASK_UPDATED',
        task,
      });
    }
  
    return task;
  }
  

  async remove(id: string) {
    const result = await this.handleServiceRequest({ cmd: 'removeTask' }, { id });

    // Notify task deletion
    this.websocketGateway.emitTaskUpdate(id, {
      type: 'TASK_DELETED',
      taskId: id,
    });

    return result;
  }

  

  async updateTaskStatus(id: string, status: string, userId: string) {
    const task = await this.handleServiceRequest(
      { cmd: 'updateTaskStatus' },
      { id, status, userId }
    );

    // Notify status change
    this.websocketGateway.emitTaskUpdate(id, {
      type: 'STATUS_CHANGED',
      taskId: id,
      status: task.status,
    });

    return task;
  }

  private async handleServiceRequest(pattern: any, payload: any) {
    try {
      return await firstValueFrom(
        this.taskService.send(pattern, payload)
          .pipe(
            timeout(5000),
            catchError(err => {
              console.error(`Error processing request ${pattern.cmd}:`, err);
              throw new ServiceUnavailableException('Task service is unavailable');
            })
          )
      );
    } catch (error) {
      console.error(`Service request error for ${pattern.cmd}:`, error);
      throw error;
    }
  }
}
