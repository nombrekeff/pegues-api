import { ObjectType } from '@nestjs/graphql';
import { BaseModel, baseSortParams, ValidBaseSortParams } from './base.model';
import { User } from './user.model';
import { Route } from './route.model';
import { ApiProperty } from '@nestjs/swagger';

export const zoneSortParams = <const>['name', ...baseSortParams];
export type ValidZoneSortParams = typeof zoneSortParams[number];

@ObjectType()
export class Zone extends BaseModel {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => User })
  author: User;

  @ApiProperty({ type: () => Route, isArray: true })
  routes: Route[];
}
