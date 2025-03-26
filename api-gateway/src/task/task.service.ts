import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskService: ClientProxy,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async create(createTaskDto: any, userId: string) {
    const task = await firstValueFrom(
      this.taskService.send({ cmd: 'create_task' }, { ...createTaskDto, userId })
    );
    
    // Notify assignee
    this.websocketGateway.emitNotification(task.assignedTo, {
      type: 'TASK_ASSIGNED',
      taskId: task.id,
      title: task.title,
    });

    return task;
  }

  async findAll() {
    return firstValueFrom(this.taskService.send({ cmd: 'find_all_tasks' }, {}));
  }

  async findOne(id: string) {
    return firstValueFrom(this.taskService.send({ cmd: 'find_task' }, id));
  }

  async update(id: string, updateTaskDto: any) {
    const task = await firstValueFrom(
      this.taskService.send({ cmd: 'update_task' }, { id, ...updateTaskDto })
    );

    // Notify task update
    this.websocketGateway.emitTaskUpdate(id, {
      type: 'TASK_UPDATED',
      task,
    });

    return task;
  }

  async remove(id: string) {
    const result = await firstValueFrom(
      this.taskService.send({ cmd: 'remove_task' }, id)
    );

    // Notify task deletion
    this.websocketGateway.emitTaskUpdate(id, {
      type: 'TASK_DELETED',
      taskId: id,
    });

    return result;
  }

  async addComment(id: string, commentDto: any, userId: string) {
    const task = await firstValueFrom(
      this.taskService.send(
        { cmd: 'add_comment' },
        { id, comment: { ...commentDto, userId } }
      )
    );

    // Notify new comment
    this.websocketGateway.emitTaskUpdate(id, {
      type: 'NEW_COMMENT',
      taskId: id,
      comment: task.comments[task.comments.length - 1],
    });

    return task;
  }

  async updateTaskStatus(id: string, status: string, userId: string) {
    const task = await firstValueFrom(
      this.taskService.send(
        { cmd: 'update_task_status' },
        { id, status, userId }
      )
    );

    // Notify status change
    this.websocketGateway.emitTaskUpdate(id, {
      type: 'STATUS_CHANGED',
      taskId: id,
      status: task.status,
    });

    return task;
  }
}
