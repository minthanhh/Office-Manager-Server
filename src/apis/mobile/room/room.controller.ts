import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators/authorize.decorator';
import { UserType } from 'src/constants/enums';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('app/room')
@ApiTags('Mobile Room API')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get('place-floor')
    @Authorize(UserType.ADMINISTRATIVE_STAFF)
    async getAllPlaceAndFloor() {
        return this.roomService.findAllPlaceAndFloor();
    }

    @Post('create-room')
    // @Authorize(UserType.ADMINISTRATIVE_STAFF)
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        return this.roomService.createRoom(createRoomDto);
    }
}
