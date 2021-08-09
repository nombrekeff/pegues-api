import { Grade } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRouteInput {
  @IsNotEmpty()
  name: string;

  description: string;
  sessions: number;
  tries: number;

  zoneId: string;

  @IsEnum(Grade)
  grade: Grade;
}
