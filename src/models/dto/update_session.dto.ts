import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateSessionInput {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  tries: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  ascentAt: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  ascent: boolean;
}
