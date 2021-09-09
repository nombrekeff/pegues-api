import { Controller, Get, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('static')
export class StaticController {
  @Get('doc-styles.css')
  getFile(): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), 'static', 'doc-styles.css')
    );
    return new StreamableFile(file);
  }
}
