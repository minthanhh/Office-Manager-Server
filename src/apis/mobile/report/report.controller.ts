import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Authorize } from 'src/decorators/authorize.decorator';
import { Status, UserType } from 'src/constants/enums';
import mongoose from 'mongoose';
import { CreateCompletionReportDto } from './dto/create-completion-report.dto';

@Controller('app/report')
@ApiTags('Mobile Report Api')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    @Authorize(UserType.TEACHER)
    async create(@Body() createReportDto: CreateReportDto, @Req() req) {
        const { _id } = req.user;
        return await this.reportService.create(createReportDto, _id);
    }

    @Get()
    @Authorize(UserType.ADMINISTRATIVE_STAFF)
    async findAll() {
        return await this.reportService.findAll();
    }

    @Post('submit-report/:id')
    @Authorize(UserType.ADMINISTRATIVE_STAFF)
    async submitReport(@Param('id') id: string, @Req() req) {
        const { _id } = req.user;
        const reportId = new mongoose.Types.ObjectId(id);
        return await this.reportService.submitReport(reportId, _id);
    }

    @Post('submit-completion')
    @Authorize(UserType.ADMINISTRATIVE_STAFF)
    async submitCompletion(
        @Req() req,
        @Body() createCompletionReportDto: CreateCompletionReportDto,
    ) {
        const { _id } = req.user;
        return await this.reportService.submitCompletion(
            _id,
            createCompletionReportDto,
        );
    }

    @Get('completion/:id')
    @Authorize(UserType.ADMINISTRATIVE_STAFF)
    async getCompletion(@Param('id') id: string) {
        const completionReportId = new mongoose.Types.ObjectId(id);
        return await this.reportService.findOneCompletion(completionReportId);
    }

    @Get('history/:id')
    @Authorize(UserType.TEACHER)
    async historyReport(@Param('id') id: string, @Req() req) {
        const { _id } = req.user;
        const reportId = new mongoose.Types.ObjectId(id);
        return await this.reportService.historyReport(reportId, _id);
    }

    @Get('user-report-history')
    @Authorize(UserType.ADMINISTRATIVE_STAFF)
    async getHistoriesUserReport(@Req() req) {
        const { _id } = req.user;
        return this.reportService.findHistoriesUserReport(_id);
    }

    @Get(':id')
    @Authorize(UserType.ADMINISTRATIVE_STAFF)
    async getReport(@Param('id') id: string) {
        const reportId = new mongoose.Types.ObjectId(id);
        return this.reportService.findOneReport(reportId);
    }
}
