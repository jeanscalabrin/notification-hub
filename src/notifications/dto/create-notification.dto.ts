import { IsEnum, IsString, Length } from 'class-validator';
import { NotificationChannel } from 'generated/prisma/enums';

export class CreateNotificationDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Length(1, 2000)
  body: string;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;
}
