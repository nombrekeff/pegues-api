import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ZonesService } from 'src/services/zones.service';

@Module({
  imports: [PrismaModule],
  providers: [ZonesService],
  exports: [ZonesService],
})
export class ZoneModule {}
