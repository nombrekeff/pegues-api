import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { SessionService } from 'src/services/session.service';
import { ProjectService } from 'src/services/project.service';

@Module({
  imports: [PrismaModule],
  providers: [SessionService, ProjectService],
  exports: [SessionService, ProjectService],
})
export class SessionModule {}
