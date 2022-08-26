import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Zone, Prisma, Grade } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { searchByQuery } from 'src/common/common_queries';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { ZoneQueryArgs } from 'src/models/args/zone-query.args';
import { zoneSortParams } from 'src/models/zone.model';
import { CreateZoneInput } from 'src/resolvers/zone/dto/create-zone.input';
import { EditZoneInput } from 'src/resolvers/zone/dto/edit-zone.input';
import { BaseService } from './base.service';
import { RouteService } from './route.service';

@Injectable()
export class ZonesService extends BaseService {
  constructor(private readonly routeService: RouteService) {
    super();
  }

  getZonesForUser(authorId: string, params: ZoneQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      zoneSortParams,
      this.defaults.sortBy,
      this.defaults.sortDir
    );

    return this.prisma.zone
      .findMany({
        where: {
          authorId: authorId,
          ...searchByQuery('name', params.search),
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip: Number(params.skip ?? 0),
        take: Number(params.take) || this.defaults.defaultPaginationTake,
      })
      .then((zones) => this.computeVirtualPropertiesForZones(authorId, zones));
  }

  getAll(userId: string, params: ZoneQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      zoneSortParams,
      this.defaults.sortBy,
      this.defaults.sortDir
    );

    return this.prisma.zone
      .findMany({
        where: {
          ...searchByQuery('name', params.search),
          OR: [
            { public: true },
            {
              authorId: userId,
            },
          ],
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip: Number(params.skip ?? 0),
        take: Number(params.take) || this.defaults.defaultPaginationTake,
      })
      .then((zones) => this.computeVirtualPropertiesForZones(userId, zones));
  }

  getOne(authorId: string, id: string) {
    return this.prisma.zone
      .findFirst({
        where: {
          id,
          authorId,
        },
        // include: {
        //   routes: {
        //     include: {
        //       ascents: true,
        //     },
        //   },
        // },
      })
      .then((zone) => this.computeVirtualForZone(authorId, zone));
  }

  async create(userId: string, zoneData: CreateZoneInput) {
    try {
      const zone = await this.prisma.zone.create({
        data: {
          name: zoneData.name,
          authorId: userId,
        },
      });
      return zone;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`zone '${zoneData.name}' already used.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async update(userId: string, zoneId: string, zoneData: EditZoneInput) {
    try {
      const zone = await this.prisma.zone.update({
        where: {
          authorId_id: { id: zoneId, authorId: userId },
        },
        data: {
          name: zoneData.name,
          public: zoneData.public ?? false,
          description: zoneData.description,
        },
      });
      return zone;
    } catch (e) {
      console.error('code', e.code);
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Zone '${zoneData.name}' already used.`);
      }
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Zone "${zoneId}" not found.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async remove(userId: string, id: string) {
    try {
      const zone = await this.prisma.zone.delete({
        where: {
          authorId_id: { id: id, authorId: userId },
        },
      });
      return {
        message: 'Deleted zone: ' + zone.id,
      };
    } catch (e) {
      if (
        e instanceof PrismaClientKnownRequestError &&
        e.code == ErrorCodes.targetNotFound
      ) {
        throw new HttpException(`Zone "${id}" not found`, HttpStatus.NOT_FOUND);
      }
      throw new Error(e);
    }
  }

  async getMinMaxGrades(userId: string, zoneId: string) {
    return await this.prisma.route
      .aggregate({
        where: {
          zoneId,
          NOT: { grade: Grade.uknown },
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

  async computeVirtualPropertiesForZones(authorId, zones: Zone[]) {
    const computedZones = [];

    for (const zone of zones) {
      computedZones.push(await this.computeVirtualForZone(authorId, zone));
    }

    return computedZones;
  }

  private async computeVirtualForZone(userId: string, zone: Zone) {
    const whereZoneId = {
      zoneId: zone.id,
    };

    const routes = await this.routeService.getAllForUser(userId, {
      zoneId: zone.id,
    });
    const totalRoutes = await this.prisma.route.count({ where: whereZoneId });
    const totalAscents = await this.prisma.session.count({
      where: {
        project: {
          authorId: userId,
        },
        has_ascent: true,
      },
    });
    const minMax = await this.getMinMaxGrades(userId, zone.id);

    return {
      ...zone,
      minGrade: minMax.min.grade,
      maxGrade: minMax.max.grade,
      routes,
      totalRoutes,
      totalAscents,
      yours: userId === zone.authorId,
    };
  }
}
