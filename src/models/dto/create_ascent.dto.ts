import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAscentInput {
  @IsNotEmpty()
  routeId: string;

  @IsOptional()
  @IsNumber()
  sessions: number;

  @IsOptional()
  @IsNumber()
  tries: number;

  @IsOptional()
  @IsDateString()
  ascentAt: string;
}
