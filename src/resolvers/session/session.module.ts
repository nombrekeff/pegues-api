import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { SessionService } from 'src/services/session.service';

@Module({
  imports: [PrismaModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
