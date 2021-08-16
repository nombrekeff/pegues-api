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
import { IsRole } from 'src/decorators/roles-decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { ZoneQueryArgs } from 'src/models/args/zone-query.args';
import { Route } from 'src/models/route.model';
import { Role, User } from 'src/models/user.model';
import { Zone } from 'src/models/zone.model';
import { CreateZoneInput } from 'src/resolvers/zone/dto/create-zone.input';
import { RoutesService } from 'src/services/route.service';
import { ZonesService } from 'src/services/zones.service';

@Controller('')
@ApiTags('zones')
@UseGuards(JwtAuthGuard)
export class ZonesController {
  constructor(
    private readonly zoneService: ZonesService,
    private readonly routeService: RoutesService
  ) {}

  @Get('zones')
  @ApiResponse({ type: () => Zone, isArray: true, status: 200 })
  async getMyZones(@CurrentUser() user: User, @Query() query: ZoneQueryArgs) {
    const zones = await this.zoneService.getZonesForUser(user.id, query);
    return zones;
  }

  @Get('admin/zones')
  @ApiResponse({ type: () => Zone, isArray: true, status: 200 })
  async getAdminZones(@Query() query: ZoneQueryArgs, @IsRole([Role.ADMIN]) _) {
    const zones = await this.zoneService.getAll(query);
    return zones;
  }

  @Get('zones/:id/routes')
  @ApiResponse({ type: () => Route, isArray: true, status: 200 })
  async getZoneRoutes(
    @CurrentUser() user: User,
    @Param('id') zoneId: string,
    @Query() query: RouteQueryArgs
  ) {
    return this.routeService.getAllForUser(user.id, { ...query, zoneId });
  }

  @Post('zones')
  @ApiResponse({ type: () => Zone, status: 200 })
  async addZone(@CurrentUser() user: User, @Body() data: CreateZoneInput) {
    return await this.zoneService.create(user.id, data);
  }

  @Put('zones/:id')
  @ApiResponse({ type: () => Zone, status: 200 })
  async editZone(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: CreateZoneInput
  ) {
    return await this.zoneService.update(user.id, id, data);
  }

  @Delete(':id')
  async deleteZone(@CurrentUser() user: User, @Param('id') id: string) {
    return this.zoneService.remove(user.id, id);
  }
}
