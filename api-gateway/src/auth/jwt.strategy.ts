import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import * as dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

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
        role: payload.role,
      };
    } catch (error) {
      console.log('JWT validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
