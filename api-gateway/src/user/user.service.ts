import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async findByEmail(email: string) {
    return firstValueFrom(
      this.userServiceClient.send('user_find_by_email', { email }),
    );
  }

  async findById(id: string) {
    console.log('Finding user by ID:', id);
    return firstValueFrom(this.userServiceClient.send({ cmd: 'get_user' }, { userId: id }));
  }

  async delete(id: string) {
    return firstValueFrom(this.userServiceClient.send('user_delete', { id }));
  }

  async getProfile(userId: string) {
    return firstValueFrom(this.userServiceClient.send('user_get_profile', { userId }));
  }

  async update(id: string, data: any) {
    return firstValueFrom(this.userServiceClient.send('user_update', { id, data }));
  }

  async updatePassword(id: string, data: any) {
    try {
      const response = await firstValueFrom(
        this.userServiceClient.send('user_update_password', { id, data }).pipe()
      );
      return response;
    } catch (error) {
      console.error('Error updating password in microservice:', error);
      throw new Error('Error updating password');
    }
  }

  async findAll() {
    return firstValueFrom(this.userServiceClient.send('user_find_all', {}));
  }
}