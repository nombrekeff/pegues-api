import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  lastname?: string;
}
