import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SubscriptionDoc extends Document {
  sub_type: string;
  start_date: Date;
  end_date: Date;
}

const SubScriptionSchema = new Schema<SubscriptionDoc>(
  {
    sub_type: { type: String, required: true, maxLength: 50, unique: true },
    start_date: { type: Date, required: true, maxLength: 50, unique: true },
    end_date: { type: Date, required: true },
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

const SubScription = mongoose.model<SubscriptionDoc>('subscriptions', SubScriptionSchema);
export { SubScription };
