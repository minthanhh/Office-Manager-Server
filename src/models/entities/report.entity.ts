import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { User } from './user.entity';
import { Room } from './room.entity';
import { Types } from 'mongoose';
import { Problem } from './problems.entity';
import { Status } from 'src/constants/enums';

@Schema({ timestamps: true, collection: `${_.camelCase(Report.name)}s` })
export class Report extends AggregateRoot {
    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: User.name })
    user: User;

    @Prop({ type: Types.ObjectId, ref: Room.name })
    room: Room;

    @Prop({ type: Types.ObjectId, ref: Problem.name })
    problem: Problem;

    @Prop()
    status: Status;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
