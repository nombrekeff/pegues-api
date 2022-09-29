import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailingService } from 'src/services/mailing.service';

@Module({
  imports: [PrismaModule],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
