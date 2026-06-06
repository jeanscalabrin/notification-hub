import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsService } from './notifications.service';

export interface SendNotificationJob {
  notificationId: string;
}

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  constructor(private readonly service: NotificationsService) {
    super();
  }

  async process(job: Job<SendNotificationJob>): Promise<any> {
    await this.service.process(job.data.notificationId);
  }
}
