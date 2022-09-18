import { HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Prisma, Session } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { searchByQuery } from 'src/common/common_queries';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { SessionQueryArgs } from 'src/models/args/session-query.args';
import { ascentSortParams } from 'src/models/project.model';
import { CreateSessionInput } from 'src/models/dto/create_session.dto';
import { UpdateSessionInput } from 'src/models/dto/update_session.dto';
import { BaseService } from './base.service';
import { ProjectService } from './project.service';

@Injectable()
export class SessionService extends BaseService {
  constructor(private readonly projectService: ProjectService) {
    super();
  }

  async getAllForUser(authorId: string, params: SessionQueryArgs = {}) {
    return this.prisma.session.findMany({
      where: {
        authorId,
        ...{
          ...params,
          has_ascent: params.has_ascent == 'true',
        },
      },
    });
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
        project: true,
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

    const sessions = await this.prisma.session.findMany({
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
          ...(params.has_ascent
            ? {
                has_ascent: params.has_ascent == 'true',
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
        project: true,
      },
      orderBy: {
        [sortBy]: sortDir,
      },
      skip: Number(params.skip ?? 0),
      take: Number(params.take) || this.defaults.defaultPaginationTake,
    });

    return sessions;
  }

  async create(userId: string, data: CreateSessionInput) {
    try {
      const session = await this.prisma.session.create({
        data: {
          authorId: userId,
          projectId: data.projectId,
          // Only set [ascentAt] if ascent is true
          ascent_date: data.ascent_date
            ? new Date(data.ascent_date)
            : new Date(Date.now()),
          has_ascent: data.has_ascent,
          tries: data.tries,
          description: data.description,
        },
      });
      await this.projectService.updateDate(data.projectId);
      return session;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code == ErrorCodes.notFound
      ) {
        throw new HttpException(
          `Project '${data.projectId}' not found.`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        throw new Error(e);
      }
    }
  }

  async update(id: string, data: UpdateSessionInput) {
    try {
      const dataToEdit = {
        tries: data.tries,
        has_ascent: data.has_ascent,
        description: data.description,
      };

      if (data.ascent_date) {
        dataToEdit['ascent_date'] = new Date(data.ascent_date);
      }

      const route = await this.prisma.session.update({
        where: {
          id: id,
        },
        data: dataToEdit,
      });
      await this.projectService.updateDate(route.projectId);
      return route;
    } catch (e) {
      throw e;
    }
  }

  async remove(authorId: string, id: string) {
    try {
      const session = await this.prisma.session.delete({
        where: {
          authorId_id: {
            authorId,
            id,
          },
        },
      });
      return {
        message: 'Deleted session: ' + session.id,
      };
    } catch (e) {
      if (
        e instanceof PrismaClientKnownRequestError &&
        e.code == ErrorCodes.targetNotFound
      ) {
        throw new HttpException(
          `session "${id}" not found`,
          HttpStatus.NOT_FOUND
        );
      }
      throw new Error(e);
    }
  }
}
