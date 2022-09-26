import { Module } from '@nestjs/common';
import { TasksService } from 'src/controllers/tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaService } from 'src/services/media.service';

@Module({
  imports: [PrismaModule],
  providers: [TasksService, MediaService],
  exports: [TasksService],
})
export class TasksModule {}
