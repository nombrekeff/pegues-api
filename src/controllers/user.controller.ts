import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
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
  async getUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
