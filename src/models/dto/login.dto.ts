import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginData {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
