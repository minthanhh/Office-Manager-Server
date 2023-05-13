import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/models/entities/user.entity';
import { UpdateProfileDto } from './dto/update-user-profile.dto';
import { UserService } from './user.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { UserType } from 'src/constants/enums';

@Controller('app/user')
@ApiTags('Mobile Api')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('admin-staff')
    @Authorize(UserType.TEACHER)
    async getUserByRoleAdminStaff() {
        return await this.userService.findUserByRoleAdminStaff();
    }

    @Put()
    @Authorize(
        UserType.OPERATOR,
        UserType.TEACHER,
        UserType.ADMINISTRATIVE_STAFF,
    )
    async updateProfile(
        @Req() req,
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<User> {
        const { _id } = req.user;
        return await this.userService.updateProfile(
            new mongoose.Types.ObjectId(_id),
            updateProfileDto,
        );
    }

    @Get()
    @Authorize(
        UserType.OPERATOR,
        UserType.TEACHER,
        UserType.ADMINISTRATIVE_STAFF,
    )
    async getProfile(@Req() req): Promise<User> {
        const { _id } = req.user;
        return await this.userService.getProfile(
            new mongoose.Types.ObjectId(_id),
        );
    }
}
