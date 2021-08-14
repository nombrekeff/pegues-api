import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { ZoneQueryArgs } from 'src/models/args/zone-query.args';
import { CreateZoneInput } from 'src/resolvers/zone/dto/create-zone.input';
import { RoutesService } from 'src/services/route.service';
import { ZonesService } from 'src/services/zones.service';

@Controller('zones')
@ApiTags('zones')
@ApiBearerAuth('JWT auth')
@UseGuards(AuthGuard('jwt'))
export class ZonesController {
  constructor(
    private readonly zoneService: ZonesService,
    private readonly routeService: RoutesService
  ) {}

  @Get('')
  async getMyZones(@CurrentUser() user: User, @Query() query: ZoneQueryArgs) {
    const zones = await this.zoneService.getZonesForUser(user.id, query);
    return zones;
  }

  @Get(':id/routes')
  async getZoneRoutes(
    @CurrentUser() user: User,
    @Param('id') zoneId: string,
    @Query() query: RouteQueryArgs
  ) {
    return this.routeService.getAllForUser(user.id, { ...query, zoneId });
  }

  @Post('')
  async addZone(@CurrentUser() user: User, @Body() data: CreateZoneInput) {
    return await this.zoneService.createZone(user.id, data);
  }

  @Put(':id')
  async editZone(@Param('id') id: string, @Body() data: CreateZoneInput) {
    return await this.zoneService.updateZone(id, data);
  }
}
