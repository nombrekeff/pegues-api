import { HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Project, Prisma, Grade } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { searchByQuery } from 'src/common/common_queries';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { ProjectQueryArgs } from 'src/models/args/ascent-query.args';
import { ascentSortParams } from 'src/models/project.model';
import { CreateProjectInput } from 'src/models/dto/create_ascent.dto';
import { UpdateProjectInput } from 'src/models/dto/update_ascent.dto';
import { BaseService } from './base.service';

@Injectable()
export class ProjectService extends BaseService {
  async getAllForUser(authorId: string, params: ProjectQueryArgs = {}) {
    return this._getAllWhere({ authorId }, params).then((data) =>
      this.computeVirtualPropertiesForProjects(authorId, data)
    );
  }

  async getAllForRoute(
    authorId: string,
    routeId: string,
    params: ProjectQueryArgs = {}
  ) {
    return this._getAllWhere({ routeId, authorId }, params);
  }

  async getOne(authorId: string, ascentId: string): Promise<Project> {
    return await this.prisma.project.findFirst({
      where: {
        authorId,
        id: ascentId,
      },
      include: {
        route: true,
      },
    });
  }

  async getAllForZone(zoneId: string, params: ProjectQueryArgs = {}) {
    return this._getAllWhere({ route: { zone: { id: zoneId } } }, params);
  }

  private async _getAllWhere(where: any, params: ProjectQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      ascentSortParams
    );

    return this.prisma.project.findMany({
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
        sessions: true,
      },
      orderBy: {
        [sortBy]: sortDir,
      },
      skip: Number(params.skip ?? 0),
      take: Number(params.take) || this.defaults.defaultPaginationTake,
    });
  }

  async create(authorId: string, data: CreateProjectInput) {
    try {
      const exists =
        (await this.prisma.project.findFirst({
          where: { routeId: data.routeId, authorId },
        })) != null;

      if (exists)
        throw new HttpException(
          `A project for route already exists`,
          HttpStatus.BAD_REQUEST
        );

      const route = await this.prisma.project.create({
        data: {
          authorId,
          routeId: data.routeId,
        },
        include: { sessions: true },
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
        throw e;
      }
    }
  }

  async update(id: string, data: UpdateProjectInput) {
    try {
      const route = await this.prisma.project.update({
        where: {
          id: id,
        },
        data: {
          routeId: data.routeId,
        },
      });
      return route;
    } catch (e) {
      throw new Error(e);
    }
  }

  async remove(authorId: string, id: string) {
    try {
      const ascent = await this.prisma.project.delete({
        where: {
          id: id,
        },
      });
      return {
        message: 'Deleted project: ' + ascent.id,
      };
    } catch (e) {
      if (
        e instanceof PrismaClientKnownRequestError &&
        e.code == ErrorCodes.targetNotFound
      ) {
        throw new HttpException(
          `Project "${id}" not found`,
          HttpStatus.NOT_FOUND
        );
      }
      throw e;
    }
  }

  async computeVirtualPropertiesForProjects(authorId, projects: Project[]) {
    const computedProjects = [];

    for (const project of projects) {
      computedProjects.push(
        await this.computeVirtualForProject(authorId, project)
      );
    }

    return computedProjects;
  }

  private async computeVirtualForProject(authorId: string, project: Project) {
    const totalSessions = await this.prisma.session.count({
      where: {
        project: { authorId },
      },
    });
    const totalAscents = await this.prisma.session.count({
      where: {
        project: { authorId },
        has_ascent: true,
      },
    });

    return {
      ...project,
      totalSessions,
      totalAscents,
    };
  }
}
