import { Completion } from './../../../models/entities/completions.entity';
import { Feedback } from './../../../models/entities/feedback.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
    logger: Logger;
    constructor(
        @InjectModel(Feedback.name)
        private readonly feedbackModel: Model<Feedback>,
        @InjectModel(Completion.name)
        private readonly completionModel: Model<Completion>,
    ) {
        this.logger = new Logger(this.feedbackModel.name);
    }

    async createFeedback(
        createFeedbackDto: CreateFeedbackDto,
        userId: string,
    ): Promise<Feedback> {
        const { completionId, start, evaluate } = createFeedbackDto;
        const isExits = await this.completionModel.findById(
            new mongoose.Types.ObjectId(completionId),
        );

        if (isExits === null)
            throw new NotFoundException(
                '[FeedBack]: You must create completion before create feedback',
            );

        const feedbackObject: Feedback = await this.feedbackModel.create({
            completion: completionId,
            start: start,
            evaluate: evaluate,
            user: new mongoose.Types.ObjectId(userId),
        });

        return feedbackObject;
    }
}
