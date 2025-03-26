import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'error',
    });
  }

  async validate(payload: any) {
    try {
      console.log('JWT Payload:', payload); // Debug log
      
      if (!payload || !payload.userId) {
        console.log('Invalid payload structure'); // Debug log
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await firstValueFrom(
        this.userService.send({ cmd: 'get_user' }, { userId: payload.userId })
      ).catch(err => {
        console.log('User service error:', err); // Debug log
        return null;
      });

      if (!user) {
        console.log('User not found'); // Debug log
        throw new UnauthorizedException('User not found');
      }

      const result = {
        id: payload.userId,
        email: payload.email,
        role: payload.role
      };
      
      console.log('Validated user:', result); // Debug log
      return result;
    } catch (error) {
      console.log('JWT validation error:', error); // Debug log
      throw new UnauthorizedException('Invalid token');
    }
  }
}