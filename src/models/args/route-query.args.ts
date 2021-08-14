import { ArgsType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { config } from 'src/configs/config';
import { Grade, ValidRouteSortParams } from '../route.model';
import { QueryAllArgs } from './query-all.args';

@ArgsType()
export class RouteQueryArgs extends QueryAllArgs<ValidRouteSortParams> {
  @IsString()
  @IsOptional()
  @ApiProperty()
  zoneId?: string;

  @IsEnum(Grade, {
    message: (args) => {
      return `Invalid grade ${args.value}. See wiki page for info, here: ${config.docsUrl}/#/routes`;
    },
  })
  @IsOptional()
  @ApiProperty({ enum: Grade })
  grade?: Grade | null;
}
