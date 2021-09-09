
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/types';
import { SearchArgs } from './search.args';
import { SortArgs } from './sort.args';


export class QueryAllArgs<T>
  implements SearchArgs, SortArgs<T>
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
