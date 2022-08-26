import { User } from './user.model';
import { BaseModel, baseSortParams } from './base.model';
import { IsBoolean, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const ascentSortParams = <const>[
  'ascentAt',
  ...baseSortParams,
];
export type ValidProjectSortParams = typeof ascentSortParams[number];

export class Media extends BaseModel {
  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  mimetype: string;

  @ApiProperty()
  @IsInt()
  size: number;

  @ApiProperty()
  @IsBoolean()
  used: false;
}
