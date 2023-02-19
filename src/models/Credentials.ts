import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CredentialDoc extends Document {
  api_key: string;
  secret: string;
  platform: string;
}

const CredentialSchema = new Schema<CredentialDoc>(
  {
    api_key: { type: String, required: true, maxLength: 50, unique: true },
    secret: { type: String, required: true, maxLength: 50, unique: true },
    platform: { type: String, required: true },
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

const Credential = mongoose.model<CredentialDoc>('credentials', CredentialSchema);
export { Credential };
