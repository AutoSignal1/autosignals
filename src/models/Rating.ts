import mongoose, { Document, Model, Schema } from 'mongoose';
import { TraderDoc } from './Trader';
import { CopyTraderDoc } from './CopyTrader';

export interface RatingDoc extends Document {
  rating: number;
  trader: TraderDoc;
  copy_trader: CopyTraderDoc;
  text: string;
}

const RatingSchema = new Schema<RatingDoc>(
  {
    rating: { type: Number, required: true, unique: true, max: 5, min: 0 },
    trader: { type: mongoose.SchemaTypes.ObjectId, ref: 'trader' },
    copy_trader: { type: mongoose.SchemaTypes.ObjectId, ref: 'ctraders' },
    text: { type: String, required: true },
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

const Rating = mongoose.model<RatingDoc>('ratings', RatingSchema);
export { Rating };
