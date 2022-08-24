import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { ZoneQueryArgs } from 'src/models/args/zone-query.args';
import { Route } from 'src/models/route.model';
import { User } from 'src/models/user.model';
import { Zone } from 'src/models/zone.model';
import { CreateZoneInput } from 'src/resolvers/zone/dto/create-zone.input';
import { EditZoneInput } from 'src/resolvers/zone/dto/edit-zone.input';
import { RouteService } from 'src/services/route.service';
import { ZonesService } from 'src/services/zones.service';

@Controller('')
@ApiTags('zones')
@UseGuards(JwtAuthGuard)
export class ZonesController {
  constructor(
    private readonly zoneService: ZonesService,
    private readonly routeService: RouteService
  ) {}

  @Get('zones/me')
  @ApiResponse({ type: () => Zone, isArray: true, status: 200 })
  getMyZones(@CurrentUser() user: User, @Query() query: ZoneQueryArgs) {
    return this.zoneService.getZonesForUser(user.id, query);
  }

  @Get('zones')
  @ApiResponse({ type: () => Zone, isArray: true, status: 200 })
  getAll(@CurrentUser() user: User, @Query() query: ZoneQueryArgs) {
    return this.zoneService.getAll(user.id, query);
  }

  @Get('zones/:id')
  @ApiResponse({ type: () => Zone, status: 200 })
  getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.zoneService.getOne(user.id, id);
  }

  @Get('zones/:id/routes')
  @ApiResponse({ type: () => Route, isArray: true, status: 200 })
  getRoutesForZone(
    @CurrentUser() user: User,
    @Param('id') zoneId: string,
    @Query() query: RouteQueryArgs
  ) {
    return this.routeService.getAllForUser(user.id, { ...query, zoneId });
  }

  @Post('zones')
  @ApiResponse({ type: () => Zone, status: 200 })
  addZone(@CurrentUser() user: User, @Body() data: CreateZoneInput) {
    return this.zoneService.create(user.id, data);
  }

  @Put('zones/:id')
  @ApiResponse({ type: () => Zone, status: 200 })
  editZone(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: EditZoneInput
  ) {
    return this.zoneService.update(user.id, id, data);
  }

  @Delete('zones/:id')
  async deleteZone(@CurrentUser() user: User, @Param('id') id: string) {
    return this.zoneService.remove(user.id, id);
  }
}
