import { PrismaModule } from './../../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { PasswordService } from '../../services/password.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService, PasswordService],
  exports: [UserService],
})
export class UserModule {}
