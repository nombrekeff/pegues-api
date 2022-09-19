import { ValidZoneSortParams } from './../zone.model';
import { IsBoolean, IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryAllArgs } from './query-all.args';
import { ApiProperty } from '@nestjs/swagger';
import { ZoneType } from '@prisma/client';
import { config } from 'src/configs/config';

export class ZoneQueryArgs extends QueryAllArgs<ValidZoneSortParams> {
  @IsString()
  @IsOptional()
  routeId?: string;

  @IsBooleanString()
  @IsOptional()
  public?: string;

  @IsEnum(ZoneType, {
    message: (args) => {
      return `Invalid zone type ${args.value}. See wiki page for info, here: ${config.docsUrl}/#/zones`;
    },
  })
  @IsOptional()
  @ApiProperty()
  type?: ZoneType;
}
