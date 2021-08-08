import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel } from './base.model';
import { Zone } from './zone.model';

@ObjectType()
export class Route extends BaseModel {
  name: string;
  author: User;
  zone: Zone;
}
