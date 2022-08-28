import { RouteDiscipline } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserPreferenceInput {
  @IsOptional()
  @IsEnum(RouteDiscipline)
  preferredDiscipline: RouteDiscipline = RouteDiscipline.lead;

  @IsOptional()
  @IsBoolean()
  enableVibration: boolean;
}
