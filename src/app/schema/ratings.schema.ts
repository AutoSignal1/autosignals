import { Prop, Schema } from '@nestjs/mongoose';
import { Document, PaginateModel } from 'mongoose';
import { NextFunction } from 'express';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

import { CREATE_SCHEMA, customPropsDefault } from '@core/utils/models';
import { nanoid } from 'nanoid';

/**
 * @class
 * @description typical mongoose schema definition stating the accurate data structure of each field in the document
 * @exports mongooseSchema
 * @extends Mongoose_DOCUMENT_INTERFACE
 */

@Schema(customPropsDefault())
export class Rating extends Document {
  @Prop({ default: () => nanoid(12), unique: true })
  readonly ratingId: string;

  @Prop({ required: [true, 'Trader Is Required!'] })
  readonly traderId: string;
  
  @Prop({ required: [true, 'Provider Is Required!'] })
  readonly providerId: string;

  @Prop({ required: [true, 'Rate Is Required!'] })
  readonly rate: Number;
  
  @Prop({ required: [true, 'Text Is Required!'] })
  readonly text: string;
}

const RatingModelName = Rating.name;
const RatingSchema = CREATE_SCHEMA<Rating>(Rating);

RatingSchema.pre('save', async function (next: NextFunction) {

  next();
});

RatingSchema.pre<Rating>('save', async function (next: NextFunction) {

  next();
});


const RatingModel = { name: RatingModelName, schema: RatingSchema };

export { RatingSchema, RatingModelName, RatingModel };
