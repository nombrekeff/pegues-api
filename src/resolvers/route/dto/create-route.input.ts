import { Grade } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateRouteInput {
  @IsNotEmpty()
  name: string;

  zoneId: string;
  grade: Grade;
}
