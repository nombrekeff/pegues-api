import { HttpStatus } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { searchByQuery } from 'src/common/common_queries';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { AscentQueryArgs } from 'src/models/args/ascent-query.args';
import { QueryAllArgs } from 'src/models/args/query-all.args';
import { SortArgs } from 'src/models/args/sort.args';
import {
  ascentSortParams,
  ValidAscentSortParams,
} from 'src/models/ascent.model';
import { CreateAscentInput } from 'src/models/dto/create_ascent.dto';
import { UpdateAscentInput } from 'src/models/dto/update_ascent.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AscentService {
  private readonly logger = new Logger('ascent');

  constructor(private prisma: PrismaService) {}

  async getAllForUser(authorId: string, params: AscentQueryArgs = {}) {
    return this._getAllWhere({ authorId }, params);
  }

  async getAllForRoute(
    authorId: string,
    routeId: string,
    params: AscentQueryArgs = {}
  ) {
    return this._getAllWhere({ routeId, authorId }, params);
  }

  async getAllForZone(zoneId: string, params: AscentQueryArgs = {}) {
    return this._getAllWhere({ route: { zone: { id: zoneId } } }, params);
  }

  private async _getAllWhere(where: any, params: AscentQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      ascentSortParams
    );

    const ascents = await this.prisma.ascent.findMany({
      where: {
        ...where,
        route: {
          ...searchByQuery('name', params.search),
        },
      },
      include: {
        route: true,
      },
      orderBy: {
        [sortBy]: sortDir,
      },
    });

    return ascents;
  }

  async create(userId: string, data: CreateAscentInput) {
    try {
      const route = await this.prisma.ascent.create({
        data: {
          authorId: userId,
          routeId: data.routeId,
          ascentAt: data.ascentAt,
          sessions: data.sessions,
          tries: data.tries,
        },
      });
      return route;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code == ErrorCodes.notFound
      ) {
        throw new HttpException(
          `Route '${data.routeId}' not found.`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        throw new Error(e);
      }
    }
  }

  async update(id: string, data: UpdateAscentInput) {
    try {
      const route = await this.prisma.ascent.update({
        where: {
          id: id,
        },
        data: {
          routeId: data.routeId,
          ascentAt: data.ascentAt,
          sessions: data.sessions,
          tries: data.tries,
        },
      });
      return route;
    } catch (e) {
      throw new Error(e);
    }
  }
}
