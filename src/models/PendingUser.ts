import mongoose, { Document, Model, Schema } from 'mongoose';
import { RatingDoc } from './Rating';

export interface PendingUserDoc extends Document {
  email: string;
  password: string;
  phone: string;
  salt: string;
  full_name: string;
  otp: string;
  otp_expiry: Date;
}

const UserSchema = new Schema<PendingUserDoc>(
  {
    email: { type: String, required: true, maxLength: 50, unique: true, index: true },
    phone: { type: String, required: true, maxLength: 15, unique: true, index: true },
    password: { type: String },
    salt: { type: String },
    otp: { type: String },
    otp_expiry: { type: Date },
    // phone_verified: { type: Boolean, default: false },
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

const PendingUser = mongoose.model<PendingUserDoc>('pusers', UserSchema);
export { PendingUser };
