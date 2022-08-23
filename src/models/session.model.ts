import { User } from './user.model';
import { BaseModel, baseSortParams } from './base.model';
import { Route } from './route.model';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export const sessionSortParams = <const>[
  'tries',
  'ascentAt',
  'ascent',
  ...baseSortParams,
];
export type ValidSessionSortParams = typeof sessionSortParams[number];

export class Session extends BaseModel {
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
