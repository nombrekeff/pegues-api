import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { searchByQuery } from 'src/common/common_queries';
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
      })
      .then(async (zones) => {
        const withCount = [];

        for (const zone of zones) {
          const whereZoneId = {
            where: {
              zoneId: zone.id,
            },
          };

          const count = await this.prisma.route.count(whereZoneId);

          withCount.push({
            ...zone,
            totalRoutes: count,
          });
        }

        return withCount;
      });
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
      })
      .then(async (zones) => {
        const withCount = [];

        for (const zone of zones) {
          const whereZoneId = {
            where: {
              zoneId: zone.id,
            },
          };

          const count = await this.prisma.route.count(whereZoneId);

          withCount.push({
            ...zone,
            totalRoutes: count,
          });
        }

        return withCount;
      });
  }

  async createZone(userId: string, zoneData: CreateZoneInput) {
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

  async updateZone(userId: string, zoneId: string, zoneData: EditZoneInput) {
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
      }if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Zone "${zoneId}" not found.`);
      } else {
        throw new Error(e);
      }
    }
  }
}
