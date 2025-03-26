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
      
      // Notify assignee
      this.websocketGateway.emitNotification(task.assignedTo, {
        type: 'TASK_ASSIGNED',
        taskId: task.id,
        title: task.title,
      });

      return task;
    } catch (error) {
      console.error('Task creation error:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await firstValueFrom(
        this.taskService.send({ cmd: 'findAllTasks' }, {})
          .pipe(
            timeout(5000),
            catchError(err => {
              console.error('Error fetching tasks:', err);
              throw new ServiceUnavailableException('Task service is unavailable');
            })
          )
      );
    } catch (error) {
      console.error('Find all tasks error:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await firstValueFrom(
        this.taskService.send({ cmd: 'findOneTask' }, id)
          .pipe(
            timeout(5000),
            catchError(err => {
              console.error('Error fetching task:', err);
              throw new ServiceUnavailableException('Task service is unavailable');
            })
          )
      );
    } catch (error) {
      console.error('Find task error:', error);
      throw error;
    }
  }

  async update(id: string, updateTaskDto: any) {
    try {
      const task = await firstValueFrom(
        this.taskService.send({ cmd: 'updateTask' }, { id, updateTaskDto })
          .pipe(
            timeout(5000),
            catchError(err => {
              console.error('Error updating task:', err);
              throw new ServiceUnavailableException('Task service is unavailable');
            })
          )
      );

      // Notify task update
      this.websocketGateway.emitTaskUpdate(id, {
        type: 'TASK_UPDATED',
        task,
      });

      return task;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const result = await firstValueFrom(
        this.taskService.send({ cmd: 'removeTask' }, id)
          .pipe(
            timeout(5000),
            catchError(err => {
              console.error('Error deleting task:', err);
              throw new ServiceUnavailableException('Task service is unavailable');
            })
          )
      );

      // Notify task deletion
      this.websocketGateway.emitTaskUpdate(id, {
        type: 'TASK_DELETED',
        taskId: id,
      });

      return result;
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  }

  async addComment(id: string, commentDto: any, userId: string) {
    try {
      const task = await firstValueFrom(
        this.taskService.send(
          { cmd: 'addComment' },
          { id, comment: { ...commentDto, userId } }
        )
          .pipe(
            timeout(5000),
            catchError(err => {
              console.error('Error adding comment:', err);
              throw new ServiceUnavailableException('Task service is unavailable');
            })
          )
      );

      // Notify new comment
      this.websocketGateway.emitTaskUpdate(id, {
        type: 'NEW_COMMENT',
        taskId: id,
        comment: task.comments[task.comments.length - 1],
      });

      return task;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  }

  async updateTaskStatus(id: string, status: string, userId: string) {
    try {
      const task = await firstValueFrom(
        this.taskService.send(
          { cmd: 'updateTaskStatus' },
          { id, status, userId }
        )
          .pipe(
            timeout(5000),
            catchError(err => {
              console.error('Error updating task status:', err);
              throw new ServiceUnavailableException('Task service is unavailable');
            })
          )
      );

      // Notify status change
      this.websocketGateway.emitTaskUpdate(id, {
        type: 'STATUS_CHANGED',
        taskId: id,
        status: task.status,
      });

      return task;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  }
}
