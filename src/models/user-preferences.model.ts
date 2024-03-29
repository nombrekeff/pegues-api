import { ApiProperty } from '@nestjs/swagger';
import { RouteDiscipline } from '@prisma/client';
import { BaseModel } from './base.model';

export class UserPreferences extends BaseModel {
  static defaultPrefereneces = {
    preferredDiscipline: RouteDiscipline.lead,
  };

  @ApiProperty({ enum: RouteDiscipline, default: RouteDiscipline.other })
  preferredDiscipline: RouteDiscipline = RouteDiscipline.lead;
}
