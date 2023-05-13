import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { User } from './user.entity';
import { Types } from 'mongoose';
import { Report } from './report.entity';
import { Status } from 'src/constants/enums';

@Schema({ timestamps: true, collection: `${_.camelCase(UserReport.name)}s` })
export class UserReport extends AggregateRoot {
    @Prop({ type: Types.ObjectId, ref: User.name })
    user: User;

    @Prop({ type: Types.ObjectId, ref: Report.name })
    report: Report;

    @Prop()
    status: Status;
}

export const UserReportSchema = SchemaFactory.createForClass(UserReport);
