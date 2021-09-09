import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Zone, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { searchByQuery } from 'src/common/common_queries';
import { ErrorCodes } from 'src/common/error_codes';
import { SortHelper } from 'src/common/sort_helper';
import { ZoneQueryArgs } from 'src/models/args/zone-query.args';
import { zoneSortParams } from 'src/models/zone.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateZoneInput } from 'src/resolvers/zone/dto/create-zone.input';
import { EditZoneInput } from 'src/resolvers/zone/dto/edit-zone.input';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  getZonesForUser(userId: string, params: ZoneQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      zoneSortParams
    );

    return this.prisma.zone
      .findMany({
        where: {
          authorId: userId,
          ...searchByQuery('name', params.search),
        },
        include: {
          routes: true,
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip: Number(params.skip ?? 0),
        take: Number(params.take ?? 0),
      })
      .then((zones) => this.computeVirtualProperties(zones));
  }

  getAll(params: ZoneQueryArgs = {}) {
    const { sortBy, sortDir } = SortHelper.safeSortParams(
      params,
      zoneSortParams
    );

    return this.prisma.zone
      .findMany({
        where: {
          ...searchByQuery('name', params.search),
        },
        include: {
          routes: true,
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip: Number(params.skip ?? 0),
        take: Number(params.take ?? 0),
      })
      .then((zones) => this.computeVirtualProperties(zones));
  }

  getOne(authorId: string, id: string) {
    return this.prisma.zone
      .findFirst({
        where: {
          id,
          authorId,
        },
        include: {
          routes: true,
        },
      })
      .then((zone) => this.computeVirtualForZone(zone));
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

  async computeVirtualProperties(zones: Zone[]) {
    const computedZones = [];

    for (const zone of zones) {
      computedZones.push(await this.computeVirtualForZone(zone));
    }

    return computedZones;
  }

  private async computeVirtualForZone(zone: Zone) {
    const whereZoneId = {
      zoneId: zone.id,
    };

    const totalRoutes = await this.prisma.route.count({ where: whereZoneId });
    const totalAscents = await this.prisma.ascent.count({
      where: {
        route: whereZoneId,
      },
    });

    return {
      ...zone,
      totalRoutes,
      totalAscents,
    };
  }
}
