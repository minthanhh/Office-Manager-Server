import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserLogin } from './dto/user-login.dto';

@Controller('auth')
@ApiTags('Auth Api')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @UseGuards(LocalAuthGuard)
    async login(@Req() req) {
        if (!req.user) {
            return undefined;
        }
        const { userId, username, role } = req.user;

        const userLogin: UserLogin = {
            userId: userId,
            username: username,
            role: role,
        };
        return await this.authService.login(userLogin);
    }

    @Get('google/id-token')
    @UseGuards(AuthGuard('google-id-token'))
    async googleVerifyIdToken(@Req() req: Request) {
        // const result = await this.authService.loginGoogleUser(req.user);
        // return result;
    }
}
