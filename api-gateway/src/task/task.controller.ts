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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto , UpdateStatusDto,UpdateTaskOrderDto } from './dtos/task.dtos';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(@Inject('TASK_SERVICE') private readonly taskClient: ClientProxy) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    console.log('Creating task with user:', req.user); 
    return this.taskClient.send(
      { cmd: 'createTask' },
      { 
        createTaskDto,
        userId: req.user.email 
      }
    );
  }

  @Get()
  async findAll() {
    return this.taskClient.send({ cmd: 'findAllTasks' }, {});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskClient.send({ cmd: 'findOneTask' }, id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskClient.send({ cmd: 'updateTask' }, { id, updateTaskDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.taskClient.send({ cmd: 'removeTask' }, id);
  }

  @Put(':id/status')
  @UsePipes(new ValidationPipe())
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Request() req,
  ) {
    return this.taskClient.send(
      { cmd: 'updateTaskStatus' }, 
      { id, status: updateStatusDto.status, userId: req.user.id }
    );
  }

  @Put(':id/order')
  @UsePipes(new ValidationPipe())
  async updateTaskOrder(@Param('id') id: string, @Body() updateTaskOrderDto: UpdateTaskOrderDto) {
    return this.taskClient.send({ cmd: 'updateTaskOrder' }, { id, ...updateTaskOrderDto });
  }

  @Get('/assignee/:userId')
  async getTasksByAssignee(@Param('userId') userId: string) {
    return this.taskClient.send({ cmd: 'getTasksByAssignee' }, { userId });
  }
}
