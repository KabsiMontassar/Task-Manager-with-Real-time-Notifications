import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @MessagePattern({ cmd: 'validate_user' })
    async validateUser(@Payload() data: { email: string; password: string }) {
        return this.authService.validateUser(data.email, data.password);
    }

    @MessagePattern({ cmd: 'register_user' })
    async registerUser(@Payload() createUserDto: CreateUserDto) {
        try {
            return await this.authService.register(createUserDto);
        } catch (error) {
            // Rethrow the error to be handled by the API Gateway
            throw error;
        }
    }
}
