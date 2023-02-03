import mongoose, { Document, Model, Schema } from 'mongoose';

export interface WalletDoc extends Document {
  userID: string;
  chain: string;
  tokenSymbol: string;
  wallet: string;
}

const WalletSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    wallet: { type: String, required: true },
    chain: { type: String, required: true }, // bitcoin, ethereum, binance, tron
    tokenSymbol: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  },
);

const Wallet = mongoose.model<WalletDoc>('wallet', WalletSchema);
export { Wallet };
