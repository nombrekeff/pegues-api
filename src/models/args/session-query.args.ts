import { IsBoolean, IsBooleanString, IsOptional, IsString } from 'class-validator';
import { QueryAllArgs } from './query-all.args';
import { ApiProperty } from '@nestjs/swagger';
import { ValidSessionSortParams } from '../session.model';

export class SessionQueryArgs extends QueryAllArgs<ValidSessionSortParams> {
  @IsString()
  @ApiProperty()
  @IsOptional()
  routeId?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  zoneId?: string;

  @IsBooleanString()
  @ApiProperty()
  @IsOptional()
  ascent?: string;
}
