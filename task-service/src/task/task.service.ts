import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, AddCommentDto } from '../dto/task.dto';
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
    const task = this.taskRepository.create({
      ...createTaskDto,
      assignedTo: this.convertMongoIdToUuid(createTaskDto.assignedTo),
      createdBy: this.convertMongoIdToUuid(userId),
    });
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

  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async addComment(id: string, userId: string, commentDto: AddCommentDto): Promise<Task> {
    const task = await this.findOne(id);
    const comment = {
      id: uuidv4(),
      userId,
      content: commentDto.content,
      createdAt: new Date(),
    };

    if (!task.comments) {
      task.comments = [];
    }
    task.comments.push(comment);
    return await this.taskRepository.save(task);
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
}
