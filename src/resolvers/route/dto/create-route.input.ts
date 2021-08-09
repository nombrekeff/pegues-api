import { Grade } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateRouteInput {
  @IsNotEmpty()
  name: string;

  description: string;
  sessions: number;
  tries: number;

  zoneId: string;
  grade: Grade;
}
