import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
// import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '@/prisma.service';
import {
  Notification,
  NotificationStatus,
} from '../../generated/prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateNotificationDto,
  ): Promise<Notification | null> {
    return await this.prisma.notification.create({
      data: {
        userId,
        title: dto.title,
        body: dto.body,
        status: NotificationStatus.PENDING,
      },
    });
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(
    userId: string,
    notificationId: string,
  ): Promise<Notification | null> {
    return await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  // update(id: number, updateNotificationDto: UpdateNotificationDto) {
  //   return `This action updates a #${id} notification`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }
}
