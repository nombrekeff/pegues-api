import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateUserPreferenceInput } from 'src/models/dto/create_user_pref.dto';
import { UserPreferences } from 'src/models/user-preferences.model';
import { User } from 'src/models/user.model';
import { UserPreferencesService } from 'src/services/preferences.service';

@Controller('preferences')
@ApiTags('preferences')
@UseGuards(AuthGuard('jwt'))
export class UserPreferencesController {
  constructor(private readonly prefService: UserPreferencesService) {}

  @Get('/me')
  @ApiResponse({ type: UserPreferences })
  async getUserPreference(@CurrentUser() user: User) {
    return this.prefService.findForUser(user.id);
  }

  @Post('')
  @ApiResponse({ type: UserPreferences })
  async addUserPreferences(@Body() body: CreateUserPreferenceInput) {
    return this.prefService.create(body);
  }

  @Put(':id')
  @ApiResponse({ type: UserPreferences })
  async updateUserPreferences(@Param('id') id: string, @Body() body: any) {
    return this.prefService.update(id, body);
  }
}
