import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SetProfileImageInput {
  @IsNotEmpty()
  @ApiProperty()
  mediaId: string;
}
