import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { RouteService } from 'src/services/route.service';

@Module({
  imports: [PrismaModule],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}
