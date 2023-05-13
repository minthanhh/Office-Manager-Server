import { ApiProperty } from '@nestjs/swagger';
import { TypeCompletion } from 'src/constants/enums';
import { IsEnum, MaxLength } from 'class-validator';

export class CreateCompletionReportDto {
    @ApiProperty({ default: 'description of completion report' })
    description: string;

    @ApiProperty({ enum: TypeCompletion, default: TypeCompletion.COMPLETED })
    @IsEnum(TypeCompletion, {
        message: `status must be a valid enum ${TypeCompletion.COMPLETED} | ${TypeCompletion.UNCOMPLETED}`,
    })
    type: TypeCompletion;

    @ApiProperty({ default: '5f9f1c0b0b9d0e1c1c8b8b8b' })
    userReportId: string;
}
