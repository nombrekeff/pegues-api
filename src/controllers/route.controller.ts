import {
  Body,
  Controller,
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
import { SortArgs } from 'src/models/args/sort.args';
import { ValidRouteSortParams } from 'src/models/route.model';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';
import { RoutesService } from 'src/services/route.service';



@Controller('routes')
@ApiTags('routes')
@UseGuards(AuthGuard('jwt'))
export class RoutesController {
  constructor(private readonly routeService: RoutesService) {}

  @Get('')
  async getMyRoutes(
    @CurrentUser() user: User,
    @Query() query: SortArgs<ValidRouteSortParams>
  ) {
    return this.routeService.getRoutesForUser(user.id, query);
  }

  @Post('')
  async addRoute(@CurrentUser() user: User, @Body() data: CreateRouteInput) {
    return this.routeService.createRoute(user.id, data);
  }

  @Put(':id')
  async editRoute(@Param('id') id: string, @Body() data: UpdateRouteInput) {
    return this.routeService.updateRoute(id, data);
  }
}
