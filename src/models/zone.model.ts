import { ObjectType } from '@nestjs/graphql';
import { BaseModel, ValidBaseSortParams } from './base.model';
import { User } from './user.model';
import { Route } from './route.model';

export const zoneSortParams = <const>['name'];
type ZoneSortParams = typeof zoneSortParams[number];
export type ValidZoneSortParams = ZoneSortParams | ValidBaseSortParams;

@ObjectType()
export class Zone extends BaseModel {
  name: string;
  author: User;
  routes: Route[];
}
