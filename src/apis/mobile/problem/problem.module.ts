import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { Problem, ProblemSchema } from 'src/models/entities/problems.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    providers: [ProblemService],
    controllers: [ProblemController],
    imports: [
        MongooseModule.forFeature([
            { name: Problem.name, schema: ProblemSchema },
        ]),
    ],
})
export class ProblemModule {}
