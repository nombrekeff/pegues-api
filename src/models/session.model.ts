import { User } from './user.model';
import { BaseModel, baseSortParams } from './base.model';
import { Route } from './route.model';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

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
  project: Route;

  @ApiProperty()
  @IsOptional()
  ascent_date?: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  has_ascent?: boolean;

  @ApiProperty()
  tries: number = 0;
}
