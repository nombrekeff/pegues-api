import { BaseModel, baseSortParams,  } from './base.model';
import { User } from './user.model';
import { Route } from './route.model';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export const zoneSortParams = <const>['name', ...baseSortParams];
export type ValidZoneSortParams = typeof zoneSortParams[number];

export type ZoneType = 'indoors' | 'outdoors';

export class Zone extends BaseModel {
  @ApiProperty()
  name: string;

  @ApiHideProperty()
  author: User;

  @ApiProperty({ type: () => Route, isArray: true })
  routes: Route[];

  @ApiProperty()
  @IsString()
  @IsIn(['indoors', 'outdoors'])
  type: string = 'outdoors';
}
