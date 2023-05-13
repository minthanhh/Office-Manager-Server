import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/models/entities/user.entity';
import { UpdateProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async updateProfile(
        userId: mongoose.Types.ObjectId,
        updateProfileDto: UpdateProfileDto,
    ): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(userId, {
            ...updateProfileDto,
        });

        if (!user) {
            throw new BadRequestException(`User id ${userId} not found`);
        }

        return user;
    }

    async getProfile(userId: mongoose.Types.ObjectId): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new BadRequestException(`User id ${userId} not found`);
        return user;
    }

    async findUserByRoleAdminStaff() {
        const users = await this.userModel
            .find({ role: process.env.ADMINISTRATIVE_STAFF })
            .select('-password -fcm_tokens')
            .populate('department');

        return users;
    }
}
