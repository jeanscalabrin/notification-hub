import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserResponseDto } from '../users/dtos/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersService.createUser(data);
  }

  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const valid = await argon2.verify(user.passwordHash, password);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      }),
    };
  }
}
