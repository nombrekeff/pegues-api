import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAscentInput {
  @IsNotEmpty()
  @ApiProperty()
  routeId: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  sessions: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  tries: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  ascentAt: string;
}
