import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel, baseSortParams, ValidBaseSortParams } from './base.model';
import { Zone } from './zone.model';
import { Ascent } from './ascent.model';

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
  lead,
  boulder,
  trad,
  dws,
  other,
}

registerEnumType(RouteDiscipline, {
  name: 'RouteDiscipline',
  description: 'Route discipline',
});

registerEnumType(Grade, {
  name: 'Grade',
  description: 'Route grade',
});

export const routeSortParams = <const>[
  'name',
  'description',
  'zone',
  'grade',
  'discipline',
  ...baseSortParams,
];
export type ValidRouteSortParams = typeof routeSortParams[number];

@ObjectType()
export class Route extends BaseModel {
  name: string;
  description: string;

  author: User;
  zone: Zone;

  ascents: Ascent[] = [];
  grade: Grade = Grade.uknown;
  discipline: RouteDiscipline = RouteDiscipline.other;
}
