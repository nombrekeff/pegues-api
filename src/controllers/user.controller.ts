import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Grade } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/models/user.model';
import { AscentService } from 'src/services/ascent.service';
import { RouteService } from 'src/services/route.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ascentService: AscentService,
    private readonly routeService: RouteService
  ) {}

  @Get('me')
  @ApiResponse({ type: User })
  async getUser(@CurrentUser() user: User) {
    return this.userService.findUser(user.id).then(async (v) => {
      const stats = await this.routeService.getMinMaxGradeForUser(user.id);
      return {
        ...v,
        maxGrade: stats.max.grade,
        minGrade: stats.min.grade,
      };
    });
  }

  @Get('me/min_max_grade')
  @ApiResponse({ type: () => Grade })
  async getMaxGrade(@CurrentUser() user: User) {
    return await this.routeService.getMinMaxGradeForUser(user.id);
  }
}
