import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from 'src/models/entities/room.entity';
import { Metadata, MetadataSchema } from 'src/models/entities/metadata.entity';

@Module({
    controllers: [RoomController],
    providers: [RoomService],
    imports: [
        MongooseModule.forFeature([
            { name: Room.name, schema: RoomSchema },
            {
                name: Metadata.name,
                schema: MetadataSchema,
            },
        ]),
    ],
})
export class RoomModule {}
