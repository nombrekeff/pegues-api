import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditZoneInput {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;


  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public: boolean;
}
