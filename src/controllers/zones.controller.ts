import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateZoneInput } from 'src/resolvers/zone/dto/create-zone.input';
import { ZonesService } from 'src/services/zones.service';

@Controller('zones')
@ApiTags('zones')
@UseGuards(AuthGuard('jwt'))
export class ZonesController {
  constructor(
    private readonly zoneService: ZonesService,
  ) {}

  @Get('')
  async getMyZones(@CurrentUser() user: User) {
    const zones = await this.zoneService.getZonesForUser(user.id);
    return zones;
  }

  @Post('')
  async addZone(@CurrentUser() user: User, @Body() data: CreateZoneInput) {
    const response = await this.zoneService.createZone(user.id, data);
    return response;
  }
}
