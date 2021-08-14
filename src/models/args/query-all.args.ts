import { ArgsType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/types';
import { SearchArgs } from './search.args';
import { SortArgs } from './sort.args';

@ArgsType()
export class QueryAllArgs<T> implements SearchArgs, SortArgs<T> {
  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string;
  
  @ApiProperty()
  sortBy?: T;

  @ApiProperty()
  sortDir?: SortOrder;
}
