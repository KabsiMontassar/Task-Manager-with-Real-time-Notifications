import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  private convertMongoIdToUuid(mongoId: string): string {
    return uuidv4({ random: Buffer.from(mongoId.padEnd(32, '0').slice(0, 32), 'hex') });
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    console.log('Creating task with userId:', userId); 
    const task = this.taskRepository.create({
      ...createTaskDto,
      createdBy: userId,
      status: createTaskDto.status || TaskStatus.TODO,
      order: createTaskDto.order || 0,
    });
    console.log('Task to be created:', task); 
    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: 'Task deleted successfully' };
  }

  async updateTaskOrder(id: string, newOrder: number): Promise<Task> {
    const task = await this.findOne(id);
    task.order = newOrder;
    return await this.taskRepository.save(task);
  }

  async getTasksByAssignee(userId: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { assignedTo: userId },
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    const task = await this.findOne(id);

    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }
    task.status = status as TaskStatus;
    task.updatedAt = new Date();
    return this.taskRepository.save(task);
  }
}
