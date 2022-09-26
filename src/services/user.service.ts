import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { ChangePasswordInput } from '../resolvers/user/dto/change-password.input';
import { BaseService } from './base.service';
import { Grade, User } from '@prisma/client';
import { EditUserInput } from 'src/models/dto/edit_user.dto';
import { SetProfileImageInput } from 'src/models/dto/set_profile_image.dto';

@Injectable()
export class UserService extends BaseService {
  private defaultInclude = {
    zones: false,
    routes: false,
    projects: false,
    preferences: true,
    profileImage: true,
  };
  
  constructor(private passwordService: PasswordService) {
    super();
  }

  findUser(userId: string) {
    return this.prisma.user
      .findUnique({
        where: { id: userId },
        include: this.defaultInclude,
      })
      .then(this.computeVirtualForZone.bind(this));
  }

  update(userId: string, newUserData: EditUserInput) {
    return this.prisma.user
      .update({
        data: newUserData,
        where: { id: userId },
        include: this.defaultInclude,
      })
      .then(this.computeVirtualForZone.bind(this));
  }

  setProfileImage(userId: string, data: SetProfileImageInput) {
    return this.prisma.user
      .update({
        data: {
          profileImage: {
            connect: {
              id: data.mediaId,
            },
          },
        },
        where: { id: userId },
        include: this.defaultInclude,
      })
      .then(this.computeVirtualForZone.bind(this));
  }

  async computeVirtualForZone(user: User) {
    const whereAuthorIsUser = {
      where: {
        authorId: user.id,
      },
    };

    const ascentCount = await this.prisma.session.count({
      where: {
        authorId: user.id,
        has_ascent: true,
      },
    });
    const projectCount = await this.prisma.project.count(whereAuthorIsUser);
    const routeCount = await this.prisma.route.count(whereAuthorIsUser);
    const zoneCount = await this.prisma.zone.count(whereAuthorIsUser);

    delete user.password;

    return {
      ...user,
      ascentCount,
      projectCount,
      routeCount,
      zoneCount,
    };
  }

  async getMinMaxGrades(authorId: string) {
    return await this.prisma.route
      .aggregate({
        where: {
          authorId,
          projects: {
            some: {
              authorId: authorId,
              sessions: { some: { has_ascent: true } },
            },
          },
          NOT: { grade: Grade.uknown },
        },
        _max: {
          grade: true,
        },
        _min: {
          grade: true,
        },
      })
      .then((result) => ({
        max: result._max,
        min: result._min,
      }));
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
