import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProblemService } from './problem.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { UserType } from 'src/constants/enums';

@Controller('app/problem')
@ApiTags('Mobile Problem Api')
export class ProblemController {
    constructor(private readonly problemService: ProblemService) {}

    @Get()
    @Authorize(UserType.TEACHER)
    async findAll() {
        return await this.problemService.findAll();
    }
}
