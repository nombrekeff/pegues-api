import { CreateUserPreferenceInput } from './../models/dto/create_user_pref.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseService } from './base.service';
import { UpdateUserPreferenceInput } from 'src/models/dto/update_user_pref.dto';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { ErrorCodes } from 'src/common/error_codes';

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

  async update(prefId: string, data: UpdateUserPreferenceInput) {
    try {
      const prefs = await this.prisma.userPreferences.update({
        data: data,
        where: {
          id: prefId,
        },
      });
      return prefs;
    } catch (e) {
      console.log('err',e);
      if (
        e instanceof PrismaClientKnownRequestError &&
        e.code == ErrorCodes.targetNotFound
      ) {
        throw new HttpException(
          `Preference "${prefId}" not found`,
          HttpStatus.NOT_FOUND
        );
      }

      if (e instanceof PrismaClientValidationError) {
        throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
      }

      throw e;
    }
  }
}
