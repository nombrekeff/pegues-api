import { ApiProperty } from '@nestjs/swagger';
import { RouteDiscipline } from '@prisma/client';
import { BaseModel } from './base.model';

export class UserPreferences extends BaseModel {
  @ApiProperty({ enum: RouteDiscipline, default: RouteDiscipline.other })
  preferredDiscipline: RouteDiscipline = RouteDiscipline.lead;
}
