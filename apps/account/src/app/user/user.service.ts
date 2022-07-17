import { Injectable } from '@nestjs/common';
import { IUser } from '@udemy-clone/interfaces';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UserEventEmitter } from './user.event-emitter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository, 
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmitter
    ) {}

  public async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new Error("User doesn't exists");
    }
    const userEntity = new UserEntity(existingUser).updateProfile(user.displayName);
    await this.updateUser(userEntity);
    return {user};
  }

  public async buyCourse(userId: string, courseId: string) {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error("User doesn't exists");
    }
    const userEntity = new UserEntity(existingUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const {paymentLink, user} = await saga.getState().pay();
    await this.updateUser(user);
    return {paymentLink};
  }

  public async checkPayment(userId: string, courseId: string) {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error("User doesn't exists");
    }
    const userEntity = new UserEntity(existingUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const {user, status} = await saga.getState().checkPayment();
    await this.updateUser(user);
    return {status};
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRepository.updateUser(user)
    ])
  }
}
