import { IsNotEmpty } from 'class-validator';

export class CreateZoneInput {
  @IsNotEmpty()
  name: string;
}