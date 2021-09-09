import { ApiProperty } from '@nestjs/swagger';
import { Grade, RouteDiscipline } from '@prisma/client';
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


  @IsEnum(RouteDiscipline, {
    message: (args) => {
      return `Invalid grade ${args.value}. See wiki page for info, here: ${config.docsUrl}/#/routes`;
    },
  })
  @IsOptional()
  @ApiProperty({ enum: RouteDiscipline, default: RouteDiscipline.other })
  discipline?: RouteDiscipline | null;
}
