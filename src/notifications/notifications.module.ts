import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '@/prisma.service';
import { NotificationsController } from './notifications.controller';
import { AuthModule } from '@/auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    AuthModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
