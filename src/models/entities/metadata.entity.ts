import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: `${_.camelCase(Metadata.name)}s` })
export class Metadata extends AggregateRoot {
    @Prop()
    type: string;

    @Prop()
    key: Types.ObjectId;

    @Prop()
    value: string;
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);
