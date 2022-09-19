
/**
 * @example
 * ```
 * where: {
 *    authorId: userId,
 *    ...searchByQuery('name', params.search),
 * }
 * ``` 
 */
export const searchByQuery = (
  key: string,
  search: string,
  mode: 'insensitive' | 'default' = 'insensitive'
) => ({
  [key]: {
    contains: search,
    mode: mode,
  },
});
