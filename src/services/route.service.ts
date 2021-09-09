import { HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Prisma, Route } from '@prisma/client';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { routeSortParams } from 'src/models/route.model';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';
import { searchByQuery } from 'src/common/common_queries';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { BaseService } from './base.service';
import { DefaultsConfig } from 'src/configs/config.interface';
import { HttpResponse } from 'src/common/responses/http_response';

@Injectable()
export class RouteService extends BaseService {
  async getAllForUser(userId: string, params: RouteQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      routeSortParams,
      this.defaults.sortBy,
      this.defaults.sortDir
    );

    return await this.prisma.route
      .findMany({
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
          ascents: true,
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip: Number(params.skip ?? 0),
        take: Number(params.take) || this.defaults.defaultPaginationTake,
      })
      .then(this.computeVirtualProperties.bind(this));
  }

  async getMinMaxGradeForUser(authorId: string) {
    return await this.prisma.route
      .aggregate({
        where: {
          authorId,
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

  async getMinMaxGradeForZone(authorId: string, zoneId: string) {
    return await this.prisma.route
      .aggregate({
        where: {
          zoneId,
          authorId,
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
        ascents: true,
      },
    });

    if (routes.length > 0) {
      const randIndex = Math.floor(Math.random() * routes.length);

      return HttpResponse.ok(routes[randIndex]);
    }

    return HttpResponse.ok(null, 'No route found');
  }

  async getAll(params: RouteQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      routeSortParams
    );

    return await this.prisma.route
      .findMany({
        where: {
          AND: {
            ...(params.zoneId
              ? {
                  zoneId: params.zoneId,
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
          ascents: true,
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip: Number(params.skip ?? 0),
        take:
          Number(params.take) ||
          this.config.get<DefaultsConfig>('defaults').defaultPaginationTake,
      })
      .then(this.computeVirtualProperties.bind(this));
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
          ascents: true,
        },
      })
      .then(this.computeVirtualForRoute.bind(this));
  }

  async createRoute(userId: string, routeData: CreateRouteInput) {
    try {
      const route = await this.prisma.route.create({
        data: {
          //  Spread out like this to avoid errors if invalid arguments are passed in
          authorId: userId,
          zoneId: routeData.zoneId,
          name: routeData.name,
          grade: routeData.grade,
          description: routeData.description,
          discipline: routeData.discipline,
          // TODO: create ascent if passed in
        },
      });
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
      } else {
        throw new Error(e);
      }
    }
  }

  async updateRoute(userId: string, id: string, routeData: UpdateRouteInput) {
    try {
      const route = await this.prisma.route.update({
        where: {
          authorId_id: { id: id, authorId: userId },
        },
        data: {
          name: routeData.name,
          grade: routeData.grade as any,
          description: routeData.description,
          zoneId: routeData.zoneId,
        },
      });
      return route;
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

  private async computeVirtualProperties(routes: Route[]) {
    const withCount = [];

    for (const route of routes) {
      withCount.push(await this.computeVirtualForRoute(route));
    }

    return withCount;
  }

  private async computeVirtualForRoute(route: Route) {
    const totalAscents = await this.prisma.ascent.count({
      where: {
        routeId: route.id,
      },
    });

    return {
      ...route,
      totalAscents,
    };
  }
}
