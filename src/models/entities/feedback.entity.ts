import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Completion } from './completions.entity';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: `${_.camelCase(Feedback.name)}s` })
export class Feedback extends AggregateRoot {
    @Prop({ type: Types.ObjectId, ref: Completion.name })
    completion: Completion;

    @Prop()
    start: number;

    @Prop()
    evaluate: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
