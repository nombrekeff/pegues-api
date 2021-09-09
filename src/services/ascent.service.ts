import { HttpStatus } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { Ascent, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { searchByQuery } from 'src/common/common_queries';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { DefaultsConfig } from 'src/configs/config.interface';
import { AscentQueryArgs } from 'src/models/args/ascent-query.args';
import { ascentSortParams } from 'src/models/ascent.model';
import { CreateAscentInput } from 'src/models/dto/create_ascent.dto';
import { UpdateAscentInput } from 'src/models/dto/update_ascent.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AscentService {
  private readonly logger = new Logger('ascent');

  constructor(private prisma: PrismaService, private config: ConfigService) {}

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

  async getOne(authorId: string, ascentId: string): Promise<Ascent> {
    return await this.prisma.ascent.findFirst({
      where: {
        authorId,
        id: ascentId,
      },
      include: {
        route: true,
      },
    });
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
        AND: {
          ...(params.routeId
            ? {
                routeId: params.routeId,
              }
            : {}),
          ...(params.zoneId
            ? {
                route: { zoneId: params.routeId },
              }
            : {}),
        },
        OR: [
          {
            ...where,
            route: {
              ...searchByQuery('name', params.search),
            },
          },
          {
            route: {
              zone: {
                ...searchByQuery('name', params.search),
              },
            },
          },
        ],
      },
      include: {
        route: {
          include: { zone: true },
        },
      },
      orderBy: {
        [sortBy]: sortDir,
      },
      skip: Number(params.skip ?? 0),
      take:
        Number(params.take) ||
        this.config.get<DefaultsConfig>('defaults').defaultPaginationTake,
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

  async remove(userId: string, id: string) {
    try {
      const ascent = await this.prisma.ascent.delete({
        where: {
          authorId_id: { id: id, authorId: userId },
        },
      });
      return {
        message: 'Deleted ascent: ' + ascent.id,
      };
    } catch (e) {
      if (
        e instanceof PrismaClientKnownRequestError &&
        e.code == ErrorCodes.targetNotFound
      ) {
        throw new HttpException(
          `Ascent "${id}" not found`,
          HttpStatus.NOT_FOUND
        );
      }
      throw new Error(e);
    }
  }
}
