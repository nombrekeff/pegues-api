import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConflictException, HttpException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { ErrorCodes } from 'src/common/error_codes';
import { SortArgs } from 'src/models/args/sort.args';
import {
  Route,
  routeSortParams,
  ValidRouteSortParams,
} from 'src/models/route.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger('routes');

  constructor(private prisma: PrismaService) {}

  async getRoutesForUser(
    userId: string,
    sortArgs: SortArgs<ValidRouteSortParams> = {}
  ) {
    let { sortBy, sortDir }: SortArgs<ValidRouteSortParams> = {
      sortBy: 'updatedAt',
      sortDir: 'desc',
      ...sortArgs,
    };

    if (!routeSortParams.includes(sortBy as any)) {
      sortBy = 'updatedAt';
    }

    if (sortDir !== 'desc' && sortDir !== 'asc') {
      sortDir = 'desc';
    }

    const routes = await this.prisma.route.findMany({
      where: {
        authorId: userId,
      },
      include: {
        zone: true,
      },
      orderBy: [
        {
          [sortBy]: sortDir,
        },
      ],
    });
    return routes;
  }

  async createRoute(userId: string, routeData: CreateRouteInput) {
    try {
      const route = await this.prisma.route.create({
        data: {
          //  Spread out like this to avoid errors if invalid arguments are passed in
          authorId: userId,
          name: routeData.name,
          grade: routeData.grade,
          description: routeData.description,
          tries: routeData.tries,
          sessions: routeData.sessions,
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

  async updateRoute(id: string, routeData: UpdateRouteInput) {
    try {
      const route = await this.prisma.route.update({
        where: {
          id: id,
        },
        data: {
          name: routeData.name,
          grade: routeData.grade,
          description: routeData.description,
          tries: routeData.tries,
          sessions: routeData.sessions,
        },
      });
      return route;
    } catch (e) {
      throw new Error(e);
    }
  }
}
