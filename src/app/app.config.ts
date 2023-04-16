import { Injectable } from '@nestjs/common';
import { InjectConfigValidation } from '@core/config';
import * as Joi from 'joi';

@Injectable()
export class AppEnvClass {
  APP_NAME = Joi.string().required();
  APP_VERSION = Joi.string().required();
  APP_DESCRIPTION = Joi.string().required();

  DOCS_ROUTE = Joi.string().required();

  HOST = Joi.string().default('http://localhost');

  PORT = Joi.number().default(5050);

  RMQ_URI = Joi.string().required();

  REDIS_CLOUD = Joi.string().required();

  RMQ_USER_QUEUE = Joi.string().required();

  NODE_ENV = Joi.string().equal('production', 'development').required();

  MONGO_STORE_SECRET = Joi.string().required();
  MONGO_STORE_TTL = Joi.number().required();

  EXPRESS_SESSION_SECRET = Joi.string().required();
  EXPRESS_SESSION_NAME = Joi.string().required();
  EXPRESS_COOKIE_MAX_AGE = Joi.number().required();

  JWT_SECRET = Joi.string().required();
  JWT_EXPIRES = Joi.string().required();

  GOOGLE_APP_ID = Joi.string().required();
  GOOGLE_APP_SECRET = Joi.string().required();

  EVENT_SERVICE = Joi.string().default('EVENT_SERVICE');
  EVENT_SERVICE_PORT = Joi.number().default(5051);
  RMQ_EVENT_QUEUE = Joi.string().required();

  AWS_REGION = Joi.string().required();
  AWS_ACCESS_KEY_ID = Joi.string().required();
  AWS_ACCESS_KEY_SECRET = Joi.string().required();
  AWS_BUCKET_NAME = Joi.string().required();

  MAILGUN_API_KEY = Joi.string();
  MAILGUN_DOMAIN = Joi.string();
  MAILGUN_FROM = Joi.string();

  // EXPERIENCE_SERVICE = Joi.string().default('llll');
}

export const APP_ENV = InjectConfigValidation<AppEnvClass>(
  'app',
  new AppEnvClass(),
);
