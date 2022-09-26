import { Controller, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/services/media.service';

@Controller('tasks')
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  /* Removes all the media images that are orphaned (not currently related to anything) */
  async handleCron() {
    this.logger.debug('Removing unused media');
    const all = await this.prisma.media.findMany({
      where: {
        AND: [{ userId: null }, { routeId: null }],
      },
    });

    for (const item of all) {
      await this.media.unsafeRemoveMediaById(item.id);
    }
  }
}
