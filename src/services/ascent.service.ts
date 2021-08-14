import { UpdateAscentInput } from './../models/dto/update_ascent.dto';
import { CreateAscentInput } from './../models/dto/create_ascent.dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConflictException, HttpException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { ErrorCodes } from 'src/common/error_codes';
import { SortArgs } from 'src/models/args/sort.args';
import { ValidAscentSortParams } from 'src/models/ascent.model';
import {
  Route,
  routeSortParams,
  ValidRouteSortParams,
} from 'src/models/route.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRouteInput } from 'src/resolvers/route/dto/create-route.input';
import { UpdateRouteInput } from 'src/resolvers/route/dto/update-route.input';

@Injectable()
export class AscentService {
  private readonly logger = new Logger('ascent');

  constructor(private prisma: PrismaService) {}

  async getAllForUser(
    userId: string,
    sortArgs: SortArgs<ValidAscentSortParams> = {}
  ) {
    let { sortBy, sortDir }: SortArgs<ValidAscentSortParams> = {
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

    const routes = await this.prisma.ascent.findMany({
      where: {
        authorId: userId,
      },
      include: {
        route: true,
      },
      orderBy: [
        {
          [sortBy]: sortDir,
        },
      ],
    });
    return routes;
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
