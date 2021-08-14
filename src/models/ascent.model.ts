import { ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel, baseSortParams } from './base.model';
import { Route } from './route.model';

export const ascentSortParams = <const>[
  'tries',
  'sessions',
  'ascentAt',
  ...baseSortParams,
];
export type ValidAscentSortParams = typeof ascentSortParams[number];

@ObjectType()
export class Ascent extends BaseModel {
  author: User;
  route: Route;
  ascentAt: Date;
  sessions: number;
  tries: number;
}
