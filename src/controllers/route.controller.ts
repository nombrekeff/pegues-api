import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { HttpResponse } from 'src/common/responses/http_response';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ProjectQueryArgs } from 'src/models/args/ascent-query.args';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { Project } from 'src/models/project.model';
import { Route } from 'src/models/route.model';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';
import { MediaService } from 'src/services/media.service';
import { ProjectService } from 'src/services/project.service';
import { RouteService } from 'src/services/route.service';

@Controller('routes')
@ApiTags('routes')
@UseGuards(AuthGuard('jwt'))
export class RoutesController {
  constructor(
    private readonly routeService: RouteService,
    private readonly projectService: ProjectService,
    private readonly mediaService: MediaService
  ) {}

  @Get('me')
  @ApiResponse({ status: 200, type: HttpResponse, isArray: true })
  async getMyRoutes(@CurrentUser() user: User, @Query() query: RouteQueryArgs) {
    return this.routeService.getAllForUser(user.id, query);
  }

  @Get('')
  @ApiResponse({ status: 200, type: HttpResponse, isArray: true })
  async getAll(@CurrentUser() user: User, @Query() query: RouteQueryArgs) {
    return this.routeService.getAll(user.id, query);
  }

  @Get('random')
  @ApiResponse({ status: 200, type: HttpResponse })
  async getRandom(@CurrentUser() user: User, @Query() query: RouteQueryArgs) {
    return this.routeService.getRandomRoute(user.id, query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: HttpResponse })
  async getSingle(@CurrentUser() user: User, @Param('id') id: string) {
    return this.routeService.getOne(user.id, id);
  }

  @Get(':id/projects')
  @ApiResponse({ status: 200, type: Project, isArray: true })
  async getProjectsForRoute(
    @CurrentUser() user: User,
    @Param('id') routeId: string,
    @Query() query: ProjectQueryArgs
  ) {
    return this.projectService.getAllForUser(user.id, { ...query, routeId });
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

  @Post(':id/files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id
  ) {
    return this.mediaService.createMediaForRoute(file, id, user);
  }

  @Delete('files/:media_id')
  async deleteFile(
    @CurrentUser() user: User,
    @Param('id') media_id,
  ) {
    return this.mediaService.removeMediaById(media_id, user);
  }
}
