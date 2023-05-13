import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: `${_.camelCase(Problem.name)}s` })
export class Problem extends AggregateRoot {
    @Prop()
    name: string;

    @Prop()
    description: string;
}

export const ProblemSchema = SchemaFactory.createForClass(Problem);
