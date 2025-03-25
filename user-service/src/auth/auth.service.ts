import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { keys } from '../config/keys';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) {}

    async register(createUserDto: CreateUserDto): Promise<{ token: string }> {
        const { email, password } = createUserDto;

        // Check if user exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new UnauthorizedException('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, keys.bcryptSaltRounds);

        // Create new user
        const newUser = await this.userModel.create({
            ...createUserDto,
            password: hashedPassword,
        });

        // Generate JWT
        const token = this.jwtService.sign({ 
            userId: newUser._id,
            email: newUser.email,
            role: newUser.role 
        });

        return { token };
    }

    async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
        const { email, password } = loginUserDto;

        // Find user
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT
        const token = this.jwtService.sign({ 
            userId: user._id,
            email: user.email,
            role: user.role 
        });

        return { token };
    }

    async validateUser(userId: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}
