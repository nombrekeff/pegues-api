import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { RoutesService } from 'src/services/route.service';

@Controller('routes')
@ApiTags('routes')
@UseGuards(AuthGuard('jwt'))
export class RoutesController {
  constructor(
    private readonly routeService: RoutesService,
  ) {}

  @Get('')
  async getMyRoutes(@CurrentUser() user: User) {
    const zones = await this.routeService.getRoutesForUser(user.id);
    return zones;
  }

  @Post('')
  async addRoute(@CurrentUser() user: User, @Body() data: CreateRouteInput) {
    const response = await this.routeService.createRoute(user.id, data);
    return response;
  }
}
