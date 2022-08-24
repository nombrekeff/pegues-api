import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ProjectQueryArgs } from 'src/models/args/ascent-query.args';
import { Project } from 'src/models/project.model';
import { CreateProjectInput } from 'src/models/dto/create_ascent.dto';
import { UpdateProjectInput } from 'src/models/dto/update_ascent.dto';
import { ProjectService } from 'src/services/project.service';

@Controller('projects')
@ApiTags('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get('')
  @ApiResponse({
    type: () => Project,
    isArray: true,
    status: 200,
  })
  async getProjects(@CurrentUser() user: User, @Query() query: ProjectQueryArgs) {
    return this.service.getAllForUser(user.id, query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: () => Project })
  async getSingle(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.getOne(user.id, id);
  }

  @Post('')
  @ApiResponse({ type: () => Project, status: 200 })
  async add(@CurrentUser() user: User, @Body() data: CreateProjectInput) {
    return this.service.create(user.id, data);
  }

  @Put(':id')
  @ApiResponse({ type: () => Project, status: 200 })
  async edit(@Param('id') id: string, @Body() data: UpdateProjectInput) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async deleteZone(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
