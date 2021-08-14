import { ObjectType } from '@nestjs/graphql';
import { BaseModel, baseSortParams, ValidBaseSortParams } from './base.model';
import { User } from './user.model';
import { Route } from './route.model';

export const zoneSortParams = <const>['name', ...baseSortParams];
export type ValidZoneSortParams = typeof zoneSortParams[number];

@ObjectType()
export class Zone extends BaseModel {
  name: string;
  author: User;
  routes: Route[];
}
