import { Controller, Get, Put, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Req, Body } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  async getProfile(@Req() req: Request) {
    if (!req.user) {
      throw new Error('User not found in request');
    }
    console.log('Getting profile for user:', req.user);
    
    const result = await this.userService.findById(req.user.userId);
    console.log('Profile result:', result);
    return result;
  }

  @Get('me/:userId')
  async getUserById(@Param('userId') userId: string) {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  @Get(':id')
  async getUserByIdRoute(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return this.userService.update(id, updateUserDto);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  @Put(':id/password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDto: any) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      const result = await this.userService.updatePassword(id, updatePasswordDto);
      return result;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}
