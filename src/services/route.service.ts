import { HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Grade, Prisma, Route } from '@prisma/client';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { routeSortParams } from 'src/models/route.model';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';
import { searchByQuery } from 'src/common/common_queries';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { DefaultsConfig } from 'src/configs/config.interface';
import { HttpResponse } from 'src/common/responses/http_response';
import { BaseService } from './base.service';

@Injectable()
export class RouteService extends BaseService {
  getAllForUser(userId: string, params: RouteQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      routeSortParams,
      this.defaults.sortBy,
      this.defaults.sortDir
    );

    let projectsWhere = {};
    // List routes that have projects
    if (params.hasProjects == 'true') {
      projectsWhere = {
        some: {},
      };
    }

    // List routes that have no projects
    if (params.hasProjects == 'false') {
      projectsWhere = {
        none: {},
      };
    }

    return this.prisma.route
      .findMany({
        where: {
          authorId: userId,
          ...(params.zoneId
            ? {
                zoneId: params.zoneId,
              }
            : {}),
          ...(params.grade
            ? {
                grade: params.grade,
              }
            : {}),
          projects: projectsWhere,
          OR: [
            { name: { contains: params.search } },
            { zone: { name: { contains: params.search } } },
          ],
        },
        include: {
          zone: true,
          projects: true,
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip: Number(params.skip ?? 0),
        take: Number(params.take) || this.defaults.defaultPaginationTake,
      })
      .then(this.computeVirtualProperties.bind(this, userId));
  }

  async getRandomRoute(userId: string, params: RouteQueryArgs = {}) {
    const routes = await this.prisma.route.findMany({
      where: {
        AND: {
          authorId: userId,
          ...(params.zoneId
            ? {
                zoneId: params.zoneId,
              }
            : {}),
          ...(params.grade
            ? {
                grade: params.grade,
              }
            : {}),
        },
        OR: [
          searchByQuery('name', params.search),
          {
            zone: {
              ...searchByQuery('name', params.search),
            },
          },
        ],
      },
      include: {
        zone: true,
        projects: true,
      },
    });

    if (routes.length > 0) {
      const randIndex = Math.floor(Math.random() * routes.length);

      return HttpResponse.ok(routes[randIndex]);
    }

    return HttpResponse.ok(null, 'No route found');
  }

  getAll(userId: string, params: RouteQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      routeSortParams,
      this.defaults.sortBy,
      this.defaults.sortDir
    );

    return this.prisma.route
      .findMany({
        where: {
          ...(params.zoneId
            ? {
                zoneId: params.zoneId,
              }
            : {}),
          OR: [
            searchByQuery('name', params.search),
            {
              zone: {
                ...searchByQuery('name', params.search),
              },
            },
          ],
        },
        include: {
          zone: true,
          projects: true,
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip: Number(params.skip ?? 0),
        take:
          Number(params.take) ||
          this.config.get<DefaultsConfig>('defaults').defaultPaginationTake,
      })
      .then(this.computeVirtualProperties.bind(this, userId));
  }

  async getOne(authorId: string, routeId: string): Promise<Route> {
    return await this.prisma.route
      .findFirst({
        where: {
          authorId,
          id: routeId,
        },
        include: {
          zone: true,
          projects: true,
        },
      })
      .then(this.computeVirtualForRoute.bind(this, authorId));
  }

  async createRoute(userId: string, routeData: CreateRouteInput) {
    try {
      const route = await this.prisma.route
        .create({
          data: {
            //  Spread out like this to avoid errors if invalid arguments are passed in
            authorId: userId,
            zoneId: routeData.zoneId,
            name: routeData.name,
            grade: routeData.grade,
            description: routeData.description,
            discipline: routeData.discipline,
            public: routeData.public ?? false,
            // TODO: create ascent if passed in
          },
        })
        .then(this.computeVirtualForRoute.bind(this, userId));
      return route;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code == ErrorCodes.notFound
      ) {
        throw new HttpException(
          `Zone '${routeData.zoneId}' not found.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (e instanceof PrismaClientValidationError) {
        throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
      }

      throw new Error(e);
    }
  }

  async updateRoute(userId: string, id: string, routeData: UpdateRouteInput) {
    try {
      return this.prisma.route
        .update({
          where: {
            authorId_id: { id: id, authorId: userId },
          },
          data: {
            name: routeData.name,
            grade: routeData.grade as any,
            description: routeData.description,
            zoneId: routeData.zoneId,
          },
          include: { projects: true, zone: true },
        })
        .then(this.computeVirtualForRoute.bind(this, userId));
    } catch (e) {
      if (
        e instanceof PrismaClientKnownRequestError &&
        e.code == ErrorCodes.targetNotFound
      ) {
        throw new HttpException(
          `Route "${id}" not found`,
          HttpStatus.NOT_FOUND
        );
      }
      throw new Error(e);
    }
  }

  async remove(userId: string, id: string) {
    try {
      const route = await this.prisma.route.delete({
        where: {
          authorId_id: { id: id, authorId: userId },
        },
      });
      return {
        message: 'Deleted route: ' + route.id,
      };
    } catch (e) {
      if (
        e instanceof PrismaClientKnownRequestError &&
        e.code == ErrorCodes.targetNotFound
      ) {
        throw new HttpException(
          `Route "${id}" not found`,
          HttpStatus.NOT_FOUND
        );
      }
      throw new Error(e);
    }
  }

  private async computeVirtualProperties(userId, routes: Route[]) {
    const withCount = [];

    for (const route of routes) {
      withCount.push(await this.computeVirtualForRoute(userId, route));
    }

    return withCount;
  }

  private async computeVirtualForRoute(userId, route: Route) {
    const totalSessions = await this.prisma.session.count({
      where: {
        project: {
          routeId: route.id,
        },
      },
    });

    /* Counts all the sessions that are ascents for the given route */
    const totalAscents = await this.prisma.session.count({
      where: {
        project: {
          routeId: route.id,
        },
        has_ascent: true,
      },
    });

    return {
      ...route,
      totalAscents,
      totalSessions,
      hasAscents: totalAscents > 0,
      yours: userId === route.authorId,
    };
  }
}
