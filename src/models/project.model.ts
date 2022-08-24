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
export type ValidProjectSortParams = typeof ascentSortParams[number];

export class Project extends BaseModel {
  @ApiHideProperty()
  author: User;

  @ApiProperty({ type: () => Route })
  route: Route;

  @ApiProperty()
  @IsOptional()
  ascentAt?: Date;

  @ApiProperty()
  ascent: boolean = false;

  @ApiProperty()
  tries: number = 0;
}
