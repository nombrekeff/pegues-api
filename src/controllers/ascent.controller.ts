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
import { AscentQueryArgs } from 'src/models/args/ascent-query.args';
import { Ascent } from 'src/models/ascent.model';
import { CreateAscentInput } from 'src/models/dto/create_ascent.dto';
import { UpdateAscentInput } from 'src/models/dto/update_ascent.dto';
import { AscentService } from 'src/services/ascent.service';

@Controller('ascents')
@ApiTags('ascents')
@UseGuards(AuthGuard('jwt'))
export class AscentController {
  constructor(private readonly service: AscentService) {}

  @Get('')
  @ApiResponse({
    type: () => Ascent,
    isArray: true,
    status: 200,
  })
  async getAscents(@CurrentUser() user: User, @Query() query: AscentQueryArgs) {
    return this.service.getAllForUser(user.id, query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: () => Ascent })
  async getSingle(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.getOne(user.id, id);
  }

  @Post('')
  @ApiResponse({ type: () => Ascent, status: 200 })
  async add(@CurrentUser() user: User, @Body() data: CreateAscentInput) {
    return this.service.create(user.id, data);
  }

  @Put(':id')
  @ApiResponse({ type: () => Ascent, status: 200 })
  async edit(@Param('id') id: string, @Body() data: UpdateAscentInput) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async deleteZone(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
