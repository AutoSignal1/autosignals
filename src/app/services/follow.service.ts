import { Connection, Model, PaginateModel, PaginateOptions } from 'mongoose';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { LogService, Logger } from '@core/logger';
import { Follow } from '@app/schema/follow.schema';
import { User } from '@app/app.schema';

interface PopulateInterface {
    path: string;
    match?: Record<string, unknown>;
    options?: Record<string, unknown>;
}

type PopulateOptions = PopulateInterface[] | undefined;



@Injectable()
export class FollowService {

  @Logger(FollowService.name) private readonly logger: LogService;
  
  constructor(
    @InjectConnection() private readonly connection: Connection,
    
    @InjectModel(User.name) private readonly userModel: Model<User> & PaginateModel<User>,

    @InjectModel(Follow.name) private readonly followModel: Model<Follow> & PaginateModel<Follow>,
  ) {}

  async getAllFollows(query?: Record<string, any>, paginateOptions: PaginateOptions = {}) {
    const {page, limit, select, sort, ...rest} = query;

    return await this.followModel.paginate(rest, paginateOptions);
  }
  
  async follow(follower: string, userId: string) {
    let followed = await this.followModel.findOne({ userId, follower });

    if (followed) return followed;

    const session = await this.connection.startSession();

    session.startTransaction();

    try {

      [followed] = await this.followModel.create([{ userId, follower }], { session });

      await this.userModel.findOneAndUpdate({ userId: followed.userId }, { $inc: { followers: 1 } }, { session });
      
      await this.userModel.findOneAndUpdate({ userId: followed.follower }, { $inc: { following: 1 } }, { session });

      await session.commitTransaction();
      session.endSession();

      return followed.toObject();

    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.log(error.message);
      this.logger.error(error.message, error.stack);
      if (error.message.includes('collection') || error.message.includes('tournest')) throw error;

      throw new InternalServerErrorException('Error occured while trying to follow this user! Try again later.');
    }
 
  }
  
  async unfollow(follower: string, userId: string) {
    let followed = await this.followModel.findOne({ userId, follower });

    if (!followed) return null;

    const session = await this.connection.startSession();

    session.startTransaction();

    try {

      await this.userModel.findOneAndUpdate({ userId: followed.userId }, { $inc: { followers: -1 } }, { session });
      
      await this.userModel.findOneAndUpdate({ userId: followed.follower }, { $inc: { following: -1 } }, { session });

      await this.followModel.findOneAndDelete({ userId, follower });

      await session.commitTransaction();
      session.endSession();

      return null;

    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.log(error.message);
      this.logger.error(error.message, error.stack);
      if (error.message.includes('collection') || error.message.includes('tournest')) throw error;

      throw new InternalServerErrorException('Error occured while trying to unfollow this user! Try again later.');
    }
 
  }
  
  
}
