import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { UserCommands } from './user.commands';
import { UserEventEmitter } from './user.event-emitter';
import { UserQueries } from './user.queries';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [UserCommands, UserQueries],
  providers: [UserService, UserRepository, UserEventEmitter],
  exports: [UserRepository]
})
export class UserModule {}
