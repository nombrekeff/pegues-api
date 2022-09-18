import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { config } from 'src/configs/config';
import { Grade, RouteDiscipline } from 'src/models/route.model';

export class UpdateRouteInput {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  zoneId?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  public: boolean;

  @IsOptional()
  @ApiProperty({ enum: Grade, default: Grade.uknown })
  grade?: Grade | null;

  @IsOptional()
  @ApiProperty({ enum: RouteDiscipline, default: RouteDiscipline.other })
  discipline?: RouteDiscipline | null;
}
