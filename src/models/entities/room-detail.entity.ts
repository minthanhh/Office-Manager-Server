import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Infrastructure } from './Infrastructures.entity';
import { Room } from './room.entity';
import { Status } from 'src/constants/enums';

@Schema({
    timestamps: true,
    collection: `${_.camelCase(RoomDetail.name)}s`,
})
export class RoomDetail extends AggregateRoot {
    @Prop({ type: Types.ObjectId, ref: Infrastructure.name })
    infrastructure: Infrastructure;

    @Prop({ type: Types.ObjectId, ref: Room.name })
    room: Room;

    @Prop()
    quantity: number;

    @Prop()
    status: Status;

    @Prop()
    note: string;
}

export const RoomDetailSchema = SchemaFactory.createForClass(RoomDetail);
