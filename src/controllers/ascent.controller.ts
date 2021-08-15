import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArgsType } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AscentQueryArgs } from 'src/models/args/ascent-query.args';
import { QueryAllArgs } from 'src/models/args/query-all.args';
import { SortArgs } from 'src/models/args/sort.args';
import { ValidAscentSortParams } from 'src/models/ascent.model';
import { CreateAscentInput } from 'src/models/dto/create_ascent.dto';
import { UpdateAscentInput } from 'src/models/dto/update_ascent.dto';
import { AscentService } from 'src/services/ascent.service';

@Controller()
@ApiTags('ascents')
@UseGuards(AuthGuard('jwt'))
export class AscentController {
  constructor(private readonly service: AscentService) {}

  @Get('ascents')
  async getAscents(
    @CurrentUser() user: User,
    @Query() query: QueryAllArgs<ValidAscentSortParams>
  ) {
    return this.service.getAllForUser(user.id, query);
  }

  @Post('ascents')
  async add(@CurrentUser() user: User, @Body() data: CreateAscentInput) {
    return this.service.create(user.id, data);
  }

  @Put('ascents/:id')
  async edit(@Param('id') id: string, @Body() data: UpdateAscentInput) {
    return this.service.update(id, data);
  }
}
