import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { RouteResolver } from './route.resolver';
import { RoutesService } from 'src/services/route.service';

@Module({
  imports: [PrismaModule],
  providers: [RoutesService, RouteResolver],
  exports: [RoutesService],
})
export class RouteModule {}
