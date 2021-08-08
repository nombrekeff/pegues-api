import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel } from './base.model';

@ObjectType()
export class Zone extends BaseModel {
  name: string;
  author: User;
}
