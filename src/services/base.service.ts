import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DefaultsConfig, SecurityConfig } from 'src/configs/config.interface';
import { PrismaService } from 'src/prisma/prisma.service';

export abstract class BaseService {
  @Inject() protected config: ConfigService;
  @Inject() protected prisma: PrismaService;

  get defaults() {
    return this.config.get<DefaultsConfig>('defaults');
  }

  get securityConfig() {
    return this.config.get<SecurityConfig>('security');
  }
}
