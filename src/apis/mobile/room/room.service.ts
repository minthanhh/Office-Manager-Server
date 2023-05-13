import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { StatusRoom, TypeMetadata } from 'src/constants/enums';
import { Metadata } from 'src/models/entities/metadata.entity';
import { Room } from 'src/models/entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Metadata.name) private metadataModel: Model<Metadata>,
        @InjectModel(Room.name) private roomModel: Model<Room>,
    ) {}

    async findAllPlaceAndFloor() {
        const places = await this.metadataModel.find({
            type: TypeMetadata.PLACE,
        });
        const floors = await this.metadataModel.find({
            type: TypeMetadata.FLOOR,
        });

        const result = places.map((place) => {
            const floor = floors.filter(
                (floor) => floor.key.toString() === place._id.toString(),
            );
            return {
                ...place.toObject(),
                floor,
            };
        });

        return result;
    }
    async createRoom(createRoomDto: CreateRoomDto) {
        const places = await this.metadataModel.find({
            type: TypeMetadata.PLACE,
        });
        const floors = await this.metadataModel.find({
            type: TypeMetadata.FLOOR,
        });
        const placeId = places.filter((place) => {
            place._id.toString() === createRoomDto.place;
        });
        const room = await this.roomModel.create({
            name: new mongoose.Types.ObjectId(createRoomDto.name),
            type: new mongoose.Types.ObjectId(createRoomDto.type),
            index: new mongoose.Types.ObjectId(createRoomDto.index),
            status: StatusRoom,
        });

        // return room;
    }
}
