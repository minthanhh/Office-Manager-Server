import { StatusRoom } from 'src/constants/enums';
import { Metadata } from 'src/models/entities/metadata.entity';

export class CreateRoomDto {
    place: Metadata;
    floor: Metadata;
    name: string;
    type: string;
    index: number;
    status: StatusRoom;
}
