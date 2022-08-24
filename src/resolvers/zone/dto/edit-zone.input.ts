import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class EditZoneInput {
  @IsOptional()
  @ApiProperty()
  name: string;


  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public: boolean;
}
