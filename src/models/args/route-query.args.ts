
import { ApiProperty } from '@nestjs/swagger';
import { Grade } from '@prisma/client';
import { IsOptional, IsString, IsEnum, IsBoolean, IsBooleanString } from 'class-validator';
import { config } from 'src/configs/config';
import { ValidRouteSortParams } from '../route.model';
import { QueryAllArgs } from './query-all.args';


export class RouteQueryArgs extends QueryAllArgs<ValidRouteSortParams> {
  @IsString()
  @IsOptional()
  @ApiProperty()
  zoneId?: string;

  @IsBooleanString()
  @IsOptional()
  @ApiProperty()
  hasProjects?: string;

  @IsEnum(Grade, {
    message: (args) => {
      return `Invalid grade ${args.value}. See wiki page for info, here: ${config.docsUrl}/#/routes`;
    },
  })
  @IsOptional()
  @ApiProperty({ enum: Grade })
  grade?: Grade | null;
}
