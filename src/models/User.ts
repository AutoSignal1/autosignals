import mongoose, { Document, Model, Schema } from 'mongoose';
import { CredentialDoc } from './Credentials';

export interface UserDoc extends Document {
  email: string;
  password: string;
  phone: string;
  full_name: string;
  activated: boolean;
  user_type: number;
  credentials: [CredentialDoc];
  salt: string;
  otp: string;
  otp_expiry: Date;
  followers: [UserDoc];
  followings: [UserDoc];
}

const UserSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, maxLength: 50, unique: true, index: true },
    phone: { type: String, required: true, maxLength: 15, unique: true, index: true },
    user_type: { type: Number, required: true, default: 1 },
    password: { type: String },
    salt: { type: String },
    otp: { type: String },
    otp_expiry: { type: Date },
    activated: { type: Boolean, default: false },
    followers: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
      },
    ],
    followings: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
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

const User = mongoose.model<UserDoc>('user', UserSchema);
export { User };
