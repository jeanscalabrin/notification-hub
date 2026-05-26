import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from 'generated/prisma/models';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async signupUser(
    @Body() userData: { name?: string; email: string; password: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
