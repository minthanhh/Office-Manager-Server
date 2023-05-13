import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Problem } from 'src/models/entities/problems.entity';

@Injectable()
export class ProblemService {
    constructor(
        @InjectModel(Problem.name) readonly problemModel: Model<Problem>,
    ) {}

    async findAll() {
        return await this.problemModel.find();
    }
}
