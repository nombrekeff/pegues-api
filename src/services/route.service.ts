import { Grade } from './../models/route.model';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConflictException, HttpException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { QueryAllArgs } from 'src/models/args/query-all.args';
import { SortArgs } from 'src/models/args/sort.args';
import {
  Route,
  routeSortParams,
  ValidRouteSortParams,
} from 'src/models/route.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';
import { searchByQuery } from 'src/common/common_queries';
import { RouteQueryArgs } from 'src/models/args/route-query.args';
import { NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger('routes');

  constructor(private prisma: PrismaService) {}

  async getAllForUser(userId: string, params: RouteQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      routeSortParams
    );

    const routes = await this.prisma.route
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
      })
      .then(async (routes) => {
        const withCount = [];

        for (const route of routes) {
          const count = await this.prisma.ascent.count({
            where: {
              routeId: route.id,
            },
          });

          withCount.push({
            ...route,
            ascentCount: count,
          });
        }

        return withCount;
      });

    return routes;
  }

  async getAll(params: RouteQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      routeSortParams
    );

    const routes = await this.prisma.route
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
      })
      .then(async (routes) => {
        const withCount = [];

        for (const route of routes) {
          const count = await this.prisma.ascent.count({
            where: {
              routeId: route.id,
            },
          });

          withCount.push({
            ...route,
            ascentCount: count,
          });
        }

        return withCount;
      });

    return routes;
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
}
