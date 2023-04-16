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
export class User extends Document {

  @Prop({ default: () => nanoid(12), unique: true })
  readonly userId: string;

  @Prop({ lowercase: true, required: [true, 'First Name Is Required!'] })
  readonly firstName: string;

  @Prop({ lowercase: true, required: [true, 'Last Name Is Required!'] })
  readonly lastName: string;

  @Prop({ unique: true, required: [true, 'Email Address Is Required!'] })
  @IsEmail()
  readonly email: string;
  
  @Prop({ unique: true, required: [true, 'Phone Is Required!'] })
  readonly phone: string;

  @Prop({ lowercase: true })
  readonly username?: string;
  
  @Prop({ lowercase: true })
  readonly dob?: string;

  @Prop()
  password?: string;

  @Prop()
  socialId?: string;

  @Prop({
    enum: {
        values: ['google', 'facebook'],
        message: 'Invalid {VALUE}. Type must be `google` or `facebook`.'
    }
  })
  socialType?: string;

  @Prop({
    lowercase: true,
    enum: {
      values: ['trader', 'provider'],
      message: 'Account must be either trader or provider'
    }
  })
  readonly account: string;
  
  @Prop({ lowercase: true })
  readonly country: string;
  
  @Prop({ lowercase: true })
  readonly city: string;

  @Prop({ lowercase: true })
  readonly avatar: string;

  @Prop({
    required: [
      true,
      'Terms And Conditions Must Be Agreed Before User Can Be Registered!',
    ],
  })
  readonly termsAndConditionsAgreement: boolean;

  @Prop({ lowercase: true })
  readonly linkedin: string;

  @Prop({ lowercase: true })
  readonly twitter: string;

  @Prop({ default: true })
  readonly isNewUser: boolean;

  @Prop({ default: false })
  readonly isSocial: boolean;

  validatePassword: (password: string) => Promise<boolean>;
}

const UserModelName = User.name;
const UserSchema = CREATE_SCHEMA<User>(User);

// UserSchema.index({ 'skills.name': 1 }, { unique: true });

UserSchema.pre('save', async function (next: NextFunction) {
  if ((this.isNew && this.password) || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

UserSchema.methods.validatePassword = async function (password: string) {
  if (!this.password) return false;
  
  return await bcrypt.compare(password, this.password);
};

const UserModel = { name: UserModelName, schema: UserSchema };

export { UserSchema, UserModelName, UserModel };
