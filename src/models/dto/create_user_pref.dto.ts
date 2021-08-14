import { ApiProperty } from '@nestjs/swagger';
import { RouteDiscipline } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserPreferenceInput {
  @ApiProperty({ enum: RouteDiscipline, default: RouteDiscipline.other })
  @IsNotEmpty()
  @IsEnum(RouteDiscipline)
  preferredDiscipline: RouteDiscipline = RouteDiscipline.lead;

  @IsNotEmpty()
  @IsString()
  authorId: string;
}
