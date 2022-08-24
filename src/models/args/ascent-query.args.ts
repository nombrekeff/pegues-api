import { ValidProjectSortParams } from 'src/models/project.model';
import { IsOptional, IsString } from 'class-validator';
import { QueryAllArgs } from './query-all.args';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectQueryArgs extends QueryAllArgs<ValidProjectSortParams> {
  @IsString()
  @ApiProperty()
  @IsOptional()
  routeId?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  zoneId?: string;
}
