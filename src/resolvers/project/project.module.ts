import { PrismaModule } from '../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProjectService } from 'src/services/project.service';

@Module({
  imports: [PrismaModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
