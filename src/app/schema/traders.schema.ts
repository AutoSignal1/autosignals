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
export class Trader extends Document {

  @Prop({ default: () => nanoid(12), unique: true })
  readonly traderId: string;

  @Prop({ required: [true, 'userId Is Required!'] })
  readonly userId: string;

  @Prop({ default: false })
  readonly phone_verified: boolean;
  
  @Prop({ default: false })
  readonly verified: boolean;

  @Prop({ default: 0 })
  readonly following: number; 

  @Prop({})
  cred_secret: string;
  
}

const TraderModelName = Trader.name;
const TraderSchema = CREATE_SCHEMA<Trader>(Trader);

// TraderSchema.index({ 'skills.name': 1 }, { unique: true });

TraderSchema.pre('save', async function (next: NextFunction) {
    if (this.isModified('cred_secret') && this.cred_secret) {
    this.cred_secret = await bcrypt.hash(this.cred_secret, 12);
    }

    next();
});
    
TraderSchema.methods.validatePassword = async function (cred_secret: string) {
    if (!this.cred_secret) return false;
    
    return await bcrypt.compare(cred_secret, this.cred_secret);
};

const TraderModel = { name: TraderModelName, schema: TraderSchema };

export { TraderSchema, TraderModelName, TraderModel };
