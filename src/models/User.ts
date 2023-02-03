import mongoose, { Document, Model, Schema } from 'mongoose';

interface UserDoc extends Document {
  email: string;
  password: string;
  phone: string;
  activated: boolean;
  user_type: number;
  salt: string;
  otp: string;
  otp_expiry: Date;
  firstname: string;
  lastname: string;
  address: string;
  username: string;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, maxLength: 50, unique: true },
    phone: { type: String, required: true, maxLength: 15, unique: true },
    user_type: { type: Number, required: true, default: 1 },
    password: { type: String },
    username: { type: String },
    salt: { type: String },
    otp: { type: String },
    otp_expiry: { type: Date },
    firstname: { type: String },
    lastname: { type: String },
    address: { type: String },
    activated: { type: Boolean, default: false },
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
