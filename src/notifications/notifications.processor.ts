import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  process(job: Job<any, any, string>): any {
    console.log(job.data);
  }
}
