import mongoose, { Document, Model, Schema } from 'mongoose';
import { CredentialDoc } from './Credentials';

export interface CopyTraderDoc extends Document {
  email: string;
  password: string;
  phone: string;
  full_name: string;
  active: boolean;
  credentials: [CredentialDoc];
  salt: string;
  otp: string;
  otp_expiry: Date;
  followings: [CopyTraderDoc];
}

const CTraderSchema = new Schema<CopyTraderDoc>(
  {
    email: { type: String, required: true, maxLength: 50, unique: true, index: true },
    phone: { type: String, required: true, maxLength: 15, unique: true, index: true },
    full_name: { type: String, required: true, maxLength: 15 },
    password: { type: String },
    salt: { type: String },
    otp: { type: String },
    otp_expiry: { type: Date },
    active: { type: Boolean, default: false },
    followings: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'traders',
      },
    ],
    credentials: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'credentials',
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  },
);

const CopyTrader = mongoose.model<CopyTraderDoc>('ctraders', CTraderSchema);
export { CopyTrader };
