import { ApiProperty } from '@nestjs/swagger';
import { ZoneType } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { config } from 'src/configs/config';

export class CreateZoneInput {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public: boolean;

  @IsEnum(ZoneType, {
    message: (args) => {
      return `Invalid zone type ${args.value}. See wiki page for info, here: ${config.docsUrl}/#/zones`;
    },
  })
  @IsOptional()
  @ApiProperty()
  type: ZoneType;
}
