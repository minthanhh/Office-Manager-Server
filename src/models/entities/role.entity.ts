import _ from 'lodash';
import { AggregateRoot } from '../aggregate-root';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: `${_.camelCase(Role.name)}s` })
export class Role extends AggregateRoot {
    @Prop()
    name: string;

    @Prop()
    description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
