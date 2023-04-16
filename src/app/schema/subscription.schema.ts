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
export class Subscription extends Document {
  @Prop({ default: () => nanoid(12), unique: true })
  readonly subscriptionId: string;

  @Prop({ required: [true, 'Trader Is Required!'] })
  readonly traderId: string;

  @Prop({ required: [true, 'Subscription Type Is Required!'] })
  readonly sub_type: string;
  
  @Prop({ required: [true, 'Start Date Is Required!'] })
  readonly startDate: Date;
  
  @Prop({ required: [true, 'End Date Is Required!'] })
  readonly endDate: Date;
}

const SubscriptionModelName = Subscription.name;
const SubscriptionSchema = CREATE_SCHEMA<Subscription>(Subscription);

SubscriptionSchema.pre('save', async function (next: NextFunction) {

  next();
});

SubscriptionSchema.pre<Subscription>('save', async function (next: NextFunction) {

  next();
});


const SubscriptionModel = { name: SubscriptionModelName, schema: SubscriptionSchema };

export { SubscriptionSchema, SubscriptionModelName, SubscriptionModel };
