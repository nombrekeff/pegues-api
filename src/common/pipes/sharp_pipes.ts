import { Injectable, Logger, PipeTransform } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class RouteImagePipe
  implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
{
  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    const filePath = path.join(image.path);
    const file = await sharp(fs.readFileSync(filePath))
      .rotate()
      .resize(720)
      .png({ effort: 3 })
      .withMetadata()
      .toFile(filePath);

    image.size = file.size;
    return image;
  }
}

@Injectable()
export class ProfileImagePipe
  implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
{
  private readonly logger = new Logger(ProfileImagePipe.name);

  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    const filePath = path.join(image.path);
    const file = await sharp(fs.readFileSync(filePath))
      .rotate()
      .resize(256)
      .png({ effort: 3 })
      .withMetadata()
      .toFile(filePath);

    image.size = file.size;
    return image;
  }
}
