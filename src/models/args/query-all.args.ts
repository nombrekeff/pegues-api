import { ArgsType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { SortOrder } from 'src/types';
import { SearchArgs } from './search.args';
import { SortArgs } from './sort.args';

@ArgsType()
export class QueryAllArgs<T>
  implements SearchArgs, SortArgs<T>, PaginationArgs
{
  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty()
  sortBy?: T;

  @ApiProperty()
  sortDir?: SortOrder;

  @ApiProperty()
  @IsOptional()
  skip?: number = 0;

  @ApiProperty()
  @IsOptional()
  take?: number = 15;
}
