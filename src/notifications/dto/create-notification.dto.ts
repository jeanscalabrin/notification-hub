import { IsString, Length } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Length(1, 2000)
  body: string;
}
