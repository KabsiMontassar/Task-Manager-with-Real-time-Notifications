import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
        const user = await this.userModel.findById(id).select('-password');
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
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
        const result = await this.userModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new NotFoundException('User not found');
        }
    }
}
