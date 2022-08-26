import { ApiProperty } from '@nestjs/swagger';
import { Media } from '@prisma/client';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserInput {
  @IsString()
  @IsOptional()
  @ApiProperty()
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  firstname: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastname: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;
}
