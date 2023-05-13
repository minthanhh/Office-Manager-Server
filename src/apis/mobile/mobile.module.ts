import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { ProblemModule } from './problem/problem.module';
import { FeedbackModule } from './feedback/feedback.module';
import { RoomModule } from './room/room.module';

@Module({
    imports: [
        UserModule,
        ReportModule,
        ProblemModule,
        FeedbackModule,
        RoomModule,
    ],
})
export class MobileModule {}
