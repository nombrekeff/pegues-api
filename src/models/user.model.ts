import { BaseModel } from './base.model';
import { Zone } from './zone.model';
import { Route } from './route.model';
import { Project } from './project.model';
import { ApiProperty } from '@nestjs/swagger';
import { UserPreferences } from './user-preferences.model';
import { Media } from '@prisma/client';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User extends BaseModel {
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  firstname?: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  profileImage?: Media;

  @ApiProperty()
  lastname?: string;
 
  @ApiProperty()
  preferences: UserPreferences;

  @ApiProperty()
  roles: Role[];

  @ApiProperty()
  zones: Zone[];
 
  @ApiProperty()
  routes: Route[];
 
  @ApiProperty()
  projects: Project[];

  password: string;
}
