import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { keys } from '../config/keys';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) {}

    async register(createUserDto: CreateUserDto): Promise<{ token: string; user: Partial<UserDocument> }> {
        try {
            const { email, password, role } = createUserDto;

            // Check if user exists
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }

            // Validate role
            if (role && !Object.values(UserRole).includes(role)) {
                throw new BadRequestException('Invalid role specified');
            }

            // Set default role if not provided
            const userRole = role || UserRole.EMPLOYEE;

            // Hash password
            const hashedPassword = await bcrypt.hash(password, keys.bcryptSaltRounds);

            // Create new user
            const newUser = await this.userModel.create({
                ...createUserDto,
                role: userRole,
                password: hashedPassword,
                isActive: true
            });

            // Generate JWT
            const token = this.jwtService.sign({ 
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role 
            });

            // Return user data without password
            const { password: _, ...userData } = newUser.toObject();

            return { 
                token,
                user: userData
            };
        } catch (error) {
            if (error instanceof ConflictException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to register user: ' + error.message);
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
        const { email, password } = loginUserDto;
        
        // Find user and validate password
        const user = await this.validateUser(email, password);
        
        // Generate JWT
        const token = this.jwtService.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        });

        return { token };
    }

    async validateUser(email: string, password: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}
