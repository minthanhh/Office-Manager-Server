import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Metadata } from './metadata.entity';
import { StatusRoom } from 'src/constants/enums';

@Schema({
    timestamps: true,
    collection: `${_.camelCase(Room.name)}s`,
})
export class Room extends AggregateRoot {
    @Prop({ type: Types.ObjectId, ref: Metadata.name })
    place: Metadata;

    @Prop({ type: Types.ObjectId, ref: Metadata.name })
    floor: Metadata;

    @Prop()
    name: string;

    @Prop()
    index: number;

    @Prop()
    status: StatusRoom;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
