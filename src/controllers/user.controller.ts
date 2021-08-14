import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';
import { AppService } from '../services/app.service';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService
  ) {}

  @Get('me')
  @ApiResponse({ type: User })
  async getUser(@CurrentUser() user: User) {
    return this.userService.findUser(user.id);
  }
}
