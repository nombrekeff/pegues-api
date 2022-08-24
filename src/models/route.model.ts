import { User } from './user.model';
import { BaseModel, baseSortParams } from './base.model';
import { Zone } from './zone.model';
import { Project } from './project.model';
import { Session } from './session.model';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export enum Grade {
  uknown = '?',
  g3 = '3',
  g4 = '4',
  g5 = '5',

  g6A = '6A',
  g6AP = '6A+',
  g6B = '6B',
  g6BP = '6B+',
  g6C = '6C',
  g6CP = '6C+',

  g7A = '7A',
  g7AP = '7A+',
  g7B = '7B',
  g7BP = '7B+',
  g7C = '7C',
  g7CP = '7C+',

  g8A = '8A',
  g8AP = '8A+',
  g8B = '8B',
  g8BP = '8B+',
  g8C = '8C',
  g8CP = '8C+',

  g9A = '9A',
  g9AP = '9A+',
}

export enum RouteDiscipline {
  lead = 'lead',
  boulder = 'boulder',
  trad = 'trad',
  dws = 'dws',
  other = 'other',
}

export const routeSortParams = <const>[
  'name',
  'description',
  'zone',
  'grade',
  'discipline',
  ...baseSortParams,
];
export type ValidRouteSortParams = typeof routeSortParams[number];

export class Route extends BaseModel {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiHideProperty()
  author: User;

  @ApiProperty({ type: () => Zone })
  zone: Zone;

  @ApiProperty({ type: () => Project, isArray: true })
  projects: Project[] = [];

  @ApiProperty({ type: () => Session, isArray: true })
  sessions: Session[] = [];

  @ApiProperty({ default: false })
  hasAscents: boolean;

  @ApiProperty({ enum: Grade, default: Grade.uknown })
  grade?: Grade | null = Grade.uknown;

  @ApiProperty({ enum: RouteDiscipline, default: RouteDiscipline.other })
  discipline: RouteDiscipline = RouteDiscipline.other;
}
