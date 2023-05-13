import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { UserReport } from './user-report.entity';
import { Types } from 'mongoose';
import { TypeCompletion } from 'src/constants/enums';
import { User } from './user.entity';

@Schema({ timestamps: true, collection: `${_.camelCase(Completion.name)}s` })
export class Completion extends AggregateRoot {
    @Prop({ type: Types.ObjectId, ref: UserReport.name })
    userReport: UserReport;

    @Prop()
    description: string;

    @Prop()
    type: TypeCompletion;

    @Prop({ type: Types.ObjectId, ref: User.name })
    user: User;
}

export const CompletionSchema = SchemaFactory.createForClass(Completion);
