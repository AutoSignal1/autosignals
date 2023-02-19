import mongoose, { Document, Model, Schema } from 'mongoose';
import { TraderDoc } from './Trader';

export interface CTradersFollowingDoc extends Document {
  base_asset: string;
  amountpertrade: string;
  trader: TraderDoc;
}

const UserSchema = new Schema<CTradersFollowingDoc>(
  {
    base_asset: { type: String, required: true },
    amountpertrade: { type: String, required: true },
    trader: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'trader',
    },
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

const CTradersFollowing = mongoose.model<CTradersFollowingDoc>('CopyTraderFollowing', UserSchema);
export { CTradersFollowing };
