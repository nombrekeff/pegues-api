import { ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel, ValidBaseSortParams } from './base.model';
import { Route } from './route.model';

export const ascentSortParams = <const>['tries', 'sessions', 'ascentAt'];
type AscentSortParams = typeof ascentSortParams[number];
export type ValidAscentSortParams = AscentSortParams | ValidBaseSortParams;

@ObjectType()
export class Ascent extends BaseModel {
  author: User;
  route: Route;
  ascentAt: Date;
  sessions: number;
  tries: number;
}
