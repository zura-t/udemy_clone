import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountLogin, AccountRegister } from '@udemy-clone/contracts';
import { UserRole } from '@udemy-clone/interfaces';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
    ) {}

  async register({email, password, displayName}: AccountRegister.Request): Promise<AccountRegister.Response> {
    const userExists = await this.userRepository.findUser(email);
    if (userExists) {
      throw new Error('User with this email is already registered');
    }
    const newUserEntity = await new UserEntity({
      displayName,
      email,
      passwordHash: '',
      role: UserRole.Student
    }).setPassword(password);

    const user = await this.userRepository.createUser(newUserEntity);
    return {email: user.email, displayName: user.displayName, role: user.role}
  }

  async login(id: string): Promise<AccountLogin.Response> {
    return {
      access_token: await this.jwtService.signAsync({id})
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new Error('Incorrect login/password');
    }
    const userEntity = new UserEntity(user);
    const isPasswordCorrect = await userEntity.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new Error('Incorrect login/password');
    }
    return {id: user._id};
  }
}
