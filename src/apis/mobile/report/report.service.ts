import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Report } from 'src/models/entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UserReport } from 'src/models/entities/user-report.entity';
import { Completion } from 'src/models/entities/completions.entity';
import { Room } from 'src/models/entities/room.entity';
import { Status } from 'src/constants/enums';
import { CreateCompletionReportDto } from './dto/create-completion-report.dto';
import {
    getISOToDayMonthYear,
    getISOToHoursMinutes,
} from 'src/extensions/function-helper';
import _ from 'lodash';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) readonly reportModel: Model<Report>,
        @InjectModel(UserReport.name)
        readonly userReportModel: Model<UserReport>,
        @InjectModel(Completion.name)
        readonly completionModel: Model<Completion>,
        @InjectModel(Room.name)
        readonly roomModel: Model<Room>,
    ) {}

    async create(createReportDto: CreateReportDto, userId: string) {
        const reportExists = await this.reportModel.findOne({
            user: userId,
            status: Status.ACTIVE,
        });

        if (reportExists) {
            throw new BadRequestException(
                `User report id ${reportExists._id} pending`,
            );
        }

        const report = await this.reportModel.create({
            description: createReportDto.description,
            user: new mongoose.Types.ObjectId(userId),
            room: new mongoose.Types.ObjectId(createReportDto.room),
            problem: new mongoose.Types.ObjectId(createReportDto.problem),
            status: Status.ACTIVE,
        });

        return report._id;
    }

    async findAll() {
        return await this.reportModel
            .find({ status: Status.ACTIVE })
            .populate('user')
            .populate('room')
            .populate('problem');
    }

    async findOneCompletion(completionReportId: mongoose.Types.ObjectId) {
        const completionReport = await this.completionModel
            .findOne({ _id: completionReportId })
            .populate('user')
            .populate('room')
            .populate('problem');

        if (!completionReport) {
            throw new BadRequestException(
                `Completion report ${completionReportId} does not exist`,
            );
        }
        return completionReport;
    }

    async submitReport(reportId: mongoose.Types.ObjectId, userId: string) {
        await this.reportValid(reportId);
        const userReport = await this.userReportModel.findOne({
            report: reportId,
            status: Status.ACTIVE,
        });

        if (userReport) {
            throw new BadRequestException(
                `User report id ${reportId} already exists`,
            );
        }

        const newUserReport = await this.userReportModel.create({
            report: reportId,
            user: new mongoose.Types.ObjectId(userId),
            status: Status.ACTIVE,
        });

        return newUserReport._id;
    }

    async submitCompletion(
        _id: string,
        createCompletionReportDto: CreateCompletionReportDto,
    ) {
        const userReportId = new mongoose.Types.ObjectId(
            createCompletionReportDto.userReportId,
        );

        const userId = new mongoose.Types.ObjectId(_id);
        await this.userReportValid(userReportId, userId);
        const { type, description } = createCompletionReportDto;

        const completion = await this.completionModel.findOne({
            userReport: userReportId,
        });

        if (completion) {
            throw new BadRequestException(
                `Completion id ${userReportId} already exists`,
            );
        }

        const result = await this.completionModel.create({
            userReport: userReportId,
            type,
            description,
        });
        return result._id;
    }

    async historyReport(reportId: mongoose.Types.ObjectId, userId: string) {
        const report = await this.reportModel
            .findOne({
                _id: reportId,
                status: Status.ACTIVE,
                user: new mongoose.Types.ObjectId(userId),
            })
            .populate('problem');

        const userReport = await this.userReportModel
            .findOne({
                report: reportId,
                status: Status.ACTIVE,
            })
            .populate('user')
            .populate('report');

        if (!userReport) {
            throw new BadRequestException(
                `User report id ${reportId} not found`,
            );
        }

        const completions = await this.completionModel.findOne({
            userReport: userReport._id,
        });

        const result = {
            report: {
                _id: _.get(report, '_id', null),
                problem: _.get(report, 'problem.name', null),
                description: _.get(report, 'description', null),
                time: getISOToHoursMinutes(report['createdAt']),
            },
            userReport: {
                _id: _.get(userReport, '_id', null),
                time: getISOToHoursMinutes(
                    _.get(userReport, 'createdAt', null),
                ),
            },
            completion: {
                _id: _.get(completions, '_id', null),
                type: _.get(completions, 'type', null),
                description: _.get(completions, 'description', null),
                time: getISOToHoursMinutes(
                    _.get(completions, 'createdAt', null),
                ),
            },
            user: {
                _id: _.get(userReport, 'user._id', null),
                name: _.get(userReport, 'user.name', null),
                phone: _.get(userReport, 'user.phone', null),
                time: getISOToHoursMinutes(
                    _.get(userReport, 'createdAt', null),
                ),
                date: getISOToDayMonthYear(
                    _.get(userReport, 'createdAt', null),
                ),
                avatar: _.get(userReport, 'user.avatar', null),
            },
        };

        return result;
    }

    async findHistoriesUserReport(userId: string) {
        const userReports = await this.userReportModel
            .find({
                user: new mongoose.Types.ObjectId(userId),
                status: Status.ACTIVE,
            })
            .populate({
                path: 'report',
                populate: [
                    { path: 'problem' },
                    { path: 'user' },
                    { path: 'room' },
                ],
            });

        const result = userReports.map((userReport) => {
            const report = userReport.report;
            return {
                _id: _.get(report, '_id', null),
                problem: _.get(report, 'problem.name', null),
                description: _.get(report, 'description', null),
                time: getISOToHoursMinutes(report['createdAt']),
                date: getISOToDayMonthYear(report['createdAt']),
                room: _.get(report, 'room.name', null),
                user: {
                    _id: _.get(report, 'user._id', null),
                    name: _.get(report, 'user.name', null),
                    avatar: _.get(report, 'user.avatar', null),
                },
            };
        });

        return result;
    }

    private async reportValid(reportId: mongoose.Types.ObjectId) {
        const report = await this.reportModel
            .findOne({
                _id: reportId,
                status: Status.ACTIVE,
            })
            .populate('problem');
        if (!report) {
            throw new BadRequestException(`Report id ${reportId} not found`);
        }
        return report;
    }

    private async userReportValid(
        reportId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId,
    ) {
        const userReport = await this.userReportModel.findOne({
            _id: reportId,
            status: Status.ACTIVE,
            user: userId,
        });

        if (!userReport) {
            throw new BadRequestException(
                `User report id ${reportId} not found`,
            );
        }

        return;
    }

    async findOneReport(reportId: mongoose.Types.ObjectId) {
        const report = await this.reportModel
            .findOne({
                _id: reportId,
                status: Status.ACTIVE,
            })
            .populate('user')
            .populate('room')
            .populate('problem');

        if (!report) {
            throw new BadRequestException(
                `detail report id ${reportId} not found`,
            );
        }

        return report;
    }
}
