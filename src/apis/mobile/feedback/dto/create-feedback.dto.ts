import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';
import mongoose from 'mongoose';

export class CreateFeedbackDto {
    @ApiProperty()
    completionId: mongoose.Types.ObjectId;

    @ApiProperty()
    @Min(0)
    @Max(5)
    start: number;

    @ApiProperty()
    evaluate: string;
}
