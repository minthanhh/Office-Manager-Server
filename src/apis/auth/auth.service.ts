import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/entities/user.entity';
import { CreateUserModel } from './models/create-user.model';
import { Status } from 'src/constants/enums';
import { JwtService } from '@nestjs/jwt';
import { appSettings } from 'src/configs/appsettings';
import { UserLogin } from './dto/user-login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    // async loginGoogleUser(
    //     user: any,
    // ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
    //     const {
    //         email,
    //         id: username,
    //         last_name,
    //         first_name,
    //         middle_name,
    //         picture,
    //     } = user._json;

    //     const userExit = await this.userModel.findOne({ email: email });

    //     if (!userExit) {
    //         const userDto: CreateUserModel = {
    //             email: email,
    //             name: `${last_name} ${first_name} ${middle_name}`,
    //             department: '',
    //             role: process.env.OPERATOR_ROLE,
    //             username: username,
    //             password: '',
    //             phone: '',
    //             status: Status.ACTIVE,
    //             fcm_tokens: [],
    //             avatar: picture,
    //         };

    //         const newUser = await this.userModel.create(userDto);

    //         // return await this.generateJwtToken(newUser);
    //     }

    //     // return await this.generateJwtToken(userExit);
    // }

    async login(
        userLogin: UserLogin,
    ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
        return await this.generateJwtToken(userLogin);
    }

    private async generateJwtToken(payload: UserLogin) {
        const refreshToken = await this.jwtService.signAsync(
            {
                sub: payload.userId,
            },
            {
                expiresIn: appSettings.jwt.refreshExpireIn,
            },
        );

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            refreshToken,
        };
    }
}
