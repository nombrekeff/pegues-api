import { SortArgs } from 'src/models/args/sort.args';

export class SortHelper {
  // Sanitizes sort args, checks if they are valid,
  // else default are set and returned
  static safeSortParams<T extends string>(
    params: any,
    validParams: any,
    defaultSortBy = 'updatedAt',
    defaultSortDir = 'asc'
  ): SortArgs<T> {
    let { sortBy, sortDir }: any = {
      sortBy: defaultSortBy,
      sortDir: defaultSortDir,
      ...params,
    };

    if (!validParams.includes(sortBy as any)) {
      sortBy = defaultSortBy;
    }

    if (sortDir !== 'desc' && sortDir !== 'asc') {
      sortDir = defaultSortDir;
    }

    return {
      sortBy,
      sortDir,
    };
  }
}
