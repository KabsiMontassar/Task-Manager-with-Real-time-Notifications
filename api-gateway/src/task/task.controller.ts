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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(@Inject('TASK_SERVICE') private readonly taskClient: ClientProxy) {}

  @Post()
  async create(@Body() createTaskDto, @Request() req) {
    return this.taskClient.send({ cmd: 'createTask' }, { createTaskDto, userId: req.user.id });
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
  async update(@Param('id') id: string, @Body() updateTaskDto) {
    return this.taskClient.send({ cmd: 'updateTask' }, { id, updateTaskDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.taskClient.send({ cmd: 'removeTask' }, id);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() commentDto,
    @Request() req,
  ) {
    return this.taskClient.send(
      { cmd: 'addComment' },
      { id, userId: req.user.id, commentDto }
    );
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.taskClient.send({ cmd: 'updateTaskStatus' }, { id, status, userId: req.user.id });
  }

  @Put(':id/order')
  async updateTaskOrder(@Param('id') id: string, @Body('order') newOrder: number) {
    return this.taskClient.send({ cmd: 'updateTaskOrder' }, { id, newOrder });
  }

  @Get('/assignee/:userId')
  async getTasksByAssignee(@Param('userId') userId: string) {
    return this.taskClient.send({ cmd: 'getTasksByAssignee' }, userId);
  }
}
