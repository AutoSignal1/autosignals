import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, PaginateModel, Connection } from 'mongoose';
import { UserModelName, User } from '@app/app.schema';
import { UserAuth, UserAuthSessionInterface, USER_AUTH_EVENTS } from './user-auth.constant';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
} from './user-auth.dto';
import { MailService } from '@app/services/email.service';
import { UserAuthSessionModelName, User_Auth_Session } from './user-auth.schema';

import { SignupInterface } from './user-auth.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LogService, Logger } from '@core/logger';


export interface SocialUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type GetSocialUserHandler = () => Promise<Partial<SocialUser>>;

@Injectable()
export class UsersAuthService {

  @Logger(UsersAuthService.name) private readonly logger: LogService;
  constructor(

    @InjectConnection() private readonly connection: Connection,

    @InjectModel(UserModelName) public readonly userModel: Model<User>,

    @InjectModel(UserAuthSessionModelName)
    private readonly userAuthSessionModel: Model<User_Auth_Session> & PaginateModel<User_Auth_Session>,
    
    private mailService: MailService,

    private eventEmitter: EventEmitter2

  ) {}

  async signup(userCdt: SignupInterface) {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      const [user] =  await this.userModel.create([userCdt], { session });

      await this.userAuthSessionModel.create([{ email: user.email, user: user._id }], { session });
      
      this.eventEmitter.emit(USER_AUTH_EVENTS.CREATE, user);
      
      await session.commitTransaction();
      session.endSession();

      return user.toObject();

    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.log(error.message);
      this.logger.error(error.message, error.stack);
      if (error.message.includes('collection') || error.message.includes('tournest')) throw error;

      throw new InternalServerErrorException('User cannot be created now! Try again later.');
    }
    
  }

  async login(userCdt: LoginDto) {
    const user = await this.userModel.findOne({$or: [
      {email: userCdt.email || ''},
      {username: userCdt.username || ''}
    ]});

    if (!user || !(await user.validatePassword(userCdt.password))) {
      throw new NotFoundException('Invalid email or password!');
    }

    await this.updateAuthSession({ email: user.email }, { lastLoggedIn: new Date(Date.now())}, user)

    return user.toObject();
  }

  async loginWithThirdParty(
    type: 'google' | 'facebook',
    getSocialUser: GetSocialUserHandler
  ) {
    const { firstName, lastName, email, id } = await getSocialUser();

    const existentUser = await this.userModel.findOne({ socialId: id });

    if (existentUser) {
      await this.updateAuthSession({ email: existentUser.email }, { lastLoggedIn: new Date(Date.now())}, existentUser)

      return existentUser.toObject();
    }

    const user = await this.signup({
      firstName,
      lastName,
      email,
      socialId: id,
      socialType: type,
      isSocial: true,
      termsAndConditionsAgreement: true
    });

    return user;
  }

  async forgotPasswordToken(userDta: ForgotPasswordDto) {
    const user = await this.userModel
      .findOne({ email: userDta.email })

    if (!user) throw new NotFoundException('Invalid Email. User Does Not Exist!');

    const token = Math.round(Math.random() * 900000 + 100000);

    await this.mailService.sendForgotPassword(user, token);

    return { token };
  }

  async resetPassword(userCdt: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: userCdt.email });

    if (!user) {
      return {
        error: {
          msg: 'Invalid Email. Email Address Does Not Exist!',
        },
      };
    }

    user.password = userCdt.password;

    user.save({ validateModifiedOnly: true, validateBeforeSave: false });

    await this.updateAuthSession({ email: user.email }, { lastPasswordChanged: new Date(Date.now())})

    return { value: { data: user } };
  }
  
  async updateAuthSession(query: Partial<UserAuthSessionInterface>, userAuthDets: Partial<UserAuthSessionInterface>, createNew?: { email: string, _id: string }) {
    const authSession = await this.userAuthSessionModel.findOneAndUpdate(query, userAuthDets);

    if (!authSession && createNew?.email && createNew?._id) {
      return await this.userAuthSessionModel.create([{ email: createNew.email, user: createNew._id, lastLoggedIn: new Date(Date.now()) }]);
    }

    return authSession;
  }

  async userHasResetedPassword(query: { email: string }) {
    const sessionDetails = await this.userAuthSessionModel.findOne({ email: query.email });

    if (!sessionDetails) throw new UnauthorizedException('You are not authorized! Please Sign in.');

    if (sessionDetails?.lastPasswordChanged >= sessionDetails?.lastLoggedIn) throw new BadRequestException('Password Was Recently Changed! Please Sign in.');

    return this.userModel.findOne({ email: query.email });

  }
}
