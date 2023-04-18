import express, { Application } from 'express';
import { MyRoutes } from '../routes';
// import path from 'path';

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use('/images', express.static(path.join(__dirname, '../images')));
  app.use('/api', MyRoutes);

  return app;
};
