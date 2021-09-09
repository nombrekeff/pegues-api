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
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { HttpResponse } from 'src/common/responses/http_response';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AscentQueryArgs } from 'src/models/args/ascent-query.args';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { Ascent } from 'src/models/ascent.model';
import { Route } from 'src/models/route.model';
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
  @ApiResponse({ status: 200, type: HttpResponse, isArray: true })
  async getMyRoutes(@CurrentUser() user: User, @Query() query: RouteQueryArgs) {
    return this.routeService.getAllForUser(user.id, query);
  }

  @Get('random')
  @ApiResponse({ status: 200, type: HttpResponse })
  async getRandom(@CurrentUser() user: User, @Query() query: RouteQueryArgs) {
    return this.routeService.getRandomRoute(user.id, query);
  }

  @Get(':id/ascents')
  @ApiResponse({ status: 200, type: Ascent, isArray: true })
  async getAscentsForRoute(
    @CurrentUser() user: User,
    @Param('id') routeId: string,
    @Query() query: AscentQueryArgs
  ) {
    return this.ascentService.getAllForUser(user.id, { ...query, routeId });
  }

  @Post('')
  @ApiResponse({ status: 200, type: Route })
  async addRoute(@CurrentUser() user: User, @Body() data: CreateRouteInput) {
    return this.routeService.createRoute(user.id, data);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: Route })
  async editRoute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateRouteInput
  ) {
    return this.routeService.updateRoute(user.id, id, data);
  }

  @Delete(':id')
  async deleteRoute(@CurrentUser() user: User, @Param('id') id: string) {
    return this.routeService.remove(user.id, id);
  }
}
