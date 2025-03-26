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
      secretOrKey: process.env.JWT_SECRET || 'error',
    });
  }

  async validate(payload: any) {
    try {
      const user = await firstValueFrom(
        this.userService.send({ cmd: 'get_user' }, { userId: payload.userId })
      );

      if (!user) {
        throw new UnauthorizedException();
      }

      return {
        id: user._id,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}