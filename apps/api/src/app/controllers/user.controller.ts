import { Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JWtAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('user')
export class UserController {
  constructor() {}

  @UseGuards(JWtAuthGuard)
  @Get('info')
  async info(@UserId() userId: string) {}

  @Cron('*/5 * * * * *')
  async logger() {
    Logger.log('log');
  }
}
