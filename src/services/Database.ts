import { Application } from 'express';
import mongoose from 'mongoose';
import { MONGO_URL } from '../config';

export default async () => {
  try {
    mongoose
      .connect(MONGO_URL)
      .then(res => {
        console.log('Connected to DB');
      })
      .catch(err => console.log('error' + err));
  } catch (error) {
    console.log(error);
  }
};
