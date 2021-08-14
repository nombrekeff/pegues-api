import { PrismaService } from './../prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { ChangePasswordInput } from '../resolvers/user/dto/change-password.input';
import { UpdateUserInput } from '../resolvers/user/dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  findUser(userId: string) {
    return this.prisma.user
      .findUnique({
        where: { id: userId },
        include: {
          zones: false,
          routes: false,
          preferences: true,
        },
      })
      .then(async (user) => {
        const whereAuthorIsUser = {
          where: {
            authorId: user.id,
          },
        };

        const ascentCount = await this.prisma.ascent.count(whereAuthorIsUser);
        const routeCount = await this.prisma.route.count(whereAuthorIsUser);
        const zoneCount = await this.prisma.zone.count(whereAuthorIsUser);

        delete user.password;

        return {
          ...user,
          ascentCount,
          routeCount,
          zoneCount,
        };
      });
  }

  updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
