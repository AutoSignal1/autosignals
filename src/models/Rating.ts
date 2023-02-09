import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserDoc } from './User';

export interface RatingDoc extends Document {
  rating: number;
  user: UserDoc;
  text: string;
}

const RatingSchema = new Schema<RatingDoc>(
  {
    rating: { type: Number, required: true, unique: true, max: 5, min: 0 },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
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

const Rating = mongoose.model<RatingDoc>('credential', RatingSchema);
export { Rating };
