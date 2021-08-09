import { IsNotEmpty } from 'class-validator';

export class EditZoneInput {
  @IsNotEmpty()
  name: string;
}
