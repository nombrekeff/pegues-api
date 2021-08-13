import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SortArgs } from 'src/models/args/sort.args';
import { ValidZoneSortParams, Zone, zoneSortParams } from 'src/models/zone.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateZoneInput } from 'src/resolvers/zone/dto/create-zone.input';
import { EditZoneInput } from 'src/resolvers/zone/dto/edit-zone.input';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  getZonesForUser(userId: string, sortArgs: SortArgs<ValidZoneSortParams> = {}) {
    let { sortBy, sortDir }: SortArgs<ValidZoneSortParams> = {
      sortBy: 'updatedAt',
      sortDir: 'desc',
      ...sortArgs,
    };

    if (!zoneSortParams.includes(sortBy as any)) {
      sortBy = 'updatedAt';
    }

    if (sortDir !== 'desc' && sortDir !== 'asc') {
      sortDir = 'desc';
    }

    return this.prisma.zone.findMany({
      where: {
        authorId: userId,
      },
      include: {
        routes: true,
      },
      orderBy: [
        {
          [sortBy]: sortDir,
        },
      ],
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

  async updateZone(zoneId: string, zoneData: EditZoneInput) {
    try {
      const zone = await this.prisma.zone.update({
        where: { id: zoneId },
        data: {
          name: zoneData.name,
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
}
