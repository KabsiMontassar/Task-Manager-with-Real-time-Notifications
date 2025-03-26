import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const JWT_SECRET = 'b09d24b7e1c4a39c8fc3b15d487b3f8d6ea716c7e8cd2859c9374b6c8c9b3e2f'; // Use the same secret as auth.module

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    try {
      console.log('JWT Payload:', payload);
      
      if (!payload || !payload.userId) {
        console.log('Invalid payload structure');
        throw new UnauthorizedException('Invalid token payload');
      }

      // Don't validate against user service again since we already have the user info in the token
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      console.log('JWT validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}