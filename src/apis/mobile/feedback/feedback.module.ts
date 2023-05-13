import {
    Completion,
    CompletionSchema,
} from './../../../models/entities/completions.entity';
import {
    Feedback,
    FeedbackSchema,
} from './../../../models/entities/feedback.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Feedback.name, schema: FeedbackSchema },
            { name: Completion.name, schema: CompletionSchema },
        ]),
    ],
    controllers: [FeedbackController],
    providers: [FeedbackService],
})
export class FeedbackModule {}
