import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateZoneInput {
  @Field()
  @IsNotEmpty()
  name: string;
}
