import { Controller, Get, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dto/user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: Request) {
        if (!req.user) {
            throw new Error('User not found in request');
        }
        return this.userService.findById(req.user.userId);
    }

    @MessagePattern('user_find_by_id')
    async findByIdMicroservice(@Payload() payload: { id: string }) {
        return this.userService.findById(payload.id);
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.userService.delete(id);
        return { message: 'User deleted successfully' };
    }

    @MessagePattern({ cmd: 'get_user' })
    async getUserByIdCmd(@Payload() payload: { userId: string }) {
        console.log('Received get_user command with payload:', payload);
        const user = await this.userService.findById(payload.userId);
        console.log('Found user:', user);
        return user;
    }

    @MessagePattern('user_get_profile')
    async getProfileMicroservice(@Payload() payload: { userId: string }) {
        console.log('Received user_get_profile request with payload:', payload);
        const user = await this.userService.findById(payload.userId);
        console.log('Found user:', user);
        return user;
    }

    @MessagePattern('user_update')
    async updateUserMicroservice(@Payload() payload: { id: string; data: UpdateUserDto }) {
        console.log('Received user_update request with payload:', payload);
        const user = await this.userService.update(payload.id, payload.data);
        console.log('Updated user:', user);
        return user;
    }
}
