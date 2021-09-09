import { CreateUserPreferenceInput } from './../models/dto/create_user_pref.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from './base.service';

@Injectable()
export class UserPreferencesService extends BaseService {
  findForUser(authorId: string) {
    return this.prisma.userPreferences.findFirst({
      where: { authorId },
    });
  }

  async create(data: CreateUserPreferenceInput) {
    try {
      const prefs = await this.prisma.userPreferences.create({
        data: data,
      });
      return prefs;
    } catch (e) {
      console.log(e.code);
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          `User '${data.authorId}' already has preferences set, udpate them instead using PUT /preferences/:id.`
        );
      } else {
        throw new Error(e);
      }
    }
  }

  update(prefId: string, data) {}
}
