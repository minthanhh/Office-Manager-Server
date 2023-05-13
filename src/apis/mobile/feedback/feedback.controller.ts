import { Feedback } from './../../../models/entities/feedback.entity';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post()
    async createFeedback(
        @Body() createFeedbackDto: CreateFeedbackDto,
        @Req() req,
    ): Promise<Feedback> {
        const { _id } = req.user;
        return await this.feedbackService.createFeedback(
            createFeedbackDto,
            _id,
        );
    }
}
