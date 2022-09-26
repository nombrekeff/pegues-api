import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { MediaService } from 'src/services/media.service';

@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User
  ) {
    return this.mediaService.createMedia(file, user);
  }

  @Get('upload/:id')
  async getFile(@Param('id') id: string) {
    const file = createReadStream(join(process.cwd(), './media/upload', id));
    return new StreamableFile(file);
  }

  @Delete('upload/:media_id')
  @UseGuards(AuthGuard('jwt'))
  async deleteFile(@CurrentUser() user: User, @Param('media_id') media_id) {
    return this.mediaService.removeMediaById(media_id, user);
  }
}
