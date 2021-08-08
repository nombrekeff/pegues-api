import {
  Field,
  ObjectType,
  registerEnumType,
  HideField,
} from '@nestjs/graphql';
import { Post } from './post.model';
import { BaseModel } from './base.model';
import { Zone } from './zone.model';
import { Route } from './route.model';

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
  email: string;
  firstname?: string;
  lastname?: string;
  role: Role;
  
  zones: Zone[];
  routes: Route[];

  posts: Post[];
  @HideField()
  password: string;
}
