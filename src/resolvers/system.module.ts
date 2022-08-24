import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SystemService } from 'src/services/system.service';

@Module({
  imports: [PrismaModule],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
