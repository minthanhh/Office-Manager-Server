import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: `${_.camelCase(Department.name)}s` })
export class Department extends AggregateRoot {
    @Prop()
    name: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
