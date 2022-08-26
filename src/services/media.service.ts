import { Injectable } from '@nestjs/common';
import { Media } from '@prisma/client';
import { BaseService } from './base.service';

@Injectable()
export class MediaService extends BaseService {
  createMedia(file: Express.Multer.File) {
    return this.prisma.media.create({
      data: {
        mimetype: file.mimetype,
        path: file.path,
        filename: file.filename,
        size: file.size,
      }
    }).then(this.computeVirtualForProject.bind(this));
  }

  private async computeVirtualForProject(file: Media) {
    return {
      ...file,
    };
  }
}
