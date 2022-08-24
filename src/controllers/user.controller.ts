import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Grade } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/models/user.model';
import { ProjectService } from 'src/services/project.service';
import { RouteService } from 'src/services/route.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly routeService: RouteService
  ) {}

  @Get('me')
  @ApiResponse({ type: User })
  async getUser(@CurrentUser() user: User) {
    return this.userService.findUser(user.id).then(async (v) => {
      const stats = await this.userService.getMinMaxGrades(user.id);
      return {
        ...v,
        maxGrade: stats.max.grade,
        minGrade: stats.min.grade,
      };
    });
  }

  @Get('me/min_max_grade')
  @ApiResponse({ type: () => Grade })
  getMaxGrade(@CurrentUser() user: User) {
    return this.userService.getMinMaxGrades(user.id);
  }
}
