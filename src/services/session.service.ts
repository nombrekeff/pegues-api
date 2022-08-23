import { HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Prisma, Session } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { searchByQuery } from 'src/common/common_queries';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { SessionQueryArgs } from 'src/models/args/session-query.args';
import { ascentSortParams } from 'src/models/ascent.model';
import { CreateAscentInput } from 'src/models/dto/create_ascent.dto';
import { CreateSessionInput } from 'src/models/dto/create_session.dto';
import { UpdateAscentInput } from 'src/models/dto/update_ascent.dto';
import { UpdateSessionInput } from 'src/models/dto/update_session.dto';
import { BaseService } from './base.service';

@Injectable()
export class SessionService extends BaseService {
  async getAllForUser(authorId: string, params: SessionQueryArgs = {}) {
    return this._getAllWhere({ authorId }, params);
  }

  async getAllForRoute(
    authorId: string,
    routeId: string,
    params: SessionQueryArgs = {}
  ) {
    return this._getAllWhere({ routeId, authorId }, params);
  }

  async getOne(authorId: string, sessionId: string): Promise<Session> {
    return await this.prisma.session.findFirst({
      where: {
        authorId,
        id: sessionId,
      },
      include: {
        route: true,
      },
    });
  }

  async getAllForZone(zoneId: string, params: SessionQueryArgs = {}) {
    return this._getAllWhere({ route: { zone: { id: zoneId } } }, params);
  }

  private async _getAllWhere(where: any, params: SessionQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      ascentSortParams
    );

    const ascents = await this.prisma.session.findMany({
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
            ...(params.ascent
              ? {
                  ascent: params.ascent == 'true',
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
      take: Number(params.take) || this.defaults.defaultPaginationTake,
    });

    return ascents;
  }

  async create(userId: string, data: CreateSessionInput) {
    try {
      const route = await this.prisma.session.create({
        data: {
          authorId: userId,
          routeId: data.routeId,
          // Only set [ascentAt] if ascent is true
          ascentAt: data.ascent
            ? data.ascentAt
              ? new Date(data.ascentAt)
              : new Date(Date.now())
            : null,
          ascent: data.ascent,
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

  async update(id: string, data: UpdateSessionInput) {
    try {
      const route = await this.prisma.session.update({
        where: {
          id: id,
        },
        data: {
          ascentAt: data.ascentAt,
          tries: data.tries,
          ascent: data.ascent,
        },
      });
      return route;
    } catch (e) {
      throw new Error(e);
    }
  }

  async remove(userId: string, id: string) {
    try {
      const ascent = await this.prisma.session.delete({
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
