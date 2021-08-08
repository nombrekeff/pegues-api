import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { User } from './user.model';
import { Route } from './route.model';

@ObjectType()
export class Zone extends BaseModel {
  name: string;
  author: User;
  routes: Route[];
}