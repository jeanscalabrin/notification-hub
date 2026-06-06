import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.notification.create({
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
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found!');
    }

    return notification;
  }
}
