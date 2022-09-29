import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateEmailInput {
  @IsEmail()
  @ApiProperty()
  email: string;
}
