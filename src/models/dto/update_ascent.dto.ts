import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateAscentInput {
  @IsOptional()
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
