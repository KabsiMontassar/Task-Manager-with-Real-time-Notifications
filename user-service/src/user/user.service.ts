import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().select('-password');
    }

    async findById(id: string): Promise<UserDocument> {
        try {
            console.log('Finding user by ID:', id); // Debug log
            
            if (!isValidObjectId(id)) {
                console.log('Invalid MongoDB ObjectId:', id); // Debug log
                throw new Error('Invalid user ID format');
            }

            const user = await this.userModel.findById(id).select('-password');
            if (!user) {
                console.log('User not found for ID:', id); // Debug log
                throw new NotFoundException('User not found');
            }
            console.log('Found user:', user); // Debug log
            return user;
        } catch (error) {
            console.error('Error finding user:', error); // Debug log
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Error finding user: ' + error.message);
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid user ID format');
        }

        const user = await this.userModel.findByIdAndUpdate(
            id,
            updateUserDto,
            { new: true }
        ).select('-password');

        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async delete(id: string): Promise<void> {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid user ID format');
        }

        const result = await this.userModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new NotFoundException('User not found');
        }
    }
}
