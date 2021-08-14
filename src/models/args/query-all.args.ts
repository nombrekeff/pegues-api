import { ArgsType } from '@nestjs/graphql';
import { SortOrder } from 'src/types';
import { SearchArgs } from './search.args';
import { SortArgs } from './sort.args';

@ArgsType()
export class QueryAllArgs<T> implements SearchArgs, SortArgs<T> {
  search?: string;
  sortBy?: T;
  sortDir?: SortOrder;
}
