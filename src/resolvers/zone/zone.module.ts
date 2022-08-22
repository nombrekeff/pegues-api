import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ZonesService } from 'src/services/zones.service';
import { RouteService } from 'src/services/route.service';

@Module({
  imports: [PrismaModule],
  providers: [ZonesService, RouteService],
  exports: [ZonesService, RouteService],
})
export class ZoneModule {}
