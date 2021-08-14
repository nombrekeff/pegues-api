import { Optional } from '@nestjs/common';
import { Grade } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRouteInput {
  @IsNotEmpty()
  name: string;

  description?: string;
  sessions?: number;
  tries?: number;

  zoneId?: string;

  @IsEnum(Grade, { message: 'Invalid grade. See wiki page for info, here: https://github.com/nombrekeff/pegues-api' })
  @IsOptional()
  grade?: Grade | null;
}
