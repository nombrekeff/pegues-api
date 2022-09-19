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
  @IsOptional()
  @ApiProperty()
  projectId: string;

  @IsOptional()
  @ApiProperty()
  routeId: string;

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
