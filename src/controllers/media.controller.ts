import {
  Controller,
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
import { createReadStream } from 'fs';
import { join } from 'path';
import { MediaService } from 'src/services/media.service';

@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.createMedia(file);
  }

  @Get('upload/:id')
  async getFile(@Param('id') id: string) {
    const file = createReadStream(join(process.cwd(), './upload', id));
    return new StreamableFile(file);
  }
}
