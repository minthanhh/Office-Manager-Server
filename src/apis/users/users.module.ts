import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/entities/user.entity';
import { Role, RoleSchema } from 'src/models/entities/role.entity';

@Module({
    providers: [UsersService],
    controllers: [UsersController],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Role.name, schema: RoleSchema },
        ]),
    ],
})
export class UsersModule {}
