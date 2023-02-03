import mongoose, { Document, Model, Schema } from 'mongoose';
import { WalletDoc } from './wallet';

interface UserDoc extends Document {
  email: string;
  password: string;
  salt: string;
  otp: string;
  otp_expiry: Date;
  firstname: string;
  lastname: string;
  address: string;
  username: string;
  walletAddressBTC: string;
  walletAddressETH: string;
  walletAddressTRON: string;
  verified: boolean;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, maxLength: 50, unique: true },
    password: { type: String },
    username: { type: String, maxLength: 50, unique: true },
    salt: { type: String },
    otp: { type: String },
    otp_expiry: { type: Date },
    firstname: { type: String },
    lastname: { type: String },
    address: { type: String },
    phone: { type: Number },
    verified: { type: Boolean, default: false },
    walletAddressBTC: { type: String, maxLength: 100 },
    walletAddressETH: { type: String, maxLength: 100 },
    walletAddressTRON: { type: String, maxLength: 100 },
    // privateKeyBTC: {
    //   publicAddress: { type: String, maxLength: 100 },
    //   privateKey: { type: String, maxLength: 200 }, // encrypted key
    //   date_created: { type: Date, default: Date.now },
    // },

    // privateKeyETH: {
    //   publicAddress: { type: String, maxLength: 100 },
    //   privateKey: { type: Object }, // encrypted key
    //   date_created: { type: Date, default: Date.now },
    // },

    // privateKeyTRON: {
    //   publicAddress: { type: String, maxLength: 100 },
    //   privateKey: { type: Object }, // encrypted key
    //   date_created: { type: Date, default: Date.now },
    // },

    // tokens: [
    //   {
    //     tokenSymbol: { type: String },
    //     tokenAddress: { type: String },
    //     chain: { type: String },
    //     balance: { type: Number, default: 0, minimum: 0 },
    //     transactionCount: { type: Number, default: 0, minimum: 0 },
    //   },
    // ],
    // wallets: [{ walletId: { type: Schema.Types.ObjectId, ref: 'wallet' } }],
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
