import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { config } from 'src/configs/config';
import { Grade, RouteDiscipline } from 'src/models/route.model';

export class UpdateRouteInput {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  zoneId?: string;

  @IsOptional()
  @ApiProperty({ enum: Grade, default: Grade.uknown })
  grade?: Grade | null;

  @IsOptional()
  @ApiProperty({ enum: RouteDiscipline, default: RouteDiscipline.other })
  discipline?: RouteDiscipline | null;
}
