import mongoose, { Document, Model, Schema } from 'mongoose';

interface Private extends Document {
  publicAddress: string;
  privateKey: string;
  date_created: string;
}
