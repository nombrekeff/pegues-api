import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AscentQueryArgs } from 'src/models/args/ascent-query.args';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';
import { AscentService } from 'src/services/ascent.service';
import { RoutesService } from 'src/services/route.service';

@Controller('routes')
@ApiTags('routes')
@UseGuards(AuthGuard('jwt'))
export class RoutesController {
  constructor(
    private readonly routeService: RoutesService,
    private readonly ascentService: AscentService
  ) {}

  @Get('')
  async getMyRoutes(@CurrentUser() user: User, @Query() query: RouteQueryArgs) {
    return this.routeService.getAllForUser(user.id, query);
  }

  @Get(':id/ascents')
  async getAscentsForRoute(
    @CurrentUser() user: User,
    @Param('id') routeId: string,
    @Query() query: AscentQueryArgs
  ) {
    return this.ascentService.getAllForUser(user.id, { ...query, routeId });
  }

  @Post('')
  async addRoute(@CurrentUser() user: User, @Body() data: CreateRouteInput) {
    return this.routeService.createRoute(user.id, data);
  }

  @Put(':id')
  async editRoute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateRouteInput
  ) {
    return this.routeService.updateRoute(user.id, id, data);
  }

  @Delete(':id')
  async deleteRoute(@CurrentUser() user: User, @Param('id') id: string) {
    return this.routeService.removeRoute(user.id, id);
  }
}
