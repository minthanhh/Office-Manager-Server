import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Department } from './department.entity';
import { Role } from './role.entity';
import { Status } from 'src/constants/enums';

@Schema({ timestamps: true, collection: `${_.camelCase(User.name)}s` })
export class User extends AggregateRoot {
    @Prop()
    email: string;

    @Prop()
    name: string;

    @Prop({ type: Types.ObjectId, ref: Department.name })
    department: Department;

    @Prop({ type: Types.ObjectId, ref: Role.name })
    role: Role;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    phone: string;

    @Prop()
    status: Status;

    @Prop()
    fcm_tokens: Array<string>;

    @Prop()
    avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
