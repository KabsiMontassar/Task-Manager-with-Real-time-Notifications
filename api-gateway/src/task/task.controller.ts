import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateStatusDto,
  UpdateTaskOrderDto,
} from './dtos/task.dtos';
import { Task } from './models/task.model';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskClient: ClientProxy,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: { user: { id: string; email: string } },
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const result = await this.taskClient
      .send({ cmd: 'createTask' }, { createTaskDto, userId })
      .toPromise();
    return result as Task;
  }

  @Get()
  async findAll(): Promise<Task[]> {
    const tasks = await this.taskClient
      .send({ cmd: 'findAllTasks' }, {})
      .toPromise();
    return tasks as Task[];
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    const task: Task | undefined = await this.taskClient
      .send<Task>({ cmd: 'findOneTask' }, { id })
      .toPromise();
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskClient
      .send<Task>({ cmd: 'updateTask' }, { id, updateTaskDto })
      .toPromise();

    if (!task) {
      throw new Error(`Task with id ${id} could not be updated`);
    }
    return task;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const result = await this.taskClient
      .send<{ message: string } | undefined>({ cmd: 'removeTask' }, id)
      .toPromise();

    if (!result) {
      throw new Error(
        'Failed to remove the task. No response from the service.',
      );
    }

    return result;
  }

  @Put(':id/status')
  @UsePipes(new ValidationPipe())
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Request() req,
  ) {
    const result = await this.taskClient
      .send(
        { cmd: 'updateTaskStatus' },
        { id, status: updateStatusDto.status, userId: req.user.id },
      )
      .toPromise();
    return result;
  }

  @Put(':id/active')
  @UsePipes(new ValidationPipe())
  async updateActive(@Param('id') id: string, @Request() req) {
    const result = await this.taskClient
      .send({ cmd: 'updateTaskActive' }, { id, userId: req.user.id })
      .toPromise();
    return result;
  }

  @Put(':id/order')
  @UsePipes(new ValidationPipe())
  async updateTaskOrder(
    @Param('id') id: string,
    @Body() updateTaskOrderDto: UpdateTaskOrderDto,
  ) {
    return await this.taskClient
      .send({ cmd: 'updateTaskOrder' }, { id, ...updateTaskOrderDto })
      .toPromise();
  }

  @Get('/assignee/:userId')
  async getTasksByAssignee(@Param('userId') userId: string) {
    return await this.taskClient
      .send({ cmd: 'getTasksByAssignee' }, { userId })
      .toPromise();
  }
}
