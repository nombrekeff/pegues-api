import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSessionInput {
  @IsNotEmpty()
  @ApiProperty()
  projectId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  tries: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  ascent_date: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  has_ascent: boolean;
}
