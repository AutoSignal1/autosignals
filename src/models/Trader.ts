import mongoose, { Document, Model, Schema } from 'mongoose';
import { RatingDoc } from './Rating';

export interface TraderDoc extends Document {
  email: string;
  password: string;
  phone: string;
  full_name: string;
  ratings: [RatingDoc];
  phone_verified: boolean;
  salt: string;
  active: boolean;
  otp: string;
  otp_expiry: Date;
  followers: [TraderDoc];
}

const UserSchema = new Schema<TraderDoc>(
  {
    email: { type: String, required: true, maxLength: 50, unique: true, index: true },
    phone: { type: String, required: true, maxLength: 15, unique: true, index: true },
    password: { type: String },
    salt: { type: String },
    otp: { type: String },
    otp_expiry: { type: Date },
    active: { type: Boolean, default: false },
    ratings: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ratings',
        default: [],
      },
    ],
    phone_verified: { type: Boolean, default: false },
    followers: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        default: [],
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

const Trader = mongoose.model<TraderDoc>('traders', UserSchema);
export { Trader };
