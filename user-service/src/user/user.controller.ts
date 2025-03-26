import { Controller, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dto/user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

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
    async getUser(@Payload() data: { userId: string }) {
        try {
            console.log('Received get_user request with data:', data); // Debug log
            const user = await this.userService.findById(data.userId);
            console.log('Found user:', user); // Debug log
            return user;
        } catch (error) {
            console.error('Error in getUser:', error); // Debug log
            return null;
        }
    }
}
