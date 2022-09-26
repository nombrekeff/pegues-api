import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Grade, User } from '@prisma/client';
import { ProfileImagePipe } from 'src/common/pipes/sharp_pipes';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { EditUserInput } from 'src/models/dto/edit_user.dto';
import { SetProfileImageInput } from 'src/models/dto/set_profile_image.dto';
import { User as MUser } from 'src/models/user.model';
import { MediaService } from 'src/services/media.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly mediaService: MediaService
  ) {}

  @Get('me')
  @ApiResponse({ type: MUser })
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

  @Put('me')
  @ApiResponse({ type: () => MUser, status: 200 })
  editZone(@CurrentUser() user: User, @Body() data: EditUserInput) {
    return this.userService.update(user.id, data);
  }

  @Put('me/profile_image')
  @ApiResponse({ type: () => MUser, status: 200 })
  setProfileImage(
    @CurrentUser() user: User,
    @Body() data: SetProfileImageInput
  ) {
    return this.userService.setProfileImage(user.id, data);
  }

  @Post('me/upload_profile_image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFile(ProfileImagePipe) file: Express.Multer.File
  ) {
    const _user = await this.userService.findUser(user.id);
    this.logger.debug('User has profile image, removing', _user);
    try {
      await this.mediaService.removeMediaById(_user.profileImage.id, _user);
    } catch (error) {
      this.logger.error(error);
    }

    const image = await this.mediaService.createMedia(file, user);
    return this.userService.setProfileImage(user.id, { mediaId: image.id });
  }

  @Get('me/min_max_grade')
  @ApiResponse({ type: () => Grade })
  getMaxGrade(@CurrentUser() user: User) {
    return this.userService.getMinMaxGrades(user.id);
  }
}
