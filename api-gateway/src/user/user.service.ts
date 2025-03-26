import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async findOne(id: string) {
    return firstValueFrom(this.userServiceClient.send('user_find_one', { id }));
  }

  async findByEmail(email: string) {
    return firstValueFrom(
      this.userServiceClient.send('user_find_by_email', { email }),
    );
  }
}
