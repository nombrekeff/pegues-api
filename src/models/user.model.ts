import { ObjectType, registerEnumType, HideField } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { Zone } from './zone.model';
import { Route } from './route.model';
import { Ascent } from './ascent.model';
import { ApiProperty } from '@nestjs/swagger';
import { UserPreferences } from './user-preferences.model';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends BaseModel {
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  firstname?: string;
 
  @ApiProperty()
  lastname?: string;
 
  @ApiProperty()
  preferences: UserPreferences;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  zones: Zone[];
 
  @ApiProperty()
  routes: Route[];
 
  @ApiProperty()
  ascents: Ascent[];

  @HideField()
  password: string;
}
