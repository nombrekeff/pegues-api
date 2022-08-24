import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { SessionQueryArgs } from 'src/models/args/session-query.args';
import { CreateSessionInput } from 'src/models/dto/create_session.dto';
import { UpdateSessionInput } from 'src/models/dto/update_session.dto';
import { SessionService } from 'src/services/session.service';

@Controller('sessions')
@ApiTags('sessions')
@UseGuards(AuthGuard('jwt'))
export class SessionsController {
  constructor(private readonly service: SessionService) {}

  @Get('me')
  @ApiResponse({
    type: () => Session,
    isArray: true,
    status: 200,
  })
  async getAscents(
    @CurrentUser() user: User,
    @Query() query: SessionQueryArgs
  ) {
    return this.service.getAllForUser(user.id, query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: () => Session })
  async getSingle(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.getOne(user.id, id);
  }

  @Post('')
  @ApiResponse({ type: () => Session, status: 200 })
  async add(@CurrentUser() user: User, @Body() data: CreateSessionInput) {
    return this.service.create(user.id, data);
  }

  @Put(':id')
  @ApiResponse({ type: () => Session, status: 200 })
  async edit(@Param('id') id: string, @Body() data: UpdateSessionInput) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
