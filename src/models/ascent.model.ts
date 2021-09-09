import { ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel, baseSortParams } from './base.model';
import { Route } from './route.model';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export const ascentSortParams = <const>[
  'tries',
  'sessions',
  'ascentAt',
  ...baseSortParams,
];
export type ValidAscentSortParams = typeof ascentSortParams[number];

@ObjectType()
export class Ascent extends BaseModel {
  @ApiHideProperty()
  author: User;

  @ApiProperty({ type: () => Route })
  route: Route;

  @ApiProperty()
  @IsOptional()
  ascentAt?: Date;

  @ApiProperty()
  sessions: number = 0;

  @ApiProperty()
  tries: number = 0;
}
