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
      console.log('Validating user:', email);
      const user = await firstValueFrom(
        this.userServiceClient.send({ cmd: 'validate_user' }, { email, password })
      );
      console.log('User validation result:', user);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      console.error('User validation error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: any) {
    try {
      console.log('Creating JWT token for user:', user);
      const payload = { 
        userId: user._id,
        email: user.email, 
        role: user.role 
      };
      
      const token = this.jwtService.sign(payload);
      console.log('JWT token created successfully');

      return {
        access_token: token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Failed to create authentication token');
    }
  }

  async register(createUserDto: any) {
    try {
      console.log('Registering new user:', createUserDto.email);
      const result = await firstValueFrom(
        this.userServiceClient.send({ cmd: 'register_user' }, createUserDto)
      );
      console.log('Registration result:', result);

      if (!result || !result.user) {
        throw new BadRequestException('Failed to create user');
      }

      const payload = {
        userId: result.user._id,
        email: result.user.email,
        role: result.user.role
      };

      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        user: {
          id: result.user._id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message?.includes('already exists')) {
        throw new ConflictException('User with this email already exists');
      }
      if (error.message?.includes('validation failed')) {
        throw new BadRequestException('Invalid user data');
      }
      throw new BadRequestException('Registration failed: ' + error.message);
    }
  }
}