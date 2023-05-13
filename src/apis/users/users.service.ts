import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/models/entities/role.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    ) {}

    async validateUser(username: string, password: string): Promise<User> {
        if (!username || !password) {
            throw new BadRequestException(
                'email_password_incorrectly',
                'Email or password incorrectly',
            );
        }

        const user = await this.findUserByUsernameOrEmail(
            username.trim(),
            username.trim(),
        );

        if (!user) {
            throw new BadRequestException(
                'email_password_incorrectly',
                'Email or password incorrectly',
            );
        }

        const isMatch =
            user &&
            user.password &&
            (await bcrypt.compare(password, user.password));
        if (isMatch) {
            return user;
        }
        throw new BadRequestException(
            'email_password_incorrectly',
            'Email or password incorrectly',
        );
    }

    async findUserByUsernameOrEmail(username: string, email: string) {
        if (!username && !email) {
            return null;
        }

        let filterQuery = [];
        if (username) {
            filterQuery = [...filterQuery, { username: username }];
        }

        if (email) {
            filterQuery = [...filterQuery, { email: email }];
        }

        const user = await this.userModel
            .findOne({
                $or: [...filterQuery],
                password: { $ne: null },
            })
            .populate('role');
        return user;
    }
}
