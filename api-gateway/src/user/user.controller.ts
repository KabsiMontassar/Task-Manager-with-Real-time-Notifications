import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Req, Body } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  
    return this.userService.findById(userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.userService.update(id, updateUserDto);
  }

  @Put(':id/password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDto: any) {
    try {
      const result = await this.userService.updatePassword(id, updatePasswordDto);
      return result;
    } catch (error) {
      console.error('Error updating password:', error);
      throw new Error('Failed to update password');
    }
  }
}
