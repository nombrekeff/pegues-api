import { ArgsType, Field } from '@nestjs/graphql';
import { SortOrder } from 'src/types';

@ArgsType()
export class SortArgs<T> {
  sortBy?: T;
  sortDir?: SortOrder;
}
