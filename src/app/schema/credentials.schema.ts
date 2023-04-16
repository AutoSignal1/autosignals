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
export class Credential extends Document {
  @Prop({ default: () => nanoid(12), unique: true })
  readonly credentialId: string;

  @Prop({ required: [true, 'Trader Is Required!'] })
  readonly traderId: string;

  @Prop({ required: [true, 'Platform Is Required!'] })
  readonly platform: string;
  
  @Prop({ required: [true, 'Api Key Is Required!'] })
  readonly api_key: string;
  
  @Prop({ required: [true, 'Api Secret Is Required!'] })
  readonly api_secret: string;
}

const CredentialModelName = Credential.name;
const CredentialSchema = CREATE_SCHEMA<Credential>(Credential);

CredentialSchema.pre('save', async function (next: NextFunction) {

  next();
});

CredentialSchema.pre<Credential>('save', async function (next: NextFunction) {

  next();
});


const CredentialModel = { name: CredentialModelName, schema: CredentialSchema };

export { CredentialSchema, CredentialModelName, CredentialModel };
