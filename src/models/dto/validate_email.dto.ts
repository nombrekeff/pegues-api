import { IsEmail, IsNotEmpty } from 'class-validator';

export class ValidateEmailData {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;
}
