import { Controller, Get, StreamableFile } from '@nestjs/common';
import { SystemService } from 'src/services/system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly service: SystemService) {}

  @Get('config')
  config() {
    return this.service.getConfig();
  }
}
