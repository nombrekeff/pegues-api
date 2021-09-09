import { SortOrder } from 'src/types';


export class SortArgs<T> {
  sortBy?: T;
  sortDir?: SortOrder;
}
