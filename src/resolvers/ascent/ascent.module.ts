import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AscentService } from 'src/services/ascent.service';

@Module({
  imports: [PrismaModule],
  providers: [AscentService],
  exports: [AscentService],
})
export class AscentModule {}
