import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({
    timestamps: true,
    collection: `${_.camelCase(Infrastructure.name)}s`,
})
export class Infrastructure extends AggregateRoot {
    @Prop()
    name: string;

    @Prop()
    description: string;
}

export const InfrastructureSchema =
    SchemaFactory.createForClass(Infrastructure);
