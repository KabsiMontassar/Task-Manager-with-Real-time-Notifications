import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await firstValueFrom(
        this.userServiceClient.send({ cmd: 'validate_user' }, { email, password })
      );
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid credentials');
    }
  }

  async login(user: any) {
    const payload = { 
      userId: user._id,
      email: user.email, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    };
  }

  async register(createUserDto: any) {
    try {
      const result = await firstValueFrom(
        this.userServiceClient.send({ cmd: 'register_user' }, createUserDto)
      );
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Registration failed');
    }
  }
}
