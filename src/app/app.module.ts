import { Module } from '@nestjs/common';
// import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogModule } from '@core/logger';
import { MessageModule } from '@core/modules/message';
import { MiddlewareModule } from '@core/modules/middleware';
import { CONFIG_VALIDATORS } from '@core/config';
import { APP_ENV } from './app.config';
import { DB_CONNECTION, MODEL_INJECT } from '@core/modules/database';
import { EventEmitModule } from '@core/modules/event-emitter';
import { ShutdownService } from '@core/power.service';
import { CachingModule } from '@core/modules/caching';
import { MicroServicesConfig } from './config.service';
import { UserModel } from './app.schema';
import { UserAuthSessionModel, UsersAuthController, UsersAuthService } from './authentication';
import { MeController } from './authentication/me.controller';
import UserAuthEvents from './authentication/user-auth.events';
import ApiFeatures from './common/ApiFeatures';
import { MailService } from './services/email.service';
import { GoogleAuthService } from './services/google.service';
import { FollowService } from './services/follow.service';
import { FollowModel } from './schema/follow.schema';

@Module({
  imports: [
    DB_CONNECTION,

    MODEL_INJECT([UserModel, UserAuthSessionModel, FollowModel]),

    EventEmitModule,

    CachingModule,

    LogModule.forRoot(),
    
    ConfigModule.forRoot({
      load: [APP_ENV],
      validationSchema: CONFIG_VALIDATORS,
      cache: true,
      isGlobal: true,
    }),
    
    MiddlewareModule,

    MessageModule,    
    //features
    MicroServicesConfig(),
  ],

  controllers: [AppController, MeController, UsersAuthController],

  providers: [AppService, UsersAuthService, UserAuthEvents, ApiFeatures, MailService, GoogleAuthService, FollowService, ShutdownService],
})
export class AppModule {}
