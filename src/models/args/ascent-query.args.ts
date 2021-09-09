import { ValidAscentSortParams } from 'src/models/ascent.model';
import { ArgsType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { QueryAllArgs } from './query-all.args';
import { ApiProperty } from '@nestjs/swagger';

@ArgsType()
export class AscentQueryArgs extends QueryAllArgs<ValidAscentSortParams> {
  @IsString()
  @ApiProperty()
  @IsOptional()
  routeId?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  zoneId?: string;
}
