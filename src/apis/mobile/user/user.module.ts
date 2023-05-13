import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/entities/user.entity';
import { Role, RoleSchema } from 'src/models/entities/role.entity';
import {
    Department,
    DepartmentSchema,
} from 'src/models/entities/department.entity';

@Module({
    providers: [UserService],
    controllers: [UserController],
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
            {
                name: Role.name,
                schema: RoleSchema,
            },
        ]),
    ],
})
export class UserModule {}
