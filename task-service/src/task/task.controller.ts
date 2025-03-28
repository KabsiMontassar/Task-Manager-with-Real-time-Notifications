import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, AddCommentDto } from '../dto/task.dto';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'createTask' })
  create(@Payload() { createTaskDto, userId }: { createTaskDto: CreateTaskDto; userId: string }) {
    return this.taskService.create(createTaskDto, userId);
  }

  @MessagePattern({ cmd: 'findAllTasks' })
  findAll() {
    return this.taskService.findAll();
  }

  @MessagePattern({ cmd: 'findOneTask' })
  findOne(@Payload() id: string) {
    return this.taskService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateTask' })
  update(@Payload() { id, updateTaskDto }: { id: string; updateTaskDto: UpdateTaskDto }) {
    return this.taskService.update(id, updateTaskDto);
  }

  @MessagePattern({ cmd: 'removeTask' })
  remove(@Payload() id: string) {
    return this.taskService.remove(id);
  }

  @MessagePattern({ cmd: 'addComment' })
  addComment(
    @Payload() { id, userId, commentDto }: { id: string; userId: string; commentDto: AddCommentDto },
  ) {
    return this.taskService.addComment(id, userId, commentDto);
  }

  @MessagePattern({ cmd: 'updateTaskOrder' })
  updateTaskOrder(@Payload() { id, newOrder }: { id: string; newOrder: number }) {
    return this.taskService.updateTaskOrder(id, newOrder);
  }

  @MessagePattern({ cmd: 'updateTaskStatus'})
  updateStatus(@Payload() { id, status }: { id: string; status: string; userId: string }) {
    return this.taskService.updateTaskStatus(id, status);
  }





  @MessagePattern({ cmd: 'getTasksByAssignee' })
  getTasksByAssignee(@Payload() userId: string) {
    return this.taskService.getTasksByAssignee(userId);
  }
}
