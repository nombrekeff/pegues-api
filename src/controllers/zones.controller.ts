import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IsRole, Roles } from 'src/decorators/roles-decorator';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { ZoneQueryArgs } from 'src/models/args/zone-query.args';
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
  async getZoneRoutes(
    @CurrentUser() user: User,
    @Param('id') zoneId: string,
    @Query() query: RouteQueryArgs
  ) {
    return this.routeService.getAllForUser(user.id, { ...query, zoneId });
  }

  @Post('zones')
  async addZone(@CurrentUser() user: User, @Body() data: CreateZoneInput) {
    return await this.zoneService.createZone(user.id, data);
  }

  @Put('zones/:id')
  async editZone(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: CreateZoneInput
  ) {
    return await this.zoneService.updateZone(user.id, id, data);
  }
}
