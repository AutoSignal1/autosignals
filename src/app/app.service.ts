import { FilterQuery, Model, PaginateModel, PaginateOptions, startSession } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './app.dto';
import { User } from './app.schema';
import { MailService } from './services/email.service';
import { UserAuthSessionInterface, User_Auth_Session } from '@app/authentication';
import { AgeAndAbove, generateUsername } from '@app/common/helpers';
// import { CachingService } from '@libs/modules/caching';
@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User> & PaginateModel<User>,
    @InjectModel(User_Auth_Session.name)
    private readonly userAuthSessionModel: Model<User_Auth_Session> & PaginateModel<User>,
    // private cache: CachingService,
    private eventEmitter: EventEmitter2,
    private mailService: MailService,
  ) {}

  async findAll(query: Record<string, any>, paginateOptions: PaginateOptions = {}) {
    const {page, limit, select, sort, ...rest} = query;

    return await this.userModel.paginate(rest, paginateOptions);
    // let userQuery = this.apiFeatures.api(this.userModel, query)
    //                 .filter()
    //                 .search(['name', 'email'])
    //                 .sort()
    //                 .limitFields()

    // if (populate !== undefined) userQuery = userQuery.populate(populate);

    // return await userQuery.query.lean();
  }

  async findOne(id: string) {
    
    const user = await this.userModel.findOne({$or: [
      {_id: id || ''},
      {userId: id || ''}
    ]});

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async findOneBy(fields: FilterQuery<User>) {
    const user = await this.userModel.findOne(fields);

    if (!user) {
      return false
    }

    return true;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.username) {
      const usernameExists = await this.userModel.findOne({ username: updateUserDto.username });

      if (usernameExists) throw new BadRequestException('username exists. Please use another username.');
    }

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const updateData: Record<string, unknown> = {
      ...updateUserDto
    };

    const isNewUserDto = {
      username: updateUserDto.username || user.username,
      country: updateUserDto.country || user.country,
      city: updateUserDto.city || user.city,
      dob: updateUserDto.dob || user.dob,
    }

    if (user.isNewUser) {
      if (isNewUserDto.country && isNewUserDto.city && isNewUserDto.username && isNewUserDto.dob) {
        if (AgeAndAbove(isNewUserDto.dob, 13)) updateData.isNewUser = false;
        else if (updateUserDto.dob) throw new BadRequestException('Date Of Birth must 13 years and above.');
      }
    }

    return await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { ...updateData }
    ,{
      new: true,
      runValidators: true
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async changePassword(userCdt: { email: string, currentPassword: string, newPassword: string }) {
    const user = await this.userModel.findOne({ email: userCdt.email });

    if (!user || !(await user.validatePassword(userCdt.currentPassword))) {
      throw new NotFoundException('Invalid Password!');
    }

    user.password = userCdt.newPassword;

    user.save({ validateModifiedOnly: true, validateBeforeSave: false });

    await this.updateAuthSession({ email: user.email }, { lastPasswordChanged: new Date(Date.now())})

    return user;
  }

  async updateAuthSession(query: Partial<UserAuthSessionInterface>, userAuthDets: Partial<UserAuthSessionInterface>) {
    return await this.userAuthSessionModel.findOneAndUpdate(query, userAuthDets);
  }

  async generateUsername() {
    const name = generateUsername();

    if (!(await this.findOneBy({ username: name }))) {
      return name;
    }

    return await this.generateUsername();
  }
}