import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserDoc } from './User';

export interface SignalDoc extends Document {
  asset: string;
  type: string;
  take_profit: string;
  stop_loss: string;
  user: UserDoc;
}

const SignalSchema = new Schema<SignalDoc>(
  {
    asset: { type: String, required: true, unique: true, max: 5, min: 0 },
    type: { type: String, required: true, maxLength: 50, unique: true },
    take_profit: { type: String, required: true },
    stop_loss: { type: String, required: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  },
);

const Signal = mongoose.model<SignalDoc>('credential', SignalSchema);
export { Signal };
