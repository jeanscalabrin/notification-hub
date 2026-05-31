import { Body, Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }
}
