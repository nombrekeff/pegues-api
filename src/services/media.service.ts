import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Media } from '@prisma/client';
import { BaseService } from './base.service';
import * as fs from 'fs';
import { HttpResponse } from 'src/common/responses/http_response';
import { User } from '@prisma/client';

@Injectable()
export class MediaService extends BaseService {
  private readonly logger = new Logger(MediaService.name);

  createMedia(file: Express.Multer.File, user: User) {
    return this.prisma.media
      .create({
        data: {
          mimetype: file.mimetype,
          path: file.path,
          filename: file.filename,
          size: file.size,
          authorId: user.id,
        },
      })
      .then(this.computeVirtualForProject.bind(this));
  }

  async createMediaForRoute(
    file: Express.Multer.File,
    routeId: string,
    user: User
  ) {
    const exists =
      (await this.prisma.route.findFirst({
        where: { id: routeId },
      })) != null;

    if (!file) {
      throw new HttpException(`'file' is required`, HttpStatus.BAD_REQUEST);
    }

    if (!exists) {
      this.logger.debug('Route not exists', { exists, routeId });
      throw new HttpException(`Route does not exist`, HttpStatus.BAD_REQUEST);
    }

    return this.prisma.media
      .create({
        data: {
          mimetype: file.mimetype,
          path: file.path,
          filename: file.filename,
          size: file.size,
          routeId: routeId,
          authorId: user.id,
        },
      })
      .then(this.computeVirtualForProject.bind(this));
  }

  async removeMediaById(mediaId: string, user: User) {
    this.logger.debug('remove mediaById', mediaId, user);
    const media = await this.prisma.media.findFirst({
      where: { 
        id: mediaId, 
        authorId: user.id,
       },
    });
    if (!media) {
      throw new HttpException(
        "Media does not exist or you don't have permission",
        HttpStatus.NOT_FOUND
      );
    }

    return this.unsafeRemoveMediaById(mediaId);
  }

  async unsafeRemoveMediaById(mediaId: string) {
    this.logger.debug('remove mediaById', mediaId);
    const media = await this.prisma.media.findFirst({
      where: { id: mediaId },
    });
    if (!media) {
      throw new HttpException('Media does not exist', HttpStatus.NOT_FOUND);
    }

    try {
      fs.rmSync(media.path);
    } catch (error) {
      this.logger.debug('rmSync error', error);
    }

    await this.prisma.media.delete({ where: { id: mediaId } });

    return new HttpResponse(HttpStatus.OK, media, 'Deleted ok');
  }

  private async computeVirtualForProject(file: Media) {
    return {
      ...file,
    };
  }
}
