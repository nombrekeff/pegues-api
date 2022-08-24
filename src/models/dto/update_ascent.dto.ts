import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateProjectInput {
  @IsOptional()
  @ApiProperty()
  routeId: string;
}
