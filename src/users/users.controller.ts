import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from 'generated/prisma/models';
import { SignupUserDto } from './dtos/signup-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async signupUser(@Body() userData: SignupUserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
