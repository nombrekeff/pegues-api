import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EditZoneInput {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
