import { ApiProperty } from '@nestjs/swagger';
import { Grade } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { config } from 'src/configs/config';

export class CreateRouteInput {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  zoneId: string;

  @IsEnum(Grade, {
    message: (args) => {
      return `Invalid grade ${args.value}. See wiki page for info, here: ${config.docsUrl}/#/routes`;
    },
  })
  @IsOptional()
  @ApiProperty({ enum: Grade, default: Grade.uknown })
  grade?: Grade | null;
}
