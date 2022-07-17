import { Body, Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import {AccountLogin, AccountRegister} from '@udemy-clone/contracts';
import { Message, RMQMessage, RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    dto: AccountRegister.Request, 
    @RMQMessage msg: Message
  ): Promise<AccountRegister.Response> {
    const rid = msg.properties.headers['requestId'];
    const logger = new Logger(rid);
    logger.error('sdfsdf');
    return this.authService.register(dto);
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
}
