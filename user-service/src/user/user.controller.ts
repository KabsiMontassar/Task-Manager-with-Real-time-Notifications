import { Controller, Get, Put, Delete, Param, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dto/user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: Request) {
        if (!req.user) {
            throw new Error('User not found in request');
        }
        return this.userService.findById(req.user.userId);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async getAllUsers(@Req() req: Request) {
        try {
            if (!req.user) {
                throw new Error('Unauthorized access: User not found in request');
            }

            console.log('Fetching all users for:', req.user);

            const users = await this.userService.findAll();

            console.log('Raw user data:', users);

            if (!users || users.length === 0) {
                throw new NotFoundException('No users found');
            }

            return users;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
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
        try {
            const user = await this.userService.findById(payload.userId);
            console.log('Found user:', user);
            return user;
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    @MessagePattern('user_find_by_email')
    async findByEmailMicroservice(@Payload() payload: { email: string }) {
        return this.userService.findByEmail(payload.email);
    }

    @MessagePattern('user_update')
    async updateMicroservice(@Payload() payload: { id: string; data: UpdateUserDto }) {
        return this.userService.update(payload.id, payload.data);
    }

    @MessagePattern('user_delete')
    async deleteMicroservice(@Payload() payload: { id: string }) {
        await this.userService.delete(payload.id);
        return { message: 'User deleted successfully' };
    }

    @MessagePattern('user_update_password')
    async updatePasswordMicroservice(@Payload() payload: { id: string; data: any }) {
        return this.userService.updatePassword(payload.id, payload.data);
    }

    @MessagePattern({ cmd: 'findAllUsers' })
    async findAllUsersMicroservice() {
        try {
            const users = await this.userService.findAll();
            return users;
        } catch (error) {
            console.error('Error fetching all users in microservice:', error);
            throw error;
        }
    }
}
