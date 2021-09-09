export const baseSortParams = <const>['id', 'createdAt', 'updatedAt'];
export type ValidBaseSortParams = typeof baseSortParams[number];

export abstract class BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
