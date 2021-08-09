import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';
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
    return await this.routeService.getRoutesForUser(user.id);
  }

  @Post('')
  async addRoute(@CurrentUser() user: User, @Body() data: CreateRouteInput) {
    return await this.routeService.createRoute(user.id, data);
  }

  @Put(':id')
  async editRoute(@Param('id') id: string, @Body() data: UpdateRouteInput) {
    return await this.routeService.updateRoute(id, data);
  }
}
