import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateZoneInput {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
