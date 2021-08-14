import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AscentResolver } from './ascent.resolver';
import { AscentService } from 'src/services/ascent.service';

@Module({
  imports: [PrismaModule],
  providers: [AscentService, AscentResolver],
  exports: [AscentService],
})
export class AscentModule {}
