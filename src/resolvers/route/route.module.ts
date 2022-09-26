import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { RouteService } from 'src/services/route.service';
import { ZonesService } from 'src/services/zones.service';

@Module({
  imports: [PrismaModule],
  providers: [ZonesService, RouteService],
  exports: [ZonesService, RouteService],
})
export class RouteModule {}
