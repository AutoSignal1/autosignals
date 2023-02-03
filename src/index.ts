import express from 'express';
import 'dotenv/config';
import App from './services/ExpressApp';
import DbConnection from './services/Database';
import { PORT } from './config';
import * as dotenv from 'dotenv';
const startServer = async () => {
  const app = express();

  //dotenv.config({ path: __dirname + '/.env' });
  await DbConnection();
  await App(app);
  app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`);
  });
};

startServer();
