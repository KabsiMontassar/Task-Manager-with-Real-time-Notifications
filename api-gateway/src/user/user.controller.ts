import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Req } from '@nestjs/common';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
