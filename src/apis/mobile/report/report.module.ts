import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/models/entities/report.entity';
import {
    UserReport,
    UserReportSchema,
} from 'src/models/entities/user-report.entity';
import {
    Completion,
    CompletionSchema,
} from 'src/models/entities/completions.entity';
import { Room, RoomSchema } from 'src/models/entities/room.entity';

@Module({
    controllers: [ReportController],
    providers: [ReportService],
    imports: [
        MongooseModule.forFeature([
            { name: Report.name, schema: ReportSchema },
            { name: UserReport.name, schema: UserReportSchema },
            { name: Completion.name, schema: CompletionSchema },
            { name: Room.name, schema: RoomSchema },
        ]),
    ],
})
export class ReportModule {}
