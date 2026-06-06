import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '@/auth/auth.guard';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { User } from '@/users/user.decorator';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @User() user: JwtPayload,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(user.sub, createNotificationDto);
  }

  @Get()
  findAll(@User() user: JwtPayload) {
    return this.notificationsService.findAll(user.sub);
  }

  @Get(':id')
  findById(@User() user: JwtPayload, @Param('id') id: string) {
    return this.notificationsService.findById(user.sub, id);
  }
}
