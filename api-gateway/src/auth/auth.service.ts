import { Injectable, Inject, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
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

      // If registration is successful, generate JWT token
      if (result && result.user) {
        const payload = {
          userId: result.user._id,
          email: result.user.email,
          role: result.user.role
        };

        return {
          access_token: this.jwtService.sign(payload),
          user: result.user
        };
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      if (error.message.includes('validation failed')) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Registration failed: ' + error.message);
    }
  }
}
