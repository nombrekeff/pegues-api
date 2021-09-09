import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { RouteResolver } from './route.resolver';
import { RouteService } from 'src/services/route.service';

@Module({
  imports: [PrismaModule],
  providers: [RouteService, RouteResolver],
  exports: [RouteService],
})
export class RouteModule {}
