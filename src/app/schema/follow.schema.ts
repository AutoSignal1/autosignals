import { Prop, Schema } from '@nestjs/mongoose';
import { Document, PaginateModel } from 'mongoose';
import { NextFunction } from 'express';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

import { CREATE_SCHEMA, customPropsDefault } from '@core/utils/models';

/**
 * @class
 * @description typical mongoose schema definition stating the accurate data structure of each field in the document
 * @exports mongooseSchema
 * @extends Mongoose_DOCUMENT_INTERFACE
 */

@Schema(customPropsDefault())
export class Follow extends Document {
  @Prop({ required: [true, 'Follower Is Required!'] })
  readonly follower: string;

  @Prop({ required: [true, 'userId Is Required!'] })
  readonly userId: string;
}

const FollowModelName = Follow.name;
const FollowSchema = CREATE_SCHEMA<Follow>(Follow);

FollowSchema.pre('save', async function (next: NextFunction) {

  next();
});

FollowSchema.pre<Follow>('save', async function (next: NextFunction) {

  next();
});


const FollowModel = { name: FollowModelName, schema: FollowSchema };

export { FollowSchema, FollowModelName, FollowModel };
