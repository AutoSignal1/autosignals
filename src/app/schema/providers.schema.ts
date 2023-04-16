import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NextFunction } from 'express';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

import { CREATE_SCHEMA, customPropsDefault } from '@core/utils/models';

/**
 * @class
 * @description typical mongoose schema definition stating the accurate data structure of each field in the document
 * @exports mongooseSchema
 * @extends Mongoose_DOCUMENT_INTERFACE
 */

@Schema(customPropsDefault(['password', 'socialId']))
export class Provider extends Document {

  @Prop({ default: () => nanoid(12), unique: true })
  readonly providerId: string;

  @Prop({ required: [true, 'userId Is Required!'] })
  readonly userId: string;

  @Prop({ default: false })
  readonly phone_verified: boolean;
  
  @Prop({ default: false })
  readonly verified: boolean;

  @Prop({ default: 0 })
  readonly signals: number; 
  
  @Prop({ default: 0 })
  readonly ratings: number; 
  
  @Prop({ default: 0 })
  readonly followers: number; 
  
}

const ProviderModelName = Provider.name;
const ProviderSchema = CREATE_SCHEMA<Provider>(Provider);

// ProviderSchema.index({ 'skills.name': 1 }, { unique: true });

ProviderSchema.pre('save', async function (next: NextFunction) {

  next();
});

const ProviderModel = { name: ProviderModelName, schema: ProviderSchema };

export { ProviderSchema, ProviderModelName, ProviderModel };
